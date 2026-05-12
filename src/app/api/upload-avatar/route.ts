import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { uploadAvatar } from '@/lib/storage/avatars';
import { STORAGE_BUCKET_NAME } from '@/lib/storage/bucket';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Avatar upload auth failed:', {
        message: authError?.message || 'No authenticated user',
      })
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    });

    // During signup/create-profile flow, profile may not exist yet.
    // Fall back to auth user id so avatar upload still works.
    const storageOwnerId = profile?.id || user.id
    if (!profile) {
      console.warn('Avatar upload: profile not found, using auth user id fallback', {
        userId: user.id,
      })
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Upload to Supabase Storage using the same pattern as resumes
    let uploadResult
    try {
      uploadResult = await uploadAvatar(file, storageOwnerId)
    } catch (error) {
      console.error('Avatar storage upload error:', {
        userId: user.id,
        storageOwnerId,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        error: error instanceof Error ? error.message : error,
      })
      return NextResponse.json({ 
        error: 'Failed to upload file to storage. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 })
    }

    return NextResponse.json({ 
      url: uploadResult.publicUrl,
      storagePath: uploadResult.storagePath,
      message: 'Avatar uploaded successfully to Supabase Storage',
      storageLocation: `Bucket: ${STORAGE_BUCKET_NAME}/avatars, Path: ${uploadResult.storagePath}`
    });

  } catch (error) {
    console.error('Avatar upload route error:', error);
    return NextResponse.json(
      { error: 'Failed to upload avatar', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


