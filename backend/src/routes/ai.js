import { Router } from "express";
import { createListingDescription, createSocialScript } from "../services/aiService.js";

export const aiRouter = Router();

aiRouter.post("/listing-description", async (req, res, next) => {
  try {
    res.json({ data: await createListingDescription(req.body || {}) });
  } catch (error) {
    next(error);
  }
});

aiRouter.post("/social-script", async (req, res, next) => {
  try {
    res.json({ data: await createSocialScript(req.body || {}) });
  } catch (error) {
    next(error);
  }
});

