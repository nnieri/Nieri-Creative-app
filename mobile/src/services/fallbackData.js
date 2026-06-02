export const fallbackListings = [
  {
    id: "lst_101",
    address: "214 Harbor View Lane, Annapolis, MD 21403",
    bedrooms: 4,
    bathrooms: 3.5,
    squareFeet: 3120,
    status: "Delivered",
    heroImageUrl: "https://picsum.photos/seed/nieri-harbor/900/600",
    mediaUrl: "https://example.com/media/214-harbor-view-lane",
    deliveredAt: "2026-05-28T18:30:00.000Z",
  },
  {
    id: "lst_102",
    address: "88 Maple Ridge Court, Bethesda, MD 20814",
    bedrooms: 5,
    bathrooms: 4,
    squareFeet: 4280,
    status: "Editing",
    heroImageUrl: "https://picsum.photos/seed/nieri-maple/900/600",
    mediaUrl: null,
    deliveredAt: null,
  },
  {
    id: "lst_103",
    address: "47 King Street, Alexandria, VA 22314",
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1840,
    status: "Scheduled",
    heroImageUrl: "https://picsum.photos/seed/nieri-king/900/600",
    mediaUrl: null,
    deliveredAt: null,
  },
];

export const fallbackOrders = [
  {
    id: "ord_401",
    listingId: "lst_101",
    address: "214 Harbor View Lane, Annapolis, MD 21403",
    status: "Completed",
    appointmentStartsAt: "2026-05-27T15:00:00.000Z",
    packageName: "Luxury Photo + Video",
    deliverablesUrl: "https://example.com/media/214-harbor-view-lane",
  },
  {
    id: "ord_402",
    listingId: "lst_102",
    address: "88 Maple Ridge Court, Bethesda, MD 20814",
    status: "Editing",
    appointmentStartsAt: "2026-05-30T17:00:00.000Z",
    packageName: "Photo, Video, and Floor Plan",
    deliverablesUrl: null,
  },
  {
    id: "ord_403",
    listingId: "lst_103",
    address: "47 King Street, Alexandria, VA 22314",
    status: "Scheduled",
    appointmentStartsAt: "2026-06-03T14:30:00.000Z",
    packageName: "Photo + Reel Package",
    deliverablesUrl: null,
  },
];

export const fallbackAppointments = [
  {
    id: "apt_201",
    listingId: "lst_103",
    startsAt: "2026-06-03T14:30:00.000Z",
    endsAt: "2026-06-03T16:00:00.000Z",
    serviceName: "Photo + Reel Package",
    photographer: "Nieri Creative Team",
  },
  {
    id: "apt_202",
    listingId: "lst_102",
    startsAt: "2026-05-30T17:00:00.000Z",
    endsAt: "2026-05-30T18:30:00.000Z",
    serviceName: "Photo, Video, and Floor Plan",
    photographer: "Nieri Creative Team",
  },
];

function clean(value, fallback = "") {
  return String(value || fallback).trim();
}

function listFeatures(rawFeatures) {
  return clean(rawFeatures, "natural light, updated finishes, and move-in-ready spaces")
    .split(/,|\n/)
    .map((feature) => feature.trim())
    .filter(Boolean);
}

export function createFallbackListingDescription(input) {
  const address = clean(input.address, "this home");
  const bedrooms = clean(input.bedrooms, "well-sized");
  const bathrooms = clean(input.bathrooms, "updated");
  const squareFeet = clean(input.squareFeet, "generous");
  const tone = clean(input.tone, "Professional").toLowerCase();
  const features = listFeatures(input.keyFeatures);
  const featurePhrase = features.slice(0, 4).join(", ");

  return {
    provider: "preview",
    mlsDescription: `Welcome to ${address}, a ${tone} ${bedrooms}-bedroom, ${bathrooms}-bath home with approximately ${squareFeet} square feet. Highlights include ${featurePhrase}. Thoughtful spaces, polished presentation, and an inviting layout make this property ready for its next chapter.`,
    shortDescription: `${address} offers ${bedrooms} bedrooms, ${bathrooms} baths, and standout features like ${featurePhrase}. A strong fit for buyers looking for style, comfort, and convenience.`,
    socialCaption: `Just listed: ${address}. ${features[0] || "Beautiful details"} set the tone for this one. Message me for details or to schedule a private tour.`,
  };
}

export function createFallbackSocialScript(input) {
  const propertyType = clean(input.propertyType, "home");
  const location = clean(input.location, "the neighborhood");
  const priceRange = clean(input.priceRange, "today's market");
  const platform = clean(input.platform, "Instagram Reel");
  const sellingPoints = listFeatures(input.keySellingPoints);
  const leadPoint = sellingPoints[0] || "a layout buyers will love";
  const secondPoint = sellingPoints[1] || "updated spaces";

  return {
    provider: "preview",
    hook: `Looking for a ${propertyType} in ${location}? This one deserves a closer look.`,
    fifteenSecondScript: `Start outside with the curb appeal, cut to the main living space, then highlight ${leadPoint}. End with the address or neighborhood and invite viewers to book a showing.`,
    thirtySecondScript: `Open with a quick exterior shot and say, "This ${propertyType} in ${location} brings serious value in ${priceRange}." Move through the kitchen, living area, and best feature. Mention ${leadPoint} and ${secondPoint}, then close with a clear showing invitation.`,
    cta: "Send me a message for details or to schedule a private tour.",
    caption: `${platform} idea: ${propertyType} in ${location} with ${sellingPoints.slice(0, 3).join(", ")}. DM for the full listing media package.`,
  };
}

