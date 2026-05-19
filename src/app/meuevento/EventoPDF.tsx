"use client";

import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";

// ── Types ─────────────────────────────────────────────────────────────────
type Guest = {
  name: string;
  phone: string;
  status: "confirmed" | "declined" | "pending";
  plus: number;
  restriction?: string;
  at: string;
};

type ReportData = {
  eventName: string;
  organizerName: string;
  date: string;
  time: string;
  location: string;
  address: string;
  guestLimit: number;
  confirmed: number;
  companions: number;
  declined: number;
  pending: number;
  guests: Guest[];
};

// ── Styles ────────────────────────────────────────────────────────────────
const C = {
  violet:  "#b14eff",
  ink:     "#0f0b1e",
  ink2:    "#2a2440",
  mute:    "#6e6880",
  mute2:   "#9994ac",
  border:  "#ece7f5",
  bg:      "#faf7ff",
  green:   "#16a34a",
  red:     "#e1124e",
  amber:   "#f59e0b",
  white:   "#ffffff",
};

const s = StyleSheet.create({
  page:        { fontFamily: "Helvetica", fontSize: 9, color: C.ink, backgroundColor: C.white, padding: "36 44 48 44" },
  // header
  header:      { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, paddingBottom: 16, borderBottom: `1.5 solid ${C.border}` },
  brand:       { flexDirection: "row", alignItems: "center", gap: 6 },
  brandBox:    { width: 22, height: 22, borderRadius: 5, backgroundColor: C.violet, justifyContent: "center", alignItems: "center" },
  brandLetter: { color: C.white, fontSize: 11, fontFamily: "Helvetica-Bold" },
  brandName:   { fontSize: 13, fontFamily: "Helvetica-Bold", color: C.ink, letterSpacing: -0.3 },
  genDate:     { fontSize: 7.5, color: C.mute2, marginTop: 2 },
  // event title block
  titleBlock:  { marginBottom: 20 },
  tag:         { fontSize: 7, fontFamily: "Helvetica-Bold", color: C.violet, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 },
  eventName:   { fontSize: 20, fontFamily: "Helvetica-Bold", color: C.ink, letterSpacing: -0.5, marginBottom: 4 },
  metaRow:     { flexDirection: "row", gap: 16, flexWrap: "wrap" },
  metaItem:    { flexDirection: "row", alignItems: "center", gap: 4 },
  metaLabel:   { fontSize: 7.5, color: C.mute2, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 0.6 },
  metaValue:   { fontSize: 8.5, color: C.ink2 },
  // summary cards
  summaryRow:  { flexDirection: "row", gap: 8, marginBottom: 20 },
  card:        { flex: 1, backgroundColor: C.bg, borderRadius: 8, padding: "10 12", border: `1 solid ${C.border}` },
  cardLabel:   { fontSize: 7, color: C.mute, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 },
  cardValue:   { fontSize: 20, fontFamily: "Helvetica-Bold", letterSpacing: -0.5, marginBottom: 1 },
  cardSub:     { fontSize: 7, color: C.mute },
  // section title
  sectionHead: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: C.mute, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 },
  // table
  tableHeader: { flexDirection: "row", backgroundColor: C.bg, borderRadius: 4, padding: "5 8", marginBottom: 2 },
  tableRow:    { flexDirection: "row", padding: "6 8", borderBottom: `0.5 solid ${C.border}` },
  tableRowAlt: { flexDirection: "row", padding: "6 8", borderBottom: `0.5 solid ${C.border}`, backgroundColor: "#fdf9ff" },
  colName:     { width: "28%", fontSize: 8.5 },
  colPhone:    { width: "20%", fontSize: 8.5, color: C.mute },
  colStatus:   { width: "16%", fontSize: 8 },
  colPlus:     { width: "10%", fontSize: 8.5, color: C.mute, textAlign: "center" },
  colRestr:    { width: "26%", fontSize: 8, color: C.mute },
  colHdr:      { fontSize: 7, fontFamily: "Helvetica-Bold", color: C.mute2, textTransform: "uppercase", letterSpacing: 0.5 },
  // status badges
  badge:       { borderRadius: 3, padding: "1 5", fontSize: 7.5, fontFamily: "Helvetica-Bold" },
  // footer
  footer:      { position: "absolute", bottom: 28, left: 44, right: 44, flexDirection: "row", justifyContent: "space-between", borderTop: `0.5 solid ${C.border}`, paddingTop: 8 },
  footerText:  { fontSize: 7, color: C.mute2 },
});

// ── Status badge ──────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Guest["status"] }) {
  const map = {
    confirmed: { label: "Confirmado", bg: "#e6f7ee", color: C.green },
    declined:  { label: "Não vai",    bg: "#fde7ee", color: C.red   },
    pending:   { label: "Pendente",   bg: "#fef3c7", color: C.amber },
  };
  const { label, bg, color } = map[status] ?? map.pending;
  return (
    <View style={[s.badge, { backgroundColor: bg }]}>
      <Text style={{ color, fontSize: 7.5, fontFamily: "Helvetica-Bold" }}>{label}</Text>
    </View>
  );
}

