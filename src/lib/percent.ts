/**
 * How much smaller a file got, as shown to people: "62", "99.8".
 * Never shows 100 unless the result is empty, because "100% smaller" reads
 * like the file disappeared. From 99% up it keeps one decimal (capped at 99.9).
 */
export function percentSmaller(originalBytes: number, compressedBytes: number): string {
  if (!originalBytes || originalBytes <= 0 || compressedBytes >= originalBytes) return '0';
  if (compressedBytes <= 0) return '100';
  const pct = (1 - compressedBytes / originalBytes) * 100;
  if (pct >= 99) return Math.min(99.9, Math.round(pct * 10) / 10).toFixed(1);
  return String(Math.round(pct));
}
