import { Router, type Request, type Response } from 'express';
import { env } from '../config/env.js';
import { processEpisodeAlerts } from '../jobs/episodeAlerts.js';

const router = Router();

router.post('/run-alerts', async (req: Request, res: Response) => {
  const auth = req.headers['authorization'];
  if (!auth || auth !== `Bearer ${env.CRON_SECRET}`) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  console.log('[Admin] Manual run-alerts triggered');
  processEpisodeAlerts().catch((err) => console.error('[Admin] run-alerts error:', err));
  res.json({ ok: true, message: 'Episode alerts job started' });
});

export default router;
