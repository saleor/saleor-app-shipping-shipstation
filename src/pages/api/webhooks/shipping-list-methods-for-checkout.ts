import { SaleorSyncWebhook } from "@saleor/app-sdk/handlers/next";
import { gql } from "urql";
import { ShippingListMethodsPayloadFragment } from "../../../../generated/graphql";
import { saleorApp } from "../../../saleor-app";
import { ShipstationShippingAPI } from "../../../lib/shipstation-shipping";
import { sumAndFormatSaleorWeights } from "../../../lib/sum-and-format-saleor-weights";
import { notEmpty } from "../../../lib/not-empty";
import { ENV_CONFIG } from "../../../env-config";

const ShippingListMethodsPayload = gql`
  fragment ShippingListMethodsPayload on ShippingListMethodsForCheckout {
    checkout {
      lines {
        id
        variant {
          weight {
            unit
            value
          }
        }
      }
      shippingAddress {
        postalCode
        country {
          code
        }
        phone
      }
      deliveryMethod {
        ... on ShippingMethod {
          id
          name
        }
      }
    }
  }
`;

const ShippingListMethodsForCheckoutSubscription = gql`
  ${ShippingListMethodsPayload}
  subscription ShippingListMethodsForCheckout {
    event {
      ...ShippingListMethodsPayload
    }
  }
`;

export const shippingListMethodsForCheckoutWebhook =
  new SaleorSyncWebhook<ShippingListMethodsPayloadFragment>({
    name: "Shipping List Methods for Checkout",
    webhookPath: "api/webhooks/shipping-list-methods-for-checkout",
    event: "SHIPPING_LIST_METHODS_FOR_CHECKOUT",
    apl: saleorApp.apl,
    query: ShippingListMethodsForCheckoutSubscription,
  });

export default shippingListMethodsForCheckoutWebhook.createHandler(async (req, res, ctx) => {
  const { payload } = ctx;
  console.log("Shipping List Methods for Checkout Webhook received with: ", payload);

  const checkout = payload.checkout;

  if (!checkout) {
    // the checkout payload is missing
    // return 200 OK to Saleor to acknowledge the webhook
    console.debug("No checkout data in the payload");
    res.status(200).end();
    return;
  }

  const shippingAddress = checkout.shippingAddress;
  if (!shippingAddress) {
    // the address payload is missing
    // return 200 OK to Saleor to acknowledge the webhook
    console.debug("No shipping address in the payload");
    res.status(200).end();
    return;
  }

  const shippingApi = new ShipstationShippingAPI({
    apiKey: ENV_CONFIG.SHIPSTATION_API_KEY,
    apiSecret: ENV_CONFIG.SHIPSTATION_API_SECRET,
    carrierCode: ENV_CONFIG.CARRIER_CODES[0],
    fromPostalCode: ENV_CONFIG.FROM_POSTAL_CODE,
  });

  res.status(200).json(
    await shippingApi.getShippingMethodsForAddressForCheckout({
      toCountry: shippingAddress.country.code,
      toPostalCode: shippingAddress.postalCode,
      weight: sumAndFormatSaleorWeights({
        weights: checkout.lines.map((line) => line.variant.weight).filter(notEmpty),
      }),
    })
  );
});

export const config = {
  api: {
    bodyParser: false,
  },
};
