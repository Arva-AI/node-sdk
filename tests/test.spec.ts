import { Arva } from "../src/index";
import dotenv from "dotenv";

dotenv.config();

describe("Test SDK methods", () => {
  const client = new Arva(process.env.ARVA_API_KEY!, process.env.ARVA_BASE_URL);
  let customerId: string;

  test("Create", async () => {
    const res = await client.customers.create({
      agentId: process.env.ARVA_AGENT_ID!,
      registeredName: "Arva AI Inc",
      state: "Delaware",
    });

    customerId = res.id;
  });

  test("Update", async () => {
    if (!customerId) {
      throw new Error("Customer ID is not set");
    }

    const res = await client.customers.update({
      id: customerId,
      userInfoPatch: {
        businessActivities:
          "We build AI agents to automate compliance operations for banks and fintechs.",
      },
      websites: ["https://arva-ai.com"],
      files: [],
    });
  }, 60000);

  test("Get by ID", async () => {
    await client.customers.getById(customerId);
  });

  test("Review", async () => {
    await client.customers.review({
      id: customerId,
      verdict: "ACCEPT",
      reason: "This is a test",
    });
  });
});
