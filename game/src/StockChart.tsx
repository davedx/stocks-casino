import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { getDefaultData } from "./defaults";

const TIME_STEP = 1800000;

type Props = {
  underlying: number;
  setUnderlying: (v: number) => void;
  date: Date;
  setDate: (v: Date) => void;
};

const getTitle = (price: number, date: Date) => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
    timeStyle: "short",
  });
  const formattedDate = formatter.format(date);
  return `SPY ${price.toFixed(1)} ${formattedDate}`;
};

const StockChart = ({ underlying, setUnderlying, date, setDate }: Props) => {
  const [series, setSeries] = useState([
    {
      data: getDefaultData(),
    },
  ]);

  const [options, setOptions] = useState({
    chart: {
      type: "candlestick" as any,
    },
    title: {
      text: getTitle(underlying, date),
      align: "left" as any,
    },
    xaxis: {
      type: "datetime" as any,
      min: 1538778600000,
      max: 1538884800000,
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  });

  const [t, setT] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setT((prev) => prev + TIME_STEP);
    }, 5000);
  }, []);
  useEffect(() => {
    setDate(new Date(1538884800000 + t));
  }, [t]);

  useEffect(() => {
    if (t > 0) {
      const prIdx = series[0].data.length - 1;
      const prev1 = series[0].data[prIdx].y[1];
      const b = prev1 + 0.5 - Math.random() * 1;
      setUnderlying(b);
      const newDate = new Date(1538884800000 + t);
      series[0].data.push({
        x: newDate,
        y: [
          b,
          prev1 + 0.5 - Math.random() * 1,
          prev1 + 0.5 - Math.random() * 1,
          prev1 + 0.5 - Math.random() * 1,
        ],
      });
      setSeries([...series]);
      setOptions({
        ...options,
        title: {
          ...options.title,
          text: getTitle(underlying, newDate),
        },
        xaxis: {
          type: "datetime" as any,
          min: 1538778600000 + t,
          max: 1538884800000 + t,
        },
      });
    }
  }, [t]);

  return (
    <div id="chart" className="mx-12">
      <ReactApexChart
        options={{ ...options }}
        series={series}
        type="candlestick"
        width={800}
        height={800}
      />
    </div>
  );
};

export default StockChart;
