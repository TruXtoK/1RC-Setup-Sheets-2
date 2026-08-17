# Deploying 1RC Setup Lab

One-time setup, roughly 30 minutes. After this, every deploy is a `git push`.

## 1. Create the Supabase project (free tier)

1. Go to https://supabase.com → New project. Name it anything (e.g. `setup-lab`). Pick a strong database password and save it somewhere — you won't need it day-to-day, but you'll want it if you ever migrate.
2. Wait for the project to finish provisioning (~2 minutes).

## 2. Run the migration

1. In the Supabase dashboard, open **SQL Editor** → **New query**.
2. Paste the entire contents of `supabase/migrations/0001_init.sql` and click **Run**.
3. You should see "Success. No rows returned." That one file creates every table, all the versioning/locking triggers, Row Level Security, and seeds the 12 vehicle templates and system tags.

## 3. Auth settings

1. **Authentication → Providers → Email**: make sure Email is enabled.
2. **Authentication → Providers → Email → Confirm email**: turn this **off** for now (you can turn it back on later once you configure an email sender). With it off, you can sign up and be logged in immediately.

## 4. Storage bucket (for photos, Phase 2 — do it now while you're here)

1. **Storage → New bucket**. Name: `photos`. Public: **off**.

## 5. Get your keys

**Project Settings → API**. Copy:
- **Project URL** → this is `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** key → this is `NEXT_PUBLIC_SUPABASE_ANON_KEY`

The anon key is safe to expose in the browser — Row Level Security is what protects the data.

## 6. Push the code to GitHub

1. Create a new **private** repo on GitHub (e.g. `1rc-setup-lab`).
2. From this project folder:
   ```
   git init
   git add .
   git commit -m "1RC Setup Lab — Phase 2 (Next.js 15)"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/1rc-setup-lab.git
   git push -u origin main
   ```

## 7. Deploy on Vercel

1. https://vercel.com → **Add New → Project** → import the repo.
2. Framework preset: Next.js (auto-detected). Leave build settings alone.
3. Under **Environment Variables**, add both values from step 5:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy. You'll get a live URL in about a minute.

## Phase 2 — Parts catalog (run after initial setup)

Phase 2 ships a second migration that adds the parts catalog, build sheet, and dynamic setup fields.

### Run the migration

In the Supabase **SQL Editor**, paste the full contents of `supabase/migrations/0002_parts.sql` and run it. This file:
- Creates `part_categories`, `parts`, `vehicle_part_compatibility`, `part_setup_capabilities`, and `car_installed_parts`.
- Seeds 15 part categories and 7 setup field definitions.
- Seeds generic factory placeholder parts (servo, servo saver, fixed tie rod, fixed rear links, shocks, axle, motor, wheel hexes) compatible with all 12 vehicle templates.
- Removes `left_rear_link_length` and `right_rear_link_length` from system template `field_schema` — those fields are now gated behind the "Adjustable rear radius rods" part.

### Seed your starter catalog

After signing in, run this in the SQL Editor to add four editable option parts to your account (adjustable tie rod, adjustable radius rods, threaded shock bodies):
```sql
select public.seed_my_catalog(id) from auth.users limit 1;
```
These are **user-owned** records — edit or delete them freely in Admin → Parts.

### Storage bucket

Already created in Step 4 above. No additional action needed for Phase 2.

---

## 8. First login + demo data (optional)

1. Open the live URL → **Create account** → sign up.
2. To load the demo car (an EDM with 3 setups, 2 scale sessions, 4 runs, and the
   adjustment chain connecting them), go back to the Supabase **SQL Editor** and run:
   ```sql
   select public.seed_demo(id) from auth.users limit 1;
   ```
   Everything it creates is labeled "Demo" and safe to delete. Skip this entirely
   if you'd rather start clean.

## 9. Install on your phone

Open the live URL in Safari/Chrome on your phone → Share → **Add to Home Screen**.
It installs as a standalone app (dark theme, no browser chrome).

## Local development (optional)

**Requires Node.js 18.17+** (Next.js 15 minimum).

```
npm install
cp .env.example .env.local   # paste in your two Supabase values
npm run dev                  # http://localhost:3000
npm test                     # runs the corner-weight math tests
```

## Where things live

- `config/app.ts` — the working name. Change it once here to rename the app.
- `supabase/migrations/` — schema history. Future phases add `0002_...sql` files; never edit 0001 after it's been run.
- `lib/scale/` — all corner-weight math (pure, tested) and the ScaleInputProvider abstraction your future load-cell hardware will plug into.
