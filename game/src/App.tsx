import { useState } from "react";
import "./App.css";
import StockChart from "./StockChart";
import { Port } from "./Port";
import { Option, Portfolio } from "./type";
import { Trade } from "./Trade";
import { calcOptionPrice } from "./pricing";

const isSameContract = (A: Option, B: Option) => {
  return A.expiry === B.expiry && A.strike === B.strike && A.type === B.type;
};

function App() {
  const [date, setDate] = useState(new Date(1538884800000));
  const [underlying, setUnderlying] = useState(660);
  const [portfolio, setPortfolio] = useState<Portfolio>({
    value: 20_000,
    positions: [],
  });

  const trade = (option: Option, numContracts: number) => {
    const price = calcOptionPrice(underlying, option, date) * 100;
    const prevPos = portfolio.positions.find((p) =>
      isSameContract(p.option, option)
    );
    if (prevPos) {
      prevPos.contracts += numContracts;
    } else {
      portfolio.positions.push({
        option: option,
        costAverage: price * numContracts,
        contracts: numContracts,
      });
    }
    setPortfolio({
      ...portfolio,
      value: portfolio.value - price,
    });
  };

  return (
    <>
      <div className="flex">
        <div className="flex-1">
          <Trade date={date} underlying={underlying} trade={trade} />
        </div>
        <div className="flex-1">
          <StockChart
            date={date}
            setDate={setDate}
            underlying={underlying}
            setUnderlying={setUnderlying}
          />
        </div>
        <div className="flex-1">
          <Port
            date={date}
            underlying={underlying}
            portfolio={portfolio}
            setPortfolio={setPortfolio}
          />
        </div>
      </div>
    </>
  );
}

export default App;
