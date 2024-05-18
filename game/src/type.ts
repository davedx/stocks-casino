export type OptionType = "c" | "p";

export type Option = {
  strike: number;
  expiry: Date;
  type: OptionType;
};

export type Position = {
  option: Option;
  contracts: number;
  costAverage: number;
};

export type Portfolio = {
  positions: Position[];
  value: number;
};
