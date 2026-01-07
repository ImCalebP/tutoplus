'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

export default function ConnexionPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const supabase = createClient();

        const { data, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setError('Email ou mot de passe incorrect');
            setLoading(false);
            return;
        }

        // Simple check: if admin email, go to admin dashboard
        if (data.user.email === 'tutoplus2025@gmail.com') {
            router.push('/admin');
        } else {
            router.push('/tableau-de-bord');
        }
    };

    return (
        <main className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <h1>Connexion</h1>
                    <p className="auth-subtitle">Accédez à votre espace Tuto+</p>

                    {error && <div className="auth-error">{error}</div>}

                    <form onSubmit={handleLogin} className="auth-form">
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

                        <div className="form-group">
                            <label className="form-label" htmlFor="password">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="form-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Link href="/mot-de-passe-oublie" className="auth-link" style={{ display: 'block', textAlign: 'right', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                                Mot de passe oublié?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-large"
                            style={{ width: '100%' }}
                            disabled={loading}
                        >
                            {loading ? 'Connexion en cours...' : 'Se connecter'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Pas encore de compte?{' '}
                            <Link href="/inscription" className="auth-link">
                                Créer un compte
                            </Link>
                        </p>
                        <p style={{ marginTop: '1rem' }}>
                            <Link href="/" className="auth-link">
                                ← Retour à l'accueil
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
