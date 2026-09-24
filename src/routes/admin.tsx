import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { queryOptions, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import backgroundAsset from "../assets/lkhdma-background.jpeg.asset.json";
import {
  TIERS,
  addTierDebt,
  adminLogin,
  adminLogout,
  getAdminStatus,
  getMembers,
  reduceDebt,
} from "../lib/debts.functions";

const statusQuery = queryOptions({ queryKey: ["admin-status"], queryFn: () => getAdminStatus() });
const membersQuery = queryOptions({ queryKey: ["members"], queryFn: () => getMembers() });

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "LKHDMA | لوحة الأدمن" },
      { name: "description", content: "لوحة إدارة نقاط الدين لأعضاء LKHDMA." },
      { property: "og:title", content: "LKHDMA | لوحة الأدمن" },
      { property: "og:description", content: "لوحة إدارة نقاط الدين لأعضاء LKHDMA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(statusQuery),
      context.queryClient.ensureQueryData(membersQuery),
    ]);
  },
  component: AdminPage,
  errorComponent: ({ error }) => <div role="alert" className="p-8 text-center text-foreground">{error.message}</div>,
  notFoundComponent: () => <div className="p-8 text-center text-foreground">Not found</div>,
});

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main dir="rtl" lang="ar" className="relative min-h-screen overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="fixed inset-0 scale-110 bg-cover bg-center blur-[7px]"
        style={{ backgroundImage: `url(${backgroundAsset.url})` }}
      />
      <div aria-hidden="true" className="fixed inset-0 bg-backdrop" />
      <div className="relative mx-auto w-full max-w-3xl px-4 pb-12 pt-8 sm:px-6">{children}</div>
    </main>
  );
}

function AdminPage() {
  const { data: status } = useSuspenseQuery(statusQuery);
  return <Shell>{status.admin ? <Dashboard /> : <Login />}</Shell>;
}

function Login() {
  const qc = useQueryClient();
  const login = useServerFn(adminLogin);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const password = String(new FormData(e.currentTarget).get("password") ?? "");
    const res = await login({ data: { password } });
    setBusy(false);
    if (res.ok) qc.invalidateQueries({ queryKey: ["admin-status"] });
    else setError(true);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto mt-24 max-w-sm space-y-4 rounded-md border border-border bg-panel p-6 shadow-panel backdrop-blur-xl"
    >
      <h1 className="text-center font-display text-2xl font-black text-foreground">دخول الأدمن</h1>
      <Input name="password" type="password" dir="ltr" placeholder="كلمة السر" autoComplete="current-password" />
      {error && <p className="text-sm font-bold text-destructive">كلمة السر غير صحيحة</p>}
      <Button type="submit" className="w-full" disabled={busy}>دخول</Button>
      <Link to="/" className="block text-center text-xs text-muted-foreground hover:text-foreground">العودة للموقع</Link>
    </form>
  );
}

function Dashboard() {
  const qc = useQueryClient();
  const { data: members } = useSuspenseQuery(membersQuery);
  const addTier = useServerFn(addTierDebt);
  const reduce = useServerFn(reduceDebt);
  const logout = useServerFn(adminLogout);
  const [busyTier, setBusyTier] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [amounts, setAmounts] = useState<Record<number, string>>({});

  async function onTier(tier: number) {
    if (!confirm(`إضافة ${TIERS[tier]} نقطة دين لكل الأعضاء (${tier}/15)؟`)) return;
    setBusyTier(tier);
    await addTier({ data: { tier } });
    setBusyTier(null);
    setMessage(`تمت إضافة ${TIERS[tier]} نقطة لكل عضو`);
    qc.invalidateQueries({ queryKey: ["members"] });
  }

  async function onReduce(id: number) {
    const amount = parseInt(amounts[id] ?? "", 10);
    if (!amount || amount <= 0) return;
    await reduce({ data: { id, amount } });
    setAmounts((a) => ({ ...a, [id]: "" }));
    qc.invalidateQueries({ queryKey: ["members"] });
  }

  async function onLogout() {
    await logout();
    qc.invalidateQueries({ queryKey: ["admin-status"] });
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-black text-foreground">لوحة الأدمن</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="bg-panel">
            <Link to="/">الموقع</Link>
          </Button>
          <Button variant="outline" size="sm" className="bg-panel" onClick={onLogout}>خروج</Button>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-bold text-foreground">عدد المشاركين — يضاف الدين لكل الأعضاء</h2>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(TIERS).map(([t, pts]) => {
            const tier = Number(t);
            return (
              <button
                key={tier}
                type="button"
                disabled={busyTier !== null}
                onClick={() => onTier(tier)}
                className="rounded-md border border-border bg-panel p-4 text-center shadow-panel backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-accent/60 hover:bg-panel-strong disabled:opacity-50"
              >
                <span dir="ltr" className="block font-display text-2xl font-black text-foreground">{tier}/15</span>
                <span dir="ltr" className="block text-sm font-bold text-primary">+{pts.toLocaleString("en-US")}</span>
              </button>
            );
          })}
        </div>
        {message && <p className="mt-3 text-sm font-bold text-accent">{message}</p>}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-foreground">إنقاص الدين عند الدفع</h2>
        <ul className="space-y-2">
          {members.map((m) => (
            <li
              key={m.id}
              className="flex flex-wrap items-center gap-3 rounded-md border border-border bg-panel px-3 py-3 shadow-panel backdrop-blur-xl"
            >
              <span dir="ltr" className="min-w-0 flex-1 truncate font-bold text-foreground">
                {String(m.rank).padStart(2, "0")} · {m.name}
              </span>
              <span dir="ltr" className="font-display font-black text-primary">{m.debt.toLocaleString("en-US")}</span>
              <Input
                type="number"
                min={1}
                dir="ltr"
                placeholder="المبلغ"
                value={amounts[m.id] ?? ""}
                onChange={(e) => setAmounts((a) => ({ ...a, [m.id]: e.target.value }))}
                className="w-28 bg-background/40"
              />
              <Button size="sm" variant="secondary" onClick={() => onReduce(m.id)}>إنقاص</Button>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
