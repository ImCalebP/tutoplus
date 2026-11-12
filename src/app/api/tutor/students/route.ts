import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const respond = (body: unknown, status = 200) =>
        NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } });
    const token = request.headers.get('authorization')?.match(/^Bearer (.+)$/i)?.[1];
    if (!token) return respond({ error: 'Connexion requise.' }, 401);
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return respond({ error: 'Service temporairement indisponible.' }, 503);
    try {
        const admin = createClient(url, key, {
            auth: { autoRefreshToken: false, persistSession: false }
        });
        // Validate identity with Supabase, not a client-supplied user ID or role.
        const { data: auth, error: authError } = await admin.auth.getUser(token);
        if (authError || !auth.user) return respond({ error: 'Session invalide.' }, 401);
        const { data: profile, error: profileError } = await admin.from('profiles')
            .select('role').eq('id', auth.user.id).single();
        if (profileError) throw profileError;
        if (profile?.role !== 'tutor') return respond({ error: 'Accès réservé aux tuteurs.' }, 403);
        const { data: assignments, error: assignmentError } = await admin.from('tutor_assignments')
            .select('student_id').eq('tutor_id', auth.user.id);
        if (assignmentError) throw assignmentError;
        const ids = [...new Set((assignments || []).map(a => a.student_id))];
        if (!ids.length) return respond({ students: [] });
        // Only contact fields of assigned students; no health information.
        const { data: profiles, error: studentsError } = await admin.from('profiles')
            .select('id, email').in('id', ids);
        if (studentsError) throw studentsError;
        const { data: inscriptions, error: inscriptionError } = await admin.from('inscriptions')
            .select('user_id, student_name, parent_name, phone, email, address, service')
            .in('user_id', ids).order('created_at', { ascending: false });
        if (inscriptionError) throw inscriptionError;
        return respond({
            students: (profiles || []).map(student => ({
                ...student,
                inscription: inscriptions?.find(i => i.user_id === student.id) || null
            }))
        });
    } catch {
        return respond({ error: 'Impossible de charger les coordonnées des élèves. Réessayez plus tard.' }, 500);
    }
}
