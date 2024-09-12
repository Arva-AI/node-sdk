export declare class ArvaBase {
    api_key: string;
    base_url: string;
    customers: Customers;
    constructor(api_key: string, base_url: string);
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
    private arva_instance;
    constructor(arva_instance: ArvaBase);
    create({ agentId, registeredName, state }: CreateCustomerInput): Promise<CreateCustomerResponse>;
    update({ id, userInfoPatch, websites, files }: UpdateCustomerInput): Promise<UpdateCustomerResponse>;
    review({ id, verdict, reason, rfi }: ReviewCustomerInput): Promise<void>;
}
export declare class Arva extends ArvaBase {
    constructor(api_key: string);
}
/**
 * This is just for testing against a local instance of the Arva API.
 */
export declare class ArvaLocal extends ArvaBase {
    constructor(api_key: string);
}
export {};
