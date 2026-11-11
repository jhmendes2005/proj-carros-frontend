import type { NextApiRequest, NextApiResponse } from 'next';
import { handler } from '@carros/backend';

export const config = {
  api: { bodyParser: false, externalResolver: true },
  maxDuration: 300,
};

export default async function api(req: NextApiRequest, res: NextApiResponse) {
  try {
    await handler(req, res);
  } catch (error) {
    console.error('API initialization failed:', error instanceof Error ? error.message : 'Unknown error');
    if (!res.headersSent) res.status(500).json({ message: 'Erro ao inicializar a API' });
  }
}
