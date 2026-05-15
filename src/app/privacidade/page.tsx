import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade — Vowify",
  description: "Saiba como a Vowify coleta, usa e protege seus dados.",
};

export default function PrivacidadePage() {
  return (
    <div style={{ background: "#fff", minHeight: "100dvh", fontFamily: "var(--font-bricolage), system-ui, sans-serif" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 24px 80px" }}>

        {/* Back */}
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6e6880", textDecoration: "none", marginBottom: 40 }}>
          ← Voltar para o início
        </Link>

        <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.025em", color: "#0f0b1e", margin: "0 0 8px" }}>Política de Privacidade</h1>
        <p style={{ fontSize: 14, color: "#9994ac", margin: "0 0 48px" }}>Última atualização: maio de 2026</p>

        <Section title="1. Quem Somos">
          A Vowify é uma plataforma brasileira de convites digitais com RSVP automático. Esta política descreve como coletamos, usamos e protegemos seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
        </Section>

        <Section title="2. Dados que Coletamos">
          <strong>Organizadores:</strong> nome, e-mail, senha (armazenada com hash), dados de pagamento (processados por terceiros certificados) e informações dos eventos criados.{"\n\n"}
          <strong>Convidados:</strong> nome completo, número de WhatsApp, restrições alimentares e resposta de presença — fornecidos voluntariamente ao preencher o formulário de RSVP.
        </Section>

        <Section title="3. Como Usamos os Dados">
          Os dados dos organizadores são utilizados para autenticação, gerenciamento de eventos e comunicações do serviço. Os dados dos convidados são coletados exclusivamente para que o organizador gerencie as confirmações de presença do evento.
        </Section>

        <Section title="4. Compartilhamento de Dados">
          Não vendemos nem compartilhamos seus dados com terceiros para fins de marketing. Podemos compartilhar dados com prestadores de serviço estritamente necessários ao funcionamento da plataforma (infraestrutura de nuvem, processamento de pagamentos), sempre sob cláusulas de confidencialidade.
        </Section>

        <Section title="5. Armazenamento e Segurança">
          Os dados são armazenados em servidores seguros com criptografia em trânsito (TLS) e em repouso. Adotamos as melhores práticas de segurança para proteger suas informações contra acesso não autorizado.
        </Section>

        <Section title="6. Retenção de Dados">
          Os dados de eventos e convidados são mantidos enquanto a conta estiver ativa. Após o encerramento da conta, os dados são removidos em até 30 dias, salvo obrigação legal de retenção.
        </Section>

        <Section title="7. Seus Direitos (LGPD)">
          Você tem direito a: acessar seus dados, corrigir informações incorretas, solicitar a exclusão dos seus dados, revogar consentimentos e solicitar a portabilidade. Para exercer esses direitos, entre em contato pelo e-mail abaixo.
        </Section>

        <Section title="8. Cookies">
          Utilizamos cookies essenciais para o funcionamento da plataforma (sessão de autenticação). Não utilizamos cookies de rastreamento ou publicidade de terceiros.
        </Section>

        <Section title="9. Menores de Idade">
          A Vowify não é destinada a menores de 18 anos. Não coletamos intencionalmente dados de menores. Se identificarmos tal coleta, os dados serão imediatamente removidos.
        </Section>

        <Section title="10. Contato e DPO">
          Para dúvidas, solicitações ou para exercer seus direitos sob a LGPD, entre em contato: <a href="mailto:privacidade@vowify.app" style={{ color: "#b14eff" }}>privacidade@vowify.app</a>
        </Section>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid #ece7f5", display: "flex", gap: 20, fontSize: 13 }}>
          <Link href="/termos" style={{ color: "#b14eff", textDecoration: "none" }}>Termos de Uso →</Link>
          <Link href="/" style={{ color: "#6e6880", textDecoration: "none" }}>Voltar ao início</Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "#0f0b1e", margin: "0 0 10px", letterSpacing: "-0.01em" }}>{title}</h2>
      <p style={{ fontSize: 15, color: "#2a2440", lineHeight: 1.75, margin: 0, whiteSpace: "pre-line" }}>{children}</p>
    </div>
  );
}
