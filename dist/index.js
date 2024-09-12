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
exports.Arva = void 0;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
class Arva {
    constructor(apiKey, baseUrl = "https://platform.arva-ai.com/api/v0") {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.customers = new Customers(this);
    }
}
exports.Arva = Arva;
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
        return __awaiter(this, arguments, void 0, function* ({ id, userInfoPatch, websites, files }) {
            const form = new form_data_1.default();
            form.append("customerId", id);
            form.append("userInfoPatch", JSON.stringify(userInfoPatch));
            form.append("websites", JSON.stringify(websites));
            for (const file of files) {
                form.append("file", file.buffer, file.name);
            }
            const response = yield axios_1.default.post(this.arvaInstance.baseUrl + "/customer/update", form, {
                headers: Object.assign({ Authorization: `Bearer ${this.arvaInstance.apiKey}` }, form.getHeaders()),
            });
            return response.data;
        });
    }
    review(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, verdict, reason, rfi }) {
            yield axios_1.default.post(this.arvaInstance.baseUrl + "/customer/review", { customerId: id, verdict, reason, rfi }, {
                headers: {
                    Authorization: `Bearer ${this.arvaInstance.apiKey}`,
                },
            });
        });
    }
}
