CREATE TABLE public.members (
  id serial PRIMARY KEY,
  rank int NOT NULL UNIQUE,
  name text NOT NULL UNIQUE,
  debt int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.members TO anon, authenticated;
GRANT ALL ON public.members TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.members_id_seq TO service_role;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view members" ON public.members FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.members (rank, name) VALUES
(1,'DARA'),(2,'RH7'),(3,'ditzyounes'),(4,'ZINOX'),(5,'BMGT'),(6,'Hoops007'),(7,'Ayman eB'),(8,'Chivasod'),(9,'saadouch'),(10,'montana'),(11,'Vanitas'),(12,'PSK-H4CHEM'),(13,'Najiiim'),(14,'Ayoubelalami01'),(15,'MOHAMHAL');