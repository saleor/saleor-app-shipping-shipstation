export enum WeightUnits {
  Pounds = "pounds",
  Ounces = "ounces",
  Grams = "grams",
}

export interface Weight {
  value: number;
  units: WeightUnits;
}

export interface Dimensions {
  units: "inches" | "centimeters";
  length: number;
  width: number;
  height: number;
}
