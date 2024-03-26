import { ShippingListMethodsPayloadFragment } from "../generated/graphql";
import { createLogger } from "./lib/logger";
import { GetRatesClient } from "./modules/shipstation/api/get-rates";
import { ShipStationApiClient } from "./modules/shipstation/api/shipstation-api-client";
import { saleorToShipstation } from "./modules/shipstation/saleor-to-shipstation";
import { shipstationToSaleor } from "./modules/shipstation/shipstation-to-saleor";

export class CheckoutShippingMethodService {
  private logger = createLogger("CheckoutShippingMethodService");
  constructor(private apiClient: ShipStationApiClient) {}

  async getShippingMethodsForCheckout({
    payload,
    carrierCodes,
    fromPostalCode,
  }: {
    payload: ShippingListMethodsPayloadFragment;
    carrierCodes: string[];
    fromPostalCode: string;
  }) {
    const checkout = payload.checkout;

    if (!checkout) {
      // the checkout payload is missing
      // return 200 OK to Saleor to acknowledge the webhook
      // console.debug("No checkout data in the payload");
      // res.status(200).end();
      throw new Error("No checkout data found in the webhook payload");
    }

    const shippingAddress = checkout.shippingAddress;

    if (!shippingAddress) {
      // the address payload is missing
      // return 200 OK to Saleor to acknowledge the webhook
      // console.debug("No shipping address in the payload");
      // res.status(200).end();
      throw new Error("No shipping address found in the webhook payload");
    }

    this.logger.debug("Getting rates for the following carrier codes: %o", carrierCodes);

    const client = new GetRatesClient(this.apiClient);

    const getShippingMethodsFromAllCarriers = carrierCodes.map((carrierCode) => {
      return client.getRates({
        carrierCode: carrierCode,
        serviceCode: null,
        packageCode: null,
        fromPostalCode,
        toCountry: shippingAddress.country.code,
        toPostalCode: shippingAddress.postalCode,
        weight: saleorToShipstation.mapSaleorLinesToWeight(checkout.lines),
      });
    });

    const allCarriersResponse = await Promise.all(getShippingMethodsFromAllCarriers);

    this.logger.debug({ allCarriersResponse }, "Shipping methods from all carriers: ");

    const flatAllCarriersResponse = allCarriersResponse.flatMap((methods) => methods);

    this.logger.trace({ flatAllCarriersResponse }, "Flat all carriers response: ");

    const saleorMethods = shipstationToSaleor.mapShipstationRates(flatAllCarriersResponse);

    return saleorMethods;
  }
}
