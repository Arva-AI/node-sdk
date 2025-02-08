"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_CHECK_TYPES = exports.Arva = void 0;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
class Arva {
    constructor(apiKey, baseUrl = "https://platform.arva.ai/api/v0") {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.customers = new Customers(this);
    }
}
exports.Arva = Arva;
exports.ALL_CHECK_TYPES = [
    "INCORPORATION",
    "TIN",
    "BUSINESS_ACTIVITIES",
    "OPERATING_ADDRESS",
    "SCREENING",
    "ADVERSE_MEDIA",
    "APPLICANT",
    "OFFICERS",
    "DIRECTORS",
    "OWNERS",
    "OWNERSHIP_STRUCTURE",
];
class Customers {
    constructor(arvaInstance) {
        this.arvaInstance = arvaInstance;
    }
    create(_a) {
        return __awaiter(this, arguments, void 0, function* ({ agentId, registeredName, state }) {
            const response = yield axios_1.default.post(this.arvaInstance.baseUrl + "/customer/create", {
                agentId,
                registeredName,
                state,
            }, {
                headers: {
                    Authorization: `Bearer ${this.arvaInstance.apiKey}`,
                },
            });
            return response.data;
        });
    }
    update(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, userInfoPatch, websites, files, checks, }) {
            const form = new form_data_1.default();
            form.append("customerId", id);
            form.append("userInfoPatch", JSON.stringify(userInfoPatch));
            form.append("websites", JSON.stringify(websites));
            for (const file of files) {
                form.append("file", file.buffer, file.name);
            }
            if (checks) {
                form.append("checks", JSON.stringify(checks));
            }
            const response = yield axios_1.default.post(this.arvaInstance.baseUrl + "/customer/update", form, {
                headers: Object.assign({ Authorization: `Bearer ${this.arvaInstance.apiKey}` }, form.getHeaders()),
            });
            return response.data;
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(this.arvaInstance.baseUrl + `/customer/getById?id=${id}`, {
                headers: {
                    Authorization: `Bearer ${this.arvaInstance.apiKey}`,
                },
            });
            return response.data;
        });
    }
    review(input) {
        return __awaiter(this, void 0, void 0, function* () {
            yield axios_1.default.post(this.arvaInstance.baseUrl + "/customer/review", Object.assign({ customerId: input.id }, input), {
                headers: {
                    Authorization: `Bearer ${this.arvaInstance.apiKey}`,
                },
            });
        });
    }
}
