import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";

export const TIERS: Record<number, number> = {
  7: 1120,
  8: 1440,
  9: 1800,
  10: 2200,
  11: 2640,
  12: 3120,
  13: 3640,
  14: 4200,
  15: 4800,
};

export type Member = { id: number; rank: number; name: string; debt: number };

type AdminSession = { admin?: boolean };

function sessionConfig() {
  return {
    password: process.env["SESSION_SECRET"]!,
    name: "lkhdma-admin",
    maxAge: 60 * 60 * 24 * 7,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

function matches(input: string, expected: string) {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

async function requireAdmin() {
  const session = await useSession<AdminSession>(sessionConfig());
  if (!session.data.admin) throw new Error("Unauthorized");
}

export const getMembers = createServerFn({ method: "GET" }).handler(async (): Promise<Member[]> => {
  const url = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"] || process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) {
    throw new Error("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in Vercel.");
  }
  const sb = createClient(url, key, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
  const { data, error } = await sb.from("members").select("id, rank, name, debt").order("rank");
  if (error) throw new Error(error.message);
  return (data ?? []) as Member[];
});

export const getAdminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  return { admin: !!session.data.admin };
});

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ password: z.string().max(200) }).parse(d))
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_PASSWORD"];
    if (!expected || !matches(data.password, expected)) return { ok: false };
    const session = await useSession<AdminSession>(sessionConfig());
    await session.update({ admin: true });
    return { ok: true };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  await session.clear();
  return { ok: true };
});

export const getSchedule = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("debt_schedule").select("pending_tier").eq("id", 1).single();
  return { pendingTier: (data?.pending_tier as number | null) ?? null };
});

export const setPendingTier = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ tier: z.number().int().min(7).max(15).nullable() }).parse(d))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("debt_schedule")
      .update({ pending_tier: data.tier, updated_at: new Date().toISOString() })
      .eq("id", 1);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const reduceDebt = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ id: z.number().int(), amount: z.number().int().min(1).max(10_000_000) }).parse(d),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("members")
      .select("debt")
      .eq("id", data.id)
      .single();
    if (error || !row) throw new Error("Member not found");
    const debt = Math.max(0, row.debt - data.amount);
    await supabaseAdmin
      .from("members")
      .update({ debt, updated_at: new Date().toISOString() })
      .eq("id", data.id);
    return { ok: true, debt };
  });

export const addDebt = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ id: z.number().int(), amount: z.number().int().min(1).max(10_000_000) }).parse(d),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("members")
      .select("debt")
      .eq("id", data.id)
      .single();
    if (error || !row) throw new Error("Member not found");
    const debt = row.debt + data.amount;
    const { error: updateError } = await supabaseAdmin
      .from("members")
      .update({ debt, updated_at: new Date().toISOString() })
      .eq("id", data.id);
    if (updateError) throw new Error(updateError.message);
    return { ok: true, debt };
  });
