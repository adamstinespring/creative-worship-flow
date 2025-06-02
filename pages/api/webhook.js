import Stripe from 'stripe';
import { buffer } from 'micro';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      // Update user subscription status
      if (session.metadata.userId) {
        await updateDoc(doc(db, 'users', session.metadata.userId), {
          is_subscribed: true,
          stripe_customer_id: session.customer,
          subscription_id: session.subscription,
        });
      }
      break;

    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      
      // Find user by stripe customer ID and update subscription status
      // In production, you'd query Firestore to find the user
      // For now, we'll assume you have the user ID in metadata
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
}
