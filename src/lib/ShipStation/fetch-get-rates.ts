// Generated based on the ShipStation API documentation:

import { Dimensions, Weight } from "./types";

// https://www.shipstation.com/docs/api/shipments/get-rates/
export interface GetRatesRequest {
  /**  Returns rates for the specified carrier. */
  carrierCode: string;
  /** Returns rates for the specified shipping service. */
  serviceCode?: any;
  /** Returns rates for the specified package type. */
  packageCode?: any;
  /** Originating postal code. */
  fromPostalCode: string;
  /** Originating city. */
  fromCity?: string;
  /** Originating state. */
  fromState?: string;
  /**
   * Originating warehouse ID.
   * The fromCity and fromState fields will take precedence over the fromWarehouseId field if all three are entered.
   */
  fromWarehouseId?: string;
  /** Destination State/Province. Please use two-character state/province abbreviation */
  toState?: string;
  /** Destination Country. Please use the two-letter ISO Origin Country code. */
  toCountry: string;
  /** Destination Postal Code. */
  toPostalCode: string;
  /** Destination City. */
  toCity?: string;
  /** Weight of the order. */
  weight: Weight;
  /** Dimensions of the order. */
  dimensions?: Dimensions;
  /** The type of delivery confirmation that is to be used once the shipment is created.
   * Possible values: none, delivery, signature, adult_signature, and direct_signature. The option for direct_signature is available for FedEx only.
   */
  confirmation?: string;
  /** Carriers may return different rates based on whether or not the address is commercial (false) or residential (true). Default value: false */
  residential?: boolean;
}

export interface GetRatesResponse {
  serviceName: string;
  serviceCode: string;
  shipmentCost: number;
  otherCost: number;
}

const GET_RATES_URL = "https://ssapi.shipstation.com/shipments/getrates";

export interface FetchGetRatesProps {
  input: GetRatesRequest;
  auth: string;
}

export const fetchGetRates = async ({ input, auth }: FetchGetRatesProps) => {
  console.log("fetchGetRates starts");

  const response = await fetch(GET_RATES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: auth,
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    console.error(`Failed to fetch rates: ${response.statusText}`);
    throw new Error(`Failed to fetch rates: ${response.statusText}`);
  }

  console.debug("fetchGetRates ok", response);

  // TODO: Add response validation
  return response.json() as Promise<GetRatesResponse[]>;
};
