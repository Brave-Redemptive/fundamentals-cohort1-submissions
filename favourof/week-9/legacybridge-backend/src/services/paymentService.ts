import axios from "axios";
import dotenv from "dotenv";
import NodeCache from "node-cache";

dotenv.config();

const LEGACY_API = process.env.LEGACY_API as string;
const cache = new NodeCache({ stdTTL: 60 });

const fetchWithRetry = async (
  url: string,
  retries = 2,
  delay = 500,
): Promise<any> => {
  try {
    return await axios.get(url);
  } catch (error: any) {
    if (retries <= 0) throw error.message;
    console.warn(`Retrying... attempts left: ${retries}`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return fetchWithRetry(url, retries - 1, delay * 2); // exponential backoff
  }
};

const fetchPayments = async () => {
  try {
    // checking for cache data first
    const cachedData = cache.get("payments");
    if (cachedData) {
      console.log("✅ Returning cached payments");
      return cachedData;
    }

    const response = await fetchWithRetry(LEGACY_API);
    // transform the api from the mock api
    const transformed = response.data.map((item: any) => ({
      id: item.id,
      customer: `Customer-${item.userId}`,
      amount: Math.floor(Math.random() * 1000), // mock amount
      description: item.title,
    }));

    //  Store the data in the cache cache
    cache.set("payments", transformed);
    return transformed;
  } catch (error: any) {
    console.error("❌ Error in fetchPayments:", error.message || error);
    throw new Error("Failed to fetch payments");
  }
};
export { cache };
export default { fetchPayments };
