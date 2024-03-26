import { CheckoutLineFragment, WeightUnitsEnum } from "../../../generated/graphql";
import { createLogger } from "../../lib/logger";
import { notEmpty } from "../../lib/not-empty";
import { Weight, WeightUnits } from "./types";

const logger = createLogger("saleorToShipstation");

/**
 * The function takes a list of Saleor weights and sums them up. Output follows Shipstation weight format.
 *
 * Assumptions made:
 * - If no weights are found, it returns 0 grams
 * - If the unit is KG, it converts it to grams
 * - If the unit is not supported, it throws an error
 * - All of the provided weights are in the same unit
 */
// todo: test
const mapSaleorLinesToWeight = (lines: CheckoutLineFragment[]): Weight => {
  const weights = lines.map((line) => line.variant.weight).filter(notEmpty);

  if (weights.length === 0) {
    // TODO: should we throw an error here?
    logger.trace("No weights found, returning 0 grams");

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

  // TODO: shouldn't we convert TONNE to KG?
  const weightMap: Record<WeightUnitsEnum, WeightUnits | undefined> = {
    G: WeightUnits.Grams,
    KG: undefined,
    LB: WeightUnits.Pounds,
    OZ: WeightUnits.Ounces,
    TONNE: undefined,
  };

  const convertedUnit = weightMap[unit];

  if (convertedUnit === undefined) {
    throw new Error(`${unit} is not a supported weight unit`);
  }

  return {
    value: value,
    units: convertedUnit,
  };
};

export const saleorToShipstation = {
  mapSaleorLinesToWeight,
};
