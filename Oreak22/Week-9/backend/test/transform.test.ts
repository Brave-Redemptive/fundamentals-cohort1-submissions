import {
  paymentLegacyToV2,
  customerLegacyToV2,
} from "../src/services/transform.service";

describe("transform.service", () => {
  test("transforms payment with string amount", () => {
    const input = {
      id: 1,
      amount: "123.45",
      currency: "usd",
      status: "paid",
      customer_id: 42,
      created_at: "2023-01-01T00:00:00",
    };
    const out = paymentLegacyToV2(input as any);
    expect(out.amount).toBeCloseTo(123.45);
    expect(out.currency).toBe("USD");
    expect(out.status).toBe("completed");
    expect(out.customerId).toBe("42");
  });

  test("transforms customer", () => {
    const input = {
      id: 7,
      first_name: "A",
      last_name: "B",
      email: "a@b.com",
      created_at: "2022-01-01",
    };
    const out = customerLegacyToV2(input as any);
    expect(out.id).toBe("7");
    expect(out.name).toBe("A B");
    expect(out.email).toBe("a@b.com");
  });
});
