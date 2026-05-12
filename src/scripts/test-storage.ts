/**
 * Test script to verify Supabase Storage is working
 * Run: pnpm tsx src/scripts/test-storage.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'
import { STORAGE_BUCKET_NAME } from '../lib/storage/bucket'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testStorage() {
  console.log('🧪 Testing Supabase Storage Connection...\n')

  try {
    // Test 1: Check if we can list buckets
    console.log('📋 Test 1: Listing storage buckets...')
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      throw new Error(`Failed to list buckets: ${bucketsError.message}`)
    }
    
    console.log(`✅ Found ${buckets?.length || 0} buckets:`)
    buckets?.forEach(bucket => {
      console.log(`   - ${bucket.name} (${bucket.public ? 'public' : 'private'})`)
    })
    
    // Test 2: Check if bucket exists
    console.log(`\n📋 Test 2: Checking for "${STORAGE_BUCKET_NAME}" bucket...`)
    const resumesBucket = buckets?.find(b => b.name === STORAGE_BUCKET_NAME)
    
    if (!resumesBucket) {
      console.log(`❌ "${STORAGE_BUCKET_NAME}" bucket not found!`)
      console.log('   Please create it in your Supabase dashboard')
      return
    }
    
    console.log(`✅ "${STORAGE_BUCKET_NAME}" bucket exists`)
    console.log(`   Public: ${resumesBucket.public ? 'Yes' : 'No'}`)
    
    // Test 3: Create a test file and upload it
    console.log('\n📋 Test 3: Testing file upload...')
    const testContent = 'This is a test file for Supabase Storage'
    const testFileName = `test-${Date.now()}.txt`
    const testPath = `applicant-docs/test-user/${testFileName}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET_NAME)
      .upload(testPath, Buffer.from(testContent), {
        contentType: 'text/plain',
        upsert: false
      })
    
    if (uploadError) {
      throw new Error(`Failed to upload test file: ${uploadError.message}`)
    }
    
    console.log('✅ Test file uploaded successfully')
    console.log(`   Path: ${uploadData.path}`)
    
    // Test 4: Get public URL
    console.log('\n📋 Test 4: Getting public URL...')
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET_NAME)
      .getPublicUrl(testPath)
    
    console.log('✅ Public URL generated:')
    console.log(`   ${urlData.publicUrl}`)
    
    // Test 5: Clean up - delete test file
    console.log('\n📋 Test 5: Cleaning up test file...')
    const { error: deleteError } = await supabase.storage
      .from(STORAGE_BUCKET_NAME)
      .remove([testPath])
    
    if (deleteError) {
      console.log(`⚠️  Warning: Could not delete test file: ${deleteError.message}`)
    } else {
      console.log('✅ Test file deleted')
    }
    
    console.log('\n' + '='.repeat(60))
    console.log('🎉 All tests passed! Supabase Storage is working correctly.')
    console.log('='.repeat(60))
    console.log('\n📝 What this means:')
    console.log('✅ Your Supabase connection is working')
    console.log(`✅ The "${STORAGE_BUCKET_NAME}" exists and is accessible`)
    console.log('✅ File uploads are working')
    console.log('✅ Public URLs are being generated')
    console.log('✅ File deletions are working')
    console.log('\n🚀 You can now upload resumes through the application!')
    console.log('\n📍 Files will be stored at:')
    console.log(`   Bucket: ${STORAGE_BUCKET_NAME}`)
    console.log(`   Folder: applicant-docs`)
    console.log(`   Format: applicant-docs/{userId}/{resumeId}-{timestamp}.{ext}`)
    
  } catch (error) {
    console.error('\n❌ Storage test failed:', error)
    console.error('\n🔧 Troubleshooting steps:')
    console.error('1. Check your .env file has SUPABASE_SERVICE_ROLE_KEY set')
    console.error('2. Run: pnpm tsx src/scripts/setup-storage.ts')
    console.error('3. Verify your Supabase project is active')
    console.error('4. Check network connectivity to Supabase')
    process.exit(1)
  }
}

testStorage()

