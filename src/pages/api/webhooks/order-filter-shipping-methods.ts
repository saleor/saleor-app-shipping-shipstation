import { SaleorSyncWebhook } from "@saleor/app-sdk/handlers/next";
import { gql } from "urql";
import { OrderFilterShippingMethodsPayloadFragment } from "../../../../generated/graphql";
import { DummyExternalShippingAPI } from "../../../lib/dummy-shipping";
import { saleorApp } from "../../../saleor-app";

const OrderFilterShippingMethodsPayload = gql`
  fragment OrderFilterShippingMethodsPayload on OrderFilterShippingMethods {
    order {
      deliveryMethod {
        ... on ShippingMethod {
          id
          name
        }
      }
    }
  }
`;

const OrderFilterShippingMethodsSubscription = gql`
  ${OrderFilterShippingMethodsPayload}
  subscription OrderFilterShippingMethods {
    event {
      ...OrderFilterShippingMethodsPayload
    }
  }
`;

export const orderFilterShippingMethodsWebhook =
  new SaleorSyncWebhook<OrderFilterShippingMethodsPayloadFragment>({
    name: "Order Filter Shipping Methods",
    webhookPath: "api/webhooks/order-filter-shipping-methods",
    event: "ORDER_FILTER_SHIPPING_METHODS",
    apl: saleorApp.apl,
    query: OrderFilterShippingMethodsSubscription,
  });

export default orderFilterShippingMethodsWebhook.createHandler((req, res, ctx) => {
  const { payload } = ctx;
  console.log("Order Filter Shipping Methods Webhook received with: ", payload);
  const dummyAPI = new DummyExternalShippingAPI();
  // send selected shipping method on order to your shipping provider API
  dummyAPI.setShippingMethodForOrder(payload.order?.deliveryMethod);
  res.status(200).end();
});

export const config = {
  api: {
    bodyParser: false,
  },
};
