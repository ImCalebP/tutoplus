'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

export default function ReinitialiserMotDePassePage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const supabase = createClient();

        // Handle the hash fragment from Supabase email link
        const handleHashChange = async () => {
            const hash = window.location.hash;

            if (hash && hash.includes('access_token')) {
                // Parse the hash to get tokens
                const params = new URLSearchParams(hash.substring(1));
                const accessToken = params.get('access_token');
                const refreshToken = params.get('refresh_token');
                const type = params.get('type');

                if (accessToken && type === 'recovery') {
                    // Set the session with the tokens
                    const { error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken || ''
                    });

                    if (!error) {
                        setIsReady(true);
                        // Clear the hash from URL for cleanliness
                        window.history.replaceState(null, '', window.location.pathname);
                        return;
                    }
                }
            }

            // Check if already have a session
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setIsReady(true);
            }
        };

        handleHashChange();

        // Listen for auth events
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
                setIsReady(true);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        if (password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères.');
            return;
        }

        setLoading(true);

        const supabase = createClient();

        const { error } = await supabase.auth.updateUser({
            password: password
        });

        setLoading(false);

        if (error) {
            setError('Une erreur est survenue: ' + error.message);
        } else {
            setSuccess(true);
        }
    };

    // Show loading while checking
    if (!isReady && !success) {
        // Give it a moment to process
        return (
            <main className="auth-page">
                <div className="auth-container">
                    <div className="auth-card" style={{ textAlign: 'center' }}>
                        <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
                        <p>Vérification du lien...</p>
                        <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#666' }}>
                            Si cette page ne change pas après quelques secondes,{' '}
                            <Link href="/mot-de-passe-oublie" className="auth-link">
                                demandez un nouveau lien
                            </Link>.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    if (success) {
        return (
            <main className="auth-page">
                <div className="auth-container">
                    <div className="auth-card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                        <h1>Mot de passe modifié!</h1>
                        <p style={{ color: '#666', marginTop: '1rem' }}>
                            Votre mot de passe a été réinitialisé avec succès.
                        </p>
                        <button
                            onClick={() => router.push('/tableau-de-bord')}
                            className="btn btn-primary"
                            style={{ marginTop: '2rem' }}
                        >
                            Continuer vers le tableau de bord
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <h1>Nouveau mot de passe</h1>
                    <p className="auth-subtitle">
                        Choisissez un nouveau mot de passe sécurisé.
                    </p>

                    {error && <div className="auth-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label className="form-label" htmlFor="password">
                                Nouveau mot de passe
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="form-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="confirmPassword">
                                Confirmer le mot de passe
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="form-input"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-large"
                            style={{ width: '100%' }}
                            disabled={loading}
                        >
                            {loading ? 'Mise à jour...' : 'Réinitialiser le mot de passe'}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
