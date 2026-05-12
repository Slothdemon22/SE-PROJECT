'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CallRequest, Job, Profile } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/toast'
import { Video, Calendar, Clock, CheckCircle2, XCircle, Loader2, User, Briefcase, MessageSquare, Copy, ExternalLink } from 'lucide-react'

interface CallRequestWithRelations extends CallRequest {
  job: Job & {
    createdBy: {
      id: string
      fullName: string | null
      avatarUrl: string | null
    }
  }
  requester: Pick<Profile, 'id' | 'fullName' | 'email' | 'avatarUrl' | 'department' | 'year'>
  receiver: Pick<Profile, 'id' | 'fullName' | 'email' | 'avatarUrl' | 'department' | 'year'>
  application: {
    id: string
    status: string
  } | null
}

interface VideoCallsClientProps {
  sentRequests: CallRequestWithRelations[]
  receivedRequests: CallRequestWithRelations[]
  currentUserId: string
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  ACCEPTED: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  REJECTED: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
  COMPLETED: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
  CANCELLED: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
}

export function VideoCallsClient({ sentRequests: initialSent, receivedRequests: initialReceived }: VideoCallsClientProps) {
  const router = useRouter()
  const toast = useToast()
  const [sentRequests] = useState(initialSent)
  const [receivedRequests] = useState(initialReceived)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [scheduledTimes, setScheduledTimes] = useState<Record<string, string>>({})
  const [rejectReasons, setRejectReasons] = useState<Record<string, string>>({})
  const [showRejectForm, setShowRejectForm] = useState<string | null>(null)

  const handleAccept = async (requestId: string) => {
    setActionLoading(requestId)
    try {
      const response = await fetch(`/api/call-requests/${requestId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduledTime: scheduledTimes[requestId] || null }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to accept request')
      }

      toast.success('Video call request accepted')
      router.refresh()
      setShowRejectForm(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to accept request')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (requestId: string) => {
    setActionLoading(requestId)
    try {
      const response = await fetch(`/api/call-requests/${requestId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectReason: rejectReasons[requestId] || null }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to reject request')
      }

      toast.success('Video call request declined')
      router.refresh()
      setShowRejectForm(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to reject request')
    } finally {
      setActionLoading(null)
    }
  }

  const renderCallRequestCard = (request: CallRequestWithRelations, isSent: boolean) => {
    const otherUser = isSent ? request.receiver : request.requester
    const canJoin = request.status === 'ACCEPTED' && request.roomId
    const callUrl = typeof window === 'undefined' ? `/video-call/${request.id}` : `${window.location.origin}/video-call/${request.id}`

    return (
      <article key={request.id} className="surface-card space-y-4 p-5 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {otherUser.avatarUrl ? (
              <img src={otherUser.avatarUrl} alt={otherUser.fullName || 'User'} className="h-11 w-11 rounded-lg border border-white/10 object-cover" />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-slate-800">
                <User className="h-5 w-5 text-slate-300" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-white">{otherUser.fullName || 'Anonymous User'}</h3>
              <p className="truncate text-sm text-slate-400">
                {otherUser.department && otherUser.year ? `${otherUser.department} - ${otherUser.year}` : otherUser.email}
              </p>
            </div>
          </div>
          <Badge className={STATUS_STYLES[request.status] || STATUS_STYLES.PENDING}>{request.status}</Badge>
        </div>

        <div className="surface-card-muted flex items-center gap-2 p-3">
          <Briefcase className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="truncate text-sm text-slate-200">{request.job.title}</span>
        </div>

        {request.message && (
          <div className="surface-card-muted p-3">
            <p className="mb-1 text-xs uppercase tracking-wide text-slate-500">Message</p>
            <div className="flex items-start gap-2">
              <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
              <p className="text-sm text-slate-300">{request.message}</p>
            </div>
          </div>
        )}

        <div className="grid gap-2 text-sm text-slate-400">
          {request.requestedTime && (
            <p className="inline-flex items-center gap-2"><Calendar className="h-4 w-4" />Preferred: {new Date(request.requestedTime).toLocaleString()}</p>
          )}
          {request.scheduledTime && (
            <p className="inline-flex items-center gap-2 text-emerald-300"><Clock className="h-4 w-4" />Scheduled: {new Date(request.scheduledTime).toLocaleString()}</p>
          )}
          <p className="inline-flex items-center gap-2"><Clock className="h-4 w-4" />Requested: {new Date(request.createdAt).toLocaleString()}</p>
        </div>

        {!isSent && request.status === 'PENDING' && (
          <div className="space-y-3 border-t border-white/10 pt-2">
            <Input
              type="datetime-local"
              value={scheduledTimes[request.id] || ''}
              onChange={(e) => setScheduledTimes((prev) => ({ ...prev, [request.id]: e.target.value }))}
              min={new Date().toISOString().slice(0, 16)}
              className="border-white/10 bg-slate-950/60 text-white"
            />
            <Button onClick={() => handleAccept(request.id)} disabled={actionLoading === request.id} className="w-full bg-emerald-600 text-white hover:bg-emerald-700">
              {actionLoading === request.id ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Accepting...</> : <><CheckCircle2 className="mr-2 h-4 w-4" />Accept Request</>}
            </Button>

            {showRejectForm === request.id ? (
              <div className="space-y-2">
                <textarea
                  value={rejectReasons[request.id] || ''}
                  onChange={(e) => setRejectReasons((prev) => ({ ...prev, [request.id]: e.target.value }))}
                  className="min-h-[88px] w-full rounded-lg border border-white/10 bg-slate-950/60 p-3 text-sm text-white"
                  placeholder="Optional reason for decline"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={() => handleReject(request.id)} disabled={actionLoading === request.id} variant="destructive">
                    {actionLoading === request.id ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Declining...</> : 'Confirm Decline'}
                  </Button>
                  <Button onClick={() => setShowRejectForm(null)} variant="outline" className="border-white/10 text-slate-200 hover:bg-white/5">Cancel</Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setShowRejectForm(request.id)} variant="outline" className="w-full border-rose-500/30 text-rose-300 hover:bg-rose-500/10">
                <XCircle className="mr-2 h-4 w-4" />Decline Request
              </Button>
            )}
          </div>
        )}

        {canJoin && (
          <div className="space-y-3 border-t border-white/10 pt-2">
            <div className="surface-card-muted space-y-2 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Video Link</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={callUrl}
                  readOnly
                  suppressHydrationWarning
                  className="flex-1 rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 font-mono text-xs text-slate-200"
                  onClick={(e) => e.currentTarget.select()}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-white/10 text-slate-200 hover:bg-white/5"
                  onClick={() => {
                    navigator.clipboard.writeText(callUrl)
                    toast.success('Link copied to clipboard')
                  }}
                >
                  <Copy className="mr-1 h-3.5 w-3.5" />Copy
                </Button>
              </div>
            </div>
            <Button onClick={() => window.open(`/video-call/${request.id}`, '_blank', 'noopener,noreferrer')} className="w-full bg-blue-600 text-white hover:bg-blue-700">
              <Video className="mr-2 h-4 w-4" />Join Video Call<ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {request.status === 'REJECTED' && request.rejectReason && (
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">
            <strong>Decline reason:</strong> {request.rejectReason}
          </div>
        )}
      </article>
    )
  }

  return (
    <div className="page-shell max-w-[1240px] space-y-6 text-slate-100">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-semibold text-white md:text-5xl">Video Interview Requests</h1>
        <p className="text-slate-400">Review requests, schedule interviews, and join calls quickly.</p>
      </div>

      <Tabs defaultValue="received" className="w-full">
        <TabsList className="grid w-full grid-cols-2 border border-white/10 bg-slate-900/70">
          <TabsTrigger value="received">Received ({receivedRequests.length})</TabsTrigger>
          <TabsTrigger value="sent">Sent ({sentRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="mt-6">
          {receivedRequests.length === 0 ? (
            <div className="surface-card p-12 text-center">
              <Video className="mx-auto mb-3 h-10 w-10 text-slate-500" />
              <h3 className="text-xl font-semibold text-white">No received requests</h3>
              <p className="mt-1 text-slate-400">When candidates request interviews, they will appear here.</p>
            </div>
          ) : (
            <div className="grid gap-4">{receivedRequests.map((request) => renderCallRequestCard(request, false))}</div>
          )}
        </TabsContent>

        <TabsContent value="sent" className="mt-6">
          {sentRequests.length === 0 ? (
            <div className="surface-card p-12 text-center">
              <Video className="mx-auto mb-3 h-10 w-10 text-slate-500" />
              <h3 className="text-xl font-semibold text-white">No sent requests</h3>
              <p className="mt-1 text-slate-400">You can request interviews from job detail pages.</p>
            </div>
          ) : (
            <div className="grid gap-4">{sentRequests.map((request) => renderCallRequestCard(request, true))}</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
