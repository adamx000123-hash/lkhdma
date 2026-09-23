import { createFileRoute } from "@tanstack/react-router";
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
  return (
    <main className="relative min-h-screen overflow-hidden bg-background" dir="rtl">
      <div
        aria-hidden="true"
        className="fixed inset-0 scale-110 bg-cover bg-center blur-[7px]"
        style={{ backgroundImage: `url(${backgroundAsset.url})` }}
      />
      <div aria-hidden="true" className="fixed inset-0 bg-backdrop" />

      <div className="relative mx-auto w-full max-w-3xl px-4 pb-12 pt-8 sm:px-6 sm:pt-12">
        <header className="mb-7 text-center sm:mb-10">
          <img
            src={logoAsset.url}
            alt="شعار مجموعة LKHDMA"
            className="mx-auto h-32 w-32 rounded-md border border-border object-cover shadow-emblem sm:h-40 sm:w-40"
          />
          <h1 className="mt-5 font-display text-4xl font-black text-foreground sm:text-5xl">
            LKHDMA
          </h1>
          <p className="mt-2 text-sm font-semibold text-muted-foreground sm:text-base">
            ترتيب أعضاء المجموعة والواجب المطلوب
          </p>
          <div className="mx-auto mt-5 flex w-fit items-center divide-x divide-x-reverse divide-border rounded-md border border-border bg-panel px-1 py-2 shadow-panel backdrop-blur-xl">
            <div className="px-4">
              <span className="block text-xl font-black text-foreground">15</span>
              <span className="text-xs text-muted-foreground">عضواً</span>
            </div>
            <div className="px-4">
              <span className="block text-xl font-black text-accent">40%</span>
              <span className="text-xs text-muted-foreground">الواجب</span>
            </div>
          </div>
        </header>

        <section aria-labelledby="members-title">
          <div className="mb-3 flex items-end justify-between px-1">
            <h2 id="members-title" className="text-lg font-bold text-foreground">
              قائمة الأعضاء
            </h2>
            <span className="text-xs font-medium text-muted-foreground">الترتيب</span>
          </div>

          <ol className="space-y-2.5">
            {members.map((member, index) => (
              <li
                key={member}
                className="member-row group grid min-h-18 grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-border bg-panel px-3 py-3 shadow-panel backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:border-accent/60 hover:bg-panel-strong sm:grid-cols-[3.5rem_minmax(0,1fr)_auto] sm:px-4"
                style={{ animationDelay: `${index * 45}ms` }}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-sm border border-rank-border bg-rank font-display text-sm font-black text-rank-foreground sm:h-11 sm:w-11">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span dir="ltr" className="min-w-0 truncate text-left text-base font-bold text-foreground sm:text-lg">
                  {member}
                </span>
                <div className="text-left" dir="ltr">
                  <span className="block text-xl font-black text-accent sm:text-2xl">40%</span>
                  <span className="block text-[10px] font-semibold text-muted-foreground">الواجب المطلوب</span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <footer className="pt-8 text-center text-xs font-semibold text-muted-foreground">
          LKHDMA • معاً نحو الأفضل
        </footer>
      </div>
    </main>
  );
}