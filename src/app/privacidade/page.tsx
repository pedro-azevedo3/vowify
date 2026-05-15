import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade — Vowify",
  description: "Saiba como a Vowify coleta, usa e protege seus dados pessoais, em conformidade com a LGPD.",
};

export default function PrivacidadePage() {
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
            Legal · LGPD
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em", color: "#0f0b1e", margin: "0 0 12px", lineHeight: 1.1 }}>
            Política de Privacidade
          </h1>
          <p style={{ fontSize: 15, color: "#6e6880", margin: 0, lineHeight: 1.6 }}>
            Última atualização: maio de 2026 · Em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
          </p>
        </div>

        {/* LGPD badge */}
        <div style={{ background: "#e6f7ee", border: "1px solid rgba(22,163,74,.2)", borderRadius: 12, padding: "16px 20px", marginBottom: 48, display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span style={{ fontSize: 20 }}>🔒</span>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#0f6b32", margin: "0 0 4px" }}>Comprometidos com sua privacidade</p>
            <p style={{ fontSize: 13, color: "#166534", margin: 0, lineHeight: 1.5 }}>
              A Vowify trata dados pessoais com responsabilidade, transparência e segurança. Você tem controle sobre seus dados a qualquer momento.
            </p>
          </div>
        </div>

        {/* Index */}
        <div style={{ background: "#faf7ff", borderRadius: 14, padding: "20px 24px", marginBottom: 48, border: "1px solid #ece7f5" }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#9994ac", textTransform: "uppercase", letterSpacing: ".06em", margin: "0 0 12px" }}>Índice</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              "1. Identificação do Controlador",
              "2. Dados que Coletamos",
              "3. Finalidade do Tratamento",
              "4. Base Legal para o Tratamento",
              "5. Compartilhamento de Dados",
              "6. Transferência Internacional",
              "7. Armazenamento e Segurança",
              "8. Retenção de Dados",
              "9. Cookies e Tecnologias Similares",
              "10. Dados de Menores",
              "11. Seus Direitos como Titular",
              "12. Como Exercer seus Direitos",
              "13. Alterações nesta Política",
              "14. Contato e Encarregado (DPO)",
            ].map((item) => (
              <span key={item} style={{ fontSize: 14, color: "#2a2440" }}>{item}</span>
            ))}
          </div>
        </div>

        {/* Sections */}
        <S title="1. Identificação do Controlador">
          A <strong>Vowify</strong> é a controladora dos dados pessoais tratados por meio desta plataforma. Para fins da LGPD, o controlador é a pessoa jurídica responsável pelas decisões referentes ao tratamento dos dados pessoais.{"\n\n"}
          Os dados de contato da Vowify estão disponíveis na seção 14 desta Política.
        </S>

        <S title="2. Dados que Coletamos">
          <strong>2.1 Dados fornecidos pelo organizador (usuário cadastrado):</strong>{"\n"}
          • Nome completo{"\n"}
          • Endereço de e-mail{"\n"}
          • Senha (armazenada com criptografia — nunca em texto puro){"\n"}
          • Informações do perfil (quando autenticado via Google: nome e foto de perfil){"\n"}
          • Dados de eventos criados (nome, data, local, configurações){"\n\n"}
          <strong>2.2 Dados fornecidos pelos convidados (via formulário de RSVP):</strong>{"\n"}
          • Nome completo{"\n"}
          • Número de WhatsApp{"\n"}
          • Restrições alimentares (quando informado pelo convidado){"\n"}
          • Resposta de presença (confirmado / não vai){"\n"}
          • Informação sobre acompanhante{"\n\n"}
          <strong>2.3 Dados coletados automaticamente:</strong>{"\n"}
          • Endereço IP{"\n"}
          • Tipo de navegador e dispositivo{"\n"}
          • Páginas acessadas e tempo de sessão{"\n"}
          • Cookies de sessão (detalhado na seção 9)
        </S>

        <S title="3. Finalidade do Tratamento">
          Os dados coletados são utilizados para as seguintes finalidades:{"\n\n"}
          • <strong>Prestação do serviço:</strong> criação e gerenciamento de eventos, geração de convites, coleta e exibição de RSVPs.{"\n"}
          • <strong>Autenticação:</strong> identificação e acesso seguro à conta do usuário.{"\n"}
          • <strong>Comunicações do serviço:</strong> envio de e-mails transacionais (confirmação de cadastro, redefinição de senha, notificações do evento).{"\n"}
          • <strong>Suporte ao cliente:</strong> atendimento e resolução de dúvidas ou problemas.{"\n"}
          • <strong>Melhoria do produto:</strong> análise de uso agregada e anonimizada para aprimorar funcionalidades.{"\n"}
          • <strong>Cumprimento legal:</strong> obrigações legais e regulatórias aplicáveis.{"\n\n"}
          A Vowify <strong>não</strong> utiliza dados pessoais para publicidade direcionada de terceiros nem vende dados a anunciantes.
        </S>

        <S title="4. Base Legal para o Tratamento">
          O tratamento dos dados pessoais pela Vowify fundamenta-se nas seguintes bases legais previstas na LGPD:{"\n\n"}
          • <strong>Execução de contrato (Art. 7º, V):</strong> tratamento necessário para a prestação do serviço contratado pelo usuário.{"\n"}
          • <strong>Legítimo interesse (Art. 7º, IX):</strong> para fins de segurança, melhoria do produto e prevenção de fraudes.{"\n"}
          • <strong>Consentimento (Art. 7º, I):</strong> para comunicações de marketing, quando aplicável, com possibilidade de revogação a qualquer tempo.{"\n"}
          • <strong>Cumprimento de obrigação legal (Art. 7º, II):</strong> quando exigido por lei ou determinação judicial.
        </S>

        <S title="5. Compartilhamento de Dados">
          A Vowify pode compartilhar dados pessoais com:{"\n\n"}
          • <strong>Provedores de infraestrutura:</strong> serviços de nuvem e banco de dados utilizados para hospedar a plataforma (Supabase), com cláusulas contratuais de proteção de dados.{"\n"}
          • <strong>Processadores de pagamento:</strong> gateways certificados PCI-DSS para processar transações financeiras. Esses parceiros recebem apenas os dados necessários para a transação.{"\n"}
          • <strong>Autoridades competentes:</strong> quando exigido por lei, ordem judicial ou para proteger direitos da Vowify ou de terceiros.{"\n\n"}
          A Vowify <strong>não compartilha</strong> dados pessoais com terceiros para fins de marketing, publicidade ou qualquer outra finalidade não descrita nesta Política, sem consentimento prévio do titular.
        </S>

        <S title="6. Transferência Internacional">
          Alguns de nossos parceiros de infraestrutura operam em servidores fora do Brasil. Quando isso ocorre, garantimos que as transferências são realizadas com salvaguardas adequadas, incluindo cláusulas contratuais padrão e certificações de segurança equivalentes às exigidas pela LGPD.
        </S>

        <S title="7. Armazenamento e Segurança">
          Adotamos medidas técnicas e organizacionais apropriadas para proteger seus dados pessoais, incluindo:{"\n\n"}
          • Criptografia em trânsito (TLS/HTTPS) em todas as comunicações.{"\n"}
          • Criptografia em repouso para dados sensíveis armazenados.{"\n"}
          • Senhas armazenadas com algoritmos de hash seguros (nunca em texto plano).{"\n"}
          • Controle de acesso baseado em funções (RBAC) nos sistemas internos.{"\n"}
          • Políticas de segurança de nível de linha (Row Level Security) no banco de dados.{"\n"}
          • Monitoramento contínuo de acessos e atividades suspeitas.{"\n\n"}
          Em caso de incidente de segurança que possa impactar seus dados, a Vowify notificará as autoridades competentes e os titulares afetados nos prazos previstos em lei.
        </S>

        <S title="8. Retenção de Dados">
          Os dados pessoais são mantidos pelo tempo necessário para as finalidades descritas nesta Política:{"\n\n"}
          • <strong>Dados da conta:</strong> mantidos enquanto a conta estiver ativa. Após o encerramento, removidos em até 30 dias.{"\n"}
          • <strong>Dados dos eventos:</strong> mantidos enquanto o evento estiver ativo na plataforma e por até 90 dias após seu encerramento.{"\n"}
          • <strong>Dados dos convidados:</strong> vinculados ao evento. Removidos junto com os dados do evento.{"\n"}
          • <strong>Registros de transações:</strong> mantidos por 5 anos, conforme exigência fiscal e legal.{"\n"}
          • <strong>Logs de acesso:</strong> mantidos por 6 meses, conforme o Marco Civil da Internet (Lei nº 12.965/2014).
        </S>

        <S title="9. Cookies e Tecnologias Similares">
          A Vowify utiliza cookies para:{"\n\n"}
          • <strong>Cookies essenciais:</strong> necessários para autenticação e funcionamento básico da plataforma. Não podem ser desativados sem comprometer o serviço.{"\n"}
          • <strong>Cookies de preferências:</strong> armazenam configurações do usuário para melhorar a experiência.{"\n\n"}
          A Vowify <strong>não</strong> utiliza cookies de rastreamento, publicidade ou analytics de terceiros. Você pode gerenciar cookies pelas configurações do seu navegador, mas a desativação de cookies essenciais pode impedir o funcionamento correto da plataforma.
        </S>

        <S title="10. Dados de Menores">
          A plataforma Vowify não é destinada a pessoas menores de 18 (dezoito) anos. Não coletamos intencionalmente dados pessoais de menores. Caso tomemos conhecimento de que coletamos dados de um menor sem o consentimento dos responsáveis, removeremos tais dados imediatamente.{"\n\n"}
          Se você acredita que coletamos dados de um menor, entre em contato pelo e-mail indicado na seção 14.
        </S>

        <S title="11. Seus Direitos como Titular">
          Nos termos da LGPD, você possui os seguintes direitos em relação aos seus dados pessoais:{"\n\n"}
          • <strong>Confirmação e acesso:</strong> saber se tratamos seus dados e obter uma cópia das informações que possuímos sobre você.{"\n"}
          • <strong>Correção:</strong> corrigir dados incompletos, inexatos ou desatualizados.{"\n"}
          • <strong>Anonimização, bloqueio ou eliminação:</strong> de dados desnecessários, excessivos ou tratados em desconformidade com a LGPD.{"\n"}
          • <strong>Portabilidade:</strong> solicitar a transferência de seus dados para outro fornecedor de serviço.{"\n"}
          • <strong>Eliminação:</strong> solicitar a exclusão dos dados tratados com base em consentimento, ressalvadas as hipóteses legais de retenção.{"\n"}
          • <strong>Informação:</strong> ser informado sobre com quem compartilhamos seus dados.{"\n"}
          • <strong>Revogação do consentimento:</strong> revogar consentimentos anteriormente fornecidos.{"\n"}
          • <strong>Oposição:</strong> opor-se ao tratamento realizado com base em legítimo interesse.{"\n"}
          • <strong>Revisão de decisões automatizadas:</strong> solicitar revisão de decisões tomadas exclusivamente com base em tratamento automatizado.
        </S>

        <S title="12. Como Exercer seus Direitos">
          Para exercer qualquer um dos direitos listados na seção anterior, você pode:{"\n\n"}
          • <strong>Pela plataforma:</strong> acessar as configurações da sua conta para gerenciar e excluir seus dados diretamente.{"\n"}
          • <strong>Por e-mail:</strong> enviar solicitação para <a href="mailto:privacidade@vowify.app" style={{ color: "#b14eff", textDecoration: "none" }}>privacidade@vowify.app</a> com assunto "Direitos LGPD — [seu direito]".{"\n\n"}
          Responderemos dentro do prazo legal de 15 dias. Podemos solicitar a confirmação de sua identidade antes de processar a solicitação, para garantir a segurança dos seus dados.
        </S>

        <S title="13. Alterações nesta Política">
          Esta Política de Privacidade pode ser atualizada periodicamente para refletir mudanças no serviço, na legislação ou nas práticas de privacidade. Alterações relevantes serão comunicadas por e-mail ou por aviso em destaque na plataforma.{"\n\n"}
          Recomendamos revisar esta Política regularmente. A data da última atualização está indicada no topo desta página. O uso continuado da plataforma após as alterações constitui aceitação da Política revisada.
        </S>

        <S title="14. Contato e Encarregado (DPO)">
          Para dúvidas, solicitações ou para exercer seus direitos relacionados a esta Política de Privacidade, entre em contato:{"\n\n"}
          • <strong>E-mail geral:</strong> <a href="mailto:contato@vowify.app" style={{ color: "#b14eff", textDecoration: "none" }}>contato@vowify.app</a>{"\n"}
          • <strong>E-mail de privacidade (DPO):</strong> <a href="mailto:privacidade@vowify.app" style={{ color: "#b14eff", textDecoration: "none" }}>privacidade@vowify.app</a>{"\n\n"}
          Nosso tempo de resposta é de até 15 dias úteis para solicitações relacionadas à LGPD.
        </S>

        {/* Footer links */}
        <div style={{ marginTop: 56, paddingTop: 24, borderTop: "1px solid #ece7f5", display: "flex", gap: 24, fontSize: 13, flexWrap: "wrap" }}>
          <Link href="/termos" style={{ color: "#b14eff", textDecoration: "none" }}>Termos de Uso →</Link>
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
