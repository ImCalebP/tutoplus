import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}

// Helper types
export type UserRole = 'user' | 'admin' | 'tutor'
export type InscriptionStatus = 'en_attente' | 'approuve' | 'refuse'
export type ContactStatus = 'non_contacte' | 'contacte' | 'en_discussion' | 'finalise'

export interface Profile {
    id: string
    email: string
    role: UserRole
    created_at: string
}

export interface Inscription {
    id: string
    user_id: string
    parent_name: string
    student_name: string
    phone: string
    email: string
    service: string
    address: string
    mental_health?: string
    specifications?: string
    status: InscriptionStatus
    contact_status: ContactStatus
    created_at: string
    updated_at: string
}

// Status labels in French
export const statusLabels: Record<InscriptionStatus, string> = {
    en_attente: 'En attente',
    approuve: 'Approuvé',
    refuse: 'Refusé'
}

export const contactStatusLabels: Record<ContactStatus, string> = {
    non_contacte: 'Non contacté',
    contacte: 'Contacté',
    en_discussion: 'En discussion',
    finalise: 'Finalisé'
}

// Status colors
export const contactStatusColors: Record<ContactStatus, string> = {
    non_contacte: '#ef4444', // red
    contacte: '#f97316',     // orange
    en_discussion: '#eab308', // yellow
    finalise: '#22c55e'      // green
}

export const inscriptionStatusColors: Record<InscriptionStatus, string> = {
    en_attente: '#eab308',   // yellow
    approuve: '#22c55e',     // green
    refuse: '#ef4444'        // red
}

// Tutor-Student Session System Types
export type SessionStatus = 'scheduled' | 'completed' | 'facture_envoyee' | 'recu_envoye' | 'cancelled'

export interface TutorAssignment {
    id: string
    tutor_id: string
    student_id: string
    created_at: string
    // Joined data
    tutor?: Profile
    student?: Profile
}

export interface TutoringSession {
    id: string
    tutor_id: string
    student_id: string
    title: string
    session_date: string
    start_time: string
    end_time: string
    notes?: string
    status: SessionStatus
    is_paid: boolean
    created_at: string
    updated_at: string
    // Joined data
    tutor?: Profile
    student?: Profile
}

export const sessionStatusLabels: Record<SessionStatus, string> = {
    scheduled: 'Planifiée',
    completed: 'Complétée',
    facture_envoyee: 'Facture envoyée',
    recu_envoye: 'Reçu envoyé',
    cancelled: 'Annulée'
}

export const sessionStatusColors: Record<SessionStatus, string> = {
    scheduled: '#3b82f6',       // blue
    completed: '#22c55e',       // green
    facture_envoyee: '#f59e0b', // amber
    recu_envoye: '#8b5cf6',     // purple
    cancelled: '#ef4444'        // red
}
