export declare class Arva {
    apiKey: string;
    baseUrl: string;
    customers: Customers;
    constructor(apiKey: string, baseUrl?: string);
}
export declare const ALL_CHECK_TYPES: readonly ["INCORPORATION", "TIN", "BUSINESS_ACTIVITIES", "OPERATING_ADDRESS", "SCREENING", "ADVERSE_MEDIA", "APPLICANT", "OFFICERS", "DIRECTORS", "OWNERS", "OWNERSHIP_STRUCTURE"];
export type CheckType = (typeof ALL_CHECK_TYPES)[number];
export type Result = {
    verdict: "ACCEPT";
    riskLevel: "LOW" | "MEDIUM" | "HIGH";
    periodicReviewYears: number;
    rfi: never;
    requiresManualReview: boolean;
} | {
    verdict: "REQUEST INFORMATION";
    rfi: string;
    requiresManualReview: boolean;
} | {
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
    companyNumber?: string;
    companyType?: string;
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
    checks?: CheckType[];
};
export type CheckResult = Result & {
    reason: string;
    proofIds: string[];
};
export type CustomerUpdateResult = {
    id: string;
    name: string;
    state: string;
    createdAt: Date;
    checks: ({
        type: string;
    } & CheckResult & {
        details?: Record<string, unknown>;
    })[];
} & Result;
export type CustomerStatus = {
    id: string;
    name: string;
    state: string;
    createdAt: Date;
    checks: ({
        type: string;
    } & (CheckResult | {}))[];
} & (Result | {});
export type ReviewCustomerInput = {
    id: string;
    verdict: "ACCEPT";
    riskLevel: "LOW" | "MEDIUM" | "HIGH";
    reason: string;
} | {
    id: string;
    verdict: "REQUEST INFORMATION";
    reason: string;
    rfi: string;
} | {
    id: string;
    verdict: "REJECT";
    reason: string;
};
declare class Customers {
    private arvaInstance;
    constructor(arvaInstance: Arva);
    create({ agentId, registeredName, state }: CreateCustomerInput): Promise<CreateCustomerResponse>;
    update({ id, userInfoPatch, websites, files, checks, }: UpdateCustomerInput): Promise<CustomerUpdateResult>;
    getById(id: string): Promise<CustomerStatus>;
    review(input: ReviewCustomerInput): Promise<void>;
}
export {};
