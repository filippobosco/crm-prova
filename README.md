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
CRM_API_TOKEN=GpiGTpy1SV4s3trTXSa8MKiSew160KolV6A76akULw7YKVej9rfSKD9QFZMQpWWK
CRM_API_URL=https://relatia.relatiacrm.com/crm/webhook/website/
```

**Importante:** Questi sono i valori per l'integrazione con il CRM Relatia.

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

Il form raccoglie i seguenti dati e li invia al CRM Relatia:

### Campi obbligatori:
- **Nome** (first_name)
- **Cognome** (last_name)
- **Email** (email)
- **Telefono** (phone)

### Campi opzionali:
- **Nome azienda** (company)
- **Occupazione** (occupation)

### Campi automatici:
- **URL della pagina** (page_url) - rilevato automaticamente
- **Sorgente** (source) - "Website Form"
- **Origine** (origin) - UTM source o "direct"

I dati vengono inviati in modo sicuro all'endpoint Relatia CRM attraverso l'API route, mantenendo il token nascosto dal frontend.

## Endpoint API

**POST** `/api/submit-form`

Request body (secondo documentazione CRM Relatia):
```json
{
  "first_name": "Mario",
  "last_name": "Rossi",
  "email": "mario.rossi@example.com",
  "phone": "+39 333 1234567",
  "company": "Azienda SRL",
  "occupation": "Imprenditore settore retail",
  "page_url": "https://tuosito.com",
  "source": "Website Form",
  "origin": "direct"
}
```

Response:
```json
{
  "success": true,
  "message": "Contatto aggiunto al CRM con successo",
  "data": {}
}
```

## Deploy su Vercel

### Passo 1: Importa il repository
1. Vai su [vercel.com](https://vercel.com)
2. Clicca su "Add New Project"
3. Importa il repository `filippobosco/crm-prova` da GitHub

### Passo 2: Configura le variabili d'ambiente
**IMPORTANTE:** Prima del deploy, aggiungi le variabili d'ambiente:

1. Nella pagina di configurazione del progetto su Vercel
2. Vai alla sezione "Environment Variables"
3. Aggiungi queste variabili:

   **Prima variabile:**
   - **Name:** `CRM_API_TOKEN`
   - **Value:** `GpiGTpy1SV4s3trTXSa8MKiSew160KolV6A76akULw7YKVej9rfSKD9QFZMQpWWK`
   - **Environment:** Production, Preview, Development (seleziona tutti)

   **Seconda variabile:**
   - **Name:** `CRM_API_URL`
   - **Value:** `https://relatia.relatiacrm.com/crm/webhook/website/`
   - **Environment:** Production, Preview, Development (seleziona tutti)

### Passo 3: Deploy
Clicca su "Deploy" e attendi il completamento.

### Troubleshooting

**Se vedi "404: NOT_FOUND":**
1. Verifica che le variabili `CRM_API_TOKEN` e `CRM_API_URL` siano configurate
2. Controlla i logs del build su Vercel (tab "Building")
3. Rieffettua il deploy manualmente da Vercel Dashboard

**Se il form non funziona:**
1. Apri la Console del browser (F12)
2. Controlla se ci sono errori nella tab Console
3. Verifica che l'API route `/api/submit-form` sia accessibile visitando `tuosito.vercel.app/api/submit-form` (dovresti vedere un errore 405 "Method not allowed" - questo è normale, significa che l'endpoint esiste)

