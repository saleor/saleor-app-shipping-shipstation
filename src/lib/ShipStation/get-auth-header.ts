export interface GetAuthHeaderArgs {
  apiKey: string;
  apiSecret: string;
}

/**
 * Basic auth header for ShipStation API requests.
 * https://www.shipstation.com/docs/api/requirements/#authentication
 */
export const getAuthHeader = ({ apiKey, apiSecret }: GetAuthHeaderArgs) => {
  return "Basic " + btoa(`${apiKey}:${apiSecret}`);
};
