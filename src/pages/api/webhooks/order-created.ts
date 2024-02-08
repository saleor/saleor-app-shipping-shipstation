import { SaleorAsyncWebhook } from "@saleor/app-sdk/handlers/next";
import { gql } from "urql";
import { OrderCreatedWebhookPayloadFragment } from "../../../../generated/graphql";
import { DummyExternalShippingAPI } from "../../../lib/dummy-shipping";
import { saleorApp } from "../../../saleor-app";

const OrderCreatedWebhookPayload = gql`
  fragment OrderCreatedWebhookPayload on OrderCreated {
    order {
      metadata {
        key
        value
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

const OrderCreatedGraphqlSubscription = gql`
  ${OrderCreatedWebhookPayload}
  subscription OrderCreated {
    event {
      ...OrderCreatedWebhookPayload
    }
  }
`;

export const orderCreatedWebhook = new SaleorAsyncWebhook<OrderCreatedWebhookPayloadFragment>({
  name: "Order Created in Saleor",
  webhookPath: "api/webhooks/order-created",
  event: "ORDER_CREATED",
  apl: saleorApp.apl,
  query: OrderCreatedGraphqlSubscription,
});

export default orderCreatedWebhook.createHandler((req, res, ctx) => {
  const { payload } = ctx;
  console.log("Order created with: ", payload);
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
