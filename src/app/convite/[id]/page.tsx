import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import ConviteClient from "./ConviteClient";

async function getEventMeta(id: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await supabase
    .from("events")
    .select("name,organizer_name")
    .eq("id", id)
    .single();
  return data as { name: string; organizer_name: string } | null;
}

export async function generateMetadata(
  props: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await props.params;
  const event = await getEventMeta(id);

  const eventName   = event?.name            || "Convite";
  const organizer   = event?.organizer_name  || "";
  const title       = organizer
    ? `${organizer} está te convidando para ${eventName}!`
    : `Você foi convidado para ${eventName}!`;
  const description = `Confirme sua presença em ${eventName}. Leva menos de 10 segundos — sem baixar nada.`;
  const siteUrl     = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vowify.app";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/convite/${id}`,
      type: "website",
      siteName: "Vowify",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function ConvitePage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;
  return <ConviteClient id={id} />;
}
