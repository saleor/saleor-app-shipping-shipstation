export class DummyExternalShippingAPI {
  private dummyShippingMethods = [
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

  getInitialShippingMethodsForCheckout() {
    console.log(
      "Calling external shipping provider API to get initial shipping methods for checkout"
    );
    return this.dummyShippingMethods;
  }

  getShippingMethodsForAddressForCheckout(_address: unknown) {
    console.log(
      "Calling external shipping provider API to get available shipping methods for address"
    );
    return this.dummyShippingMethods;
  }

  setShippingMethodForCheckout(_method: unknown) {
    console.log("Calling external shipping provider API to set selected shipping method");
    return {
      success: true,
    };
  }

  setShippingMethodForOrder(_method: unknown) {
    console.log("Calling external shipping provider API to set selected shipping method for order");
    return {
      success: true,
    };
  }

  filterShippingMethodsForCheckout() {
    // This method is not used in the example but it can be used to filtering out internal & external shipping methods
    return {
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
  }
}
