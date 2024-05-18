import { Option } from "./type";

// Utility functions for the Black-Scholes model
function cumulativeDistributionFunction(x: number): number {
  const a1 = 0.31938153;
  const a2 = -0.356563782;
  const a3 = 1.781477937;
  const a4 = -1.821255978;
  const a5 = 1.330274429;
  const p = 0.2316419;
  const c = 0.39894228;

  if (x >= 0.0) {
    const t = 1.0 / (1.0 + p * x);
    return (
      1.0 -
      c *
        Math.exp((-x * x) / 2.0) *
        t *
        (t * (t * (t * (t * a5 + a4) + a3) + a2) + a1)
    );
  } else {
    const t = 1.0 / (1.0 - p * x);
    return (
      c *
      Math.exp((-x * x) / 2.0) *
      t *
      (t * (t * (t * (t * a5 + a4) + a3) + a2) + a1)
    );
  }
}

// Black-Scholes model for European options
export function blackScholes(
  S: number, // Current stock price
  K: number, // Strike price
  T: number, // Time to expiration in years
  r: number, // Risk-free interest rate
  sigma: number, // Volatility
  optionType: "call" | "put" // Option type
): number {
  const d1 =
    (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);

  if (optionType === "call") {
    return (
      S * cumulativeDistributionFunction(d1) -
      K * Math.exp(-r * T) * cumulativeDistributionFunction(d2)
    );
  } else {
    return (
      K * Math.exp(-r * T) * cumulativeDistributionFunction(-d2) -
      S * cumulativeDistributionFunction(-d1)
    );
  }
}
/*
// Example usage
const stockPrice = 100;
const strikePrice = 100;
const timeToExpiration = 1; // 1 year
const riskFreeRate = 0.05; // 5% annual risk-free rate
const volatility = 0.2; // 20% annual volatility
*/

const MS_IN_DAY = 60 * 60 * 24 * 1000;
export const calcOptionPrice = (
  underlying: number,
  option: Option,
  date: Date
) => {
  const dateDiffMs = option.expiry.getTime() - date.getTime();
  const daysToExpiry = dateDiffMs / MS_IN_DAY;
  const yearsToExpiry = daysToExpiry / 365;
  return blackScholes(
    underlying,
    option.strike,
    yearsToExpiry,
    0.05,
    0.2,
    option.type === "c" ? "call" : "put"
  );
};
