// API Route per nascondere il token e inviare i dati all'endpoint CRM
export default async function handler(req, res) {
  // Accetta solo richieste POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { first_name, last_name, email, phone } = req.body;

    // Validazione base dei dati
    if (!first_name || !last_name || !email || !phone) {
      return res.status(400).json({ 
        error: 'Campi obbligatori mancanti',
        details: 'Nome, cognome, email e telefono sono obbligatori' 
      });
    }

    // Token nascosto dal frontend (usa variabile d'ambiente)
    const token = process.env.CRM_API_TOKEN;

    if (!token) {
      console.error('CRM_API_TOKEN non configurato');
      console.error('Variabili d\'ambiente disponibili:', Object.keys(process.env).filter(k => k.includes('CRM')));
      return res.status(500).json({ 
        error: 'Configurazione server non valida',
        debug: 'CRM_API_TOKEN non trovato nelle variabili d\'ambiente. Verifica la configurazione su Vercel.',
        hint: 'Hai fatto il redeploy dopo aver aggiunto la variabile?'
      });
    }

    // Costruisci il nome completo per il titolo del deal
    const fullName = `${first_name} ${last_name}`;

    // Payload con first_name e last_name separati per il CRM
    const payload = {
      first_name,
      last_name,
      name: fullName, // Manteniamo anche name per compatibilità
      email,
      phone,
      deal_title: `${fullName} - CRM Demo`, // Titolo del deal
      title: `${fullName} - CRM Demo`, // Alternativa per titolo
      subject: `${fullName} - CRM Demo` // Alternativa per subject
    };

    console.log('Invio dati al CRM:', { ...payload, email: '***' });

    // Invio dati all'endpoint esterno
    const response = await fetch('https://prova.relatiacrm.com/api/webhook/website/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    // Gestione risposta
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Errore API CRM:', response.status, errorText);
      
      return res.status(response.status).json({ 
        error: 'Errore durante l\'invio dei dati',
        details: errorText
      });
    }

    const data = await response.json();
    console.log('Risposta CRM:', data);
    
    // Risposta di successo
    return res.status(200).json({ 
      success: true, 
      message: 'Dati inviati con successo',
      data 
    });

  } catch (error) {
    console.error('Errore nel submit form:', error);
    return res.status(500).json({ 
      error: 'Errore interno del server',
      details: error.message 
    });
  }
}

