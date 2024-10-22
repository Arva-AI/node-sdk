import { Arva } from "../src/index";
import dotenv from "dotenv";

dotenv.config();

describe("Test SDK methods", () => {
  if (!process.env.ARVA_API_KEY) {
    throw new Error("ARVA_API_KEY must be set");
  }

  const client = new Arva(process.env.ARVA_API_KEY, process.env.ARVA_BASE_URL);
  let customerId: string;

  test("Create", async () => {
    if (!process.env.ARVA_AGENT_ID) {
      throw new Error("ARVA_AGENT_ID must be set");
    }

    const res = await client.customers.create({
      agentId: process.env.ARVA_AGENT_ID,
      registeredName: "Arva AI Inc",
      state: "Delaware",
    });

    customerId = res.id;
    expect(res.id).toBeDefined();
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

    expect(res.id).toEqual(customerId);
    expect(res.name).toEqual("Arva AI Inc");
    expect(res.state).toEqual("Delaware");
    expect((res as any).verdict).toEqual("REQUEST INFORMATION");
    expect((res as any).rfi).toBeDefined();
    expect(res.checks).toHaveLength(4);
  }, 60000);

  test("Get by ID", async () => {
    const res = await client.customers.getById(customerId);

    expect(res.id).toEqual(customerId);
    expect(res.name).toEqual("Arva AI Inc");
    expect(res.state).toEqual("Delaware");
    expect((res as any).verdict).toEqual("REQUEST INFORMATION");
    expect((res as any).rfi).toBeDefined();
    expect(res.checks).toHaveLength(4);
  });

  test("Review", async () => {
    await client.customers.review({
      id: customerId,
      verdict: "ACCEPT",
      reason: "This is a test",
    });

    const res = await client.customers.getById(customerId);

    expect(res.id).toEqual(customerId);
    expect(res.name).toEqual("Arva AI Inc");
    expect(res.state).toEqual("Delaware");
    expect((res as any).verdict).toEqual("ACCEPT");
    expect((res as any).reason).toEqual("This is a test");
  });
});
