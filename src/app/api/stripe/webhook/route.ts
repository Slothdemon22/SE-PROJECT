import { NextRequest, NextResponse } from 'next/server'
import { stripe, STRIPE_CONFIG } from '@/lib/stripe/config'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_CONFIG.webhookSecret
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId

  if (!userId) {
    console.error('No userId in session metadata')
    return
  }

  await createBillingNotification(
    userId,
    'Subscription Activated',
    'Your subscription has been successfully activated.',
    '/billing'
  )
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId

  if (!userId) {
    console.error('No userId in subscription metadata')
    return
  }

  await createBillingNotification(
    userId,
    'Subscription Updated',
    `Your subscription is now ${subscription.status}.`,
    '/billing'
  )
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId
  if (!userId) return
  await createBillingNotification(
    userId,
    'Subscription Canceled',
    'Your subscription has been canceled.',
    '/billing'
  )
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const userId = invoice.metadata?.userId

  if (!userId) return

  await createBillingNotification(
    userId,
    'Payment Received',
    `Invoice ${invoice.number ?? invoice.id} has been paid successfully.`,
    '/billing'
  )
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const userId = invoice.metadata?.userId

  if (!userId) return

  await createBillingNotification(
    userId,
    'Payment Failed',
    'Your payment failed. Please update your payment method.',
    '/billing'
  )
}

async function createBillingNotification(
  userId: string,
  title: string,
  content: string,
  link: string
) {
  const profile = await prisma.profile.findFirst({
    where: {
      OR: [{ id: userId }, { userId }],
    },
    select: { id: true },
  })

  if (!profile) return

  await prisma.notification.create({
    data: {
      userId: profile.id,
      type: 'PAYMENT',
      title,
      content,
      link,
    },
  })
}





