import { Request, Response, NextFunction } from "express";
import * as legacyClient from "../services/legacy.client";
import * as transform from "../services/transform.service";
import * as cache from "../services/cache.service";

export async function getPayments(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const cacheKey = "payments_list_v2";
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ source: "cache", data: cached });

    const raw = await legacyClient.fetchPayments();
    const transformed = raw.map(transform.paymentLegacyToV2);
    console.log(transformed);
    cache.set(cacheKey, transformed);
    return res.json({ source: "legacy", data: transformed });
  } catch (err) {
    console.log(err)
    next(err);
  }
}

export async function getPaymentById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    const cacheKey = `payment_${id}_v2`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ source: "cache", data: cached });

    const raw = await legacyClient.fetchPaymentById(id);
    if (!raw) return res.status(404).json({ error: "Not found" });

    const transformed = transform.paymentLegacyToV2(raw);
    cache.set(cacheKey, transformed);
    return res.json({ source: "legacy", data: transformed });
  } catch (err) {
    next(err);
  }
}

export async function getCustomers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const cacheKey = "customers_list_v2";
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ source: "cache", data: cached });

    const raw = await legacyClient.fetchCustomers();
    const transformed = raw.map(transform.customerLegacyToV2);

    cache.set(cacheKey, transformed);
    return res.json({ source: "legacy", data: transformed });
  } catch (err) {
    next(err);
  }
}
