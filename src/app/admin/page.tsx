'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    createClient,
    Inscription,
    ContactStatus,
    InscriptionStatus,
    statusLabels,
    contactStatusLabels,
    contactStatusColors,
    inscriptionStatusColors,
    TutoringSession,
    SessionStatus,
    sessionStatusLabels,
    sessionStatusColors
} from '@/lib/supabase';

export default function AdminPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'inscriptions' | 'users' | 'sessions'>('inscriptions');
    const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
    const [profiles, setProfiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInscription, setSelectedInscription] = useState<Inscription | null>(null);
    const [filter, setFilter] = useState<'all' | InscriptionStatus>('all');
    const [currentUserEmail, setCurrentUserEmail] = useState('');
    const [tutors, setTutors] = useState<any[]>([]);
    const [tutorAssignments, setTutorAssignments] = useState<Record<string, string>>({});

    // Sessions tab state
    const [allSessions, setAllSessions] = useState<TutoringSession[]>([]);
    const [sessionFilterStatus, setSessionFilterStatus] = useState<'all' | SessionStatus>('all');
    const [sessionFilterPaid, setSessionFilterPaid] = useState<'all' | 'paid' | 'unpaid'>('all');
    const [sessionFilterTutor, setSessionFilterTutor] = useState<string>('all');
    const [sessionFilterStudent, setSessionFilterStudent] = useState<string>('all');
    const [showSessionModal, setShowSessionModal] = useState(false);
    const [sessionForm, setSessionForm] = useState({
        tutor_id: '',
        student_id: '',
        title: '',
        session_date: '',
        start_time: '09:00',
        end_time: '10:00',
        notes: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient();

            // Check if user is logged in
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/connexion');
                return;
            }

            // Simple check: if not admin email, redirect to user dashboard
            if (user.email !== 'tutoplus2025@gmail.com') {
                router.push('/tableau-de-bord');
                return;
            }

            setCurrentUserEmail(user.email || '');

            // Fetch all inscriptions
            const { data: inscriptionsData } = await supabase
                .from('inscriptions')
                .select('*')
                .order('created_at', { ascending: false });

            if (inscriptionsData) {
                setInscriptions(inscriptionsData);
            }

            // Fetch all profiles
            const { data: profilesData, error: profilesError } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            console.log('Profiles data:', profilesData);
            console.log('Profiles error:', profilesError);

            if (profilesData) {
                // Match inscriptions to profiles manually
                const profilesWithInscriptions = profilesData.map(profile => ({
                    ...profile,
                    inscriptions: inscriptionsData?.filter(i => i.user_id === profile.id) || []
                }));
                setProfiles(profilesWithInscriptions);

                // Extract tutors for assignment dropdown
                const tutorsList = profilesData.filter(p => p.role === 'tutor');
                setTutors(tutorsList);
            }

            // Fetch tutor assignments
            const { data: assignmentsData } = await supabase
                .from('tutor_assignments')
                .select('*');

            if (assignmentsData) {
                const assignmentMap: Record<string, string> = {};
                assignmentsData.forEach(a => {
                    assignmentMap[a.student_id] = a.tutor_id;
                });
                setTutorAssignments(assignmentMap);
            }

            // Fetch all sessions for admin
            const { data: sessionsData } = await supabase
                .from('tutoring_sessions')
                .select('*')
                .order('session_date', { ascending: false });

            if (sessionsData) {
                setAllSessions(sessionsData);
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

    // --- Inscription Actions ---

    const updateInscriptionStatus = async (id: string, status: InscriptionStatus) => {
        const supabase = createClient();
        const { error } = await supabase
            .from('inscriptions')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (!error) {
            setInscriptions(inscriptions.map(i => i.id === id ? { ...i, status } : i));
            if (selectedInscription?.id === id) {
                setSelectedInscription({ ...selectedInscription, status });
            }
        }
    };

    const updateContactStatus = async (id: string, contactStatus: ContactStatus) => {
        const supabase = createClient();
        const { error } = await supabase
            .from('inscriptions')
            .update({ contact_status: contactStatus, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (!error) {
            setInscriptions(inscriptions.map(i => i.id === id ? { ...i, contact_status: contactStatus } : i));
            if (selectedInscription?.id === id) {
                setSelectedInscription({ ...selectedInscription, contact_status: contactStatus });
            }
        }
    };

    const deleteInscription = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette inscription?')) return;
        const supabase = createClient();
        const { error } = await supabase.from('inscriptions').delete().eq('id', id);
        if (!error) {
            setInscriptions(inscriptions.filter(i => i.id !== id));
            if (selectedInscription?.id === id) setSelectedInscription(null);
            // Also update profiles list as inscription is gone
            setProfiles(profiles.map(p => ({
                ...p,
                inscriptions: p.inscriptions.filter((i: any) => i.id !== id)
            })));
        }
    };

    // --- User Actions ---

    const updateUserRole = async (userId: string, newRole: string) => {
        const supabase = createClient();
        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId);

        if (!error) {
            setProfiles(profiles.map(p => p.id === userId ? { ...p, role: newRole } : p));
            alert('Rôle mis à jour avec succès');
        } else {
            alert('Erreur lors de la mise à jour du rôle: ' + error.message);
        }
    };

    const updateUserService = async (userId: string, inscriptionId: string | null, newService: string) => {
        const supabase = createClient();

        if (inscriptionId) {
            // Update existing inscription
            const { error } = await supabase
                .from('inscriptions')
                .update({ service: newService })
                .eq('id', inscriptionId);

            if (!error) {
                setInscriptions(inscriptions.map(i => i.id === inscriptionId ? { ...i, service: newService } : i));
                setProfiles(profiles.map(p => ({
                    ...p,
                    inscriptions: p.inscriptions.map((i: any) => i.id === inscriptionId ? { ...i, service: newService } : i)
                })));
                alert('Forfait modifié avec succès');
            } else {
                alert('Erreur: ' + error.message);
            }
        } else {
            // Create a minimal inscription for this user
            const profile = profiles.find(p => p.id === userId);
            const { data, error } = await supabase
                .from('inscriptions')
                .insert({
                    user_id: userId,
                    parent_name: profile?.email || 'Non spécifié',
                    student_name: 'Non spécifié',
                    phone: 'Non spécifié',
                    email: profile?.email || '',
                    service: newService,
                    address: 'Non spécifié',
                    status: 'approuve'
                })
                .select()
                .single();

            if (!error && data) {
                setInscriptions([...inscriptions, data]);
                setProfiles(profiles.map(p =>
                    p.id === userId
                        ? { ...p, inscriptions: [data] }
                        : p
                ));
                alert('Forfait créé avec succès');
            } else {
                alert('Erreur: ' + (error?.message || 'Unknown'));
            }
        }
    };

    const sendPasswordReset = async (email: string) => {
        if (!confirm(`Envoyer un courriel de réinitialisation de mot de passe à ${email}?`)) return;

        const supabase = createClient();
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/connexion`,
        });

        if (error) {
            alert('Erreur lors de l\'envoi: ' + error.message);
        } else {
            alert('Courriel envoyé avec succès!');
        }
    };

    const loginAsUser = async (email: string) => {
        if (!confirm(`Se connecter en tant que ${email}? Vous serez déconnecté de votre session admin.`)) return;

        try {
            const response = await fetch('/api/admin/impersonate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: email,
                    adminEmail: currentUserEmail
                }),
            });

            const data = await response.json();

            if (data.error) {
                alert('Erreur: ' + data.error);
                return;
            }

            if (data.token && data.email) {
                // Sign out current user first
                const supabase = createClient();
                await supabase.auth.signOut();

                // Verify the OTP token to log in as the target user
                const { error: verifyError } = await supabase.auth.verifyOtp({
                    email: data.email,
                    token: data.token,
                    type: 'magiclink'
                });

                if (verifyError) {
                    alert('Erreur de connexion: ' + verifyError.message);
                    return;
                }

                // Redirect to dashboard
                window.location.href = '/tableau-de-bord';
            }
        } catch (err) {
            alert('Erreur de connexion');
        }
    };

    const deleteUserAccount = async (userId: string, inscriptionId?: string) => {
        if (!confirm('ATTENTION: Vous êtes sur le point de supprimer les données de cet utilisateur (profil et inscription). Cette action est irréversible. Continuer?')) return;

        const supabase = createClient();

        // 1. Delete inscription first
        if (inscriptionId) {
            await supabase.from('inscriptions').delete().eq('id', inscriptionId);
        }

        // 2. Delete profile
        const { error } = await supabase.from('profiles').delete().eq('id', userId);

        if (error) {
            alert('Erreur lors de la suppression: ' + error.message);
        } else {
            setProfiles(profiles.filter(p => p.id !== userId));
            setInscriptions(inscriptions.filter(i => i.user_id !== userId));
            alert('Données utilisateur supprimées.');
        }
        // Note: The actual Auth User (login) remains in Supabase Auth unless deleted via Admin API, 
        // but they effectively lose access/data.
    };

    const assignTutor = async (studentId: string, tutorId: string) => {
        const supabase = createClient();

        if (!tutorId) {
            // Remove assignment
            const { error } = await supabase
                .from('tutor_assignments')
                .delete()
                .eq('student_id', studentId);

            if (!error) {
                const newAssignments = { ...tutorAssignments };
                delete newAssignments[studentId];
                setTutorAssignments(newAssignments);
                alert('Assignation retirée');
            } else {
                alert('Erreur: ' + error.message);
            }
        } else {
            // Check if assignment exists
            const existingTutorId = tutorAssignments[studentId];

            if (existingTutorId) {
                // Update existing
                const { error } = await supabase
                    .from('tutor_assignments')
                    .update({ tutor_id: tutorId })
                    .eq('student_id', studentId);

                if (!error) {
                    setTutorAssignments({ ...tutorAssignments, [studentId]: tutorId });
                    alert('Tuteur modifié avec succès');
                } else {
                    alert('Erreur: ' + error.message);
                }
            } else {
                // Create new
                const { error } = await supabase
                    .from('tutor_assignments')
                    .insert({ tutor_id: tutorId, student_id: studentId });

                if (!error) {
                    setTutorAssignments({ ...tutorAssignments, [studentId]: tutorId });
                    alert('Tuteur assigné avec succès');
                } else {
                    alert('Erreur: ' + error.message);
                }
            }
        }
    };


    const filteredInscriptions = filter === 'all'
        ? inscriptions
        : inscriptions.filter(i => i.status === filter);

    const getServiceLabel = (service: string) => {
        const labels: Record<string, string> = {
            'en_ligne': 'En Ligne',
            'primaire': 'Primaire',
            'secondaire': 'Secondaire',
            'cegep': 'Cégep',
            'online': 'En Ligne',
        };
        return labels[service] || service;
    };

    // Session management functions
    const getProfileName = (userId: string) => {
        const profile = profiles.find(p => p.id === userId);
        const inscription = profile?.inscriptions?.[0];
        return inscription?.student_name || profile?.email || 'Inconnu';
    };

    const getProfileEmail = (userId: string) => {
        const profile = profiles.find(p => p.id === userId);
        return profile?.email || '';
    };

    const filteredSessions = allSessions.filter(session => {
        if (sessionFilterStatus !== 'all' && session.status !== sessionFilterStatus) return false;
        if (sessionFilterPaid === 'paid' && !session.is_paid) return false;
        if (sessionFilterPaid === 'unpaid' && session.is_paid) return false;
        if (sessionFilterTutor !== 'all' && session.tutor_id !== sessionFilterTutor) return false;
        if (sessionFilterStudent !== 'all' && session.student_id !== sessionFilterStudent) return false;
        return true;
    });

    const updateSessionStatus = async (sessionId: string, newStatus: SessionStatus) => {
        const supabase = createClient();
        const { error } = await supabase
            .from('tutoring_sessions')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', sessionId);

        if (!error) {
            setAllSessions(allSessions.map(s => s.id === sessionId ? { ...s, status: newStatus } : s));
        } else {
            alert('Erreur: ' + error.message);
        }
    };

    const toggleSessionPayment = async (sessionId: string, currentPaid: boolean) => {
        const supabase = createClient();
        const { error } = await supabase
            .from('tutoring_sessions')
            .update({ is_paid: !currentPaid, updated_at: new Date().toISOString() })
            .eq('id', sessionId);

        if (!error) {
            setAllSessions(allSessions.map(s => s.id === sessionId ? { ...s, is_paid: !currentPaid } : s));
        }
    };

    const createSession = async (e: React.FormEvent) => {
        e.preventDefault();
        const supabase = createClient();

        const { data, error } = await supabase
            .from('tutoring_sessions')
            .insert({
                tutor_id: sessionForm.tutor_id,
                student_id: sessionForm.student_id,
                title: sessionForm.title,
                session_date: sessionForm.session_date,
                start_time: sessionForm.start_time,
                end_time: sessionForm.end_time,
                notes: sessionForm.notes,
                status: 'scheduled',
                is_paid: false
            })
            .select()
            .single();

        if (!error && data) {
            setAllSessions([data, ...allSessions]);
            setShowSessionModal(false);
            setSessionForm({ tutor_id: '', student_id: '', title: '', session_date: '', start_time: '09:00', end_time: '10:00', notes: '' });
            alert('Séance créée avec succès');
        } else {
            alert('Erreur: ' + (error?.message || 'Erreur inconnue'));
        }
    };

    const deleteSession = async (sessionId: string) => {
        if (!confirm('Supprimer cette séance?')) return;
        const supabase = createClient();
        const { error } = await supabase.from('tutoring_sessions').delete().eq('id', sessionId);
        if (!error) {
            setAllSessions(allSessions.filter(s => s.id !== sessionId));
        } else {
            alert('Erreur: ' + error.message);
        }
    };

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    // Get unique students from sessions for filter
    const studentsInSessions = [...new Set(allSessions.map(s => s.student_id))];
    const tutorsInSessions = [...new Set(allSessions.map(s => s.tutor_id))];

    if (loading) {
        return (
            <main className="dashboard-page">
                <div className="dashboard-loading"><div className="spinner"></div><p>Chargement...</p></div>
            </main>
        );
    }

    return (
        <main className="admin-page">
            <nav className="dashboard-nav">
                <Link href="/" className="nav-logo">
                    <Image src="/logo.jpg" alt="Tuto+" width={40} height={40} style={{ borderRadius: '8px' }} />
                    Tuto+ Admin
                </Link>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="tab-buttons" style={{ display: 'flex', gap: '0.5rem', background: '#f3f4f6', padding: '0.25rem', borderRadius: '8px' }}>
                        <button
                            onClick={() => setActiveTab('inscriptions')}
                            className={`btn ${activeTab === 'inscriptions' ? 'btn-primary' : ''}`}
                            style={{ borderRadius: '6px', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer', background: activeTab === 'inscriptions' ? 'var(--primary-green)' : 'transparent', color: activeTab === 'inscriptions' ? 'white' : 'inherit' }}
                        >
                            Inscriptions
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`btn ${activeTab === 'users' ? 'btn-primary' : ''}`}
                            style={{ borderRadius: '6px', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer', background: activeTab === 'users' ? 'var(--primary-green)' : 'transparent', color: activeTab === 'users' ? 'white' : 'inherit' }}
                        >
                            Utilisateurs
                        </button>
                        <button
                            onClick={() => setActiveTab('sessions')}
                            className={`btn ${activeTab === 'sessions' ? 'btn-primary' : ''}`}
                            style={{ borderRadius: '6px', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer', background: activeTab === 'sessions' ? 'var(--primary-green)' : 'transparent', color: activeTab === 'sessions' ? 'white' : 'inherit' }}
                        >
                            Séances ({allSessions.length})
                        </button>
                    </div>
                    <button onClick={handleLogout} className="btn btn-secondary">Déconnexion</button>
                </div>
            </nav>

            <div className="admin-container">
                {activeTab === 'inscriptions' ? (
                    <>
                        {/* EXISTING INSCRIPTION DASHBOARD CODE */}
                        <div className="admin-header">
                            <h1>Tableau de bord administrateur</h1>
                            <p>Gérez les demandes d'inscription</p>
                        </div>

                        {/* Stats */}
                        <div className="admin-stats">
                            <div className="stat-card">
                                <span className="stat-number">{inscriptions.length}</span>
                                <span className="stat-label">Total demandes</span>
                            </div>
                            <div className="stat-card stat-waiting">
                                <span className="stat-number">{inscriptions.filter(i => i.status === 'en_attente').length}</span>
                                <span className="stat-label">En attente</span>
                            </div>
                            <div className="stat-card stat-approved">
                                <span className="stat-number">{inscriptions.filter(i => i.status === 'approuve').length}</span>
                                <span className="stat-label">Approuvées</span>
                            </div>
                            <div className="stat-card stat-refused">
                                <span className="stat-number">{inscriptions.filter(i => i.status === 'refuse').length}</span>
                                <span className="stat-label">Refusées</span>
                            </div>
                        </div>

                        {/* Filter */}
                        <div className="admin-filter">
                            {['all', 'en_attente', 'approuve', 'refuse'].map(f => (
                                <button
                                    key={f}
                                    className={`filter-btn ${filter === f ? 'active' : ''}`}
                                    onClick={() => setFilter(f as any)}
                                >
                                    {f === 'all' ? 'Toutes' : statusLabels[f as InscriptionStatus]}
                                </button>
                            ))}
                        </div>

                        <div className="admin-content">
                            <div className="inscriptions-list">
                                <h2>Demandes ({filteredInscriptions.length})</h2>
                                {filteredInscriptions.length === 0 ? (
                                    <p className="no-inscriptions">Aucune inscription trouvée</p>
                                ) : (
                                    filteredInscriptions.map((inscription) => (
                                        <div
                                            key={inscription.id}
                                            className={`inscription-card ${selectedInscription?.id === inscription.id ? 'selected' : ''}`}
                                            onClick={() => setSelectedInscription(inscription)}
                                        >
                                            <div className="inscription-header">
                                                <div className="contact-indicator" style={{ backgroundColor: contactStatusColors[inscription.contact_status] }} />
                                                <div className="inscription-info">
                                                    <h3>{inscription.student_name}</h3>
                                                    <p>{inscription.parent_name}</p>
                                                </div>
                                                <div className="status-pill" style={{ backgroundColor: inscriptionStatusColors[inscription.status] + '20', color: inscriptionStatusColors[inscription.status] }}>
                                                    {statusLabels[inscription.status]}
                                                </div>
                                            </div>
                                            <div className="inscription-meta">
                                                <span>{getServiceLabel(inscription.service)}</span>
                                                <span>{new Date(inscription.created_at).toLocaleDateString('fr-CA')}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {selectedInscription && (
                                <div className="inscription-detail">
                                    <h2>Détails</h2>

                                    {/* Contact Status */}
                                    <div className="detail-section">
                                        <h3>Statut de contact</h3>
                                        <div className="contact-status-buttons">
                                            {(['non_contacte', 'contacte', 'en_discussion', 'finalise'] as ContactStatus[]).map((status) => (
                                                <button
                                                    key={status}
                                                    className={`contact-btn ${selectedInscription.contact_status === status ? 'active' : ''}`}
                                                    style={{
                                                        borderColor: contactStatusColors[status],
                                                        backgroundColor: selectedInscription.contact_status === status ? contactStatusColors[status] : 'transparent',
                                                        color: selectedInscription.contact_status === status ? 'white' : contactStatusColors[status]
                                                    }}
                                                    onClick={() => updateContactStatus(selectedInscription.id, status)}
                                                >
                                                    {contactStatusLabels[status]}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Inscription Status Actions */}
                                    <div className="detail-section">
                                        <h3>Actions</h3>
                                        <div className="action-buttons">
                                            <button
                                                className="btn btn-approve"
                                                onClick={() => updateInscriptionStatus(selectedInscription.id, 'approuve')}
                                                disabled={selectedInscription.status === 'approuve'}
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                                Approuver
                                            </button>
                                            <button
                                                className="btn btn-refuse"
                                                onClick={() => updateInscriptionStatus(selectedInscription.id, 'refuse')}
                                                disabled={selectedInscription.status === 'refuse'}
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <line x1="18" y1="6" x2="6" y2="18" />
                                                    <line x1="6" y1="6" x2="18" y2="18" />
                                                </svg>
                                                Refuser
                                            </button>
                                            {selectedInscription.status !== 'en_attente' && (
                                                <button
                                                    className="btn btn-secondary"
                                                    onClick={() => updateInscriptionStatus(selectedInscription.id, 'en_attente')}
                                                >
                                                    Remettre en attente
                                                </button>
                                            )}
                                            <button
                                                className="btn btn-delete"
                                                onClick={() => deleteInscription(selectedInscription.id)}
                                                style={{ backgroundColor: '#7f1d1d', marginLeft: 'auto' }}
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="3 6 5 6 21 6" />
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                </svg>
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>
                                    {/* Additional details rendering (abbreviated for brevity, but logically present) */}
                                    <div className="detail-section">
                                        <h3>Informations</h3>
                                        <div className="detail-grid">
                                            <div className="detail-item"><span className="detail-label">Parent</span><span className="detail-value">{selectedInscription.parent_name}</span></div>
                                            <div className="detail-item"><span className="detail-label">Élève</span><span className="detail-value">{selectedInscription.student_name}</span></div>
                                            <div className="detail-item"><span className="detail-label">Téléphone</span><a href={`tel:${selectedInscription.phone}`} className="detail-value detail-link">{selectedInscription.phone}</a></div>
                                            <div className="detail-item"><span className="detail-label">Courriel</span><a href={`mailto:${selectedInscription.email}`} className="detail-value detail-link">{selectedInscription.email}</a></div>
                                            <div className="detail-item"><span className="detail-label">Service</span><span className="detail-value">{getServiceLabel(selectedInscription.service)}</span></div>
                                            <div className="detail-item"><span className="detail-label">Adresse</span><span className="detail-value">{selectedInscription.address}</span></div>
                                            {selectedInscription.mental_health && (
                                                <div className="detail-item detail-item-full">
                                                    <span className="detail-label">Besoins particuliers</span>
                                                    <span className="detail-value">{selectedInscription.mental_health}</span>
                                                </div>
                                            )}
                                            {selectedInscription.specifications && (
                                                <div className="detail-item detail-item-full">
                                                    <span className="detail-label">Spécifications</span>
                                                    <span className="detail-value">{selectedInscription.specifications}</span>
                                                </div>
                                            )}
                                            <div className="detail-item">
                                                <span className="detail-label">Date d'inscription</span>
                                                <span className="detail-value">
                                                    {new Date(selectedInscription.created_at).toLocaleDateString('fr-CA', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Legend */}
                        <div className="admin-legend">
                            <h3>Légende des couleurs de contact</h3>
                            <div className="legend-items">
                                <div className="legend-item">
                                    <span className="legend-dot" style={{ backgroundColor: contactStatusColors.non_contacte }}></span>
                                    <span>Non contacté</span>
                                </div>
                                <div className="legend-item">
                                    <span className="legend-dot" style={{ backgroundColor: contactStatusColors.contacte }}></span>
                                    <span>Contacté</span>
                                </div>
                                <div className="legend-item">
                                    <span className="legend-dot" style={{ backgroundColor: contactStatusColors.en_discussion }}></span>
                                    <span>En discussion</span>
                                </div>
                                <div className="legend-item">
                                    <span className="legend-dot" style={{ backgroundColor: contactStatusColors.finalise }}></span>
                                    <span>Finalisé</span>
                                </div>
                            </div>
                        </div>
                    </>
                ) : activeTab === 'sessions' ? (
                    <div className="sessions-tab">
                        <div className="admin-header">
                            <h1>Gestion des Séances</h1>
                            <p>Gérez toutes les séances de tutorat ({allSessions.length} séances)</p>
                        </div>

                        {/* Filters Bar */}
                        <div className="sessions-filters">
                            <div className="filter-group">
                                <label>Statut:</label>
                                <select value={sessionFilterStatus} onChange={e => setSessionFilterStatus(e.target.value as any)}>
                                    <option value="all">Tous</option>
                                    <option value="scheduled">Planifiée</option>
                                    <option value="completed">Complétée</option>
                                    <option value="facture_envoyee">Facture envoyée</option>
                                    <option value="recu_envoye">Reçu envoyé</option>
                                    <option value="cancelled">Annulée</option>
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>Paiement:</label>
                                <select value={sessionFilterPaid} onChange={e => setSessionFilterPaid(e.target.value as any)}>
                                    <option value="all">Tous</option>
                                    <option value="paid">Payées</option>
                                    <option value="unpaid">Non payées</option>
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>Tuteur:</label>
                                <select value={sessionFilterTutor} onChange={e => setSessionFilterTutor(e.target.value)}>
                                    <option value="all">Tous les tuteurs</option>
                                    {tutorsInSessions.map(id => (
                                        <option key={id} value={id}>{getProfileEmail(id)}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>Étudiant:</label>
                                <select value={sessionFilterStudent} onChange={e => setSessionFilterStudent(e.target.value)}>
                                    <option value="all">Tous les étudiants</option>
                                    {studentsInSessions.map(id => (
                                        <option key={id} value={id}>{getProfileName(id)}</option>
                                    ))}
                                </select>
                            </div>
                            <button className="btn btn-primary" onClick={() => setShowSessionModal(true)}>
                                + Nouvelle séance
                            </button>
                        </div>

                        {/* Stats Pills */}
                        <div className="sessions-stats">
                            <div className="stat-pill" style={{ background: '#dbeafe', color: '#1d4ed8' }}>
                                <span>{allSessions.filter(s => s.status === 'scheduled').length}</span> Planifiées
                            </div>
                            <div className="stat-pill" style={{ background: '#dcfce7', color: '#16a34a' }}>
                                <span>{allSessions.filter(s => s.status === 'completed').length}</span> Complétées
                            </div>
                            <div className="stat-pill" style={{ background: '#fef3c7', color: '#b45309' }}>
                                <span>{allSessions.filter(s => s.status === 'facture_envoyee').length}</span> Factures
                            </div>
                            <div className="stat-pill" style={{ background: '#ede9fe', color: '#7c3aed' }}>
                                <span>{allSessions.filter(s => s.status === 'recu_envoye').length}</span> Reçus
                            </div>
                            <div className="stat-pill" style={{ background: '#fecaca', color: '#dc2626' }}>
                                <span>{allSessions.filter(s => !s.is_paid).length}</span> Non payées
                            </div>
                        </div>

                        {/* Sessions Table */}
                        <div style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: 'var(--shadow-md)', overflowX: 'auto' }}>
                            {filteredSessions.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>Aucune séance trouvée avec ces filtres.</p>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                                            <th style={{ padding: '1rem' }}>Date</th>
                                            <th style={{ padding: '1rem' }}>Titre</th>
                                            <th style={{ padding: '1rem' }}>Tuteur</th>
                                            <th style={{ padding: '1rem' }}>Étudiant</th>
                                            <th style={{ padding: '1rem' }}>Statut</th>
                                            <th style={{ padding: '1rem' }}>Paiement</th>
                                            <th style={{ padding: '1rem' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredSessions.map(session => (
                                            <tr key={session.id} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '1rem' }}>
                                                    <div style={{ fontWeight: 500 }}>
                                                        {new Date(session.session_date + 'T00:00:00').toLocaleDateString('fr-CA')}
                                                    </div>
                                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                                                        {formatTime(session.start_time)} - {formatTime(session.end_time)}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem', fontWeight: 500 }}>{session.title}</td>
                                                <td style={{ padding: '1rem' }}>{getProfileEmail(session.tutor_id)}</td>
                                                <td style={{ padding: '1rem' }}>{getProfileName(session.student_id)}</td>
                                                <td style={{ padding: '1rem' }}>
                                                    <select
                                                        value={session.status}
                                                        onChange={e => updateSessionStatus(session.id, e.target.value as SessionStatus)}
                                                        style={{
                                                            padding: '0.4rem 0.6rem',
                                                            borderRadius: '6px',
                                                            border: '1px solid #ddd',
                                                            background: sessionStatusColors[session.status] + '20',
                                                            color: sessionStatusColors[session.status],
                                                            fontWeight: 600,
                                                            fontSize: '0.8rem'
                                                        }}
                                                    >
                                                        <option value="scheduled">Planifiée</option>
                                                        <option value="completed">Complétée</option>
                                                        <option value="facture_envoyee">Facture envoyée</option>
                                                        <option value="recu_envoye">Reçu envoyé</option>
                                                        <option value="cancelled">Annulée</option>
                                                    </select>
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <button
                                                        onClick={() => toggleSessionPayment(session.id, session.is_paid)}
                                                        style={{
                                                            padding: '0.4rem 0.8rem',
                                                            borderRadius: '20px',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            fontWeight: 600,
                                                            fontSize: '0.8rem',
                                                            background: session.is_paid ? '#dcfce7' : '#fef3c7',
                                                            color: session.is_paid ? '#16a34a' : '#b45309'
                                                        }}
                                                    >
                                                        {session.is_paid ? '✓ Payée' : 'Non payée'}
                                                    </button>
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <button
                                                        onClick={() => deleteSession(session.id)}
                                                        style={{ padding: '0.4rem', border: '1px solid #fecaca', borderRadius: '6px', background: '#fef2f2', color: '#dc2626', cursor: 'pointer' }}
                                                        title="Supprimer"
                                                    >
                                                        🗑️
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Create Session Modal */}
                        {showSessionModal && (
                            <div className="modal-overlay" onClick={() => setShowSessionModal(false)}>
                                <div className="modal-content" onClick={e => e.stopPropagation()}>
                                    <h2>Nouvelle Séance</h2>
                                    <form onSubmit={createSession}>
                                        <div className="form-group">
                                            <label>Tuteur</label>
                                            <select
                                                value={sessionForm.tutor_id}
                                                onChange={e => setSessionForm({ ...sessionForm, tutor_id: e.target.value, student_id: '' })}
                                                required
                                            >
                                                <option value="">Sélectionner un tuteur...</option>
                                                {tutors.map(t => (
                                                    <option key={t.id} value={t.id}>{t.email}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Étudiant</label>
                                            <select
                                                value={sessionForm.student_id}
                                                onChange={e => setSessionForm({ ...sessionForm, student_id: e.target.value })}
                                                required
                                                disabled={!sessionForm.tutor_id}
                                            >
                                                <option value="">Sélectionner un étudiant...</option>
                                                {Object.entries(tutorAssignments)
                                                    .filter(([, tutorId]) => tutorId === sessionForm.tutor_id)
                                                    .map(([studentId]) => (
                                                        <option key={studentId} value={studentId}>{getProfileName(studentId)}</option>
                                                    ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Titre</label>
                                            <input
                                                type="text"
                                                value={sessionForm.title}
                                                onChange={e => setSessionForm({ ...sessionForm, title: e.target.value })}
                                                placeholder="Ex: Mathématiques - Algèbre"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Date</label>
                                            <input
                                                type="date"
                                                value={sessionForm.session_date}
                                                onChange={e => setSessionForm({ ...sessionForm, session_date: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Heure début</label>
                                                <input
                                                    type="time"
                                                    value={sessionForm.start_time}
                                                    onChange={e => setSessionForm({ ...sessionForm, start_time: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Heure fin</label>
                                                <input
                                                    type="time"
                                                    value={sessionForm.end_time}
                                                    onChange={e => setSessionForm({ ...sessionForm, end_time: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Notes (optionnel)</label>
                                            <textarea
                                                value={sessionForm.notes}
                                                onChange={e => setSessionForm({ ...sessionForm, notes: e.target.value })}
                                                rows={3}
                                            />
                                        </div>
                                        <div className="modal-actions">
                                            <button type="button" className="btn btn-secondary" onClick={() => setShowSessionModal(false)}>
                                                Annuler
                                            </button>
                                            <button type="submit" className="btn btn-primary">
                                                Créer la séance
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="users-tab">
                        <div className="admin-header">
                            <h1>Gestion des Utilisateurs</h1>
                            <p>Modifier les rôles, services et accès ({profiles.length} comptes)</p>
                        </div>

                        <div style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: 'var(--shadow-md)', overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '950px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                                        <th style={{ padding: '1rem' }}>Courriel</th>
                                        <th style={{ padding: '1rem' }}>Rôle</th>
                                        <th style={{ padding: '1rem' }}>Tuteur Assigné</th>
                                        <th style={{ padding: '1rem' }}>Service</th>
                                        <th style={{ padding: '1rem' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {profiles.map(profile => {
                                        const inscription = profile.inscriptions && profile.inscriptions[0];
                                        return (
                                            <tr key={profile.id} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '1rem', fontWeight: 500 }}>
                                                    {profile.email}
                                                    {profile.email === currentUserEmail && <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', background: '#dcfce7', color: '#166534', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>Vous</span>}
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <select
                                                        value={profile.role}
                                                        onChange={(e) => updateUserRole(profile.id, e.target.value)}
                                                        style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd' }}
                                                        disabled={profile.email === currentUserEmail && profile.role === 'admin'} // Prevent removing own admin
                                                    >
                                                        <option value="user">Utilisateur</option>
                                                        <option value="tutor">Tuteur</option>
                                                        <option value="admin">Administrateur</option>
                                                    </select>
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    {profile.role === 'user' ? (
                                                        <select
                                                            value={tutorAssignments[profile.id] || ''}
                                                            onChange={(e) => assignTutor(profile.id, e.target.value)}
                                                            style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd', minWidth: '150px' }}
                                                        >
                                                            <option value="">Aucun tuteur</option>
                                                            {tutors.map(tutor => (
                                                                <option key={tutor.id} value={tutor.id}>{tutor.email}</option>
                                                            ))}
                                                        </select>
                                                    ) : profile.role === 'tutor' ? (
                                                        <span style={{ color: '#166534', fontWeight: 500 }}>—</span>
                                                    ) : (
                                                        <span style={{ color: '#999', fontStyle: 'italic' }}>—</span>
                                                    )}
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <select
                                                        value={inscription?.service || ''}
                                                        onChange={(e) => updateUserService(profile.id, inscription?.id || null, e.target.value)}
                                                        style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd', minWidth: '140px' }}
                                                    >
                                                        {!inscription && <option value="">Choisir forfait...</option>}
                                                        <option value="online">En Ligne</option>
                                                        <option value="primaire">Primaire</option>
                                                        <option value="secondaire">Secondaire</option>
                                                        <option value="cegep">Cégep</option>
                                                    </select>
                                                </td>
                                                <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#666' }}>
                                                    {new Date(profile.created_at).toLocaleDateString()}
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); loginAsUser(profile.email); }}
                                                            title="Se connecter en tant que cet utilisateur"
                                                            style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '6px', background: '#f0fdf4', cursor: 'pointer' }}
                                                            disabled={profile.email === currentUserEmail}
                                                        >
                                                            👤
                                                        </button>
                                                        <button
                                                            onClick={() => sendPasswordReset(profile.email)}
                                                            title="Réinitialiser le mot de passe"
                                                            style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '6px', background: 'white', cursor: 'pointer' }}
                                                        >
                                                            🔑
                                                        </button>
                                                        <button
                                                            onClick={() => deleteUserAccount(profile.id, inscription?.id)}
                                                            title="Supprimer le compte"
                                                            style={{ padding: '0.5rem', border: '1px solid #fecaca', borderRadius: '6px', background: '#fef2f2', color: '#dc2626', cursor: 'pointer' }}
                                                            disabled={profile.email === 'tutoplus2025@gmail.com'}
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
