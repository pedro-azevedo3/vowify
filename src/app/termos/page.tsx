import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso — Vowify",
  description: "Leia os Termos de Uso da plataforma Vowify antes de utilizar nossos serviços.",
};

export default function TermosPage() {
  return (
    <div style={{ background: "#fff", minHeight: "100dvh", fontFamily: "var(--font-bricolage), system-ui, sans-serif" }}>

      {/* Header */}
      <header style={{ borderBottom: "1px solid #ece7f5", padding: "16px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <Image src="/logo.png" alt="Vowify" width={28} height={28} style={{ borderRadius: 8 }} />
            <span style={{ fontSize: 17, fontWeight: 700, color: "#0f0b1e", letterSpacing: "-0.02em" }}>Vowify</span>
          </Link>
          <Link href="/" style={{ fontSize: 13, color: "#6e6880", textDecoration: "none" }}>← Voltar</Link>
        </div>
      </header>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "56px 24px 96px" }}>

        {/* Title */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: 999, background: "#f1e1ff", color: "#b14eff", fontSize: 12, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 16 }}>
            Legal
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em", color: "#0f0b1e", margin: "0 0 12px", lineHeight: 1.1 }}>
            Termos de Uso
          </h1>
          <p style={{ fontSize: 15, color: "#6e6880", margin: 0, lineHeight: 1.6 }}>
            Última atualização: maio de 2026 · Leia com atenção antes de utilizar a plataforma Vowify.
          </p>
        </div>

        {/* Index */}
        <div style={{ background: "#faf7ff", borderRadius: 14, padding: "20px 24px", marginBottom: 48, border: "1px solid #ece7f5" }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#9994ac", textTransform: "uppercase", letterSpacing: ".06em", margin: "0 0 12px" }}>Índice</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              "1. Quem Somos",
              "2. Aceitação dos Termos",
              "3. Descrição do Serviço",
              "4. Cadastro e Conta",
              "5. Planos e Pagamentos",
              "6. Uso Aceitável",
              "7. Conteúdo do Usuário",
              "8. Dados dos Convidados",
              "9. Propriedade Intelectual",
              "10. Disponibilidade do Serviço",
              "11. Limitação de Responsabilidade",
              "12. Rescisão",
              "13. Alterações nos Termos",
              "14. Lei Aplicável e Foro",
              "15. Contato",
            ].map((item) => (
              <span key={item} style={{ fontSize: 14, color: "#2a2440" }}>{item}</span>
            ))}
          </div>
        </div>

        {/* Sections */}
        <S title="1. Quem Somos">
          A Vowify é uma plataforma digital brasileira de criação e gerenciamento de convites para eventos, operada por pessoa jurídica com sede no Brasil. Nosso serviço permite que organizadores de eventos criem convites personalizados, compartilhem via link ou QR Code e acompanhem confirmações de presença (RSVP) em tempo real.
        </S>

        <S title="2. Aceitação dos Termos">
          Ao acessar, cadastrar-se ou utilizar qualquer funcionalidade da plataforma Vowify — seja pelo site, aplicativo web ou qualquer outro meio disponibilizado — você declara ter lido, compreendido e concordado integralmente com estes Termos de Uso e com nossa Política de Privacidade.{"\n\n"}
          Se você estiver aceitando estes Termos em nome de uma empresa ou outra pessoa jurídica, você declara ter autoridade para vincular tal entidade a estes Termos. Caso não concorde com qualquer disposição aqui contida, você não está autorizado a utilizar o serviço.
        </S>

        <S title="3. Descrição do Serviço">
          A Vowify oferece as seguintes funcionalidades principais:{"\n\n"}
          • <strong>Criação de eventos:</strong> cadastro de informações do evento como nome, data, local, traje e mensagem personalizada.{"\n"}
          • <strong>Personalização do convite:</strong> escolha de paleta de cores, tipografia e aparência visual do convite digital.{"\n"}
          • <strong>Compartilhamento:</strong> geração de link único e QR Code para distribuição do convite.{"\n"}
          • <strong>RSVP automático:</strong> formulário integrado ao convite para que convidados confirmem ou recusem presença.{"\n"}
          • <strong>Painel CRM:</strong> dashboard em tempo real com estatísticas de confirmações, lista de convidados e informações de acompanhantes e restrições alimentares.{"\n\n"}
          A Vowify reserva-se o direito de modificar, suspender ou descontinuar qualquer funcionalidade do serviço a qualquer momento, mediante aviso prévio sempre que possível.
        </S>

        <S title="4. Cadastro e Conta">
          Para utilizar as funcionalidades completas da plataforma, é necessário criar uma conta fornecendo nome completo, e-mail válido e senha. Você também pode autenticar-se por meio de provedores de identidade de terceiros (como Google), sujeito aos termos desses provedores.{"\n\n"}
          Você é inteiramente responsável por:{"\n"}
          • Manter a confidencialidade de suas credenciais de acesso.{"\n"}
          • Todas as atividades realizadas em sua conta.{"\n"}
          • Notificar imediatamente a Vowify sobre qualquer uso não autorizado de sua conta.{"\n\n"}
          A Vowify não se responsabiliza por perdas ou danos resultantes do descumprimento das obrigações acima. É vedado criar contas falsas, compartilhar credenciais ou utilizar a plataforma em nome de terceiros sem autorização expressa.
        </S>

        <S title="5. Planos e Pagamentos">
          A Vowify adota o modelo de cobrança <strong>por evento</strong>. O valor do plano vigente está disponível na página de preços do site. Os preços podem ser alterados com aviso prévio de no mínimo 30 dias.{"\n\n"}
          <strong>Formas de pagamento aceitas:</strong> Pix, cartão de crédito e boleto bancário. O processamento é realizado por parceiros certificados (gateways de pagamento) e a Vowify não armazena dados de cartão em seus servidores.{"\n\n"}
          <strong>Política de reembolso:</strong> Oferecemos garantia de reembolso integral de 7 (sete) dias corridos a partir da data de compra, sem necessidade de justificativa. Após esse prazo, não são concedidos reembolsos parciais ou totais.{"\n\n"}
          Em caso de disputa de cobrança, o usuário deve entrar em contato com a Vowify antes de acionar a operadora do cartão.
        </S>

        <S title="6. Uso Aceitável">
          Ao utilizar a Vowify, você concorda em NÃO:{"\n\n"}
          • Enviar ou distribuir conteúdo ilegal, ofensivo, discriminatório, difamatório ou que viole direitos de terceiros.{"\n"}
          • Utilizar a plataforma para fins de spam, phishing ou qualquer atividade fraudulenta.{"\n"}
          • Tentar acessar, modificar ou danificar sistemas, redes ou dados da Vowify ou de outros usuários.{"\n"}
          • Realizar engenharia reversa, descompilar ou desmontar qualquer parte do software da plataforma.{"\n"}
          • Usar ferramentas automatizadas (bots, scrapers) para acessar ou coletar dados da plataforma sem autorização prévia e por escrito.{"\n"}
          • Revender, sublicenciar ou explorar comercialmente o serviço sem autorização expressa da Vowify.{"\n\n"}
          O descumprimento destas regras pode resultar na suspensão imediata da conta, sem direito a reembolso.
        </S>

        <S title="7. Conteúdo do Usuário">
          Você mantém todos os direitos sobre o conteúdo que criar ou inserir na plataforma (textos, imagens, informações de eventos). Ao publicar conteúdo na Vowify, você concede à plataforma uma licença não exclusiva, gratuita e global para hospedar, armazenar e exibir esse conteúdo estritamente para fins de prestação do serviço.{"\n\n"}
          Você declara e garante que possui todos os direitos necessários sobre o conteúdo enviado e que este não infringe direitos de terceiros. A Vowify não se responsabiliza pelo conteúdo gerado por usuários.
        </S>

        <S title="8. Dados dos Convidados">
          Ao utilizar a funcionalidade de RSVP, os convidados fornecem voluntariamente seus dados pessoais (nome, telefone, restrições alimentares). Esses dados são coletados pela Vowify na qualidade de <strong>operadora</strong>, em nome do organizador do evento, que atua como <strong>controlador</strong> dos dados, nos termos da LGPD.{"\n\n"}
          O organizador é responsável por:{"\n"}
          • Informar os convidados sobre a coleta de dados antes do envio do convite.{"\n"}
          • Utilizar os dados dos convidados exclusivamente para fins relacionados ao evento.{"\n"}
          • Não compartilhar, vender ou utilizar os dados dos convidados para finalidades não relacionadas ao evento.{"\n\n"}
          A Vowify não utilizará os dados dos convidados para fins de marketing próprio.
        </S>

        <S title="9. Propriedade Intelectual">
          Todos os direitos de propriedade intelectual relacionados à plataforma Vowify — incluindo, mas não se limitando a, marca, logotipo, design, interface, código-fonte, textos e demais elementos visuais — são de propriedade exclusiva da Vowify e estão protegidos pelas leis brasileiras e internacionais de propriedade intelectual.{"\n\n"}
          Nenhuma disposição destes Termos concede ao usuário qualquer direito, título ou interesse sobre a propriedade intelectual da Vowify. É estritamente proibida qualquer reprodução, distribuição ou criação de obras derivadas sem autorização prévia e por escrito.
        </S>

        <S title="10. Disponibilidade do Serviço">
          A Vowify envida seus melhores esforços para manter a plataforma disponível 24 horas por dia, 7 dias por semana. No entanto, não garantimos disponibilidade ininterrupta. Podemos realizar manutenções programadas ou não programadas que resultem em indisponibilidade temporária.{"\n\n"}
          A Vowify não se responsabiliza por danos causados por indisponibilidade do serviço decorrente de falhas de infraestrutura de terceiros, eventos de força maior ou ataques cibernéticos.
        </S>

        <S title="11. Limitação de Responsabilidade">
          Na máxima extensão permitida pela legislação aplicável, a Vowify não será responsável por danos indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo perda de lucros, dados ou oportunidades de negócio, mesmo que tenha sido avisada da possibilidade de tais danos.{"\n\n"}
          A responsabilidade total da Vowify perante o usuário, por qualquer motivo, será limitada ao valor pago pelo usuário nos 12 (doze) meses anteriores ao evento que deu origem à reclamação.
        </S>

        <S title="12. Rescisão">
          Você pode encerrar sua conta a qualquer momento através das configurações da plataforma ou entrando em contato com o suporte. A Vowify pode suspender ou encerrar sua conta imediatamente, sem aviso prévio, em caso de violação destes Termos.{"\n\n"}
          Após o encerramento, o acesso à plataforma será revogado e os dados do evento serão removidos conforme descrito na Política de Privacidade. As obrigações que por sua natureza devam persistir após a rescisão continuarão em vigor.
        </S>

        <S title="13. Alterações nos Termos">
          A Vowify reserva-se o direito de modificar estes Termos a qualquer momento. Alterações substanciais serão comunicadas por e-mail cadastrado ou por aviso em destaque na plataforma, com antecedência mínima de 15 dias.{"\n\n"}
          O uso continuado da plataforma após a data de vigência das alterações constituirá aceitação dos novos Termos. Caso não concorde, você deve encerrar sua conta antes da data de vigência.
        </S>

        <S title="14. Lei Aplicável e Foro">
          Estes Termos são regidos pelas leis da República Federativa do Brasil. Para dirimir quaisquer controvérsias decorrentes deste instrumento, fica eleito o foro da comarca da sede da Vowify, com renúncia expressa a qualquer outro, por mais privilegiado que seja.
        </S>

        <S title="15. Contato">
          Para dúvidas, sugestões ou reclamações relacionadas a estes Termos de Uso, entre em contato pelo e-mail: <a href="mailto:contato@vowify.app" style={{ color: "#b14eff", textDecoration: "none" }}>contato@vowify.app</a>.{"\n\n"}
          Nosso tempo de resposta é de até 5 dias úteis.
        </S>

        {/* Footer links */}
        <div style={{ marginTop: 56, paddingTop: 24, borderTop: "1px solid #ece7f5", display: "flex", gap: 24, fontSize: 13, flexWrap: "wrap" }}>
          <Link href="/privacidade" style={{ color: "#b14eff", textDecoration: "none" }}>Política de Privacidade →</Link>
          <Link href="/" style={{ color: "#6e6880", textDecoration: "none" }}>Voltar ao início</Link>
        </div>
      </div>
    </div>
  );
}

function S({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f0b1e", margin: "0 0 12px", letterSpacing: "-0.015em" }}>{title}</h2>
      <p style={{ fontSize: 15, color: "#2a2440", lineHeight: 1.8, margin: 0, whiteSpace: "pre-line" }}>{children}</p>
    </div>
  );
}
