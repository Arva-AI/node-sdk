import axios from "axios";
import FormData from "form-data";

export class Arva {
  public apiKey: string;
  public baseUrl: string;
  public customers: Customers;

  constructor(apiKey: string, baseUrl = "https://platform.arva-ai.com/api/v0") {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.customers = new Customers(this);
  }
}

export type CreateCustomerInput = {
  agentId: string;
  registeredName: string;
  state?: string;
};

export type CreateCustomerResponse = {
  id: string;
};

export type UpdateCustomerInput = {
  id: string;
  userInfoPatch: Record<string, unknown>;
  websites: string[];
  files: {
    buffer: Buffer;
    name: string;
  }[];
};

export type UpdateCustomerResponse = {
  success: boolean;
  result:
    | {
        verdict: "ACCEPT" | "REJECT";
        lowConfidence: boolean;
        rfi: never;
      }
    | {
        verdict: "REQUEST INFORMATION";
        lowConfidence: boolean;
        rfi: string;
      };
};

export type ReviewCustomerInput = {
  id: string;
  verdict: "ACCEPT" | "REJECT" | "REQUEST INFORMATION";
  reason: string;
  rfi?: string;
};

class Customers {
  private arvaInstance: Arva;

  constructor(arvaInstance: Arva) {
    this.arvaInstance = arvaInstance;
  }

  async create({ agentId, registeredName, state }: CreateCustomerInput) {
    const response = await axios.post<CreateCustomerResponse>(
      this.arvaInstance.baseUrl + "/customer/create",
      {
        agentId,
        registeredName,
        state,
      },
      {
        headers: {
          Authorization: `Bearer ${this.arvaInstance.apiKey}`,
        },
      }
    );

    return response.data;
  }

  async update({ id, userInfoPatch, websites, files }: UpdateCustomerInput) {
    const form = new FormData();

    form.append("customerId", id);
    form.append("userInfoPatch", JSON.stringify(userInfoPatch));
    form.append("websites", JSON.stringify(websites));

    for (const file of files) {
      form.append("file", file.buffer, file.name);
    }

    const response = await axios.post(
      this.arvaInstance.baseUrl + "/customer/update",
      form,
      {
        headers: {
          Authorization: `Bearer ${this.arvaInstance.apiKey}`,
          ...form.getHeaders(),
        },
      }
    );

    return response.data as UpdateCustomerResponse;
  }

  async review({ id, verdict, reason, rfi }: ReviewCustomerInput) {
    await axios.post(
      this.arvaInstance.baseUrl + "/customer/review",
      { customerId: id, verdict, reason, rfi },
      {
        headers: {
          Authorization: `Bearer ${this.arvaInstance.apiKey}`,
        },
      }
    );
  }
}
