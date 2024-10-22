export declare class Arva {
    apiKey: string;
    baseUrl: string;
    customers: Customers;
    constructor(apiKey: string, baseUrl?: string);
}
export type Result = {
    verdict: "ACCEPT" | "REJECT";
    lowConfidence: boolean;
    rfi: never;
} | {
    verdict: "REQUEST INFORMATION";
    lowConfidence: boolean;
    rfi: string;
};
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
export type CheckResult = {
    verdict: "ACCEPT" | "REJECT" | "REQUEST INFORMATION";
    confidence: number;
    reason: string;
    proofIds: string[];
};
export type CustomerResult = {
    id: string;
    name: string;
    state: string;
    createdAt: Date;
    isTest: boolean;
    checks: ({
        type: string;
    } & (CheckResult | {}))[];
} & (Result | {});
export type ReviewCustomerInput = {
    id: string;
    verdict: "ACCEPT" | "REJECT";
    reason: string;
} | {
    id: string;
    verdict: "REQUEST INFORMATION";
    reason: string;
    rfi: string;
};
declare class Customers {
    private arvaInstance;
    constructor(arvaInstance: Arva);
    create({ agentId, registeredName, state }: CreateCustomerInput): Promise<CreateCustomerResponse>;
    update({ id, userInfoPatch, websites, files }: UpdateCustomerInput): Promise<CustomerResult>;
    getById(id: string): Promise<CustomerResult>;
    review(input: ReviewCustomerInput): Promise<void>;
}
export {};
