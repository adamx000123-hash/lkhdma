import { createFileRoute } from "@tanstack/react-router";
import { Languages } from "lucide-react";
import { useState } from "react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getMembers } from "../lib/debts.functions";
import { Button } from "../components/ui/button";
import backgroundAsset from "../assets/lkhdma-background.jpeg.asset.json";
import logoAsset from "../assets/lkhdma-logo.jpeg.asset.json";

const membersQuery = queryOptions({
  queryKey: ["members"],
  queryFn: () => getMembers(),
});

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
  loader: ({ context }) => context.queryClient.ensureQueryData(membersQuery),
  component: Index,
  errorComponent: ({ error }) => <div role="alert" className="p-8 text-center text-foreground">{error.message}</div>,
  notFoundComponent: () => <div className="p-8 text-center text-foreground">Not found</div>,
});

function Index() {
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const isArabic = language === "ar";
  const { data: members } = useSuspenseQuery(membersQuery);
  const [openId, setOpenId] = useState<number | null>(null);

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
        debt: "نقاط الدين",
        tap: "اضغط لعرض الدين",
        points: "نقطة",
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
        debt: "Debt points",
        tap: "Tap to view debt",
        points: "pts",
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
              <span className="block text-xl font-black text-foreground">{members.length}</span>
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
            {members.map((member, index) => {
              const open = openId === member.id;
              return (
                <li
                  key={member.id}
                  className="member-row rounded-md border border-border bg-panel shadow-panel backdrop-blur-xl transition duration-200 hover:border-accent/60 hover:bg-panel-strong"
                  style={{ animationDelay: `${index * 45}ms` }}
                >
                  <button
                    type="button"
                    dir="ltr"
                    aria-expanded={open}
                    onClick={() => setOpenId(open ? null : member.id)}
                    className="grid min-h-18 w-full grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-3 px-3 py-3 text-left sm:grid-cols-[3.5rem_minmax(0,1fr)_auto] sm:px-4"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-sm border border-rank-border bg-rank font-display text-sm font-black text-rank-foreground sm:h-11 sm:w-11">
                      {String(member.rank).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-base font-bold text-foreground sm:text-lg">{member.name}</span>
                      <span className="block font-display text-xs font-bold text-muted-foreground" dir={isArabic ? "rtl" : "ltr"}>{copy.tap}</span>
                    </span>
                    <div className="text-right" dir={isArabic ? "rtl" : "ltr"}>
                      <span className="block text-xl font-black text-accent sm:text-2xl">40%</span>
                      <span className="block whitespace-nowrap text-[10px] font-semibold text-muted-foreground">
                        {copy.requiredDuty}
                      </span>
                    </div>
                  </button>
                  {open && (
                    <div
                      dir={isArabic ? "rtl" : "ltr"}
                      className="mx-3 mb-3 flex items-center justify-between rounded-sm border border-primary/40 bg-rank px-4 py-3 sm:mx-4"
                    >
                      <span className="font-display text-base font-extrabold text-foreground">{copy.debt}</span>
                      <span className="font-display text-2xl font-black text-primary">
                        <span dir="ltr">{member.debt.toLocaleString("en-US")}</span>{" "}
                        <span className="font-display text-sm font-bold text-foreground">{copy.points}</span>
                      </span>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </section>

        <footer className="pt-8 text-center text-xs font-semibold text-muted-foreground">
          <span dir="ltr">LKHDMA</span> • {copy.footer}
        </footer>
      </div>
    </main>
  );
}