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
RELATIA_API_TOKEN=IL_TUO_TOKEN_QUI
```

**Importante:** Sostituisci `IL_TUO_TOKEN_QUI` con il token reale fornito da Relatia.

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
- Nome e Cognome (combinati in un unico campo "name")
- Email
- Telefono
- Messaggio (opzionale)

I dati vengono inviati in modo sicuro all'endpoint Relatia CRM attraverso l'API route, mantenendo il token nascosto dal frontend.

## Endpoint API

**POST** `/api/submit-form`

Request body:
```json
{
  "name": "Nome Cognome",
  "email": "email@example.com",
  "phone": "+39123456789",
  "message": "Messaggio opzionale"
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

## Deploy

Questa applicazione può essere facilmente deployata su Vercel, Netlify o qualsiasi altro servizio che supporti Next.js.

Ricorda di configurare la variabile d'ambiente `RELATIA_API_TOKEN` nelle impostazioni del tuo servizio di hosting.

