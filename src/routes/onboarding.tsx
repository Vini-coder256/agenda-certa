import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  businessCategories,
  defaultDays,
  saveSetup,
  slugify,
  type SetupDay,
  type SetupProfessional,
  type SetupService,
} from "@/lib/setup";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Configurar seu negócio | Agenda Certa" },
      {
        name: "description",
        content:
          "Cadastre seu negócio no Agenda Certa: dados, link público, períodos de atendimento, serviços e profissionais.",
      },
      { property: "og:title", content: "Configurar seu negócio | Agenda Certa" },
      {
        property: "og:description",
        content: "Em poucos passos seu negócio fica pronto para receber agendamentos online.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Onboarding,
});

const stepLabels = ["Negócio", "Link", "Horários", "Serviços", "Equipe", "Revisão"];

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [biz, setBiz] = useState({
    name: "",
    category: businessCategories[0]!,
    description: "",
    whatsapp: "",
    address: "",
  });
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [days, setDays] = useState<SetupDay[]>(defaultDays());
  const [services, setServices] = useState<SetupService[]>([
    { name: "", price: "", durationMin: "40" },
  ]);
  const [teamMode, setTeamMode] = useState<"solo" | "equipe">("solo");
  const [pros, setPros] = useState<SetupProfessional[]>([{ name: "", role: "" }]);

  const effectiveSlug = slugTouched ? slugify(slug) : slugify(biz.name);

  const validServices = services.filter((s) => s.name && s.price);
  const validPros = pros.filter((p) => p.name);

  const canNext = [
    Boolean(biz.name && biz.whatsapp),
    Boolean(effectiveSlug),
    days.some((d) => d.active && d.periods.length > 0),
    validServices.length > 0,
    teamMode === "solo" || validPros.length > 0,
    true,
  ][step];

  const finish = () => {
    saveSetup({
      owner: { name: "", email: "", whatsapp: biz.whatsapp },
      ...biz,
      slug: effectiveSlug,
      days,
      services: validServices,
      teamMode,
      professionals:
        teamMode === "solo"
          ? [{ name: "Você", role: biz.category }]
          : validPros.map((p) => ({ name: p.name, role: p.role || biz.category })),
      completedAt: new Date().toISOString(),
    });
    navigate({ to: "/painel" });
  };

  const updateDay = (index: number, patch: Partial<SetupDay>) =>
    setDays(days.map((d, i) => (i === index ? { ...d, ...patch } : d)));

  return (
    <div className="min-h-screen bg-muted/40 px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-2xl">
        <Link
          to="/cadastro"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground"
        >
          <ArrowLeft className="size-3.5" /> Voltar
        </Link>

        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">Vamos configurar seu negócio</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Passo {step + 1} de {stepLabels.length} · {stepLabels[step]}
        </p>

        <ol className="mt-4 flex flex-wrap gap-2">
          {stepLabels.map((label, i) => (
            <li
              key={label}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold",
                i < step
                  ? "bg-success-soft text-success"
                  : i === step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
              )}
            >
              {label}
            </li>
          ))}
        </ol>

        <div className="surface-card mt-5 space-y-4 p-5 sm:p-6">
          {step === 0 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="b-nome">Nome do negócio</Label>
                <Input
                  id="b-nome"
                  placeholder="Ex.: Studio Ana Beleza"
                  value={biz.name}
                  onChange={(e) => setBiz({ ...biz, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <div className="flex flex-wrap gap-2">
                  {businessCategories.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setBiz({ ...biz, category: c })}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-sm transition-colors",
                        biz.category === c
                          ? "border-primary bg-primary text-primary-foreground"
                          : "hover:bg-muted",
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="b-desc">Descrição curta</Label>
                <Textarea
                  id="b-desc"
                  rows={3}
                  placeholder="Conte em uma frase o que seu cliente encontra aí."
                  value={biz.description}
                  onChange={(e) => setBiz({ ...biz, description: e.target.value })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="b-zap">WhatsApp</Label>
                  <Input
                    id="b-zap"
                    placeholder="(11) 90000-0000"
                    value={biz.whatsapp}
                    onChange={(e) => setBiz({ ...biz, whatsapp: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="b-end">Endereço ou região</Label>
                  <Input
                    id="b-end"
                    placeholder="Rua, bairro ou atendo em domicílio"
                    value={biz.address}
                    onChange={(e) => setBiz({ ...biz, address: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="b-slug">Escolha seu link público</Label>
                <Input
                  id="b-slug"
                  placeholder="studio-ana-beleza"
                  value={slugTouched ? slug : effectiveSlug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(e.target.value);
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Use letras, números e hífens. É esse endereço que você vai divulgar.
                </p>
              </div>
              <div className="rounded-xl bg-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Prévia do link
                </p>
                <p className="mt-1 break-all font-mono text-sm">
                  agendacerta.app/b/{effectiveSlug || "seu-negocio"}
                </p>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-sm text-muted-foreground">
                Você pode ter mais de um período por dia — o intervalo entre eles (almoço, por
                exemplo) nunca aparece para o cliente.
              </p>
              {days.map((d, i) => (
                <div key={d.day} className="rounded-xl border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{d.day}</p>
                    <Button
                      type="button"
                      variant={d.active ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => updateDay(i, { active: !d.active })}
                    >
                      {d.active ? "Atende" : "Fechado"}
                    </Button>
                  </div>

                  {d.active && (
                    <div className="mt-3 space-y-2">
                      {d.periods.map((p, pi) => (
                        <div key={pi} className="flex items-center gap-2">
                          <Input
                            type="time"
                            value={p.from}
                            onChange={(e) =>
                              updateDay(i, {
                                periods: d.periods.map((x, xi) =>
                                  xi === pi ? { ...x, from: e.target.value } : x,
                                ),
                              })
                            }
                          />
                          <span className="text-muted-foreground">até</span>
                          <Input
                            type="time"
                            value={p.to}
                            onChange={(e) =>
                              updateDay(i, {
                                periods: d.periods.map((x, xi) =>
                                  xi === pi ? { ...x, to: e.target.value } : x,
                                ),
                              })
                            }
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Remover período"
                            onClick={() =>
                              updateDay(i, { periods: d.periods.filter((_, xi) => xi !== pi) })
                            }
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          updateDay(i, {
                            periods: [...d.periods, { from: "19:00", to: "21:00" }],
                          })
                        }
                      >
                        <Plus className="mr-1 size-4" /> Adicionar período
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          {step === 3 && (
            <>
              <p className="text-sm text-muted-foreground">
                Cadastre pelo menos um serviço. Você pode adicionar mais depois no painel.
              </p>
              {services.map((s, i) => (
                <div key={i} className="grid gap-3 rounded-xl border p-4 sm:grid-cols-[2fr_1fr_1fr_auto]">
                  <div className="space-y-2">
                    <Label htmlFor={`s-nome-${i}`}>Serviço</Label>
                    <Input
                      id={`s-nome-${i}`}
                      placeholder="Ex.: Corte feminino"
                      value={s.name}
                      onChange={(e) =>
                        setServices(
                          services.map((x, xi) => (xi === i ? { ...x, name: e.target.value } : x)),
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`s-preco-${i}`}>Preço (R$)</Label>
                    <Input
                      id={`s-preco-${i}`}
                      inputMode="numeric"
                      placeholder="60"
                      value={s.price}
                      onChange={(e) =>
                        setServices(
                          services.map((x, xi) => (xi === i ? { ...x, price: e.target.value } : x)),
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`s-dur-${i}`}>Duração (min)</Label>
                    <Input
                      id={`s-dur-${i}`}
                      inputMode="numeric"
                      value={s.durationMin}
                      onChange={(e) =>
                        setServices(
                          services.map((x, xi) =>
                            xi === i ? { ...x, durationMin: e.target.value } : x,
                          ),
                        )
                      }
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Remover serviço"
                      onClick={() => setServices(services.filter((_, xi) => xi !== i))}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => setServices([...services, { name: "", price: "", durationMin: "40" }])}
              >
                <Plus className="mr-1 size-4" /> Adicionar serviço
              </Button>
            </>
          )}

          {step === 4 && (
            <>
              <p className="text-sm text-muted-foreground">
                Você atende sozinho ou tem uma equipe?
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {(
                  [
                    { id: "solo", title: "Trabalho sozinho", text: "Criamos um profissional padrão com o seu nome." },
                    { id: "equipe", title: "Tenho equipe", text: "Cada profissional terá sua própria agenda." },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTeamMode(opt.id)}
                    className={cn(
                      "rounded-xl border p-4 text-left transition-colors",
                      teamMode === opt.id ? "border-primary bg-primary-soft" : "hover:bg-muted",
                    )}
                  >
                    <span className="flex items-center gap-2 font-semibold">
                      <Users className="size-4" /> {opt.title}
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">{opt.text}</span>
                  </button>
                ))}
              </div>

              {teamMode === "equipe" && (
                <div className="space-y-3">
                  {pros.map((p, i) => (
                    <div key={i} className="grid gap-3 rounded-xl border p-4 sm:grid-cols-[2fr_2fr_auto]">
                      <div className="space-y-2">
                        <Label htmlFor={`p-nome-${i}`}>Nome</Label>
                        <Input
                          id={`p-nome-${i}`}
                          placeholder="Ex.: Marina Alves"
                          value={p.name}
                          onChange={(e) =>
                            setPros(pros.map((x, xi) => (xi === i ? { ...x, name: e.target.value } : x)))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`p-func-${i}`}>Função</Label>
                        <Input
                          id={`p-func-${i}`}
                          placeholder="Ex.: Cabeleireira"
                          value={p.role}
                          onChange={(e) =>
                            setPros(pros.map((x, xi) => (xi === i ? { ...x, role: e.target.value } : x)))
                          }
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Remover profissional"
                          onClick={() => setPros(pros.filter((_, xi) => xi !== i))}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPros([...pros, { name: "", role: "" }])}
                  >
                    <Plus className="mr-1 size-4" /> Adicionar profissional
                  </Button>
                </div>
              )}
            </>
          )}

          {step === 5 && (
            <>
              <h2 className="text-lg font-bold">Tudo pronto, confira o resumo</h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Negócio</dt>
                  <dd className="text-right font-medium">
                    {biz.name} · {biz.category}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Link público</dt>
                  <dd className="text-right font-mono text-xs">agendacerta.app/b/{effectiveSlug}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">WhatsApp</dt>
                  <dd className="text-right font-medium">{biz.whatsapp}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Dias de atendimento</dt>
                  <dd className="text-right font-medium">
                    {days.filter((d) => d.active).length} dias por semana
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Serviços</dt>
                  <dd className="text-right font-medium">{validServices.length} cadastrados</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Profissionais</dt>
                  <dd className="text-right font-medium">
                    {teamMode === "solo" ? "Só você" : `${validPros.length} na equipe`}
                  </dd>
                </div>
              </dl>
              <div className="rounded-xl border border-warning/50 bg-warning-soft p-4 text-sm text-warning-foreground">
                A tolerância padrão de atraso é de 15 minutos e aparece como aviso ao cliente antes
                da confirmação. Você pode mudar isso em Configurações.
              </div>
            </>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            <ArrowLeft className="mr-1 size-4" /> Voltar
          </Button>

          {step < stepLabels.length - 1 ? (
            <Button type="button" disabled={!canNext} onClick={() => setStep((s) => s + 1)}>
              Continuar
            </Button>
          ) : (
            <Button type="button" size="lg" onClick={finish}>
              <Check className="mr-1 size-4" /> Ir para o painel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
