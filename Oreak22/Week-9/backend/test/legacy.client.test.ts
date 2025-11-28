import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import * as legacyClient from "../src/services/legacy.client";

const mock = new MockAdapter(axios);

describe("legacy.client", () => {
  afterEach(() => mock.reset());

  test("fetchPayments returns data", async () => {
    mock.onGet("http://localhost:4000/legacy/payments").reply(200, [{ id: 1 }]);
    const res = await legacyClient.fetchPayments();
    expect(res).toEqual([
      {
        amount: "",
        created_at: "",
        currency: "",
        customer_id: 1,
        id: 1,
        status: "",
      },
    ]);
  });

  test("fetchPaymentById returns null on 404", async () => {
    mock.onGet("http://localhost:4000/legacy/payments/999").reply(404);
    const res = await legacyClient.fetchPaymentById("999");
    expect(res).toBeNull();
  });
});
