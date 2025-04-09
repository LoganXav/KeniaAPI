"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ArrayUtil_1 = __importDefault(require("../../../../utils/ArrayUtil"));
const tsyringe_1 = require("tsyringe");
const caching_1 = __importDefault(require("../../../../infrastructure/internal/caching"));
const GuardianRead_provider_1 = __importDefault(require("../providers/GuardianRead.provider"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
let GuardianReadCache = class GuardianReadCache {
    constructor(guardianReadProvider) {
        this.CACHE_EXPIRY = 60 * 5;
        this.redisClient = caching_1.default.getInstance();
        this.guardianReadProvider = guardianReadProvider;
    }
    async getByCriteria(criteria) {
        try {
            const cacheKey = `${criteria.tenantId}:guardian:${JSON.stringify(criteria)}`;
            const cachedGuardians = await this.redisClient.get(cacheKey);
            if (cachedGuardians) {
                console.log("Criteria Guardian Cache HIT!");
                return JSON.parse(cachedGuardians);
            }
            const guardians = await this.guardianReadProvider.getByCriteria(criteria);
            console.log("Criteria Guardian Cache MISS!");
            if (ArrayUtil_1.default.any(guardians)) {
                await this.redisClient.set(cacheKey, JSON.stringify(guardians), {
                    EX: this.CACHE_EXPIRY,
                });
            }
            return guardians;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
    async invalidate(tenantId) {
        try {
            // Find all keys matching criteria-based caches and delete them
            const keys = await this.redisClient.keys(`${tenantId}:guardian:*`);
            if (ArrayUtil_1.default.any(keys)) {
                await this.redisClient.del(keys);
                console.log("Criteria Guardian Cache CLEARED!");
            }
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
    async getOneByCriteria(criteria) {
        try {
            const { tenantId } = criteria;
            const cacheKey = `${tenantId}:guardian:${JSON.stringify(criteria)}`;
            const cachedGuardian = await this.redisClient.get(cacheKey);
            if (cachedGuardian) {
                console.log("Criteria Single Guardian Cache HIT!");
                return JSON.parse(cachedGuardian);
            }
            const guardian = await this.guardianReadProvider.getOneByCriteria(criteria);
            console.log("Criteria Single Guardian Cache MISS!");
            if (guardian) {
                await this.redisClient.set(cacheKey, JSON.stringify(guardian), {
                    EX: this.CACHE_EXPIRY,
                });
            }
            return guardian;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
};
GuardianReadCache.cacheName = "GuardianReadCache";
GuardianReadCache = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [GuardianRead_provider_1.default])
], GuardianReadCache);
exports.default = GuardianReadCache;
//# sourceMappingURL=GuardianRead.cache.js.map