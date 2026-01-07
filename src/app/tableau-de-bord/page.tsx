'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    createClient,
    Inscription,
    statusLabels,
    inscriptionStatusColors,
    TutoringSession,
    sessionStatusColors,
    Profile
} from '@/lib/supabase';

export default function TableauDeBordPage() {
    const router = useRouter();
    const [inscription, setInscription] = useState<Inscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');
    const [sessions, setSessions] = useState<TutoringSession[]>([]);
    const [tutorInfo, setTutorInfo] = useState<Profile | null>(null);
    const [tutorPhone, setTutorPhone] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient();

            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/connexion');
                return;
            }

            // Fetch profile to check role
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileData) {
                // Redirect based on role
                if (profileData.role === 'admin') {
                    router.push('/admin');
                    return;
                }
                if (profileData.role === 'tutor') {
                    router.push('/tuteur');
                    return;
                }
            }

            // Fetch user's inscription
            const { data: inscriptionData } = await supabase
                .from('inscriptions')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (inscriptionData) {
                setInscription(inscriptionData);
                setUserName(inscriptionData.parent_name);
            }

            // Fetch tutoring sessions for this student
            const { data: sessionsData } = await supabase
                .from('tutoring_sessions')
                .select('*')
                .eq('student_id', user.id)
                .order('session_date', { ascending: true });

            if (sessionsData) {
                setSessions(sessionsData);
            }

            // Fetch assigned tutor from tutor_assignments
            const { data: assignmentData } = await supabase
                .from('tutor_assignments')
                .select('tutor_id')
                .eq('student_id', user.id)
                .single();

            if (assignmentData?.tutor_id) {
                // Fetch tutor profile
                const { data: tutorData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', assignmentData.tutor_id)
                    .single();

                if (tutorData) {
                    setTutorInfo(tutorData);

                    // Fetch tutor's inscription for phone number
                    const { data: tutorInscription } = await supabase
                        .from('inscriptions')
                        .select('phone')
                        .eq('user_id', assignmentData.tutor_id)
                        .single();

                    if (tutorInscription?.phone) {
                        setTutorPhone(tutorInscription.phone);
                    }
                }
            }

            setLoading(false);
        };

        fetchData();
    }, [router]);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/');
    };

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    const upcomingSessions = sessions.filter(s => s.status === 'scheduled');
    const completedSessions = sessions.filter(s => s.status === 'completed');

    const getServiceLabel = (service: string) => {
        const labels: Record<string, string> = {
            'en_ligne': 'En Ligne',
            'online': 'En Ligne',
            'primaire': 'Primaire',
            'secondaire': 'Secondaire',
            'cegep': 'Cégep'
        };
        return labels[service] || service;
    };

    if (loading) {
        return (
            <main className="dashboard-page">
                <div className="dashboard-loading">
                    <div className="spinner"></div>
                    <p>Chargement...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="dashboard-page">
            <nav className="dashboard-nav">
                <Link href="/" className="nav-logo">
                    <Image src="/logo.jpg" alt="Tuto+" width={40} height={40} style={{ borderRadius: '8px' }} />
                    Tuto+
                </Link>
                <button onClick={handleLogout} className="btn btn-secondary">
                    Déconnexion
                </button>
            </nav>

            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>Tableau de bord</h1>
                    <p>Bienvenue, {userName}!</p>
                </div>

                {inscription && (
                    <div className="dashboard-content">
                        {/* Status Card */}
                        <div className="status-card">
                            <h2>Statut de votre inscription</h2>
                            <div
                                className="status-badge"
                                style={{
                                    backgroundColor: inscriptionStatusColors[inscription.status] + '20',
                                    color: inscriptionStatusColors[inscription.status],
                                    borderColor: inscriptionStatusColors[inscription.status]
                                }}
                            >
                                {statusLabels[inscription.status]}
                            </div>

                            {inscription.status === 'en_attente' && (
                                <div className="status-message status-waiting">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    <div>
                                        <h3>Votre demande est en cours de traitement</h3>
                                        <p>
                                            Nous avons bien reçu votre inscription et notre équipe l'examine actuellement.
                                            Vous serez contacté dans les 24 à 48 heures pour confirmer les détails et
                                            planifier votre première séance.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {inscription.status === 'approuve' && (
                                <div className="status-message status-approved">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                    <div>
                                        <h3>Félicitations! Votre inscription est approuvée</h3>
                                        <p>
                                            Bienvenue dans la famille Tuto+! Votre inscription a été approuvée et nous
                                            sommes prêts à commencer votre parcours vers la réussite académique.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {inscription.status === 'refuse' && (
                                <div className="status-message status-refused">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="15" y1="9" x2="9" y2="15" />
                                        <line x1="9" y1="9" x2="15" y2="15" />
                                    </svg>
                                    <div>
                                        <h3>Inscription non approuvée</h3>
                                        <p>
                                            Malheureusement, nous ne sommes pas en mesure d'approuver votre inscription pour
                                            le moment. Contactez-nous pour plus d'informations.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tutor Contact Card */}
                        {tutorInfo && (
                            <div className="tutor-contact-card">
                                <h2>Votre Tuteur</h2>
                                <div className="tutor-contact-info">
                                    <div className="tutor-avatar">
                                        {tutorInfo.email[0].toUpperCase()}
                                    </div>
                                    <div className="tutor-details">
                                        <div className="contact-links">
                                            <a href={`mailto:${tutorInfo.email}`} className="contact-link">
                                                📧 {tutorInfo.email}
                                            </a>
                                            {tutorPhone && (
                                                <a href={`tel:${tutorPhone}`} className="contact-link">
                                                    📞 {tutorPhone}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Upcoming Sessions */}
                        <div className="sessions-card">
                            <h2>Prochaines séances de tutorat</h2>
                            {upcomingSessions.length === 0 ? (
                                <div className="empty-sessions">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                    <p>Aucune séance planifiée pour le moment.</p>
                                    <span>Votre tuteur planifiera vos séances prochainement.</span>
                                </div>
                            ) : (
                                <div className="sessions-list-student">
                                    {upcomingSessions.map(session => (
                                        <div key={session.id} className="session-item">
                                            <div className="session-date-badge">
                                                <span className="date-day">
                                                    {new Date(session.session_date + 'T00:00:00').getDate()}
                                                </span>
                                                <span className="date-month">
                                                    {new Date(session.session_date + 'T00:00:00').toLocaleDateString('fr-CA', { month: 'short' })}
                                                </span>
                                            </div>
                                            <div className="session-details">
                                                <h4>{session.title}</h4>
                                                <p className="session-time-display">
                                                    {formatTime(session.start_time)} - {formatTime(session.end_time)}
                                                </p>
                                                {inscription && (
                                                    <span className="session-forfait-badge">{getServiceLabel(inscription.service)}</span>
                                                )}
                                                {session.notes && (
                                                    <p className="session-notes">{session.notes}</p>
                                                )}
                                            </div>
                                            <div className="session-badges-student">
                                                <div
                                                    className="session-status-badge"
                                                    style={{ backgroundColor: sessionStatusColors[session.status] + '20', color: sessionStatusColors[session.status] }}
                                                >
                                                    Planifiée
                                                </div>
                                                <div className={`payment-badge-display ${session.is_paid ? 'paid' : 'unpaid'}`}>
                                                    {session.is_paid ? '✓ Payée' : 'Non payée'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Completed Sessions */}
                        <div className="sessions-card">
                            <h2>Séances complétées ({completedSessions.length})</h2>
                            {completedSessions.length === 0 ? (
                                <div className="empty-sessions">
                                    <p>Aucune séance complétée pour le moment.</p>
                                </div>
                            ) : (
                                <div className="sessions-list-student">
                                    {completedSessions
                                        .sort((a, b) => b.session_date.localeCompare(a.session_date))
                                        .map(session => (
                                            <div key={session.id} className="session-item completed">
                                                <div className="session-date-badge completed-date">
                                                    <span className="date-day">
                                                        {new Date(session.session_date + 'T00:00:00').getDate()}
                                                    </span>
                                                    <span className="date-month">
                                                        {new Date(session.session_date + 'T00:00:00').toLocaleDateString('fr-CA', { month: 'short' })}
                                                    </span>
                                                </div>
                                                <div className="session-details">
                                                    <h4>{session.title}</h4>
                                                    <p className="session-time-display">
                                                        {formatTime(session.start_time)} - {formatTime(session.end_time)}
                                                    </p>
                                                    {inscription && (
                                                        <span className="session-forfait-badge">{getServiceLabel(inscription.service)}</span>
                                                    )}
                                                </div>
                                                <div className="session-badges-student">
                                                    <div className="completed-badge">
                                                        ✓ Complétée
                                                    </div>
                                                    <div className={`payment-badge-display ${session.is_paid ? 'paid' : 'unpaid'}`}>
                                                        {session.is_paid ? '✓ Payée' : 'Non payée'}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>

                        {/* Inscription Details */}
                        <div className="details-card">
                            <h2>Détails de votre inscription</h2>
                            <div className="details-grid">
                                <div className="detail-item">
                                    <span className="detail-label">Nom du parent</span>
                                    <span className="detail-value">{inscription.parent_name}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Nom de l'élève</span>
                                    <span className="detail-value">{inscription.student_name}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Téléphone</span>
                                    <span className="detail-value">{inscription.phone}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Courriel</span>
                                    <span className="detail-value">{inscription.email}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Service</span>
                                    <span className="detail-value">{inscription.service}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Adresse</span>
                                    <span className="detail-value">{inscription.address}</span>
                                </div>
                                {inscription.mental_health && (
                                    <div className="detail-item">
                                        <span className="detail-label">Besoins particuliers</span>
                                        <span className="detail-value">{inscription.mental_health}</span>
                                    </div>
                                )}
                                {inscription.specifications && (
                                    <div className="detail-item detail-item-full">
                                        <span className="detail-label">Spécifications</span>
                                        <span className="detail-value">{inscription.specifications}</span>
                                    </div>
                                )}
                                <div className="detail-item">
                                    <span className="detail-label">Date d'inscription</span>
                                    <span className="detail-value">
                                        {new Date(inscription.created_at).toLocaleDateString('fr-CA', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!inscription && (
                    <div className="no-inscription">
                        <h2>Aucune inscription trouvée</h2>
                        <p>Vous n'avez pas encore soumis de demande d'inscription.</p>
                        <Link href="/inscription" className="btn btn-primary">
                            Soumettre une inscription
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}

