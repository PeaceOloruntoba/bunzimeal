import { toast as sonnerToast } from 'sonner';

const recent = new Map<string, number>();
const DEDUPE_MS = 3000;

function shouldShow(msg: string) {
  const now = Date.now();
  const prev = recent.get(msg);
  if (prev && now - prev < DEDUPE_MS) return false;
  recent.set(msg, now);
  // cleanup old entries
  for (const [k, t] of recent.entries()) {
    if (now - t > DEDUPE_MS * 3) recent.delete(k);
  }
  return true;
}

export const toast = {
  success: (msg: string) => { if (shouldShow(msg)) sonnerToast.success(msg); },
  error: (msg: string) => { if (shouldShow(msg)) sonnerToast.error(msg); },
  info: (msg: string) => { if (shouldShow(msg)) sonnerToast.info(msg); },
  clear: () => sonnerToast.dismiss(),
};

export default toast;
