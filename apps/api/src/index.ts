import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'bunzimeal-api' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`[api] listening on :${port}`);
});
