# Migrazione CRM "Nexus" in Lovable nativo

La CRM dentro `artifacts/crm-nuovo/` è un'app React + Vite + react-router-dom con ~30 pagine, Firebase, Supabase, Google Gemini, FullCalendar, TipTap, D3, Zustand e ~20 servizi. Lovable usa TanStack Start con file-based routing e runtime serverless (Cloudflare Workers): non tutte le librerie funzionano allo stesso modo. Procediamo per fasi così vedi subito qualcosa in preview e validiamo passo passo.

## Fase 1 — Scheletro e shell (questa fase)

- Installazione delle dipendenze core: `react-router-dom` non serve (sostituito da TanStack), ma servono: `@radix-ui/*` già presenti in root, `zustand`, `framer-motion`, `lucide-react`, `tailwind-merge`, `clsx`, `date-fns`, `recharts`, `@tanstack/react-query`, `@supabase/supabase-js`, `sonner`, `next-themes`, `zod`, `react-hook-form`, `@hookform/resolvers`, `cmdk`.
- Copia di `src/lib/utils.ts`, `src/lib/supabase.ts`, `src/types/*`, `src/contexts/AuthContext.tsx` (riadattato a TanStack), `src/index.css` (token + tema) verso la root.
- Layout base: `src/routes/__root.tsx` con `AuthProvider`, sidebar/topbar minimale.
- Route home `/` come Dashboard placeholder che conferma che lo shell è vivo.
- Esclusione esplicita (per ora) di: Firebase, FullCalendar, TipTap, D3, Gemini server, jspdf, canvas-confetti — verranno reintrodotti quando servono nelle pagine corrispondenti.

Risultato: preview funzionante con sidebar + dashboard vuota.

## Fase 2 — Autenticazione + Layout app

- Login, ForgotPassword, Invite (route pubbliche).
- Layout `_authenticated` con sidebar Bitrix-style, topbar (`?` help, presence, notifiche, Quick Create FAB).
- Stores: `notificationStore`, `presenceStore`, `crmStore` (solo struttura, dati mock).

## Fase 3 — Moduli core CRM

- Dashboard, Feed, CRM (pipeline + drawer dettaglio), Tasks, Calendar (sostituendo FullCalendar con `react-day-picker` + viste custom oppure aggiungendo FullCalendar se compatibile).
- Servizi Supabase (`supabaseCRMService`, `supabaseFeedService`, `notificationService`).

## Fase 4 — Moduli avanzati

- Chat, Webmail, Drive, Docs, Analytics, BusinessModule, QuoteModule, Marketing, Automations, Applications, ContactCenter, Groups, ClientPortal, CommercialDashboard, NexusIndex, PageArchivio, PageClienti, PageCompila, PipelineSettings, Settings, SmartCRM.
- CoPilot Gemini: come server function TanStack invece dell'Express `api-server`.

## Fase 5 — Pulizia

- Rimozione `artifacts/crm-nuovo/`, `artifacts/api-server/`, `artifacts/mockup-sandbox/` se confermi.
- Migrazione/adattamento delle regole Firestore o sostituzione completa con Supabase + RLS.

## Note tecniche importanti

- **Firebase**: `firebase` SDK funziona in Worker SSR solo lato client (no SSR). Userò `client.only` o caricamento dinamico. Se preferisci, possiamo dismettere Firebase e tenere solo Supabase (consigliato per Lovable).
- **react-router-dom → TanStack**: ogni `<Route path="/x" element={<X />} />` diventa `src/routes/x.tsx`. `useNavigate`, `useParams`, `Link` vanno reimportati da `@tanstack/react-router`. `useSearchParams` cambia API.
- **Vite alias `@assets`** che puntava a `attached_assets/` (cartella non presente nella root) verrà risolto caso per caso quando incontriamo asset mancanti.
- **`process.env.GEMINI_API_KEY`**: in Lovable lo gestiamo come secret server-side, non più via `define` di Vite.
- **CSS**: `index.css` della CRM usa Tailwind v4 con un tema custom; lo fonderò con `src/styles.css` esistente preservando i token CRM.

## Cosa ti chiedo di confermare prima di partire con Fase 1

1. Procedo con la Fase 1 (shell + dashboard placeholder) e ci fermiamo lì per validare la preview, prima di andare in Fase 2.
2. Posso **dismettere Firebase** e tenere solo Supabase? (Semplifica molto e Lovable è ottimizzato per Supabase via Lovable Cloud.)
3. Vuoi che attivi **Lovable Cloud** ora (Supabase gestito da Lovable) oppure tieni il tuo progetto Supabase esistente collegato via `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`?
