# CRM Automation - Relatia

Applicazione Next.js per la raccolta di contatti e invio automatico al CRM Relatia.

## Setup

### 1. Installazione dipendenze

```bash
npm install
```

### 2. Configurazione Token API

Crea un file `.env.local` nella root del progetto con il seguente contenuto:

```
CRM_API_TOKEN=IL_TUO_TOKEN_QUI
```

**Importante:** Sostituisci `IL_TUO_TOKEN_QUI` con il token reale fornito dal tuo CRM.

### 3. Esecuzione in locale

```bash
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:3000`

### 4. Build per produzione

```bash
npm run build
npm start
```

## Struttura del progetto

- `/pages/index.js` - Pagina principale con il form di contatto
- `/pages/api/submit-form.js` - API route che gestisce l'invio dei dati al CRM Relatia
- `/public/logo-relatia.png` - Logo aziendale

## Funzionalità

Il form raccoglie i seguenti dati:
- **Nome e Cognome** (combinati in un unico campo "name")
- **Email**
- **Telefono**
- **Messaggio** (opzionale)

I dati vengono inviati in modo sicuro all'endpoint `https://prova.relatiacrm.com/api/webhook/website/` attraverso l'API route, mantenendo il token nascosto dal frontend.

## Endpoint API

**POST** `/api/submit-form`

Request body:
```json
{
  "name": "Mario Rossi",
  "email": "mario.rossi@example.com",
  "phone": "+39 333 1234567",
  "message": "Vorrei maggiori informazioni"
}
```

Response:
```json
{
  "success": true,
  "message": "Dati inviati con successo",
  "data": {}
}
```

## Deploy su Vercel

### Passo 1: Importa il repository
1. Vai su [vercel.com](https://vercel.com)
2. Clicca su "Add New Project"
3. Importa il repository `filippobosco/crm-prova` da GitHub

### Passo 2: Configura la variabile d'ambiente
**IMPORTANTE:** Prima del deploy, aggiungi la variabile d'ambiente:

1. Nella pagina di configurazione del progetto su Vercel
2. Vai alla sezione "Environment Variables"
3. Aggiungi:
   - **Name:** `CRM_API_TOKEN`
   - **Value:** Il tuo token reale dell'API CRM
   - **Environment:** Production, Preview, Development (seleziona tutti)

### Passo 3: Deploy
Clicca su "Deploy" e attendi il completamento.

### Troubleshooting

**Se vedi "404: NOT_FOUND":**
1. Verifica che la variabile `CRM_API_TOKEN` sia configurata
2. Controlla i logs del build su Vercel (tab "Building")
3. Rieffettua il deploy manualmente da Vercel Dashboard

**Se il form non funziona:**
1. Apri la Console del browser (F12)
2. Controlla se ci sono errori nella tab Console
3. Verifica che l'API route `/api/submit-form` sia accessibile visitando `tuosito.vercel.app/api/submit-form` (dovresti vedere un errore 405 "Method not allowed" - questo è normale, significa che l'endpoint esiste)

