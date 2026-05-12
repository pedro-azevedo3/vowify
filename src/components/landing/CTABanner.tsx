import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTABanner() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl gradient-primary p-10 sm:p-16 text-center shadow-2xl">
          {/* Decorative blobs */}
          <div className="absolute top-0 left-0 size-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 size-80 rounded-full bg-white/5 translate-x-1/2 translate-y-1/2 blur-2xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full bg-indigo-400/10 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col items-center gap-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5">
              <Sparkles className="size-4 text-white/90" />
              <span className="text-sm font-semibold text-white/90">
                Comece gratuitamente hoje
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
              Chega de planilha e contagem manual.
              <br />
              Seu evento merece mais.
            </h2>

            <p className="text-lg text-white/75 max-w-md">
              Crie seu primeiro convite gratuitamente. Sem cartão de crédito,
              sem complicação. Por menos de R$20 o seu evento fica profissional.
            </p>

            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 border-0 shadow-lg text-base font-semibold px-8 h-12 cursor-pointer"
            >
              Criar Meu Convite Grátis
              <ArrowRight className="size-4" data-icon="inline-end" />
            </Button>

            <p className="text-sm text-white/55">
              Mais de 5.000 eventos realizados · Sem taxa por convidado
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
