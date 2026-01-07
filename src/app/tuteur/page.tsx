'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    createClient,
    Profile,
    TutoringSession,
    sessionStatusLabels,
    sessionStatusColors
} from '@/lib/supabase';

interface AssignedStudent {
    id: string;
    email: string;
    student_name?: string;
    inscription?: {
        student_name: string;
        phone: string;
        service: string;
    };
}

export default function TuteurPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [assignedStudents, setAssignedStudents] = useState<AssignedStudent[]>([]);
    const [sessions, setSessions] = useState<TutoringSession[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [editingSession, setEditingSession] = useState<TutoringSession | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        student_id: '',
        title: '',
        session_date: '',
        start_time: '',
        end_time: '',
        notes: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient();

            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/connexion');
                return;
            }

            // Fetch profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (!profileData) {
                router.push('/connexion');
                return;
            }

            // Redirect based on role
            if (profileData.role === 'admin') {
                router.push('/admin');
                return;
            }

            if (profileData.role !== 'tutor') {
                router.push('/tableau-de-bord');
                return;
            }

            setProfile(profileData);

            // Fetch assigned students
            const { data: assignmentsData } = await supabase
                .from('tutor_assignments')
                .select('student_id')
                .eq('tutor_id', user.id);

            if (assignmentsData && assignmentsData.length > 0) {
                const studentIds = assignmentsData.map(a => a.student_id);

                // Fetch student profiles
                const { data: studentsData } = await supabase
                    .from('profiles')
                    .select('id, email')
                    .in('id', studentIds);

                // Fetch inscriptions for student names
                const { data: inscriptionsData } = await supabase
                    .from('inscriptions')
                    .select('user_id, student_name, phone, service')
                    .in('user_id', studentIds);

                if (studentsData) {
                    const studentsWithInfo = studentsData.map(s => ({
                        ...s,
                        inscription: inscriptionsData?.find(i => i.user_id === s.id)
                    }));
                    setAssignedStudents(studentsWithInfo);
                }
            }

            // Fetch sessions
            const { data: sessionsData } = await supabase
                .from('tutoring_sessions')
                .select('*')
                .eq('tutor_id', user.id)
                .order('session_date', { ascending: true });

            if (sessionsData) {
                setSessions(sessionsData);
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

    // Calendar helpers
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const days: (number | null)[] = [];
        for (let i = 0; i < startingDay; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    };

    const getSessionsForDay = (day: number) => {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return sessions.filter(s => s.session_date === dateStr);
    };

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    const monthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    const navigateMonth = (direction: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
    };

    const openCreateModal = (date?: string) => {
        setEditingSession(null);
        setFormData({
            student_id: assignedStudents[0]?.id || '',
            title: '',
            session_date: date || new Date().toISOString().split('T')[0],
            start_time: '09:00',
            end_time: '10:00',
            notes: ''
        });
        setShowModal(true);
    };

    const openEditModal = (session: TutoringSession) => {
        setEditingSession(session);
        setFormData({
            student_id: session.student_id,
            title: session.title,
            session_date: session.session_date,
            start_time: session.start_time.substring(0, 5),
            end_time: session.end_time.substring(0, 5),
            notes: session.notes || ''
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        const supabase = createClient();

        if (editingSession) {
            // Update
            const { error } = await supabase
                .from('tutoring_sessions')
                .update({
                    student_id: formData.student_id,
                    title: formData.title,
                    session_date: formData.session_date,
                    start_time: formData.start_time,
                    end_time: formData.end_time,
                    notes: formData.notes,
                    updated_at: new Date().toISOString()
                })
                .eq('id', editingSession.id);

            if (!error) {
                setSessions(sessions.map(s =>
                    s.id === editingSession.id
                        ? { ...s, ...formData, updated_at: new Date().toISOString() }
                        : s
                ));
                setShowModal(false);
            } else {
                alert('Erreur: ' + error.message);
            }
        } else {
            // Create
            const { data, error } = await supabase
                .from('tutoring_sessions')
                .insert({
                    tutor_id: profile.id,
                    student_id: formData.student_id,
                    title: formData.title,
                    session_date: formData.session_date,
                    start_time: formData.start_time,
                    end_time: formData.end_time,
                    notes: formData.notes,
                    status: 'scheduled'
                })
                .select()
                .single();

            if (!error && data) {
                setSessions([...sessions, data]);
                setShowModal(false);
            } else {
                alert('Erreur: ' + (error?.message || 'Unknown error'));
            }
        }
    };

    const deleteSession = async (sessionId: string) => {
        if (!confirm('Supprimer cette séance?')) return;

        const supabase = createClient();
        const { error } = await supabase
            .from('tutoring_sessions')
            .delete()
            .eq('id', sessionId);

        if (!error) {
            setSessions(sessions.filter(s => s.id !== sessionId));
        } else {
            alert('Erreur: ' + error.message);
        }
    };

    const updateSessionStatus = async (sessionId: string, status: 'scheduled' | 'completed' | 'cancelled') => {
        const supabase = createClient();
        const { error } = await supabase
            .from('tutoring_sessions')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', sessionId);

        if (!error) {
            setSessions(sessions.map(s =>
                s.id === sessionId ? { ...s, status } : s
            ));
        }
    };

    const togglePaymentStatus = async (sessionId: string, currentStatus: boolean) => {
        const supabase = createClient();
        const { error } = await supabase
            .from('tutoring_sessions')
            .update({ is_paid: !currentStatus, updated_at: new Date().toISOString() })
            .eq('id', sessionId);

        if (!error) {
            setSessions(sessions.map(s =>
                s.id === sessionId ? { ...s, is_paid: !currentStatus } : s
            ));
        }
    };

    const getStudentName = (studentId: string) => {
        const student = assignedStudents.find(s => s.id === studentId);
        return student?.inscription?.student_name || student?.email || 'Étudiant inconnu';
    };

    const getStudentService = (studentId: string) => {
        const student = assignedStudents.find(s => s.id === studentId);
        const service = student?.inscription?.service || 'N/A';
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
        <main className="tutor-page">
            <nav className="dashboard-nav">
                <Link href="/" className="nav-logo">
                    <Image src="/logo.jpg" alt="Tuto+" width={40} height={40} style={{ borderRadius: '8px' }} />
                    Tuto+ Tuteur
                </Link>
                <button onClick={handleLogout} className="btn btn-secondary">
                    Déconnexion
                </button>
            </nav>

            <div className="tutor-container">
                <div className="tutor-header">
                    <h1>Tableau de bord Tuteur</h1>
                    <p>Bienvenue, {profile?.email}</p>
                </div>

                <div className="tutor-content">
                    {/* Assigned Students */}
                    <div className="tutor-section students-section">
                        <div className="section-header-row">
                            <h2>Mes Étudiants ({assignedStudents.length})</h2>
                        </div>
                        {assignedStudents.length === 0 ? (
                            <div className="empty-state">
                                <p>Aucun étudiant assigné pour le moment.</p>
                                <p style={{ fontSize: '0.9rem', color: '#666' }}>L'administrateur doit vous assigner des étudiants.</p>
                            </div>
                        ) : (
                            <div className="students-grid">
                                {assignedStudents.map(student => (
                                    <div key={student.id} className="student-card">
                                        <div className="student-avatar">
                                            {(student.inscription?.student_name || student.email)[0].toUpperCase()}
                                        </div>
                                        <div className="student-info">
                                            <h3>{student.inscription?.student_name || 'Sans nom'}</h3>
                                            <div className="student-contact">
                                                <a href={`mailto:${student.email}`} className="contact-link">
                                                    📧 {student.email}
                                                </a>
                                                {student.inscription?.phone && (
                                                    <a href={`tel:${student.inscription.phone}`} className="contact-link">
                                                        📞 {student.inscription.phone}
                                                    </a>
                                                )}
                                            </div>
                                            {student.inscription && (
                                                <span className="student-service">{student.inscription.service}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Calendar */}
                    <div className="tutor-section calendar-section">
                        <div className="section-header-row">
                            <h2>Calendrier</h2>
                            <button
                                className="btn btn-primary"
                                onClick={() => openCreateModal()}
                                disabled={assignedStudents.length === 0}
                            >
                                + Créer une séance
                            </button>
                        </div>

                        <div className="calendar-nav">
                            <button onClick={() => navigateMonth(-1)} className="calendar-nav-btn">
                                ← Précédent
                            </button>
                            <h3>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
                            <button onClick={() => navigateMonth(1)} className="calendar-nav-btn">
                                Suivant →
                            </button>
                        </div>

                        <div className="calendar-grid">
                            <div className="calendar-header">
                                <span>Dim</span>
                                <span>Lun</span>
                                <span>Mar</span>
                                <span>Mer</span>
                                <span>Jeu</span>
                                <span>Ven</span>
                                <span>Sam</span>
                            </div>
                            <div className="calendar-days">
                                {getDaysInMonth(currentDate).map((day, idx) => (
                                    <div
                                        key={idx}
                                        className={`calendar-day ${day ? 'has-date' : 'empty'} ${day && getSessionsForDay(day).length > 0 ? 'has-sessions' : ''
                                            }`}
                                        onClick={() => {
                                            if (day && assignedStudents.length > 0) {
                                                const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                                openCreateModal(dateStr);
                                            }
                                        }}
                                    >
                                        {day && (
                                            <>
                                                <span className="day-number">{day}</span>
                                                <div className="day-sessions">
                                                    {getSessionsForDay(day).map(session => (
                                                        <div
                                                            key={session.id}
                                                            className="session-dot"
                                                            style={{ backgroundColor: sessionStatusColors[session.status] }}
                                                            title={`${session.title} - ${formatTime(session.start_time)}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openEditModal(session);
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Sessions */}
                    <div className="tutor-section sessions-section">
                        <h2>Prochaines Séances</h2>
                        {sessions.filter(s => s.status === 'scheduled').length === 0 ? (
                            <div className="empty-state">
                                <p>Aucune séance planifiée.</p>
                            </div>
                        ) : (
                            <div className="sessions-list">
                                {sessions
                                    .filter(s => s.status === 'scheduled')
                                    .sort((a, b) => a.session_date.localeCompare(b.session_date))
                                    .map(session => (
                                        <div key={session.id} className="session-card">
                                            <div className="session-date-col">
                                                <span className="session-day">
                                                    {new Date(session.session_date + 'T00:00:00').toLocaleDateString('fr-CA', { day: 'numeric' })}
                                                </span>
                                                <span className="session-month">
                                                    {new Date(session.session_date + 'T00:00:00').toLocaleDateString('fr-CA', { month: 'short' })}
                                                </span>
                                            </div>
                                            <div className="session-info">
                                                <h4>{session.title}</h4>
                                                <p>{getStudentName(session.student_id)}</p>
                                                <div className="session-meta">
                                                    <span className="session-time">
                                                        {formatTime(session.start_time)} - {formatTime(session.end_time)}
                                                    </span>
                                                    <span className="session-forfait">{getStudentService(session.student_id)}</span>
                                                </div>
                                            </div>
                                            <div className="session-actions">
                                                <button
                                                    onClick={() => updateSessionStatus(session.id, 'completed')}
                                                    className="action-btn complete-btn"
                                                    title="Marquer comme complétée"
                                                >
                                                    ✓
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(session)}
                                                    className="action-btn edit-btn"
                                                    title="Modifier"
                                                >
                                                    ✎
                                                </button>
                                                <button
                                                    onClick={() => deleteSession(session.id)}
                                                    className="action-btn delete-btn"
                                                    title="Supprimer"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => togglePaymentStatus(session.id, session.is_paid)}
                                                className={`payment-badge ${session.is_paid ? 'paid' : 'unpaid'}`}
                                                title="Cliquer pour changer le statut de paiement"
                                            >
                                                {session.is_paid ? '✓ Payée' : 'Non payée'}
                                            </button>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>

                    {/* Completed Sessions */}
                    <div className="tutor-section sessions-section completed-section">
                        <h2>Séances Complétées ({sessions.filter(s => s.status === 'completed').length})</h2>
                        {sessions.filter(s => s.status === 'completed').length === 0 ? (
                            <div className="empty-state">
                                <p>Aucune séance complétée.</p>
                            </div>
                        ) : (
                            <div className="sessions-list">
                                {sessions
                                    .filter(s => s.status === 'completed')
                                    .sort((a, b) => b.session_date.localeCompare(a.session_date))
                                    .map(session => (
                                        <div key={session.id} className="session-card completed">
                                            <div className="session-date-col completed-date">
                                                <span className="session-day">
                                                    {new Date(session.session_date + 'T00:00:00').toLocaleDateString('fr-CA', { day: 'numeric' })}
                                                </span>
                                                <span className="session-month">
                                                    {new Date(session.session_date + 'T00:00:00').toLocaleDateString('fr-CA', { month: 'short' })}
                                                </span>
                                            </div>
                                            <div className="session-info">
                                                <h4>{session.title}</h4>
                                                <p>{getStudentName(session.student_id)}</p>
                                                <div className="session-meta">
                                                    <span className="session-time">
                                                        {formatTime(session.start_time)} - {formatTime(session.end_time)}
                                                    </span>
                                                    <span className="session-forfait">{getStudentService(session.student_id)}</span>
                                                </div>
                                            </div>
                                            <div className="session-badges">
                                                <div className="completed-badge">
                                                    ✓ Complétée
                                                </div>
                                                <button
                                                    onClick={() => togglePaymentStatus(session.id, session.is_paid)}
                                                    className={`payment-badge ${session.is_paid ? 'paid' : 'unpaid'}`}
                                                    title="Cliquer pour changer le statut de paiement"
                                                >
                                                    {session.is_paid ? '✓ Payée' : 'Non payée'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>{editingSession ? 'Modifier la séance' : 'Créer une séance'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Étudiant</label>
                                <select
                                    value={formData.student_id}
                                    onChange={e => setFormData({ ...formData, student_id: e.target.value })}
                                    required
                                >
                                    {assignedStudents.map(student => (
                                        <option key={student.id} value={student.id}>
                                            {student.inscription?.student_name || student.email}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Titre</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Ex: Mathématiques - Algèbre"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Date</label>
                                <input
                                    type="date"
                                    value={formData.session_date}
                                    onChange={e => setFormData({ ...formData, session_date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Heure début</label>
                                    <input
                                        type="time"
                                        value={formData.start_time}
                                        onChange={e => setFormData({ ...formData, start_time: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Heure fin</label>
                                    <input
                                        type="time"
                                        value={formData.end_time}
                                        onChange={e => setFormData({ ...formData, end_time: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Notes (optionnel)</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Notes pour la séance..."
                                    rows={3}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Annuler
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingSession ? 'Enregistrer' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
