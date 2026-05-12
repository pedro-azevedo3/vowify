import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Camila Rodrigues",
    role: "Mãe de aniversariante",
    location: "São Paulo, SP",
    avatar: "C",
    avatarBg: "from-pink-500 to-rose-600",
    rating: 5,
    text: "Usei o Vowify para a festa de 7 anos da minha filha e foi incrível! Mandei os convites pelo WhatsApp em minutos e fiquei acompanhando as confirmações pelo celular. Muito mais prático do que ficando ligando para cada um.",
  },
  {
    name: "Rafael Mendes",
    role: "Organizador de eventos",
    location: "Rio de Janeiro, RJ",
    avatar: "R",
    avatarBg: "from-blue-500 to-indigo-600",
    rating: 5,
    text: "Como organizador, sempre tive dificuldade de controlar as confirmações de presença. O Vowify resolveu isso com o CRM. Consigo ver em tempo real quem confirmou e quem está pendente. O QR Code no convite físico foi um diferencial enorme.",
  },
  {
    name: "Juliana Costa",
    role: "Assessora de casamentos",
    location: "Belo Horizonte, MG",
    avatar: "J",
    avatarBg: "from-violet-500 to-purple-600",
    rating: 5,
    text: "Recomendo o Vowify para todos os meus clientes. A plataforma é super intuitiva, o preço é justo e funciona muito bem. A função de lembrete automático para quem ainda não respondeu salvou várias listas de presença.",
  },
  {
    name: "André Santana",
    role: "Festeiro de plantão",
    location: "Curitiba, PR",
    avatar: "A",
    avatarBg: "from-emerald-500 to-teal-600",
    rating: 5,
    text: "Fiz minha festa de 30 anos com o Vowify e não tive nenhum trabalho com confirmações. Os convidados adoraram receber o convite pelo WhatsApp. O painel de CRM me ajudou a dimensionar o buffet perfeitamente.",
  },
  {
    name: "Fernanda Lima",
    role: "Professora e organizadora",
    location: "Fortaleza, CE",
    avatar: "F",
    avatarBg: "from-amber-500 to-orange-600",
    rating: 5,
    text: "Perfeito para eventos escolares! Usei para a festa junina da escola e o processo foi incrivelmente simples. Os pais conseguiram confirmar presença sem precisar instalar nada. Por R$14,90 valeu muito a pena.",
  },
  {
    name: "Marcelo Alves",
    role: "Empresário",
    location: "Salvador, BA",
    avatar: "M",
    avatarBg: "from-cyan-500 to-blue-600",
    rating: 5,
    text: "Usamos o Vowify para nosso evento corporativo de fim de ano com 150 pessoas. A exportação da lista em CSV facilitou muito o controle de credenciamento na entrada. Plataforma profissional e com preço acessível.",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">
            Depoimentos
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground max-w-2xl">
            Quem usa o Vowify{" "}
            <span className="text-gradient-primary">não volta atrás</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl">
            Veja o que organizadores de todo o Brasil estão dizendo sobre a
            plataforma.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="glass-card rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md transition-shadow duration-300"
            >
              <Stars count={t.rating} />

              <p className="text-sm text-foreground leading-relaxed flex-1">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <div
                  className={`size-10 rounded-full bg-gradient-to-br ${t.avatarBg} flex items-center justify-center text-sm font-bold text-white shrink-0`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {t.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t.role} · {t.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
