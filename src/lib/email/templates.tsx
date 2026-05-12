import { EMAIL_CONFIG } from './config'
import * as React from 'react'

// Type definitions for email props
interface WelcomeEmailProps {
  userName: string
}

interface SignupConfirmationEmailProps {
  userName: string
  confirmationLink: string
}

interface PasswordResetEmailProps {
  userName: string
  resetLink: string
}

interface JobApprovedEmailProps {
  userName: string
  jobTitle: string
  jobLink: string
}

interface JobRejectedEmailProps {
  userName: string
  jobTitle: string
  rejectionReason: string
}

interface ApplicationReceivedEmailProps {
  posterName: string
  applicantName: string
  jobTitle: string
  applicationLink: string
}

interface ApplicationStatusEmailProps {
  applicantName: string
  status: string
  jobTitle: string
  jobLink: string
}

interface VideoCallRequestEmailProps {
  receiverName: string
  requesterName: string
  jobTitle: string
  message: string
  callsLink: string
}

interface VideoCallAcceptedEmailProps {
  requesterName: string
  receiverName: string
  jobTitle: string
  videoCallLink: string
  scheduledTime: string | null
}

interface VideoCallRejectedEmailProps {
  requesterName: string
  jobTitle: string
  reason: string
}

interface PaymentSuccessEmailProps {
  userName: string
  jobTitle: string
  amount: number
  jobLink: string
}

interface JobFilledEmailProps {
  applicantName: string
  jobTitle: string
}

// Base HTML template with styling (for Resend)
const emailStyles = {
  body: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    lineHeight: '1.6',
    color: '#0f172a',
    backgroundColor: '#f1f5f9',
    margin: '0',
    padding: '24px 0',
  },
  container: {
    maxWidth: '640px',
    margin: '0 auto',
    background: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    boxShadow: '0 24px 48px rgba(15, 23, 42, 0.12)',
  },
  header: {
    background: 'linear-gradient(135deg, #0f172a, #1e293b)',
    padding: '28px 32px',
    textAlign: 'center' as const,
    color: 'white',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  content: {
    padding: '36px 32px',
    color: '#334155',
  },
  button: {
    display: 'inline-block',
    padding: '12px 24px',
    background: '#1d4ed8',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '14px',
    letterSpacing: '0.2px',
    margin: '18px 0',
    textAlign: 'center' as const,
    boxShadow: '0 8px 20px rgba(29, 78, 216, 0.3)',
  },
  footer: {
    background: '#f8fafc',
    padding: '22px 32px',
    textAlign: 'center' as const,
    color: '#64748b',
    fontSize: '13px',
    borderTop: '1px solid #e2e8f0',
  },
  highlight: {
    background: '#f8fafc',
    padding: '16px 18px',
    border: '1px solid #dbeafe',
    borderLeft: '4px solid #2563eb',
    borderRadius: '10px',
    margin: '18px 0',
  },
}

// Welcome Email Component
export function WelcomeEmail({ userName, appUrl }: WelcomeEmailProps & { appUrl?: string }) {
  const baseUrl = appUrl || process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '')
  const profileLink = `${baseUrl}/profile`
  
  return (
    <div style={emailStyles.body}>
      <div style={emailStyles.container}>
        <div style={emailStyles.header}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '600' }}>
            🎓 {EMAIL_CONFIG.appName}
          </h1>
        </div>
        <div style={emailStyles.content}>
          <h2 style={{ marginTop: 0, fontSize: '24px', color: '#0f172a' }}>Welcome to {EMAIL_CONFIG.appName}</h2>
          <p>Hi {userName},</p>
          <p>Thanks for joining. Your account is now active and ready.</p>
          
          <div style={emailStyles.highlight}>
            <p><strong>Get started in under 2 minutes:</strong></p>
            <ul>
              <li>Complete your profile for better matching</li>
              <li>Explore active opportunities</li>
              <li>Save roles and track applications in one place</li>
              <li>Connect with people relevant to your goals</li>
            </ul>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <a href={profileLink} style={emailStyles.button}>Complete Your Profile</a>
          </div>
          
          <p>If you need help, reply to this email and our team will assist you.</p>
          <p>Best regards,<br/>The {EMAIL_CONFIG.appName} Team</p>
        </div>
        <div style={emailStyles.footer}>
          <p>© 2025 {EMAIL_CONFIG.appName}. All rights reserved.</p>
          <p>Connect. Collaborate. Create.</p>
        </div>
      </div>
    </div>
  )
}

