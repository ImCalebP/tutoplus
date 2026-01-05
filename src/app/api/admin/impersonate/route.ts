'use server';

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
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

    // First, get user by email
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
        return NextResponse.json({ error: listError.message }, { status: 400 });
    }

    const targetUser = users.users.find(u => u.email === userId);

    if (!targetUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate a magic link and extract the token
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: userId,
    });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // The hashed_token can be used to verify the OTP
    return NextResponse.json({
        link: data.properties?.action_link,
        token: data.properties?.hashed_token,
        email: userId
    });
}
