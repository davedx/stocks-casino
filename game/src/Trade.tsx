import { useEffect, useState } from "react";
import { Option, OptionType } from "./type";
import { calcOptionPrice } from "./pricing";

const STRIKE_MIN = 10;
const STRIKE_MAX = 10;

type Props = {
  date: Date;
  underlying: number;
  trade: (option: Option, numContracts: number) => void;
};

const getStrikes = (underlyingPrice: number) => {
  const rounded = Math.round(underlyingPrice);
  const strikes = [];
  for (let i = rounded - STRIKE_MIN; i <= rounded + STRIKE_MAX; i += 1) {
    strikes.push(i);
  }
  return strikes;
};

const getExpiries = (date: Date) => {
  const x = [];
  for (let i = 0; i <= 3; i++) {
    const d = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + i,
      23,
      59,
      59
    );
    x.push(d);
  }
  return x;
};

export const Trade = ({ date, underlying: underlying, trade }: Props) => {
  const defaultStrikes = getStrikes(underlying);
  const defaultExpiries = getExpiries(date);
  const [expiry, setExpiry] = useState(defaultExpiries[0]);
  const [strike, setStrike] = useState(String(defaultStrikes[10]));
  const [contracts, setContracts] = useState("1");
  const [type, setType] = useState<OptionType>("c");
  const [log, setLog] = useState<string[]>([]);
  const [strikes, setStrikes] = useState(defaultStrikes);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    setStrikes(getStrikes(underlying));
  }, [underlying]);

  useEffect(() => {
    setPrice(
      calcOptionPrice(
        underlying,
        {
          strike: Number(strike),
          expiry,
          type,
        },
        date
      ) * 100
    );
  }, [underlying, strike, expiry, type]);

  const priceTxt = Number.isNaN(price) ? "Expired" : `$${price.toFixed(2)}`;

  return (
    <div className="flex flex-col gap-2">
      <div>
        <select
          className="p-1 border border-black w-full"
          value={expiry.toISOString()}
          onChange={(e) => setExpiry(new Date(e.target.value))}
        >
          {defaultExpiries.map((exp) => (
            <option value={exp.toISOString()}>{exp.toDateString()}</option>
          ))}
        </select>
      </div>
      <div>
        <select
          className="p-1 border border-black w-full"
          value={strike}
          onChange={(e) => setStrike(e.target.value)}
        >
          {strikes.map((s) => (
            <option value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div>
        <select
          className="p-1 border border-black w-full"
          value={type}
          onChange={(e) => setType(e.target.value as OptionType)}
        >
          {["c", "p"].map((s) => (
            <option value={s}>{s === "c" ? "call" : "put"}</option>
          ))}
        </select>
      </div>
      <div>
        <select
          className="p-1 border border-black w-full"
          value={contracts}
          onChange={(e) => setContracts(e.target.value)}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
            <option value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div>{priceTxt}</div>
      <button
        onClick={() => {
          if (Number.isNaN(price)) {
            log.push(`Cannot buy expired option`);
            return;
          }
          log.push(`Buy ${contracts} ${expiry.toDateString()} ${strike}`);
          setLog([...log]);
          trade(
            {
              strike: Number(strike),
              expiry: expiry,
              type: "c",
            },
            Number(contracts)
          );
        }}
        className="border rounded-none border-black w-full px-1 py-0.5"
      >
        Buy
      </button>
      <button
        onClick={() => {
          if (Number.isNaN(price)) {
            log.push(`Cannot sell expired option`);
            return;
          }

          log.push(`Sell ${contracts} ${expiry.toDateString()} ${strike}`);
          setLog([...log]);

          trade(
            {
              strike: Number(strike),
              expiry: expiry,
              type: "c",
            },
            -Number(contracts)
          );
        }}
        className="border rounded-none border-black w-full px-1 py-0.5"
      >
        Sell
      </button>
      <div>
        <div>Log</div>
        {log.map((l, idx) => (
          <div key={idx}>{l}</div>
        ))}
      </div>
    </div>
  );
};
