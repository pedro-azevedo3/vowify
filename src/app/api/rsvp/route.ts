import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ALLOWED_STATUS = new Set(["confirmed", "declined"]);
const MAX_NAME        = 120;
const MAX_PHONE       = 20;
const MAX_RESTRICTION = 500;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
    }

    const { event_id, name, phone, status, plus, restriction } = body;

    // ── Presença dos campos obrigatórios ──────────────────────────────────
    if (!event_id || !name || !phone || !status) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
    }

    // ── Tipos primitivos ──────────────────────────────────────────────────
    if (
      typeof event_id !== "string" ||
      typeof name     !== "string" ||
      typeof phone    !== "string" ||
      typeof status   !== "string"
    ) {
      return NextResponse.json({ error: "Tipos de dados inválidos." }, { status: 400 });
    }

    // ── Status permitido ──────────────────────────────────────────────────
    if (!ALLOWED_STATUS.has(status)) {
      return NextResponse.json({ error: "Status inválido." }, { status: 400 });
    }

    // ── Comprimentos máximos ──────────────────────────────────────────────
    if (name.trim().length > MAX_NAME) {
      return NextResponse.json({ error: "Nome muito longo." }, { status: 400 });
    }
    if (phone.replace(/\D/g, "").length > MAX_PHONE) {
      return NextResponse.json({ error: "Telefone inválido." }, { status: 400 });
    }
    if (restriction && typeof restriction === "string" && restriction.length > MAX_RESTRICTION) {
      return NextResponse.json({ error: "Restrição alimentar muito longa." }, { status: 400 });
    }

    // ── Campo plus: só 0 ou 1 ────────────────────────────────────────────
    const plusVal = Number(plus);
    if (!Number.isInteger(plusVal) || plusVal < 0 || plusVal > 1) {
      return NextResponse.json({ error: "Valor de acompanhante inválido." }, { status: 400 });
    }

    // ── Busca o evento (verifica existência, expiração e limite) ──────────
    const { data: event, error: evErr } = await supabaseAdmin
      .from("events")
      .select("id, acomp_on, guest_limit, expires_at")
      .eq("id", event_id)
      .single();

    if (evErr || !event) {
      return NextResponse.json({ error: "Evento não encontrado." }, { status: 404 });
    }

    // ── Verifica expiração server-side ────────────────────────────────────
    if (event.expires_at && new Date() > new Date(event.expires_at)) {
      return NextResponse.json({ error: "Este convite não está mais disponível." }, { status: 403 });
    }

    // ── Verifica limite de convidados server-side ─────────────────────────
    if (event.guest_limit > 0) {
      const { count } = await supabaseAdmin
        .from("guests")
        .select("id", { count: "exact", head: true })
        .eq("event_id", event_id);

      if (count !== null && count >= event.guest_limit) {
        return NextResponse.json({ error: "Limite de convidados atingido." }, { status: 409 });
      }
    }

    // ── Upsert do convidado ───────────────────────────────────────────────
    const { error } = await supabaseAdmin.from("guests").upsert(
      {
        event_id,
        name:        name.trim().slice(0, MAX_NAME),
        phone:       phone.replace(/\D/g, "").slice(0, MAX_PHONE),
        status,
        plus:        event.acomp_on ? plusVal : 0,
        restriction: ((restriction as string) ?? "").trim().slice(0, MAX_RESTRICTION),
      },
      { onConflict: "event_id,phone" }
    );

    if (error) return NextResponse.json({ error: "Erro ao registrar resposta." }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