// Job Approved Email Component
export function JobApprovedEmail({ userName, jobTitle, jobLink }: JobApprovedEmailProps) {
  return (
    <div style={emailStyles.body}>
      <div style={emailStyles.container}>
        <div style={emailStyles.header}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '600' }}>
            🎓 {EMAIL_CONFIG.appName}
          </h1>
        </div>
        <div style={emailStyles.content}>
          <h2 style={{ marginTop: 0, color: '#059669', fontSize: '24px' }}>Your Job Is Live</h2>
          <p>Hi {userName},</p>
          <p>Your posting has been approved and is now visible to candidates.</p>
          
          <div style={emailStyles.highlight}>
            <p><strong>Job Details:</strong></p>
            <p style={{ fontSize: '18px', fontWeight: '600', color: '#1E3A8A' }}>{jobTitle}</p>
            <p>Your job is now visible to all users on the platform.</p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <a href={jobLink} style={emailStyles.button}>View Your Job</a>
          </div>
          
          <p><strong>Recommended next steps:</strong></p>
          <ul>
            <li>Review incoming applications promptly</li>
            <li>Shortlist top candidates early</li>
            <li>Schedule interviews with high-match applicants</li>
            <li>Mark the position as filled when you find the right match</li>
          </ul>
          
          <p>Good luck finding the perfect candidate!</p>
          <p>Best regards,<br/>The {EMAIL_CONFIG.appName} Team</p>
        </div>
        <div style={emailStyles.footer}>
          <p>© 2025 {EMAIL_CONFIG.appName}. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

// Job Rejected Email Component
export function JobRejectedEmail({ userName, jobTitle, rejectionReason, appUrl }: JobRejectedEmailProps & { appUrl?: string }) {
  const baseUrl = appUrl || process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '')
  
  return (
    <div style={emailStyles.body}>
      <div style={emailStyles.container}>
        <div style={emailStyles.header}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '600' }}>
            🎓 {EMAIL_CONFIG.appName}
          </h1>
        </div>
        <div style={emailStyles.content}>
          <h2 style={{ color: '#DC2626' }}>❌ Job Posting Update</h2>
          <p>Hi {userName},</p>
          <p>We regret to inform you that your job posting could not be approved at this time.</p>
          
          <div style={emailStyles.highlight}>
            <p><strong>Job Title:</strong></p>
            <p style={{ fontSize: '18px', fontWeight: '600' }}>{jobTitle}</p>
            
            {rejectionReason && (
              <>
                <p><strong>Reason:</strong></p>
                <p>{rejectionReason}</p>
              </>
            )}
          </div>
          
          <p><strong>What You Can Do:</strong></p>
          <ul>
            <li>Review our posting guidelines</li>
            <li>Edit your job posting to address the concerns</li>
            <li>Resubmit for approval</li>
          </ul>
          
          <div style={{ textAlign: 'center' }}>
            <a href={`${baseUrl}/my-jobs`} style={emailStyles.button}>View My Jobs</a>
          </div>
          
          <p>If you have any questions about this decision, please contact our support team.</p>
          <p>Best regards,<br/>The {EMAIL_CONFIG.appName} Team</p>
        </div>
        <div style={emailStyles.footer}>
          <p>© 2025 {EMAIL_CONFIG.appName}. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

