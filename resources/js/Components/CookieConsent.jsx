import React, { useState, useEffect } from 'react';

export default function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            setShowBanner(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'accepted');
        setShowBanner(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookie_consent', 'declined');
        setShowBanner(false);
        // Optionally, disable non-essential cookies here
    };

    if (!showBanner) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex flex-col md:flex-row items-center justify-between shadow-lg z-50">
            <p className="text-sm text-center md:text-left mb-2 md:mb-0">
                Utilizamos cookies para mejorar tu experiencia en nuestro sitio. Al continuar navegando, aceptas nuestro uso de cookies. Para más información, consulta nuestra <a href="/politica-de-privacidad" className="underline">Política de Privacidad</a>.
            </p>
            <div className="flex space-x-2">
                <button
                    onClick={handleAccept}
                    className="bg-calm-green-600 hover:bg-calm-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    Aceptar
                </button>
                <button
                    onClick={handleDecline}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                    Rechazar
                </button>
            </div>
        </div>
    );
}
