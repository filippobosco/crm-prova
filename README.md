# CRM Automation - Relatia

Applicazione Next.js per la raccolta di contatti e invio automatico al CRM Relatia.

## Setup

### 1. Installazione dipendenze

```bash
npm install
```

### 2. Configurazione variabili d'ambiente

Crea un file `.env.local` nella root del progetto con il seguente contenuto:

```
# Token per inviare dati al CRM
CRM_API_TOKEN=IL_TUO_TOKEN_QUI

# (Opzionale) URL webhook n8n per automazioni
N8N_WEBHOOK_URL=https://tua-istanza-n8n.com/webhook/xxx
```

**Importante:** 
- Sostituisci `IL_TUO_TOKEN_QUI` con il token reale del CRM
- `N8N_WEBHOOK_URL` è opzionale - configuralo solo se usi n8n per automazioni

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

### 1. POST `/api/submit-form`
**Uso:** Form del sito invia dati al CRM

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

### 2. POST/GET `/api/webhook-crm`
**Uso:** CRM invia notifiche quando arriva un nuovo contatto → Automazioni n8n

- Riceve notifiche dal CRM
- Inoltra automaticamente a n8n (se configurato)
- Permette di creare automazioni (email, WhatsApp, ecc.)

**URL webhook da configurare nel CRM:**
```
https://crm-prova.vercel.app/api/webhook-crm
```

## Deploy su Vercel

### Passo 1: Importa il repository
1. Vai su [vercel.com](https://vercel.com)
2. Clicca su "Add New Project"
3. Importa il repository `filippobosco/crm-prova` da GitHub

### Passo 2: Configura le variabili d'ambiente
**IMPORTANTE:** Prima del deploy, aggiungi le variabili:

1. Nella pagina di configurazione del progetto su Vercel
2. Vai alla sezione "Environment Variables"
3. Aggiungi:

   **Variabile obbligatoria:**
   - **Name:** `CRM_API_TOKEN`
   - **Value:** Il tuo token reale dell'API CRM
   - **Environment:** Production, Preview, Development (seleziona tutti)

   **Variabile opzionale (per automazioni n8n):**
   - **Name:** `N8N_WEBHOOK_URL`
   - **Value:** URL del webhook n8n (es: https://tua-istanza.n8n.cloud/webhook/xxx)
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

## Automazioni con n8n

### Setup

1. **Crea un workflow in n8n** con un nodo "Webhook"
2. **Copia l'URL del webhook** (es: `https://tua-istanza.n8n.cloud/webhook/nuovo-contatto`)
3. **Aggiungi la variabile su Vercel:**
   - Name: `N8N_WEBHOOK_URL`
   - Value: L'URL copiato da n8n
4. **Configura il webhook nel CRM:**
   - URL: `https://crm-prova.vercel.app/api/webhook-crm`
5. **Redeploy** su Vercel

### Flusso completo

```
Form compilato → CRM → /api/webhook-crm → n8n → Automazioni
                                                   ├─ Email benvenuto
                                                   ├─ WhatsApp
                                                   ├─ Slack notification
                                                   └─ Altre azioni
```

### Esempio workflow n8n

1. **Webhook Trigger** - Riceve i dati dal CRM
2. **Email Node** - Invia email di benvenuto al contatto
3. **HTTP Request** - Invia messaggio WhatsApp via API
4. **Google Sheets** - Salva in un foglio Google
5. **Slack** - Notifica il team

