export function handleError(e: any, options?: { fallbackMessage?: string }) {
  const fallback = options?.fallbackMessage || "An error occurred";
  const msg = e?.response?.data?.errorMessage
    || e?.response?.data?.error
    || e?.message
    || fallback;
  return String(msg);
}
