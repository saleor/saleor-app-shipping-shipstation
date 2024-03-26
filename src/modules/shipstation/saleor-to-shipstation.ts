import { CheckoutLine, CheckoutLineFragment, WeightUnitsEnum } from "../../../generated/graphql";
import { notEmpty } from "../../lib/not-empty";
import { Weight, WeightUnits } from "./types";

/**
 * The function takes a list of Saleor weights and sums them up. Output follows Shipstation weight format.
 *
 * Assumptions made:
 * - If no weights are found, it returns 0 grams
 * - If the unit is KG, it converts it to grams
 * - If the unit is not supported, it throws an error
 * - All of the provided weights are in the same unit
 */
const mapSaleorLinesToWeight = (lines: CheckoutLineFragment[]): Weight => {
  const weights = lines.map((line) => line.variant.weight).filter(notEmpty);

  if (weights.length === 0) {
    console.debug("No weights found, returning 0 grams");
    return {
      value: 0,
      units: WeightUnits.Grams,
    };
  }

  let unit = weights[0].unit;
  let value = weights.reduce((acc, weight) => {
    return acc + weight.value;
  }, 0);

  // Weight conversion, ShipStation does not support KGs
  if (unit === "KG") {
    value = value * 1000;
    unit = WeightUnitsEnum.G;
  }

  const weightMap: Record<WeightUnitsEnum, WeightUnits | undefined> = {
    G: WeightUnits.Grams,
    KG: undefined,
    LB: WeightUnits.Pounds,
    OZ: WeightUnits.Ounces,
    TONNE: undefined,
  };

  const convertedUnit = weightMap[unit];

  if (convertedUnit === undefined) {
    console.error("Unsupported weight unit", unit);
    throw new Error("Unsupported weight unit");
  }

  return {
    value: value,
    units: convertedUnit,
  };
};

export const saleorToShipstation = {
  mapSaleorLinesToWeight,
};
