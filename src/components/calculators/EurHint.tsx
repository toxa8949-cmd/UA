// Інлайн-підказка конвертації локальної валюти в EUR: "(≈ €X)".
// Курс передається з серверної сторінки (props eurRate = скільки EUR за 1 одиницю).

function fmtEur(n: number): string {
  return "€" + Math.round(n).toLocaleString("en-US").replace(/,/g, "\u00a0");
}

/**
 * @param amount сума в локальній валюті
 * @param eurRate курс: скільки EUR за 1 одиницю валюти (напр. PLN ≈ 0.23)
 */
export function EurHint({ amount, eurRate }: { amount: number; eurRate: number }) {
  if (!eurRate || eurRate === 1) return null;
  const eur = amount * eurRate;
  if (!isFinite(eur) || eur <= 0) return null;
  return (
    <span className="ml-1 whitespace-nowrap text-xs font-normal text-slate-400">
      (≈ {fmtEur(eur)})
    </span>
  );
}
