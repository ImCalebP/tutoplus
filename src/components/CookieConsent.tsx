'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setShowBanner(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className="cookie-banner">
            <div className="cookie-content">
                <div className="cookie-text">
                    <p>
                        🍪 Ce site utilise des <strong>cookies essentiels</strong> pour l'authentification et le bon fonctionnement du service.
                        Aucun cookie de suivi n'est utilisé.
                    </p>
                    <Link href="/politique-de-confidentialite" className="cookie-link">
                        En savoir plus
                    </Link>
                </div>
                <button onClick={acceptCookies} className="btn btn-primary cookie-accept">
                    J'accepte
                </button>
            </div>
        </div>
    );
}
