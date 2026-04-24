import express from 'express';
import { createCheckoutSession } from '../controllers/payment.controller.js';
import { auth } from '../middleware/auth.middleware.js';

const router = express.Router();

// The checkout session route needs the parsed JSON body, which `app.use(express.json())` handles
router.post('/create-checkout-session', auth, createCheckoutSession);

// The webhook needs the raw Buffer, but we'll configure that separately in app.js
// Webhook logic is mounted directly in app.js due to body parser requirements

export default router;
