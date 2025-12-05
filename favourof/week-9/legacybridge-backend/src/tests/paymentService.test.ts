import paymentService, { cache } from "../services/paymentService";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("paymentService.fetchPayments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cache.flushAll(); // ✅ clear cache before each test
  });

  it("should fetch and transform payments successfully", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        { id: 1, userId: 10, title: "Test Payment" },
        { id: 2, userId: 20, title: "Another Payment" },
      ],
    });

    const result = await paymentService.fetchPayments();

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 1,
          customer: "Customer-10",
          description: "Test Payment",
        }),
        expect.objectContaining({
          id: 2,
          customer: "Customer-20",
          description: "Another Payment",
        }),
      ]),
    );
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });

  it("should retry and eventually throw error if API fails", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Network Error"));

    await expect(paymentService.fetchPayments()).rejects.toThrow(
      "Failed to fetch payments",
    );

    expect(mockedAxios.get).toHaveBeenCalledTimes(3);
  });
});
