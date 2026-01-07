import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
    const { userId, adminEmail } = await request.json();

    // Verify the request is from admin
    if (adminEmail !== 'tutoplus2025@gmail.com') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create admin client with service role key
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    try {
        // Delete from inscriptions first
        await supabaseAdmin.from('inscriptions').delete().eq('user_id', userId);

        // Delete from tutor_assignments
        await supabaseAdmin.from('tutor_assignments').delete().eq('student_id', userId);
        await supabaseAdmin.from('tutor_assignments').delete().eq('tutor_id', userId);

        // Delete from tutoring_sessions
        await supabaseAdmin.from('tutoring_sessions').delete().eq('student_id', userId);
        await supabaseAdmin.from('tutoring_sessions').delete().eq('tutor_id', userId);

        // Delete from profiles
        await supabaseAdmin.from('profiles').delete().eq('id', userId);

        // Delete the auth user (this frees up the email)
        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
