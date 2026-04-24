import Stripe from 'stripe';
import User from '../models/user.model.js';
import dotenv from 'dotenv';
dotenv.config();

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is missing in backend .env");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

export const createCheckoutSession = async (req, res, next) => {
  try {
    const stripe = getStripe();
    const userId = req.user.id; // From requireAuth middleware

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      client_reference_id: userId, // CRITICAL: Links the payment to the MongoDB User
      success_url: `http://localhost:5173/dashboard?payment=success`,
      cancel_url: `http://localhost:5173/pricing?payment=cancelled`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

export const stripeWebhook = async (req, res) => {
  const stripe = getStripe();
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    // Note: req.body MUST be the raw Buffer, not parsed JSON for Webhooks to verify successfully
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;
    const stripeCustomerId = session.customer;

    if (userId) {
      await User.findByIdAndUpdate(userId, {
        plan: 'pro',
        subscriptionStatus: 'active',
        stripeCustomerId: stripeCustomerId,
      });
      console.log(`User ${userId} successfully upgraded to PRO!`);
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).send();
};