// ── Document ──────────────────────────────────────────────────────────────
function EventoDocument({ data }: { data: ReportData }) {
  const now = new Date().toLocaleString("pt-BR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const total = data.confirmed + data.declined + data.pending;
  const responded = data.confirmed + data.declined;
  const respondedPct = total > 0 ? Math.round((responded / total) * 100) : 0;

  return (
    <Document title={`Relatório — ${data.eventName}`} author="Vowify">
      <Page size="A4" style={s.page}>

        {/* Header */}
        <View style={s.header}>
          <View style={s.brand}>
            <View style={s.brandBox}><Text style={s.brandLetter}>V</Text></View>
            <Text style={s.brandName}>Vowify</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: 8, color: C.mute, fontFamily: "Helvetica-Bold" }}>RELATÓRIO DO EVENTO</Text>
            <Text style={s.genDate}>Gerado em {now}</Text>
          </View>
        </View>

        {/* Event title */}
        <View style={s.titleBlock}>
          <Text style={s.tag}>Evento</Text>
          <Text style={s.eventName}>{data.eventName}</Text>
          <View style={s.metaRow}>
            {data.organizerName ? (
              <View style={s.metaItem}>
                <Text style={s.metaLabel}>Organizador</Text>
                <Text style={s.metaValue}> {data.organizerName}</Text>
              </View>
            ) : null}
            {data.date ? (
              <View style={s.metaItem}>
                <Text style={s.metaLabel}>Data</Text>
                <Text style={s.metaValue}> {data.date}{data.time ? ` · ${data.time}` : ""}</Text>
              </View>
            ) : null}
            {data.location ? (
              <View style={s.metaItem}>
                <Text style={s.metaLabel}>Local</Text>
                <Text style={s.metaValue}> {data.location}{data.address ? `, ${data.address}` : ""}</Text>
              </View>
            ) : null}
            <View style={s.metaItem}>
              <Text style={s.metaLabel}>Limite</Text>
              <Text style={s.metaValue}> {data.guestLimit} convidados</Text>
            </View>
          </View>
        </View>

        {/* Summary cards */}
        <View style={s.summaryRow}>
          <View style={s.card}>
            <Text style={s.cardLabel}>Confirmados</Text>
            <Text style={[s.cardValue, { color: C.violet }]}>{data.confirmed + data.companions}</Text>
            <Text style={s.cardSub}>{data.confirmed} + {data.companions} acomp.</Text>
          </View>
          <View style={s.card}>
            <Text style={s.cardLabel}>Não vão</Text>
            <Text style={[s.cardValue, { color: C.red }]}>{data.declined}</Text>
            <Text style={s.cardSub}>{total > 0 ? Math.round((data.declined / total) * 100) : 0}% do total</Text>
          </View>
          <View style={s.card}>
            <Text style={s.cardLabel}>Pendentes</Text>
            <Text style={[s.cardValue, { color: C.amber }]}>{data.pending}</Text>
            <Text style={s.cardSub}>{total > 0 ? Math.round((data.pending / total) * 100) : 0}% do total</Text>
          </View>
          <View style={s.card}>
            <Text style={s.cardLabel}>Respostas</Text>
            <Text style={[s.cardValue, { color: C.ink }]}>{respondedPct}%</Text>
            <Text style={s.cardSub}>{responded} de {total} convidados</Text>
          </View>
        </View>

        {/* Guest list */}
        <Text style={s.sectionHead}>Lista de convidados ({data.guests.length})</Text>

        {/* Table header */}
        <View style={s.tableHeader}>
          <Text style={[s.colName,  s.colHdr]}>Nome</Text>
          <Text style={[s.colPhone, s.colHdr]}>WhatsApp</Text>
          <Text style={[s.colStatus,s.colHdr]}>Status</Text>
          <Text style={[s.colPlus,  s.colHdr]}>+1</Text>
          <Text style={[s.colRestr, s.colHdr]}>Restrição alimentar</Text>
        </View>

        {data.guests.map((g, i) => (
          <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
            <Text style={[s.colName,  { fontFamily: g.status === "confirmed" ? "Helvetica-Bold" : "Helvetica" }]}>{g.name}</Text>
            <Text style={s.colPhone}>{g.phone}</Text>
            <View style={s.colStatus}><StatusBadge status={g.status} /></View>
            <Text style={[s.colPlus,  { color: g.plus > 0 ? C.violet : C.mute2 }]}>{g.plus > 0 ? `+${g.plus}` : "—"}</Text>
            <Text style={s.colRestr}>{g.restriction || "—"}</Text>
          </View>
        ))}

        {data.guests.length === 0 && (
          <View style={{ padding: "16 0", alignItems: "center" }}>
            <Text style={{ fontSize: 8, color: C.mute }}>Nenhum convidado registrado ainda.</Text>
          </View>
        )}

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>vowify.app · {data.eventName}</Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}

// ── Download trigger ──────────────────────────────────────────────────────
export async function downloadEventoPDF(data: ReportData) {
  const blob = await pdf(<EventoDocument data={data} />).toBlob();
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `relatorio-${data.eventName.toLowerCase().replace(/\s+/g, "-")}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}
