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

    const firstPass = await client.customers.update({
      id: customerId,
      userInfoPatch: {},
      websites: [],
      files: [],
      checks: ["INCORPORATION"],
    });

    expect(firstPass.id).toEqual(customerId);
    expect(firstPass.name).toEqual("Arva AI Inc");
    expect(firstPass.state).toEqual("Delaware");
    expect(firstPass.verdict).toEqual("PENDING");

    const incorporationCheck = firstPass.checks.find(
      (check) => check.type === "INCORPORATION"
    );

    expect(incorporationCheck).toBeDefined();
    expect(incorporationCheck?.verdict).toEqual("REQUEST INFORMATION");
    expect(incorporationCheck?.details).toBeDefined();

    expect(incorporationCheck?.details).toBeDefined();
    expect(incorporationCheck?.details?.type).toEqual("Corporation");
    expect(incorporationCheck?.details?.identifier).toEqual("4021356");
    expect(incorporationCheck?.details?.dateOfCreation).toEqual("6/24/2024");
    expect(incorporationCheck?.details?.registeredName).toEqual("ARVA AI INC.");
    expect(incorporationCheck?.details?.jurisdictionCode).toEqual("us_de");

    const secondPass = await client.customers.update({
      id: customerId,
      userInfoPatch: {
        businessActivities:
          "We build AI agents to automate compliance operations for banks and fintechs.",
      },
      websites: ["https://arva.ai"],
      files: [],
    });

    expect(secondPass.id).toEqual(customerId);
    expect(secondPass.verdict).toEqual("REQUEST INFORMATION");
    expect(secondPass.rfi).toBeDefined();
    expect(secondPass.rfi).toBeTruthy();
    expect(secondPass.checks).toHaveLength(9);
  }, 60000);

  test("Get by ID", async () => {
    const res = await client.customers.getById(customerId);

    if (!("verdict" in res)) {
      throw new Error("Verdict is not set");
    }

    expect(res.id).toEqual(customerId);
    expect(res.name).toEqual("Arva AI Inc");
    expect(res.state).toEqual("Delaware");
    expect(res.verdict).toEqual("REQUEST INFORMATION");
    expect("riskLevel" in res).toBeFalsy();
    expect(res.rfi).toBeDefined();
    expect(res.rfi).toBeTruthy();
    expect(res.checks).toHaveLength(9);
  }, 120000); // Bump timeout as it essentially runs the case twice

  test("Review", async () => {
    await client.customers.review({
      id: customerId,
      verdict: "ACCEPT",
      riskLevel: "LOW",
      reason: "This is a test",
    });

    const res = await client.customers.getById(customerId);

    if (!("verdict" in res)) {
      throw new Error("Verdict is not set");
    }

    if (!("riskLevel" in res)) {
      throw new Error("Risk level is not set");
    }

    if (!("reason" in res)) {
      throw new Error("Reason is not set");
    }

    expect(res.id).toEqual(customerId);
    expect(res.name).toEqual("Arva AI Inc");
    expect(res.state).toEqual("Delaware");
    expect(res.verdict).toEqual("ACCEPT");
    expect(res.riskLevel).toEqual("LOW");
    expect(res.reason).toEqual("This is a test");
    expect("rfi" in res).toBeFalsy();
    expect(res.checks).toHaveLength(9);
  });
});
