import { LegacyPayment, LegacyCustomer } from "../types/legacy";
import { V2Payment, V2Customer } from "../types/models";



export function paymentLegacyToV2(lp: LegacyPayment): V2Payment {
  const amount =
    typeof lp.amount === "string"
      ? parseFloat(lp.amount)
      : Number(lp.amount || 0);

  const createdAt = new Date(lp.created_at).toISOString();

  return {
    id: lp.id.toString(),
    amount,
    currency: (lp.currency || "USD").toUpperCase(),
    status: normalizeStatus(lp.status),
    customerId: lp.customer_id?.toString(),
    createdAt,
    raw: lp,
  };
}

export function customerLegacyToV2(lc: LegacyCustomer): V2Customer {
  return {
    id: lc.id.toString(),
    name: `${lc.first_name} ${lc.last_name}`.trim(),
    email: lc.email,
    metadata: lc.meta || {},
    createdAt: new Date(lc.created_at).toISOString(),
    raw: lc,
  };
}

function normalizeStatus(s: any): "pending" | "completed" | "failed" {
  if (!s) return "pending";
  const v = String(s).toLowerCase();
  if (["paid", "success", "completed"].includes(v)) return "completed";
  if (["failed", "declined", "error"].includes(v)) return "failed";
  return "pending";
}
