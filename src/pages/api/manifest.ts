import { createManifestHandler } from "@saleor/app-sdk/handlers/next";
import { AppManifest } from "@saleor/app-sdk/types";

import packageJson from "../../../package.json";
import { orderCreatedWebhook } from "./webhooks/order-created";
import { orderFilterShippingMethodsWebhook } from "./webhooks/order-filter-shipping-methods";
import { shippingListMethodsForCheckoutWebhook } from "./webhooks/shipping-list-methods-for-checkout";

export default createManifestHandler({
  async manifestFactory({ appBaseUrl, request }) {
    const iframeBaseUrl = process.env.APP_IFRAME_BASE_URL ?? appBaseUrl;
    const apiBaseURL = process.env.APP_API_BASE_URL ?? appBaseUrl;

    const manifest: AppManifest = {
      name: "Saleor App Shipping",
      tokenTargetUrl: `${apiBaseURL}/api/register`,
      appUrl: iframeBaseUrl,

      permissions: ["MANAGE_ORDERS", "MANAGE_CHECKOUTS", "IMPERSONATE_USER", "MANAGE_SHIPPING"],
      id: "saleor.app",
      version: packageJson.version,
      webhooks: [
        orderCreatedWebhook.getWebhookManifest(apiBaseURL),
        shippingListMethodsForCheckoutWebhook.getWebhookManifest(apiBaseURL),
        orderFilterShippingMethodsWebhook.getWebhookManifest(apiBaseURL),
      ],
      extensions: [],
      author: "Saleor Commerce",
      brand: {
        logo: {
          default: `${apiBaseURL}/logo.png`,
        },
      },
    };

    return manifest;
  },
});
