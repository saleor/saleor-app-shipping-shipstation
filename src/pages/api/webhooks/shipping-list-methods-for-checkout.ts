import { SaleorSyncWebhook } from "@saleor/app-sdk/handlers/next";
import { gql } from "urql";
import { ShippingListMethodsPayloadFragment } from "../../../../generated/graphql";
import { DummyExternalShippingAPI } from "../../../lib/dummy-shipping";
import { saleorApp } from "../../../saleor-app";

const ShippingListMethodsPayload = gql`
  fragment ShippingListMethodsPayload on ShippingListMethodsForCheckout {
    checkout {
      shippingAddress {
        firstName
        lastName
        streetAddress1
        streetAddress2
        city
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

export default shippingListMethodsForCheckoutWebhook.createHandler((req, res, ctx) => {
  const { payload } = ctx;
  console.log("Shipping List Methods for Checkout Webhook received with: ", payload);

  const dummyAPI = new DummyExternalShippingAPI();

  if (payload.checkout?.shippingAddress) {
    // there is shipping address present on checkout
    // call your shipping provider API to get available shipping methods
    res
      .status(200)
      .json(dummyAPI.getShippingMethodsForAddressForCheckout(payload.checkout.shippingAddress));
  }

  if (payload.checkout?.deliveryMethod) {
    // there is delivery method present on checkout
    // call your shipping provider API to set selected shipping method
    dummyAPI.setShippingMethodForCheckout(payload.checkout.deliveryMethod);
    res.status(200).end();
  }

  // there is no shipping address or delivery method present on checkout
  // call your shipping provider API to get available default shipping methods (ones before user enters shipping address)
  res.status(200).json(dummyAPI.getInitialShippingMethodsForCheckout());
});

export const config = {
  api: {
    bodyParser: false,
  },
};
