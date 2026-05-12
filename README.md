# Vowify

**Convites digitais com RSVP automático.**  
Crie, compartilhe via WhatsApp ou QR Code e acompanhe as confirmações de presença no painel CRM — por menos de R$ 20.

---

## Sobre o produto

A Vowify resolve um problema simples que acontece em toda festa: saber quantas pessoas vão aparecer. O organizador cria o evento, faz upload do convite (ou usa um template), distribui via WhatsApp ou QR Code e acompanha em tempo real quem confirmou, quem está pendente e quem não vai. Os convidados confirmam em 10 segundos, direto no navegador, sem baixar nenhum aplicativo.

**Um plano. Uma festa. R$ 19,90.**

---

## Funcionalidades

- **Convites digitais** — upload de PDF/imagem ou template com gradiente personalizado
- **RSVP automático** — formulário de confirmação embutido no link do convite
- **QR Code instantâneo** — gerado automaticamente, pronto para imprimir
- **Compartilhamento via WhatsApp** — link personalizado com um clique
- **Painel CRM** — donut em tempo real com confirmados, pendentes e ausentes
- **Exportação CSV/PDF** — lista de convidados para controle de entrada
- **Lembretes automáticos** — disparados 48h antes para quem não respondeu
- **Página de convite responsiva** — mobile-first, funciona em qualquer dispositivo

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Linguagem | TypeScript 5 |
| Estilização | Tailwind CSS v4 + inline styles |
| Componentes | [shadcn/ui](https://ui.shadcn.com/) (base: `@base-ui/react`) |
| Fonte | [Geist](https://vercel.com/font) via `next/font` |
| Ícones | [Lucide React](https://lucide.dev/) |

---

## Começando

### Pré-requisitos

- Node.js 18+
- npm 9+

### Instalação

```bash
# Clone o repositório
git clone git@github.com:pedro-azevedo3/vowify.git
cd vowify/app

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Scripts disponíveis

```bash
npm run dev      # Servidor de desenvolvimento (Turbopack)
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Lint com ESLint
```

---

## Estrutura do projeto

```
app/
├── src/
│   ├── app/
│   │   ├── globals.css               # Design system (tokens, animações, utilitários)
│   │   ├── layout.tsx                # Root layout com fonte Geist e metadata
│   │   ├── page.tsx                  # Landing page (composição das seções)
│   │   └── convite/
│   │       └── exemplo/
│   │           └── page.tsx          # Página de convite + RSVP interativo
│   ├── components/
│   │   ├── landing/
│   │   │   ├── Navbar.tsx            # Navbar fixa com dropdowns de auth
│   │   │   ├── Hero.tsx              # Hero com mockup animado do convite
│   │   │   ├── Stats.tsx             # Barra de números (12.4k eventos, 98%...)
│   │   │   ├── HowItWorks.tsx        # 3 passos: upload → share → CRM
│   │   │   ├── Features.tsx          # Seção CRM com dashboard preview
│   │   │   ├── Pricing.tsx           # Plano único R$ 19,90
│   │   │   ├── FAQ.tsx               # Accordion de perguntas frequentes
│   │   │   ├── Footer.tsx            # Rodapé com links
│   │   │   └── shared.tsx            # Avatar, Donut chart, VowQR (SVG)
│   │   └── ui/                       # Componentes shadcn/ui
│   └── hooks/
│       └── use-in-view.ts            # IntersectionObserver para animações on-scroll
├── components.json                   # Configuração shadcn
├── package.json
└── tsconfig.json
```

---

## Design system

O sistema visual da Vowify é construído sobre CSS custom properties definidas em `globals.css`.

**Paleta principal**

| Token | Valor | Uso |
|-------|-------|-----|
| `--vw-pink` | `#ff4d8d` | Gradiente início |
| `--vw-violet` | `#b14eff` | Gradiente meio / accent |
| `--vw-purple` | `#7a3aff` | Gradiente fim |
| `--vw-ink` | `#0f0b1e` | Texto principal |
| `--vw-mute` | `#6e6880` | Texto secundário |
| `--vw-line` | `#ece7f5` | Bordas |

**Gradiente primário**
```css
background: linear-gradient(135deg, #ff4d8d 0%, #b14eff 60%, #7a3aff 100%);
```

**Classes de animação disponíveis**

| Classe | Efeito |
|--------|--------|
| `.vw-anim-up` | Slide de baixo para cima + fade |
| `.vw-anim-left` | Slide da esquerda + fade |
| `.vw-anim-right` | Slide da direita + fade |
| `.vw-anim-scale` | Scale in + fade |
| `.vw-float` | Flutuação vertical infinita (7s) |
| `.vw-card-interactive` | Hover: lift + glow roxo |
| `.vw-card-interactive-dark` | Hover para cards escuros |

Delays disponíveis: `.d-80` `.d-160` `.d-240` `.d-320` `.d-400` `.d-500` `.d-600` `.d-700`

---

## Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Landing page |
| `/convite/exemplo` | Exemplo de convite com RSVP funcional |

---

## Licença

Proprietário — todos os direitos reservados. © 2026 Vowify.
