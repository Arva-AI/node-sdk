import axios from "axios";
import FormData from "form-data";

export class Arva {
  public apiKey: string;
  public baseUrl: string;
  public customers: Customers;

  constructor(apiKey: string, baseUrl = "https://platform.arva.ai/api/v0") {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.customers = new Customers(this);
  }
}

export type Result =
  | {
      verdict: "ACCEPT";
      riskLevel: "LOW" | "MEDIUM" | "HIGH";
      periodicReviewYears: number;
      rfi: never;
      requiresManualReview: boolean;
    }
  | {
      verdict: "REQUEST INFORMATION";
      rfi: string;
      requiresManualReview: boolean;
    }
  | {
      verdict: "REJECT";
      rfi: never;
      requiresManualReview: boolean;
    };

export type CreateCustomerInput = {
  agentId: string;
  registeredName: string;
  state?: string;
};

export type CreateCustomerResponse = {
  id: string;
};

export type UserInfoPatch = {
  dba?: string;
  natureOfBusiness?: string;
  operatingAddress?: string;
  tin?: string;
} & Record<string, unknown>;

export type UpdateCustomerInput = {
  id: string;
  userInfoPatch: UserInfoPatch;
  websites: string[];
  files: {
    buffer: Buffer;
    name: string;
  }[];
};

export type CheckResult = Result & {
  reason: string;
  proofIds: string[];
};

export type CustomerResult = {
  id: string;
  name: string;
  state: string;
  createdAt: Date;
  checks: ({
    type: string;
  } & (CheckResult | {}))[];
} & (Result | {});

export type ReviewCustomerInput =
  | {
      id: string;
      verdict: "ACCEPT";
      riskLevel: "LOW" | "MEDIUM" | "HIGH";
      reason: string;
    }
  | {
      id: string;
      verdict: "REQUEST INFORMATION";
      reason: string;
      rfi: string;
    }
  | {
      id: string;
      verdict: "REJECT";
      reason: string;
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

    const response = await axios.post<CustomerResult>(
      this.arvaInstance.baseUrl + "/customer/update",
      form,
      {
        headers: {
          Authorization: `Bearer ${this.arvaInstance.apiKey}`,
          ...form.getHeaders(),
        },
      }
    );

    return response.data;
  }

  async getById(id: string) {
    const response = await axios.get<CustomerResult>(
      this.arvaInstance.baseUrl + `/customer/getById?id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${this.arvaInstance.apiKey}`,
        },
      }
    );

    return response.data;
  }

  async review(input: ReviewCustomerInput) {
    await axios.post(
      this.arvaInstance.baseUrl + "/customer/review",
      {
        customerId: input.id,
        ...input,
      },
      {
        headers: {
          Authorization: `Bearer ${this.arvaInstance.apiKey}`,
        },
      }
    );
  }
}
