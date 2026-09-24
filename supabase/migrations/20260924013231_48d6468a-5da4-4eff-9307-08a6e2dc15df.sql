CREATE TABLE public.debt_schedule (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  pending_tier int,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.debt_schedule TO anon, authenticated;
GRANT ALL ON public.debt_schedule TO service_role;
ALTER TABLE public.debt_schedule ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view schedule" ON public.debt_schedule FOR SELECT TO anon, authenticated USING (true);
INSERT INTO public.debt_schedule (id, pending_tier) VALUES (1, NULL);

CREATE OR REPLACE FUNCTION public.apply_pending_debt()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE t int; amt int;
BEGIN
  SELECT pending_tier INTO t FROM public.debt_schedule WHERE id = 1 FOR UPDATE;
  IF t IS NULL THEN RETURN; END IF;
  amt := CASE t WHEN 7 THEN 1120 WHEN 8 THEN 1440 WHEN 9 THEN 1800 WHEN 10 THEN 2200
    WHEN 11 THEN 2640 WHEN 12 THEN 3120 WHEN 13 THEN 3640 WHEN 14 THEN 4200 WHEN 15 THEN 4800 ELSE 0 END;
  UPDATE public.members SET debt = debt + amt, updated_at = now() WHERE id IS NOT NULL;
  UPDATE public.debt_schedule SET pending_tier = NULL, updated_at = now() WHERE id = 1;
END $$;
REVOKE EXECUTE ON FUNCTION public.apply_pending_debt() FROM PUBLIC, anon, authenticated;

CREATE EXTENSION IF NOT EXISTS pg_cron;
SELECT cron.schedule('apply-pending-debt-midnight', '0 0 * * *', $$SELECT public.apply_pending_debt();$$);