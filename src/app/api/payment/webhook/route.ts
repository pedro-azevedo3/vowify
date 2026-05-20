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
  return expected === signature;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-webhook-signature") ?? "";

    if (!verifySignature(rawBody, signature)) {
      return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    // Só processa pagamentos confirmados
    if (event.event !== "billing.paid" && event.event !== "checkout.completed") {
      return NextResponse.json({ ok: true });
    }

    const billingId  = event.data?.id as string | undefined;
    const externalId = event.data?.products?.[0]?.externalId as string | undefined;

    if (!billingId && !externalId) {
      return NextResponse.json({ error: "Dados insuficientes." }, { status: 400 });
    }

    const admin = getAdmin();

    // Busca o evento pelo payment_id ou pelo externalId do produto
    let query = admin.from("events").select("id, expires_at");
    if (billingId) {
      query = query.eq("payment_id", billingId) as typeof query;
    } else {
      query = query.eq("id", externalId) as typeof query;
    }

    const { data: dbEvent } = await query.single();

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
