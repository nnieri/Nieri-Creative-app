import { API_BASE_URL } from "../config";
import {
  createFallbackListingDescription,
  createFallbackSocialScript,
  fallbackAppointments,
  fallbackListings,
  fallbackOrders,
} from "./fallbackData";

async function request(path, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const payload = await response.json();
    return payload.data;
  } catch (error) {
    return getPreviewFallback(path, options);
  }
}

function getPreviewFallback(path, options = {}) {
  if (path === "/api/aryeo/listings") return fallbackListings;
  if (path === "/api/aryeo/orders") return fallbackOrders;
  if (path === "/api/aryeo/appointments") return fallbackAppointments;
  if (path.startsWith("/api/aryeo/media/")) return [];

  const body = options.body ? JSON.parse(options.body) : {};
  if (path === "/api/ai/listing-description") return createFallbackListingDescription(body);
  if (path === "/api/ai/social-script") return createFallbackSocialScript(body);

  throw new Error("Unable to reach the backend. Start the backend to use live data.");
}

export const api = {
  getListings: () => request("/api/aryeo/listings"),
  getOrders: () => request("/api/aryeo/orders"),
  getAppointments: () => request("/api/aryeo/appointments"),
  getMedia: (listingId) => request(`/api/aryeo/media/${listingId}`),
  createListingDescription: (body) =>
    request("/api/ai/listing-description", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  createSocialScript: (body) =>
    request("/api/ai/social-script", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
