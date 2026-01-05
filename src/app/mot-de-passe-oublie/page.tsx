'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

export default function MotDePasseOubliePage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const supabase = createClient();

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reinitialiser-mot-de-passe`,
        });

        setLoading(false);

        if (error) {
            setError('Une erreur est survenue. Veuillez réessayer.');
        } else {
            setSent(true);
        }
    };

    if (sent) {
        return (
            <main className="auth-page">
                <div className="auth-container">
                    <div className="auth-card">
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📧</div>
                            <h1>Courriel envoyé!</h1>
                            <p style={{ color: '#666', marginTop: '1rem', lineHeight: 1.6 }}>
                                Si un compte existe avec l'adresse <strong>{email}</strong>,
                                vous recevrez un courriel avec un lien pour réinitialiser votre mot de passe.
                            </p>
                            <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '1.5rem' }}>
                                Vérifiez également votre dossier de courriers indésirables.
                            </p>
                            <Link href="/connexion" className="btn btn-primary" style={{ marginTop: '2rem', display: 'inline-block' }}>
                                Retour à la connexion
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <h1>Mot de passe oublié</h1>
                    <p className="auth-subtitle">
                        Entrez votre adresse courriel et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                    </p>

                    {error && <div className="auth-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">
                                Courriel
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="form-input"
                                placeholder="votre@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-large"
                            style={{ width: '100%' }}
                            disabled={loading}
                        >
                            {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            <Link href="/connexion" className="auth-link">
                                ← Retour à la connexion
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
