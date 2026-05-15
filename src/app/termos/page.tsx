import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso — Vowify",
  description: "Leia os Termos de Uso da plataforma Vowify.",
};

export default function TermosPage() {
  return (
    <div style={{ background: "#fff", minHeight: "100dvh", fontFamily: "var(--font-bricolage), system-ui, sans-serif" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 24px 80px" }}>

        {/* Back */}
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6e6880", textDecoration: "none", marginBottom: 40 }}
          onMouseEnter={() => {}} >
          ← Voltar para o início
        </Link>

        <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.025em", color: "#0f0b1e", margin: "0 0 8px" }}>Termos de Uso</h1>
        <p style={{ fontSize: 14, color: "#9994ac", margin: "0 0 48px" }}>Última atualização: maio de 2026</p>

        <Section title="1. Aceitação dos Termos">
          Ao acessar ou utilizar a plataforma Vowify, você concorda com estes Termos de Uso. Se não concordar com qualquer parte, não utilize o serviço.
        </Section>

        <Section title="2. Descrição do Serviço">
          A Vowify é uma plataforma de convites digitais com RSVP automático. Permite criar eventos, compartilhar convites via link ou QR Code e acompanhar confirmações de presença em tempo real.
        </Section>

        <Section title="3. Cadastro e Conta">
          Para utilizar os recursos completos da plataforma, é necessário criar uma conta com e-mail e senha válidos. Você é responsável pela confidencialidade de suas credenciais e por todas as atividades realizadas em sua conta.
        </Section>

        <Section title="4. Uso Aceitável">
          Você concorda em não utilizar a Vowify para enviar conteúdo ilegal, ofensivo, spam ou que viole direitos de terceiros. A Vowify reserva o direito de suspender contas que violem estas diretrizes.
        </Section>

        <Section title="5. Pagamentos">
          Os planos pagos são cobrados por evento, conforme a tabela de preços vigente. Os pagamentos são processados por parceiros certificados e não armazenamos dados de cartão de crédito. Oferecemos garantia de reembolso de 7 dias.
        </Section>

        <Section title="6. Dados dos Convidados">
          Os dados coletados pelo formulário de RSVP (nome, telefone e restrições alimentares) pertencem ao organizador do evento. A Vowify atua como processadora dos dados e não os utiliza para fins de marketing sem consentimento.
        </Section>

        <Section title="7. Propriedade Intelectual">
          Todo o conteúdo da plataforma — incluindo marca, design, código e textos — é propriedade exclusiva da Vowify e protegido por lei. É proibida a reprodução sem autorização prévia.
        </Section>

        <Section title="8. Limitação de Responsabilidade">
          A Vowify não se responsabiliza por falhas de conectividade, eventos de força maior ou danos indiretos decorrentes do uso do serviço.
        </Section>

        <Section title="9. Alterações nos Termos">
          Podemos atualizar estes Termos periodicamente. Notificaremos os usuários sobre mudanças relevantes por e-mail ou aviso na plataforma. O uso continuado após as mudanças constitui aceitação dos novos termos.
        </Section>

        <Section title="10. Contato">
          Dúvidas sobre estes Termos? Entre em contato: <a href="mailto:contato@vowify.app" style={{ color: "#b14eff" }}>contato@vowify.app</a>
        </Section>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid #ece7f5", display: "flex", gap: 20, fontSize: 13 }}>
          <Link href="/privacidade" style={{ color: "#b14eff", textDecoration: "none" }}>Política de Privacidade →</Link>
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
      <p style={{ fontSize: 15, color: "#2a2440", lineHeight: 1.75, margin: 0 }}>{children}</p>
    </div>
  );
}
