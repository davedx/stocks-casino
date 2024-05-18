import { calcOptionPrice } from "./pricing";
import { Portfolio } from "./type";

type Props = {
  date: Date;
  underlying: number;
  portfolio: Portfolio;
  setPortfolio: (p: Portfolio) => void;
};

export const Port = ({ date, underlying, portfolio }: Props) => {
  return (
    <div className="">
      <div>Portfolio</div>
      <div>NAV: ${portfolio.value.toFixed(2)}</div>
      {portfolio.positions
        .filter((p) => p.contracts !== 0)
        .map((h, idx) => {
          const price = calcOptionPrice(underlying, h.option, date) * 100;
          return (
            <div key={idx}>
              {h.option.expiry.toDateString()} ${h.option.strike} {h.contracts}{" "}
              value: ${price.toFixed(1)}
            </div>
          );
        })}
    </div>
  );
};
