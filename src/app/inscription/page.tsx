'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase';

export default function InscriptionPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        parentName: '',
        studentName: '',
        phone: '',
        service: '',
        address: '',
        mentalHealth: '',
        specifications: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        if (formData.password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        setLoading(true);

        const supabase = createClient();

        // 1. Create user account
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            }
        });

        if (authError) {
            if (authError.message.includes('already registered')) {
                setError('Un compte existe déjà avec cet email. Veuillez vous connecter.');
            } else {
                setError('Erreur lors de la création du compte: ' + authError.message);
            }
            setLoading(false);
            return;
        }

        // 2. Ensure we have a session (Sign in if needed, or if email conform is off)
        let user = authData.user;

        if (!authData.session) {
            // If Auto-Confirm is ON, we might just need to login
            const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (loginError) {
                // If login fails, it might be because email needs confirmation
                if (loginError.message.includes('Email not confirmed')) {
                    setError('Compte créé! Veuillez vérifier vos courriels pour confirmer votre compte avant de continuer.');
                    setLoading(false);
                    return;
                }
                // Otherwise, real error
                setError('Erreur de connexion: ' + loginError.message);
                setLoading(false);
                return;
            }
            user = loginData.user;
        }

        if (!user) {
            setError('Erreur: Impossible de récupérer les informations utilisateur.');
            setLoading(false);
            return;
        }

        // 3. Create inscription record
        const { error: inscriptionError } = await supabase.from('inscriptions').insert({
            user_id: user.id,
            parent_name: formData.parentName,
            student_name: formData.studentName,
            phone: formData.phone,
            email: formData.email,
            service: formData.service,
            address: formData.address,
            mental_health: formData.mentalHealth || null,
            specifications: formData.specifications || null,
        });

        if (inscriptionError) {
            setError('Erreur lors de l\'inscription: ' + inscriptionError.message);
            console.error('RLS Error Details:', inscriptionError);
            setLoading(false);
            return;
        }

        // 4. Redirect to dashboard
        router.push('/tableau-de-bord');
    };

    return (
        <main className="auth-page">
            <div className="auth-container auth-container-wide">
                <div className="auth-card auth-card-wide">
                    <div className="auth-header">
                        <Link href="/" className="auth-logo">
                            <Image src="/logo.jpg" alt="Tutoplus" width={60} height={60} style={{ borderRadius: '12px' }} />
                        </Link>
                        <h1>Créer un compte</h1>
                        <p className="auth-subtitle">Inscrivez-vous pour commencer votre parcours avec Tutoplus</p>
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-section">
                            <h3 className="form-section-title">Informations de connexion</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="email">Courriel *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="form-input"
                                        placeholder="marie@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="password">Mot de passe *</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        className="form-input"
                                        placeholder="Minimum 6 caractères"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="confirmPassword">Confirmer le mot de passe *</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        className="form-input"
                                        placeholder="Confirmez votre mot de passe"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3 className="form-section-title">Informations personnelles</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="parentName">Nom complet du parent *</label>
                                    <input
                                        type="text"
                                        id="parentName"
                                        name="parentName"
                                        className="form-input"
                                        placeholder="Marie Tremblay"
                                        value={formData.parentName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="studentName">Nom complet de l'élève *</label>
                                    <input
                                        type="text"
                                        id="studentName"
                                        name="studentName"
                                        className="form-input"
                                        placeholder="Thomas Tremblay"
                                        value={formData.studentName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="phone">Numéro de téléphone *</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        className="form-input"
                                        placeholder="(819) 555-0123"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="service">Service choisi *</label>
                                    <select
                                        id="service"
                                        name="service"
                                        className="form-select"
                                        value={formData.service}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Sélectionnez un service</option>
                                        <option value="en_ligne">En Ligne - 30$</option>
                                        <option value="primaire">Primaire Présentiel - 35$</option>
                                        <option value="secondaire">Secondaire Présentiel - 38$</option>
                                        <option value="cegep">Cégep (Présentiel & En Ligne) - 40$</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="address">Adresse de domicile *</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    className="form-input"
                                    placeholder="123 Rue Principale, Val-des-Monts, QC"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="mentalHealth">Besoins particuliers (optionnel)</label>
                                <input
                                    type="text"
                                    id="mentalHealth"
                                    name="mentalHealth"
                                    className="form-input"
                                    placeholder="TDAH, dyslexie, anxiété, etc."
                                    value={formData.mentalHealth}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="specifications">Spécifications additionnelles (optionnel)</label>
                                <textarea
                                    id="specifications"
                                    name="specifications"
                                    className="form-textarea"
                                    placeholder="Parlez-nous de vos besoins spécifiques, matières à couvrir, objectifs académiques, etc."
                                    value={formData.specifications}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-large"
                            style={{ width: '100%' }}
                            disabled={loading}
                        >
                            {loading ? 'Création en cours...' : 'Créer mon compte et soumettre'}
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                            </svg>
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Déjà un compte?{' '}
                            <Link href="/connexion" className="auth-link">
                                Se connecter
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
