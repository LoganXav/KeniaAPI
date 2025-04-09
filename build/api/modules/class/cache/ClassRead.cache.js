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
const caching_1 = __importDefault(require("../../../../infrastructure/internal/caching"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
const ArrayUtil_1 = __importDefault(require("../../../../utils/ArrayUtil"));
const ClassRead_provider_1 = __importDefault(require("../providers/ClassRead.provider"));
let ClassReadCache = class ClassReadCache {
    constructor(classReadProvider) {
        this.CACHE_EXPIRY = 60 * 5;
        this.redisClient = caching_1.default.getInstance();
        this.classReadProvider = classReadProvider;
    }
    async getByCriteria(criteria) {
        try {
            const cacheKey = `${criteria.tenantId}:class:${JSON.stringify(criteria)}`;
            const cachedClasses = await this.redisClient.get(cacheKey);
            if (cachedClasses) {
                console.log("Criteria Class Cache HIT!");
                return JSON.parse(cachedClasses);
            }
            const classes = await this.classReadProvider.getByCriteria(criteria);
            console.log("Criteria Class Cache MISS!");
            if (ArrayUtil_1.default.any(classes)) {
                await this.redisClient.set(cacheKey, JSON.stringify(classes), {
                    EX: this.CACHE_EXPIRY,
                });
            }
            return classes;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
    async invalidate(tenantId) {
        try {
            // Find all keys matching criteria-based caches and delete them
            const keys = await this.redisClient.keys(`${tenantId}:class:*`);
            if (ArrayUtil_1.default.any(keys)) {
                await this.redisClient.del(keys);
                console.log("Criteria Class Cache CLEARED!");
            }
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
    async getOneByCriteria(criteria) {
        try {
            const { tenantId } = criteria;
            const cacheKey = `${tenantId}:class:${JSON.stringify(criteria)}`;
            const cachedClass = await this.redisClient.get(cacheKey);
            if (cachedClass) {
                // console.log("Criteria Single Class Cache HIT!");
                return JSON.parse(cachedClass);
            }
            const _class = await this.classReadProvider.getOneByCriteria(criteria);
            // console.log("Criteria Single Class Cache MISS!");
            if (_class) {
                await this.redisClient.set(cacheKey, JSON.stringify(_class), {
                    EX: this.CACHE_EXPIRY,
                });
            }
            return _class;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
};
ClassReadCache.cacheName = "ClassReadCache";
ClassReadCache = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [ClassRead_provider_1.default])
], ClassReadCache);
exports.default = ClassReadCache;
//# sourceMappingURL=ClassRead.cache.js.map