// Test Email Component
export function TestEmail() {
  return (
    <div style={emailStyles.body}>
      <div style={emailStyles.container}>
        <div style={emailStyles.header}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '600' }}>
            🎓 {EMAIL_CONFIG.appName}
          </h1>
        </div>
        <div style={emailStyles.content}>
          <h2>🧪 Test Email</h2>
          <p>This is a test email from {EMAIL_CONFIG.appName}!</p>
          
          <div style={emailStyles.highlight}>
            <p><strong>✅ Email System Status:</strong> Working Perfectly!</p>
            <p>Your email configuration is set up correctly.</p>
          </div>
          
          <p>If you received this email, your email service is configured correctly.</p>
          <p>Best regards,<br/>The {EMAIL_CONFIG.appName} Team</p>
        </div>
        <div style={emailStyles.footer}>
          <p>© 2025 {EMAIL_CONFIG.appName}. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

// Application Received Email Component
export function ApplicationReceivedEmail({ 
  posterName, 
  applicantName, 
  jobTitle, 
  applicationLink 
}: ApplicationReceivedEmailProps) {
  return (
    <div style={emailStyles.body}>
      <div style={emailStyles.container}>
        <div style={emailStyles.header}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '600' }}>
            🎓 {EMAIL_CONFIG.appName}
          </h1>
        </div>
        <div style={emailStyles.content}>
          <h2 style={{ marginTop: 0, fontSize: '24px', color: '#0f172a' }}>New Application Received</h2>
          <p>Hi {posterName},</p>
          <p>You have a new applicant waiting for review.</p>
          
          <div style={emailStyles.highlight}>
            <p><strong>Applicant:</strong> {applicantName}</p>
            <p><strong>Job:</strong> {jobTitle}</p>
            <p><strong>Status:</strong> <span style={{ color: '#D97706', fontWeight: '600' }}>Pending Review</span></p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <a href={applicationLink} style={emailStyles.button}>Review Application</a>
          </div>
          
          <p><strong>Suggested review flow:</strong></p>
          <ul>
            <li>Read proposal and resume</li>
            <li>Shortlist strong candidates</li>
            <li>Schedule interview if relevant</li>
            <li>Accept or reject applications</li>
          </ul>
          
          <p>Don't keep talented candidates waiting!</p>
          <p>Best regards,<br/>The {EMAIL_CONFIG.appName} Team</p>
        </div>
        <div style={emailStyles.footer}>
          <p>© 2025 {EMAIL_CONFIG.appName}. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

