import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const PROD_URL      = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vowify.app";
const ABACATE_URL   = "https://api.abacatepay.com/v1";

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function createBilling(payload: object) {
  const res = await fetch(`${ABACATE_URL}/billing/create`, {
    method:  "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${process.env.ABACATEPAY_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`AbacatePay error: ${err}`);
  }
  return res.json();
}

export async function POST(req: NextRequest) {
  // Diagnóstico de env vars — remover após resolver
  const envCheck = {
    SUPABASE_URL:      !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_KEY:      !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    ABACATEPAY_KEY:    !!process.env.ABACATEPAY_API_KEY,
  };
  if (!envCheck.SUPABASE_URL || !envCheck.SUPABASE_KEY) {
    return NextResponse.json({ error: "Configuração incompleta.", envCheck }, { status: 500 });
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
    }

    const { event_id, user_id, name, email, cpf, cellphone } = body;

    if (!event_id || !user_id || !name || !email || !cpf) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
    }
    if (typeof event_id !== "string" || typeof user_id !== "string") {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }

    const admin = getAdmin();

    // Verifica que o evento pertence ao usuário e está pendente
    const { data: event, error: evErr } = await admin
      .from("events")
      .select("id, name, expires_at, user_id")
      .eq("id", event_id)
      .eq("user_id", user_id)
      .single();

    if (evErr || !event) {
      return NextResponse.json({ error: "Evento não encontrado." }, { status: 404 });
    }

    if (event.expires_at && new Date(event.expires_at) > new Date()) {
      return NextResponse.json({ error: "Este evento já está ativo." }, { status: 409 });
    }

    const billing = await createBilling({
      frequency: "ONE_TIME",
      methods:   ["PIX", "CREDIT_CARD", "BOLETO"],
      products:  [{
        externalId: event_id,
        name:       `Vowify — ${event.name || "Meu Evento"}`,
        quantity:   1,
        price:      1990,
      }],
      customer: {
        name,
        email,
        taxId:     cpf.replace(/\D/g, ""),
        cellphone: (cellphone ?? "").replace(/\D/g, ""),
      },
      returnUrl:     `${PROD_URL}/pagamento?event_id=${event_id}&cancelled=1`,
      completionUrl: `${PROD_URL}/pagamento/sucesso?event_id=${event_id}`,
    });

    // Salva o billing ID no evento
    await admin.from("events").update({ payment_id: billing.data?.id ?? billing.id }).eq("id", event_id);

    return NextResponse.json({ url: billing.data?.url ?? billing.url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[payment/create]", msg);
    return NextResponse.json({ error: "Erro ao criar cobrança.", detail: msg }, { status: 500 });
  }
}
