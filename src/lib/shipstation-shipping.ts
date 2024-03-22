import { fetchGetRates } from "./ShipStation/fetch-get-rates";
import { getAuthHeader } from "./ShipStation/get-auth-header";
import { Weight } from "./ShipStation/types";

export interface GetShippingMethodsForAddressForCheckout {
  toCountry: string;
  toPostalCode: string;
  weight: Weight;
  carrierCode: string;
  fromPostalCode: string;
}

export interface ShipstationShippingAPIProps {
  apiKey: string;
  apiSecret: string;
}

export class ShipstationShippingAPI {
  private authHeader: string;

  constructor(props: ShipstationShippingAPIProps) {
    this.authHeader = getAuthHeader({
      apiKey: props.apiKey,
      apiSecret: props.apiSecret,
    });
  }

  async getShippingMethodsForAddressForCheckout(args: GetShippingMethodsForAddressForCheckout) {
    console.log(
      "Calling external shipping provider API to get available shipping methods for address"
    );

    const shipstationResponse = await fetchGetRates({
      input: {
        carrierCode: args.carrierCode,
        serviceCode: null,
        packageCode: null,
        fromPostalCode: args.fromPostalCode,
        toCountry: args.toCountry,
        toPostalCode: args.toPostalCode,
        weight: args.weight,
      },
      auth: this.authHeader,
    });

    return shipstationResponse;
  }
}
