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
const ArrayUtil_1 = __importDefault(require("../../../../utils/ArrayUtil"));
const caching_1 = __importDefault(require("../../../../infrastructure/internal/caching"));
const StudentRead_provider_1 = __importDefault(require("../providers/StudentRead.provider"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
let StudentReadCache = class StudentReadCache {
    constructor(studentReadProvider) {
        this.CACHE_EXPIRY = 60 * 5;
        this.redisClient = caching_1.default.getInstance();
        this.studentReadProvider = studentReadProvider;
    }
    async getByCriteria(criteria) {
        try {
            const cacheKey = `${criteria.tenantId}:student:${JSON.stringify(criteria)}`;
            const cachedStudents = await this.redisClient.get(cacheKey);
            if (cachedStudents) {
                // console.log("Criteria Student Cache HIT!");
                return JSON.parse(cachedStudents);
            }
            const students = await this.studentReadProvider.getByCriteria(criteria);
            // console.log("Criteria Student Cache MISS!");
            if (ArrayUtil_1.default.any(students)) {
                await this.redisClient.set(cacheKey, JSON.stringify(students), {
                    EX: this.CACHE_EXPIRY,
                });
            }
            return students;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
    async invalidate(tenantId) {
        try {
            const keys = await this.redisClient.keys(`${tenantId}:student:*`);
            if (ArrayUtil_1.default.any(keys)) {
                await this.redisClient.del(keys);
                console.log("Criteria Student Cache CLEARED!");
            }
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
    async getOneByCriteria(criteria) {
        try {
            const cacheKey = `${criteria.tenantId}:student:${JSON.stringify(criteria)}`;
            const cachedStudent = await this.redisClient.get(cacheKey);
            if (cachedStudent) {
                console.log("Criteria Single Student Cache HIT!");
                return JSON.parse(cachedStudent);
            }
            const student = await this.studentReadProvider.getOneByCriteria(criteria);
            console.log("Criteria Single Student Cache MISS!");
            if (student) {
                await this.redisClient.set(cacheKey, JSON.stringify(student), {
                    EX: this.CACHE_EXPIRY,
                });
            }
            return student;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
};
StudentReadCache.cacheName = "StudentReadCache";
StudentReadCache = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [StudentRead_provider_1.default])
], StudentReadCache);
exports.default = StudentReadCache;
//# sourceMappingURL=StudentRead.cache.js.map