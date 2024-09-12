import axios from "axios";
import FormData from "form-data";

export class ArvaBase {
  public api_key: string;
  public base_url: string;
  public customers: Customers;

  constructor(api_key: string, base_url: string) {
    this.api_key = api_key;
    this.base_url = base_url;
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
  private arva_instance: ArvaBase;

  constructor(arva_instance: ArvaBase) {
    this.arva_instance = arva_instance;
  }

  async create({ agentId, registeredName, state }: CreateCustomerInput) {
    const response = await axios.post<CreateCustomerResponse>(
      this.arva_instance.base_url + "/customer/create",
      {
        agentId,
        registeredName,
        state,
      },
      {
        headers: {
          Authorization: `Bearer ${this.arva_instance.api_key}`,
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
      this.arva_instance.base_url + "/customer/update",
      form,
      {
        headers: {
          Authorization: `Bearer ${this.arva_instance.api_key}`,
          ...form.getHeaders(),
        },
      }
    );

    return response.data as UpdateCustomerResponse;
  }

  async review({ id, verdict, reason, rfi }: ReviewCustomerInput) {
    await axios.post(
      this.arva_instance.base_url + "/customer/review",
      { customerId: id, verdict, reason, rfi },
      {
        headers: {
          Authorization: `Bearer ${this.arva_instance.api_key}`,
        },
      }
    );
  }
}

export class Arva extends ArvaBase {
  constructor(api_key: string) {
    super(api_key, "http://platform.arva-ai.com/api/v0");
  }
}

/**
 * This is just for testing against a local instance of the Arva API.
 */
export class ArvaLocal extends ArvaBase {
  constructor(api_key: string) {
    super(api_key, "http://localhost:3000/api/v0");
  }
}
