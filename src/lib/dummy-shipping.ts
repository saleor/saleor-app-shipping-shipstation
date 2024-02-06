export const dummyShippingMethods = [
  {
    id: "pnl-bua",
    name: "PostNord Letter",
    amount: 10.0,
    currency: "USD",
  },
  {
    id: "dhl-exp",
    name: "DHL Express",
    amount: 20.0,
    currency: "USD",
  },
];

export const excludedShippingMethods = {
  excluded_methods: [
    {
      id: "U2hpcHBpbmdNZXRob2Q6MTgzMA==",
      reason: "UPS is no longer available.",
    },
    {
      id: "YXBwOnNhbGVvci5hcHA6cG5sLWJ1YQ==",
      reason: "PostNord Letter is not available for your location.",
    },
  ],
};
