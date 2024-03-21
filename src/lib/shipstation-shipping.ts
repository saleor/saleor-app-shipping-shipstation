import { getAuthHeader } from "./ShipStation/get-auth-header";
import { fetchGetRates } from "./ShipStation/fetch-get-rates";
import { Weight } from "./ShipStation/types";
import { mapShipstationRatesToSaleor } from "./map-shipstation-rates-to-saleor";

export interface GetShippingMethodsForAddressForCheckout {
  toCountry: string;
  toPostalCode: string;
  weight: Weight;
}

export interface ShipstationShippingAPIProps {
  apiKey: string;
  apiSecret: string;
  carrierCode: string;
  fromPostalCode: string;
}

export class ShipstationShippingAPI {
  private authHeader: string;
  private carrierCode: string;
  private fromPostalCode: string;

  constructor(props: ShipstationShippingAPIProps) {
    this.authHeader = getAuthHeader({
      apiKey: props.apiKey,
      apiSecret: props.apiSecret,
    });
    this.carrierCode = props.carrierCode;
    this.fromPostalCode = props.fromPostalCode;
  }

  async getShippingMethodsForAddressForCheckout(args: GetShippingMethodsForAddressForCheckout) {
    console.log(
      "Calling external shipping provider API to get available shipping methods for address"
    );

    const shipstationResponse = await fetchGetRates({
      input: {
        // TODO: add support for multiple carriers
        carrierCode: this.carrierCode,
        serviceCode: null,
        packageCode: null,
        fromPostalCode: this.fromPostalCode,
        toCountry: args.toCountry,
        toPostalCode: args.toPostalCode,
        weight: args.weight,
      },
      auth: this.authHeader,
    });

    const rates = mapShipstationRatesToSaleor(shipstationResponse);

    return rates;
  }
}
