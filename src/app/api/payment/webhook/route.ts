import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { createClient } from "@supabase/supabase-js";

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function verifySignature(payload: string, signature: string): boolean {
  const secret = process.env.ABACATEPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  // Suporta comparação com ou sem prefixo "sha256="
  const sig = signature.startsWith("sha256=") ? signature.slice(7) : signature;
  return expected === sig;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    // AbacatePay pode usar x-webhook-signature ou x-abacatepay-signature
    const signature =
      req.headers.get("x-webhook-signature") ??
      req.headers.get("x-abacatepay-signature") ??
      "";

    if (!verifySignature(rawBody, signature)) {
      return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventType: string = payload.event ?? payload.type ?? "";

    // Só processa pagamentos confirmados
    const PAID_EVENTS = ["billing.paid", "checkout.completed", "billing.completed"];
    if (!PAID_EVENTS.includes(eventType)) {
      return NextResponse.json({ ok: true });
    }

    const data = payload.data ?? payload;

    // AbacatePay v1: id da cobrança + externalId do produto
    const billingId:  string | undefined = data?.id;
    const externalId: string | undefined =
      data?.products?.[0]?.externalId ??
      data?.items?.[0]?.externalId ??
      data?.metadata?.event_id;

    if (!billingId && !externalId) {
      return NextResponse.json({ error: "Dados insuficientes." }, { status: 400 });
    }

    const admin = getAdmin();

    // Busca pelo payment_id salvo no evento, ou pelo externalId do produto
    const { data: byPaymentId } = billingId
      ? await admin.from("events").select("id").eq("payment_id", billingId).maybeSingle()
      : { data: null };

    const { data: byExternalId } = (!byPaymentId && externalId)
      ? await admin.from("events").select("id").eq("id", externalId).maybeSingle()
      : { data: null };

    const dbEvent = byPaymentId ?? byExternalId;

    if (!dbEvent) {
      return NextResponse.json({ error: "Evento não encontrado." }, { status: 404 });
    }

    // Ativa o evento por 90 dias
    const newExpiry = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
    await admin
      .from("events")
      .update({ expires_at: newExpiry, payment_id: billingId ?? null })
      .eq("id", dbEvent.id);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
