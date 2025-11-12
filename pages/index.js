import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    telefono: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Invia nome e cognome separati per il CRM
      const dataToSend = {
        first_name: formData.nome,
        last_name: formData.cognome,
        email: formData.email,
        phone: formData.telefono
      };

      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: 'Richiesta inviata con successo!' });
        // Reset form
        setFormData({
          nome: '',
          cognome: '',
          telefono: '',
          email: ''
        });
      } else {
        setSubmitStatus({ 
          type: 'error', 
          message: result.error || 'Errore durante l\'invio. Riprova.' 
        });
      }
    } catch (error) {
      console.error('Errore:', error);
      setSubmitStatus({ 
        type: 'error', 
        message: 'Errore di connessione. Riprova più tardi.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>CRM Automation - Relatia</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
      </Head>

      <div className="container">
        <div className="logo-container">
          <Image 
            src="/logo-relatia.png" 
            alt="Relatia Logo" 
            width={200}
            height={80}
            priority
          />
        </div>

        <div className="content">
          <div className="text-section">
            <h1>Vuoi vedere come il tuo CRM può lavorare al posto tuo?</h1>
            <p className="subtitle">Lascia il tuo contatto e prova con le tue mani l&apos;efficacia e l&apos;efficienza dell&apos;automation marketing</p>
          </div>

          <div className="form-section">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nome">Nome</label>
                <input 
                  type="text" 
                  id="nome" 
                  name="nome" 
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Il tuo nome" 
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="cognome">Cognome</label>
                <input 
                  type="text" 
                  id="cognome" 
                  name="cognome" 
                  value={formData.cognome}
                  onChange={handleChange}
                  placeholder="Il tuo cognome" 
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefono">Numero di telefono</label>
                <input 
                  type="tel" 
                  id="telefono" 
                  name="telefono" 
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Il tuo numero di telefono" 
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="La tua e-mail" 
                  required 
                />
              </div>

              {submitStatus && (
                <div className={`status-message ${submitStatus.type}`}>
                  {submitStatus.message}
                </div>
              )}

              <button 
                type="submit" 
                className="submit-btn" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Invio in corso...' : 'Invia Richiesta'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :global(html) {
          height: auto;
          overflow-y: auto;
        }

        :global(body) {
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, #2D1B69 0%, #000000 100%);
          background-attachment: fixed;
          background-size: cover;
          color: #FFFFFF;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem;
          padding-bottom: 50px;
          position: relative;
          overflow-x: hidden;
          margin: 0;
        }

        :global(body::before) {
          content: '';
          position: fixed;
          top: 0;
          right: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at top right, rgba(232, 51, 110, 0.1) 0%, transparent 70%);
          animation: pulse 15s ease-in-out infinite;
          z-index: 0;
          pointer-events: none;
        }

        :global(body::after) {
          content: '';
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at bottom left, rgba(45, 27, 105, 0.3) 0%, transparent 70%);
          animation: pulse 20s ease-in-out infinite reverse;
          z-index: 0;
          pointer-events: none;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        .container {
          max-width: 1200px;
          width: 100%;
          z-index: 1;
          position: relative;
          margin-bottom: 0;
        }

        .logo-container {
          text-align: center;
          margin-bottom: 3rem;
          animation: fadeInDown 1s ease-out;
          display: flex;
          justify-content: center;
        }

        .logo-container :global(img) {
          max-width: 200px;
          height: auto;
          filter: drop-shadow(0 4px 20px rgba(232, 51, 110, 0.3));
        }

        .content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          margin-top: 2rem;
        }

        .text-section {
          animation: fadeInLeft 1s ease-out;
        }

        h1 {
          font-size: 3rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #FFFFFF 0%, #E8336E 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          font-size: 1.25rem;
          font-weight: 400;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 2rem;
        }

        .form-section {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(232, 51, 110, 0.3);
          border-radius: 20px;
          padding: 2.5rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
                      0 0 0 1px rgba(232, 51, 110, 0.1) inset;
          animation: fadeInRight 1s ease-out;
          margin-bottom: 0;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: rgba(255, 255, 255, 0.9);
        }

        .form-group input {
          width: 100%;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(232, 51, 110, 0.3);
          border-radius: 10px;
          color: #FFFFFF;
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-group input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .form-group input:focus {
          outline: none;
          border-color: #E8336E;
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 0 0 3px rgba(232, 51, 110, 0.2);
        }

        .status-message {
          padding: 1rem;
          border-radius: 10px;
          margin-bottom: 1rem;
          text-align: center;
          font-weight: 500;
        }

        .status-message.success {
          background: rgba(34, 197, 94, 0.2);
          border: 1px solid rgba(34, 197, 94, 0.5);
          color: #86efac;
        }

        .status-message.error {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.5);
          color: #fca5a5;
        }

        .submit-btn {
          width: 100%;
          padding: 1.2rem;
          background: linear-gradient(135deg, #E8336E 0%, #2D1B69 100%);
          border: none;
          border-radius: 10px;
          color: #FFFFFF;
          font-family: 'Inter', sans-serif;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 4px 15px rgba(232, 51, 110, 0.4);
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(232, 51, 110, 0.6);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media (max-width: 968px) {
          .content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          h1 {
            font-size: 2.2rem;
          }

          .subtitle {
            font-size: 1.1rem;
          }

          .form-section {
            padding: 2rem;
          }
        }

        @media (max-width: 480px) {
          :global(body) {
            padding: 1rem;
            padding-bottom: 50px;
          }

          h1 {
            font-size: 1.8rem;
          }

          .subtitle {
            font-size: 1rem;
          }

          .form-section {
            padding: 1.5rem;
          }

          .logo-container :global(img) {
            max-width: 150px;
          }
        }
      `}</style>
    </>
  );
}

