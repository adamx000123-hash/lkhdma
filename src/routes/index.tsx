import { createFileRoute } from "@tanstack/react-router";
import { Languages } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import backgroundAsset from "../assets/lkhdma-background.jpeg.asset.json";
import logoAsset from "../assets/lkhdma-logo.jpeg.asset.json";

const members = [
  "DARA",
  "RH7",
  "ditzyounes",
  "ZINOX",
  "BMGT",
  "Hoops007",
  "Ayman eB",
  "Chivasod",
  "saadouch",
  "montana",
  "Vanitas",
  "PSK-H4CHEM",
  "Najiiim",
  "Ayoubelalami01",
  "MOHAMHAL",
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LKHDMA | ترتيب أعضاء المجموعة" },
      {
        name: "description",
        content: "قائمة أعضاء مجموعة LKHDMA وترتيب الواجب المطلوب لكل عضو.",
      },
      { property: "og:title", content: "LKHDMA | ترتيب أعضاء المجموعة" },
      {
        property: "og:description",
        content: "تابع ترتيب أعضاء مجموعة LKHDMA والواجب المطلوب لكل عضو.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const isArabic = language === "ar";

  const copy = isArabic
    ? {
        subtitle: "ترتيب أعضاء المجموعة والواجب المطلوب",
        membersCount: "عضواً",
        duty: "الواجب",
        members: "قائمة الأعضاء",
        ranking: "الترتيب",
        requiredDuty: "الواجب المطلوب",
        footer: "معاً نحو الأفضل",
        switchLabel: "English",
        logoAlt: "شعار مجموعة LKHDMA",
        switchAria: "تغيير اللغة إلى الإنجليزية",
      }
    : {
        subtitle: "Team member rankings and required contribution",
        membersCount: "members",
        duty: "contribution",
        members: "Team members",
        ranking: "Rank",
        requiredDuty: "Required contribution",
        footer: "Better together",
        switchLabel: "العربية",
        logoAlt: "LKHDMA team logo",
        switchAria: "Switch language to Arabic",
      };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background" dir={isArabic ? "rtl" : "ltr"} lang={language}>
      <div
        aria-hidden="true"
        className="fixed inset-0 scale-110 bg-cover bg-center blur-[7px]"
        style={{ backgroundImage: `url(${backgroundAsset.url})` }}
      />
      <div aria-hidden="true" className="fixed inset-0 bg-backdrop" />

      <div className="relative mx-auto w-full max-w-3xl px-4 pb-12 pt-8 sm:px-6 sm:pt-12">
        <div className={`absolute top-4 z-10 ${isArabic ? "left-4" : "right-4"} sm:top-6`}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label={copy.switchAria}
            onClick={() => setLanguage(isArabic ? "en" : "ar")}
            className="border-border bg-panel text-foreground shadow-panel backdrop-blur-xl hover:bg-panel-strong hover:text-foreground"
          >
            <Languages aria-hidden="true" />
            <span dir={isArabic ? "ltr" : "rtl"}>{copy.switchLabel}</span>
          </Button>
        </div>

        <header className="mb-7 text-center sm:mb-10">
          <img
            src={logoAsset.url}
            alt={copy.logoAlt}
            className="mx-auto h-32 w-32 rounded-md border border-border object-cover shadow-emblem sm:h-40 sm:w-40"
          />
          <h1 className="mt-5 font-display text-4xl font-black text-foreground sm:text-5xl">
            LKHDMA
          </h1>
          <p className="mt-2 text-sm font-semibold text-muted-foreground sm:text-base">
            {copy.subtitle}
          </p>
          <div className="mx-auto mt-5 flex w-fit items-center divide-x divide-x-reverse divide-border rounded-md border border-border bg-panel px-1 py-2 shadow-panel backdrop-blur-xl">
            <div className="px-4">
              <span className="block text-xl font-black text-foreground">15</span>
              <span className="text-xs text-muted-foreground">{copy.membersCount}</span>
            </div>
            <div className="px-4">
              <span className="block text-xl font-black text-accent">40%</span>
              <span className="text-xs text-muted-foreground">{copy.duty}</span>
            </div>
          </div>
        </header>

        <section aria-labelledby="members-title">
          <div className="mb-3 flex items-end justify-between px-1">
            <h2 id="members-title" className="text-lg font-bold text-foreground">
              {copy.members}
            </h2>
            <span className="text-xs font-medium text-muted-foreground">{copy.ranking}</span>
          </div>

          <ol className="space-y-2.5">
            {members.map((member, index) => (
              <li
                key={member}
                dir="ltr"
                className="member-row group grid min-h-18 grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-border bg-panel px-3 py-3 shadow-panel backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:border-accent/60 hover:bg-panel-strong sm:grid-cols-[3.5rem_minmax(0,1fr)_auto] sm:px-4"
                style={{ animationDelay: `${index * 45}ms` }}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-sm border border-rank-border bg-rank font-display text-sm font-black text-rank-foreground sm:h-11 sm:w-11">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span dir="ltr" className="min-w-0 truncate text-left text-base font-bold text-foreground sm:text-lg">
                  {member}
                </span>
                <div className="text-right" dir={isArabic ? "rtl" : "ltr"}>
                  <span className="block text-xl font-black text-accent sm:text-2xl">40%</span>
                  <span className="block whitespace-nowrap text-[10px] font-semibold text-muted-foreground">
                    {copy.requiredDuty}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <footer className="pt-8 text-center text-xs font-semibold text-muted-foreground">
          <span dir="ltr">LKHDMA</span> • {copy.footer}
        </footer>
      </div>
    </main>
  );
}