import { GetRatesResponse } from "./ShipStation/fetch-get-rates";
import { SaleorShippingMethod } from "./types";

export const mapShipstationRatesToSaleor = (rates: GetRatesResponse[]): SaleorShippingMethod[] => {
  return rates.map((rate) => {
    return {
      id: rate.serviceCode,
      name: rate.serviceName,
      amount: rate.shipmentCost + rate.otherCost,
      currency: "USD",
    };
  });
};
