import { config } from "../config.js";
import { appointments, listings, mediaByListingId, orders } from "../data/mockData.js";

const liveEndpointPaths = {
  listings: "/listings",
  orders: "/orders",
  appointments: "/appointments",
  media: (listingId) => `/listings/${listingId}/media`,
};

async function requestAryeo(path) {
  if (!config.aryeoApiToken) {
    throw new Error("ARYEO_API_TOKEN is required when USE_MOCK_ARYEO=false");
  }

  const url = new URL(path, config.aryeoApiBaseUrl);
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${config.aryeoApiToken}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Aryeo request failed with ${response.status}: ${body}`);
  }

  const payload = await response.json();
  return payload.data || payload;
}

export async function getListings() {
  if (config.useMockAryeo) return listings;
  return requestAryeo(liveEndpointPaths.listings);
}

export async function getOrders() {
  if (config.useMockAryeo) return orders;
  return requestAryeo(liveEndpointPaths.orders);
}

export async function getAppointments() {
  if (config.useMockAryeo) return appointments;
  return requestAryeo(liveEndpointPaths.appointments);
}

export async function getMediaForListing(listingId) {
  if (config.useMockAryeo) return mediaByListingId[listingId] || [];
  return requestAryeo(liveEndpointPaths.media(listingId));
}