// Application Status Email Component
export function ApplicationStatusEmail({ 
  applicantName, 
  status, 
  jobTitle, 
  jobLink 
}: ApplicationStatusEmailProps) {
  const statusConfig: Record<string, { color: string; icon: string; message: string }> = {
    SHORTLISTED: {
      color: '#059669',
      icon: '⭐',
      message: 'Congratulations! You\'ve been shortlisted for the next round.'
    },
    ACCEPTED: {
      color: '#059669',
      icon: '🎉',
      message: 'Congratulations! Your application has been accepted!'
    },
    REJECTED: {
      color: '#DC2626',
      icon: '😔',
      message: 'Unfortunately, your application was not selected this time.'
    }
  }

  const config = statusConfig[status] || statusConfig.REJECTED

  return (
    <div style={emailStyles.body}>
      <div style={emailStyles.container}>
        <div style={emailStyles.header}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '600' }}>
            🎓 {EMAIL_CONFIG.appName}
          </h1>
        </div>
        <div style={emailStyles.content}>
          <h2 style={{ marginTop: 0, color: config.color, fontSize: '24px' }}>{config.icon} Application Update</h2>
          <p>Hi {applicantName},</p>
          <p>We have an update regarding your application.</p>
          
          <div style={emailStyles.highlight}>
            <p><strong>Job:</strong> {jobTitle}</p>
            <p><strong>Status:</strong> <span style={{ color: config.color, fontWeight: '600' }}>{status}</span></p>
            <p>{config.message}</p>
          </div>
          
          {status === 'ACCEPTED' && (
            <>
              <p><strong>🎊 Next Steps:</strong></p>
              <ul>
                <li>The job poster will contact you soon</li>
                <li>Check your dashboard for any messages</li>
                <li>Be ready for a potential video interview</li>
              </ul>
            </>
          )}
          
          {status === 'SHORTLISTED' && (
            <>
              <p><strong>📝 Next Steps:</strong></p>
              <ul>
                <li>Keep an eye on your notifications</li>
                <li>You may receive a video interview request</li>
                <li>Prepare to discuss your proposal</li>
              </ul>
            </>
          )}
          
          {status === 'REJECTED' && (
            <>
              <p><strong>Keep Going:</strong></p>
              <ul>
                <li>Don't give up! Keep applying to other opportunities</li>
                <li>Update your profile to showcase your skills</li>
                <li>Browse more jobs that match your interests</li>
              </ul>
            </>
          )}
          
          <div style={{ textAlign: 'center' }}>
            <a href={jobLink} style={emailStyles.button}>View Job Details</a>
          </div>
          
          <p>Best regards,<br/>The {EMAIL_CONFIG.appName} Team</p>
        </div>
        <div style={emailStyles.footer}>
          <p>© 2025 {EMAIL_CONFIG.appName}. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

// Video Call Request Email Component
export function VideoCallRequestEmail({ 
  receiverName, 
  requesterName, 
  jobTitle, 
  message, 
  callsLink 
}: VideoCallRequestEmailProps) {
  return (
    <div style={emailStyles.body}>
      <div style={emailStyles.container}>
        <div style={emailStyles.header}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '600' }}>
            🎓 {EMAIL_CONFIG.appName}
          </h1>
        </div>
        <div style={emailStyles.content}>
          <h2>📹 Video Interview Request</h2>
          <p>Hi {receiverName},</p>
          <p><strong>{requesterName}</strong> has requested a video interview with you!</p>
          
          <div style={emailStyles.highlight}>
            <p><strong>Job:</strong> {jobTitle}</p>
            {message && (
              <>
                <p><strong>Message:</strong></p>
                <p style={{ fontStyle: 'italic' }}>"{message}"</p>
              </>
            )}
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <a href={callsLink} style={emailStyles.button}>Review Request</a>
          </div>
          
          <p><strong>You can:</strong></p>
          <ul>
            <li>✅ Accept and schedule a time</li>
            <li>❌ Decline with an optional reason</li>
          </ul>
          
          <p>Video interviews are a great way to assess candidates quickly!</p>
          <p>Best regards,<br/>The {EMAIL_CONFIG.appName} Team</p>
        </div>
        <div style={emailStyles.footer}>
          <p>© 2025 {EMAIL_CONFIG.appName}. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

