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
const UserRead_provider_1 = __importDefault(require("../providers/UserRead.provider"));
let UserReadCache = class UserReadCache {
    constructor(userReadProvider) {
        this.CACHE_EXPIRY = 60 * 5;
        this.redisClient = caching_1.default.getInstance();
        this.userReadProvider = userReadProvider;
    }
    async getAll(tenantId) {
        try {
            const cacheKey = `${tenantId}:user:all`;
            const cachedUsers = await this.redisClient.get(cacheKey);
            if (cachedUsers) {
                console.log("All User Cache HIT!");
                return JSON.parse(cachedUsers);
            }
            const users = await this.userReadProvider.getAll();
            console.log("All User Cache MISS!");
            if (ArrayUtil_1.default.any(users)) {
                await this.redisClient.set(cacheKey, JSON.stringify(users), {
                    EX: this.CACHE_EXPIRY,
                });
            }
            return users;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
    async getOneByCriteria(criteria) {
        try {
            const { tenantId } = criteria;
            const cacheKey = `${tenantId}:user:${JSON.stringify(criteria)}`;
            const cachedUser = await this.redisClient.get(cacheKey);
            if (cachedUser) {
                console.log("Criteria User Cache HIT!");
                return JSON.parse(cachedUser);
            }
            const user = await this.userReadProvider.getOneByCriteria(criteria);
            console.log("Criteria User Cache MISS!");
            if (user) {
                await this.redisClient.set(cacheKey, JSON.stringify(user), {
                    EX: this.CACHE_EXPIRY,
                });
            }
            return user;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
    async invalidate(tenantId) {
        try {
            // Find all keys matching criteria-based caches and delete them
            const keys = await this.redisClient.keys(`${tenantId}:user:*`);
            if (ArrayUtil_1.default.any(keys)) {
                await this.redisClient.del(keys);
                console.log("Criteria User Cache CLEARED!");
            }
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
};
UserReadCache.cacheName = "UserReadCache";
UserReadCache = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [UserRead_provider_1.default])
], UserReadCache);
exports.default = UserReadCache;
//# sourceMappingURL=UserRead.cache.js.map