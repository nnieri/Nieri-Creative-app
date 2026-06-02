import { Router } from "express";
import {
  getAppointments,
  getListings,
  getMediaForListing,
  getOrders,
} from "../services/aryeoClient.js";

export const aryeoRouter = Router();

aryeoRouter.get("/listings", async (req, res, next) => {
  try {
    res.json({ data: await getListings() });
  } catch (error) {
    next(error);
  }
});

aryeoRouter.get("/orders", async (req, res, next) => {
  try {
    res.json({ data: await getOrders() });
  } catch (error) {
    next(error);
  }
});

aryeoRouter.get("/appointments", async (req, res, next) => {
  try {
    res.json({ data: await getAppointments() });
  } catch (error) {
    next(error);
  }
});

aryeoRouter.get("/media/:listingId", async (req, res, next) => {
  try {
    res.json({ data: await getMediaForListing(req.params.listingId) });
  } catch (error) {
    next(error);
  }
});