// Video Call Accepted Email Component
export function VideoCallAcceptedEmail({ 
  requesterName, 
  receiverName, 
  jobTitle, 
  videoCallLink, 
  scheduledTime 
}: VideoCallAcceptedEmailProps) {
  return (
    <div style={emailStyles.body}>
      <div style={emailStyles.container}>
        <div style={emailStyles.header}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '600' }}>
            🎓 {EMAIL_CONFIG.appName}
          </h1>
        </div>
        <div style={emailStyles.content}>
          <h2 style={{ color: '#059669' }}>✅ Video Interview Accepted!</h2>
          <p>Hi {requesterName},</p>
          <p>Great news! <strong>{receiverName}</strong> has accepted your video interview request.</p>
          
          <div style={emailStyles.highlight}>
            <p><strong>Job:</strong> {jobTitle}</p>
            {scheduledTime ? (
              <p><strong>🗓️ Scheduled Time:</strong> {new Date(scheduledTime).toLocaleString()}</p>
            ) : (
              <p>No specific time set - you can join anytime!</p>
            )}
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <a href={videoCallLink} style={emailStyles.button}>Join Video Call</a>
          </div>
          
          <p><strong>📝 Prepare for Your Interview:</strong></p>
          <ul>
            <li>Test your camera and microphone</li>
            <li>Review the job requirements</li>
            <li>Prepare questions about the role</li>
            <li>Find a quiet location with good lighting</li>
          </ul>
          
          <p><strong>Video Call Link:</strong></p>
          <p style={{ 
            background: '#f3f4f6', 
            padding: '12px', 
            borderRadius: '6px', 
            fontFamily: 'monospace', 
            wordBreak: 'break-all' 
          }}>
            {videoCallLink}
          </p>
          
          <p>Good luck with your interview!</p>
          <p>Best regards,<br/>The {EMAIL_CONFIG.appName} Team</p>
        </div>
        <div style={emailStyles.footer}>
          <p>© 2025 {EMAIL_CONFIG.appName}. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

// Video Call Rejected Email Component
export function VideoCallRejectedEmail({ 
  requesterName, 
  jobTitle, 
  reason,
  appUrl
}: VideoCallRejectedEmailProps & { appUrl?: string }) {
  const baseUrl = appUrl || process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '')
  
  return (
    <div style={emailStyles.body}>
      <div style={emailStyles.container}>
        <div style={emailStyles.header}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '600' }}>
            🎓 {EMAIL_CONFIG.appName}
          </h1>
        </div>
        <div style={emailStyles.content}>
          <h2 style={{ color: '#D97706' }}>Video Interview Update</h2>
          <p>Hi {requesterName},</p>
          <p>We wanted to let you know that your video interview request was declined.</p>
          
          <div style={emailStyles.highlight}>
            <p><strong>Job:</strong> {jobTitle}</p>
            {reason && <p><strong>Reason:</strong> {reason}</p>}
          </div>
          
          <p><strong>Don't be discouraged!</strong></p>
          <ul>
            <li>The job poster may have scheduling conflicts</li>
            <li>They might be reviewing other candidates first</li>
            <li>Your application is still under consideration</li>
          </ul>
          
          <div style={{ textAlign: 'center' }}>
            <a href={`${baseUrl}/my-applications`} style={emailStyles.button}>View My Applications</a>
          </div>
          
          <p>Keep applying and showcasing your talents!</p>
          <p>Best regards,<br/>The {EMAIL_CONFIG.appName} Team</p>
        </div>
        <div style={emailStyles.footer}>
          <p>© 2025 {EMAIL_CONFIG.appName}. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

// Payment Success Email Component
export function PaymentSuccessEmail({ 
  userName, 
  jobTitle, 
  amount, 
  jobLink 
}: PaymentSuccessEmailProps) {
  return (
    <div style={emailStyles.body}>
      <div style={emailStyles.container}>
        <div style={emailStyles.header}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '600' }}>
            🎓 {EMAIL_CONFIG.appName}
          </h1>
        </div>
        <div style={emailStyles.content}>
          <h2 style={{ color: '#059669' }}>💰 Payment Confirmed!</h2>
          <p>Hi {userName},</p>
          <p>Your payment has been successfully processed.</p>
          
          <div style={emailStyles.highlight}>
            <p><strong>Job:</strong> {jobTitle}</p>
            <p><strong>Amount:</strong> <span style={{ fontSize: '24px', fontWeight: '700', color: '#059669' }}>${amount}</span></p>
            <p><strong>Status:</strong> <span style={{ color: '#059669', fontWeight: '600' }}>Paid ✓</span></p>
          </div>
          
          <p><strong>What This Means:</strong></p>
          <ul>
            <li>Your job now displays the compensation amount</li>
            <li>Paid jobs get better visibility</li>
            <li>More attractive to quality candidates</li>
          </ul>
          
          <div style={{ textAlign: 'center' }}>
            <a href={jobLink} style={emailStyles.button}>View Your Job</a>
          </div>
          
          <p>Thank you for using our payment feature!</p>
          <p>Best regards,<br/>The {EMAIL_CONFIG.appName} Team</p>
        </div>
        <div style={emailStyles.footer}>
          <p>© 2025 {EMAIL_CONFIG.appName}. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

