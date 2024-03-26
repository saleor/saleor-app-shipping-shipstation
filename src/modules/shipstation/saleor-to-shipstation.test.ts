import { describe, expect, it } from "vitest";
import { saleorToShipstation } from "./saleor-to-shipstation";
import { CheckoutLineFragment, WeightUnitsEnum } from "../../../generated/graphql";
import { WeightUnits } from "./types";

describe("saleorToShipstation", () => {
  describe("mapSaleorLinesToWeight", () => {
    it("should map Saleor g lines to weight in grams", () => {
      const lines: CheckoutLineFragment[] = [
        {
          id: "1",
          variant: {
            weight: {
              unit: WeightUnitsEnum.G,
              value: 1,
            },
          },
        },
      ];

      const result = saleorToShipstation.mapSaleorLinesToWeight(lines);

      expect(result).toEqual({
        value: 1,
        units: WeightUnits.Grams,
      });
    });
    it("should map Saleor kg lines to weight in grams", () => {
      const lines: CheckoutLineFragment[] = [
        {
          id: "1",
          variant: {
            weight: {
              unit: WeightUnitsEnum.Kg,
              value: 1,
            },
          },
        },
      ];

      const result = saleorToShipstation.mapSaleorLinesToWeight(lines);

      expect(result).toEqual({
        value: 1000,
        units: WeightUnits.Grams,
      });
    });
    it("should map Saleor lines with no variant.weight to zero weight", () => {
      const lines: CheckoutLineFragment[] = [
        {
          id: "1",
          variant: {},
        },
      ];

      const result = saleorToShipstation.mapSaleorLinesToWeight(lines);

      expect(result).toEqual({
        value: 0,
        units: WeightUnits.Grams,
      });
    });
    it("should throw an error if the weight unit is not supported", () => {
      const lines: CheckoutLineFragment[] = [
        {
          id: "1",
          variant: {
            weight: {
              unit: WeightUnitsEnum.Tonne,
              value: 1,
            },
          },
        },
      ];

      expect(() => saleorToShipstation.mapSaleorLinesToWeight(lines)).toThrowError(
        "TONNE is not a supported weight unit"
      );
    });
  });
});
