// Webhook endpoint per ricevere notifiche dal CRM
// Questo endpoint può essere collegato a n8n per automazioni
export default async function handler(req, res) {
  // Accetta POST, GET per test
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Se è un GET (test dal CRM), rispondi OK
    if (req.method === 'GET') {
      return res.status(200).json({ 
        status: 'ok',
        message: 'Webhook CRM endpoint attivo',
        timestamp: new Date().toISOString()
      });
    }

    // Ricevi i dati dal CRM
    const data = req.body;
    
    console.log('📥 Webhook CRM - Nuovo contatto ricevuto:', {
      timestamp: new Date().toISOString(),
      data: data
    });

    // URL del webhook n8n (da configurare)
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

    if (n8nWebhookUrl) {
      // Inoltra i dati a n8n
      console.log('🔄 Inoltro dati a n8n...');
      
      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: 'crm',
          timestamp: new Date().toISOString(),
          contact: data
        })
      });

      if (n8nResponse.ok) {
        console.log('✅ Dati inviati a n8n con successo');
      } else {
        console.error('❌ Errore invio a n8n:', n8nResponse.status);
      }
    } else {
      console.log('⚠️ N8N_WEBHOOK_URL non configurato - dati solo loggati');
    }

    // Rispondi al CRM
    return res.status(200).json({ 
      success: true,
      message: 'Webhook ricevuto con successo',
      received_at: new Date().toISOString(),
      forwarded_to_n8n: !!n8nWebhookUrl
    });

  } catch (error) {
    console.error('❌ Errore nel webhook CRM:', error);
    return res.status(500).json({ 
      error: 'Errore interno',
      message: error.message 
    });
  }
}