// Job Filled Email Component
export function JobFilledEmail({ 
  applicantName, 
  jobTitle,
  appUrl
}: JobFilledEmailProps & { appUrl?: string }) {
  const baseUrl = appUrl || process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '')
  
  return (
    <div style={emailStyles.body}>
      <div style={emailStyles.container}>
        <div style={emailStyles.header}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '600' }}>
            🎓 {EMAIL_CONFIG.appName}
          </h1>
        </div>
        <div style={emailStyles.content}>
          <h2>Position Filled</h2>
          <p>Hi {applicantName},</p>
          <p>We wanted to let you know that the position you applied for has been filled.</p>
          
          <div style={emailStyles.highlight}>
            <p><strong>Job:</strong> {jobTitle}</p>
            <p><strong>Status:</strong> Position Filled</p>
          </div>
          
          <p><strong>Keep Exploring:</strong></p>
          <ul>
            <li>Browse more opportunities on our platform</li>
            <li>Update your skills and experience</li>
            <li>Network with other students</li>
          </ul>
          
          <div style={{ textAlign: 'center' }}>
            <a href={`${baseUrl}/jobs`} style={emailStyles.button}>Browse More Jobs</a>
          </div>
          
          <p>Best regards,<br/>The {EMAIL_CONFIG.appName} Team</p>
        </div>
        <div style={emailStyles.footer}>
          <p>© 2025 {EMAIL_CONFIG.appName}. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

// Signup Confirmation Email Component
export function SignupConfirmationEmail({ userName, confirmationLink }: SignupConfirmationEmailProps) {
  return (
    <div style={emailStyles.body}>
      <div style={emailStyles.container}>
        <div style={emailStyles.header}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '600' }}>
            🎓 {EMAIL_CONFIG.appName}
          </h1>
        </div>
        <div style={emailStyles.content}>
          <h2>Verify your email address</h2>
          <p>Hi {userName},</p>
          <p>Welcome to {EMAIL_CONFIG.appName}! Please verify your email address to get started.</p>
          
          <div style={{ textAlign: 'center' }}>
            <a href={confirmationLink} style={emailStyles.button}>Verify Email</a>
          </div>
          
          <p>If you didn't create an account, you can safely ignore this email.</p>
          <p>Best regards,<br/>The {EMAIL_CONFIG.appName} Team</p>
        </div>
        <div style={emailStyles.footer}>
          <p>© 2025 {EMAIL_CONFIG.appName}. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

// Password Reset Email Component
export function PasswordResetEmail({ userName, resetLink }: PasswordResetEmailProps) {
  return (
    <div style={emailStyles.body}>
      <div style={emailStyles.container}>
        <div style={emailStyles.header}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '600' }}>
            🎓 {EMAIL_CONFIG.appName}
          </h1>
        </div>
        <div style={emailStyles.content}>
          <h2>Reset your password</h2>
          <p>Hi {userName},</p>
          <p>Someone recently requested a password change for your {EMAIL_CONFIG.appName} account. If this was you, you can set a new password here:</p>
          
          <div style={{ textAlign: 'center' }}>
            <a href={resetLink} style={emailStyles.button}>Reset Password</a>
          </div>
          
          <p>If you don't want to change your password or didn't request this, just ignore and delete this message.</p>
          <p>Best regards,<br/>The {EMAIL_CONFIG.appName} Team</p>
        </div>
        <div style={emailStyles.footer}>
          <p>© 2025 {EMAIL_CONFIG.appName}. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
