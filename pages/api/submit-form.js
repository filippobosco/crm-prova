// API Route per nascondere il token e inviare i dati all'endpoint esterno
export default async function handler(req, res) {
  // Accetta solo richieste POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, message } = req.body;

    // Validazione base dei dati
    if (!name || !email || !phone) {
      return res.status(400).json({ 
        error: 'Campi obbligatori mancanti',
        details: 'Nome, email e telefono sono obbligatori' 
      });
    }

    // Token nascosto dal frontend (usa variabile d'ambiente)
    const token = process.env.RELATIA_API_TOKEN;

    if (!token) {
      console.error('RELATIA_API_TOKEN non configurato');
      return res.status(500).json({ 
        error: 'Configurazione server non valida' 
      });
    }

    // Invio dati all'endpoint esterno
    const response = await fetch('https://prova.relatiacrm.com/api/webhook/website/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        message: message || '' // message è opzionale
      })
    });

    // Gestione risposta
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Errore API Relatia:', response.status, errorText);
      
      return res.status(response.status).json({ 
        error: 'Errore durante l\'invio dei dati',
        details: errorText
      });
    }

    const data = await response.json();
    
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

