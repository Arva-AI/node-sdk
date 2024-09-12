export declare class Arva {
    apiKey: string;
    baseUrl: string;
    customers: Customers;
    constructor(apiKey: string, baseUrl?: string);
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
    result: {
        verdict: "ACCEPT" | "REJECT";
        lowConfidence: boolean;
        rfi: never;
    } | {
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
declare class Customers {
    private arvaInstance;
    constructor(arvaInstance: Arva);
    create({ agentId, registeredName, state }: CreateCustomerInput): Promise<CreateCustomerResponse>;
    update({ id, userInfoPatch, websites, files }: UpdateCustomerInput): Promise<UpdateCustomerResponse>;
    review({ id, verdict, reason, rfi }: ReviewCustomerInput): Promise<void>;
}
export {};
