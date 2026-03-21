import { useEffect, useState } from 'react';

export function usePayPal() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

    if (!clientId) {
      return;
    }

    if (window.paypal) {
      setLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
    script.async = true;
    script.onload = () => setLoaded(true);
    script.onerror = () => console.error('Failed to load PayPal SDK');

    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector(`script[src^="https://www.paypal.com/sdk/js"]`);
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return loaded;
}
