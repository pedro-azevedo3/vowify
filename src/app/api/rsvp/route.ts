import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event_id, name, phone, status, plus, restriction } = body;

    if (!event_id || !name || !phone || !status) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
    }

    // Verifica se o evento existe
    const { data: event, error: evErr } = await supabaseAdmin
      .from("events")
      .select("id, acomp_on")
      .eq("id", event_id)
      .single();

    if (evErr || !event) {
      return NextResponse.json({ error: "Evento não encontrado." }, { status: 404 });
    }

    const { error } = await supabaseAdmin.from("guests").upsert(
      {
        event_id,
        name: name.trim(),
        phone: phone.replace(/\D/g, ""),
        status,
        plus: event.acomp_on ? (plus ?? 0) : 0,
        restriction: (restriction ?? "").trim(),
      },
      { onConflict: "event_id,phone" }
    );

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
