import express from 'express';

import { runAsync } from '@util/helpers';
import { handleStripeWebhook } from '@util/webhooks';

export const router = express.Router({
	strict: true
});

/**
 * Stripe Webhooks
 */
router.post('/stripe', runAsync(handleStripeWebhook));

export default router;
