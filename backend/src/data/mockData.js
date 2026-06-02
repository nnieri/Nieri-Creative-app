export const listings = [
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

export const appointments = [
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

export const mediaByListingId = {
  lst_101: [
    {
      id: "med_301",
      type: "gallery",
      title: "Photo Gallery",
      url: "https://example.com/media/214-harbor-view-lane/photos",
    },
    {
      id: "med_302",
      type: "video",
      title: "Property Video",
      url: "https://example.com/media/214-harbor-view-lane/video",
    },
    {
      id: "med_303",
      type: "social",
      title: "Vertical Reel",
      url: "https://example.com/media/214-harbor-view-lane/reel",
    },
  ],
  lst_102: [],
  lst_103: [],
};

export const orders = [
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

