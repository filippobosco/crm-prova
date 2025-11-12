// API Route per nascondere il token e inviare i dati al CRM Relatia
export default async function handler(req, res) {
  // Accetta solo richieste POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      first_name, 
      last_name, 
      email, 
      phone, 
      company,
      occupation,
      page_url,
      source,
      origin
    } = req.body;

    // Validazione campi obbligatori secondo documentazione CRM
    if (!first_name || !last_name || !email || !page_url || !source) {
      return res.status(400).json({ 
        error: 'Campi obbligatori mancanti',
        details: 'first_name, last_name, email, page_url e source sono obbligatori' 
      });
    }

    // Token e URL nascosti dal frontend (variabili d'ambiente)
    const token = process.env.CRM_API_TOKEN;
    const crmUrl = process.env.CRM_API_URL || 'https://relatia.relatiacrm.com/crm/webhook/website/';

    if (!token) {
      console.error('CRM_API_TOKEN non configurato');
      return res.status(500).json({ 
        error: 'Configurazione server non valida' 
      });
    }

    // Costruisci payload secondo la documentazione CRM
    const payload = {
      // Campi obbligatori
      first_name,
      last_name,
      email,
      page_url,
      source,
      
      // Campi opzionali
      ...(phone && { phone }),
      ...(company && { company }),
      ...(occupation && { occupation }),
      ...(origin && { origin }),
    };

    console.log('Invio dati al CRM Relatia:', { ...payload, email: '***' });

    // Invio dati al CRM Relatia
    const response = await fetch(crmUrl, {
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
      console.error('Errore API Relatia CRM:', response.status, errorText);
      
      return res.status(response.status).json({ 
        error: 'Errore durante l\'invio dei dati al CRM',
        details: errorText
      });
    }

    const data = await response.json();
    console.log('Risposta CRM:', data);
    
    // Risposta di successo
    return res.status(200).json({ 
      success: true, 
      message: 'Contatto aggiunto al CRM con successo',
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

