declare class ArvaBase {
    api_key: string;
    base_url: string;
    customers: Customers;
    constructor(api_key: string, base_url: string);
}
declare class Customers {
    private arva_instance;
    constructor(arva_instance: ArvaBase);
    create({ agentId, registeredName, state, }: {
        agentId: string;
        registeredName: string;
        state?: string;
    }): Promise<{
        id: string;
    }>;
    update({ id, userInfoPatch, websites, files, }: {
        id: string;
        userInfoPatch: Record<string, unknown>;
        websites: string[];
        files: {
            buffer: Buffer;
            name: string;
        }[];
    }): Promise<{
        customerId: string;
    }>;
    review({ id, verdict, reason, rfi, }: {
        id: string;
        verdict: "ACCEPT" | "REJECT" | "REQUEST INFORMATION";
        reason: string;
        rfi?: string;
    }): Promise<unknown>;
}
export declare class Arva extends ArvaBase {
    constructor(api_key: string);
}
export declare class ArvaLocal extends ArvaBase {
    constructor(api_key: string);
}
export {};
