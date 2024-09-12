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
exports.ArvaLocal = exports.Arva = exports.ArvaBase = void 0;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
class ArvaBase {
    constructor(api_key, base_url) {
        this.api_key = api_key;
        this.base_url = base_url;
        this.customers = new Customers(this);
    }
}
exports.ArvaBase = ArvaBase;
class Customers {
    constructor(arva_instance) {
        this.arva_instance = arva_instance;
    }
    create(_a) {
        return __awaiter(this, arguments, void 0, function* ({ agentId, registeredName, state }) {
            const response = yield axios_1.default.post(this.arva_instance.base_url + "/customer/create", {
                agentId,
                registeredName,
                state,
            }, {
                headers: {
                    Authorization: `Bearer ${this.arva_instance.api_key}`,
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
            const response = yield axios_1.default.post(this.arva_instance.base_url + "/customer/update", form, {
                headers: Object.assign({ Authorization: `Bearer ${this.arva_instance.api_key}` }, form.getHeaders()),
            });
            return response.data;
        });
    }
    review(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, verdict, reason, rfi }) {
            yield axios_1.default.post(this.arva_instance.base_url + "/customer/review", { customerId: id, verdict, reason, rfi }, {
                headers: {
                    Authorization: `Bearer ${this.arva_instance.api_key}`,
                },
            });
        });
    }
}
class Arva extends ArvaBase {
    constructor(api_key) {
        super(api_key, "http://platform.arva-ai.com/api/v0");
    }
}
exports.Arva = Arva;
/**
 * This is just for testing against a local instance of the Arva API.
 */
class ArvaLocal extends ArvaBase {
    constructor(api_key) {
        super(api_key, "http://localhost:3000/api/v0");
    }
}
exports.ArvaLocal = ArvaLocal;
