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
const tsyringe_1 = require("tsyringe");
const StaffRead_provider_1 = __importDefault(require("../providers/StaffRead.provider"));
const caching_1 = __importDefault(require("../../../../infrastructure/internal/caching"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
const ArrayUtil_1 = __importDefault(require("../../../../utils/ArrayUtil"));
let StaffReadCache = class StaffReadCache {
    constructor(staffReadProvider) {
        this.CACHE_EXPIRY = 60 * 5;
        this.redisClient = caching_1.default.getInstance();
        this.staffReadProvider = staffReadProvider;
    }
    async getByCriteria(criteria) {
        try {
            const cacheKey = `${criteria.tenantId}:staff:${JSON.stringify(criteria)}`;
            const cachedStaffs = await this.redisClient.get(cacheKey);
            if (cachedStaffs) {
                console.log("Criteria Staff Cache HIT!");
                return JSON.parse(cachedStaffs);
            }
            const staffs = await this.staffReadProvider.getByCriteria(criteria);
            console.log("Criteria Staff Cache MISS!");
            if (ArrayUtil_1.default.any(staffs)) {
                await this.redisClient.set(cacheKey, JSON.stringify(staffs), {
                    EX: this.CACHE_EXPIRY,
                });
            }
            return staffs;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
    async invalidate(tenantId) {
        try {
            // Find all keys matching criteria-based caches and delete them
            const keys = await this.redisClient.keys(`${tenantId}:staff:*`);
            if (ArrayUtil_1.default.any(keys)) {
                await this.redisClient.del(keys);
                console.log("Criteria Staff Cache CLEARED!");
            }
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
    async getOneByCriteria(criteria) {
        try {
            const { tenantId } = criteria;
            const cacheKey = `${tenantId}:staff:${JSON.stringify(criteria)}`;
            const cachedStaff = await this.redisClient.get(cacheKey);
            if (cachedStaff) {
                console.log("Criteria Single Staff Cache HIT!");
                return JSON.parse(cachedStaff);
            }
            const staff = await this.staffReadProvider.getOneByCriteria(criteria);
            console.log("Criteria Single Staff Cache MISS!");
            if (staff) {
                await this.redisClient.set(cacheKey, JSON.stringify(staff), {
                    EX: this.CACHE_EXPIRY,
                });
            }
            return staff;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
};
StaffReadCache.cacheName = "StaffReadCache";
StaffReadCache = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [StaffRead_provider_1.default])
], StaffReadCache);
exports.default = StaffReadCache;
//# sourceMappingURL=StaffRead.cache.js.map