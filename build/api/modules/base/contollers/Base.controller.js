"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpHeader_enum_1 = require("../../../shared/helpers/enums/HttpHeader.enum");
const ServiceContext_enum_1 = require("../../../shared/helpers/enums/ServiceContext.enum");
const StatusMapping_1 = __importDefault(require("../helpers/StatusMapping"));
const LoggingProviderFactory_1 = require("../../../../infrastructure/internal/logger/LoggingProviderFactory");
const PayloadEncryptService_1 = require("../../../shared/services/encryption/PayloadEncryptService");
class BaseController {
    constructor(serviceContext = ServiceContext_enum_1.ServiceContext.KENIA_EXPRESS) {
        this.serviceContext = serviceContext;
        this.loggingProvider = LoggingProviderFactory_1.LoggingProviderFactory.build();
    }
    setApiDocGenerator(apiDocGenerator) {
        this.apiDocGenerator = apiDocGenerator;
    }
    setRouter(router) {
        this.router = router;
    }
    addRoute(route) {
        const { produces, method, handlers, path, description, apiDoc } = route;
        produces.forEach(({ applicationStatus, httpStatus }) => this.setProducesCode(applicationStatus, httpStatus));
        if (!this.router) {
            throw new Error("Router not initialized, you should call setRouter before addRoute.");
        }
        // Calls the routes with the path and handlers i.e controllers
        this.router[method](path, ...handlers);
        if (this.apiDocGenerator) {
            this.apiDocGenerator.createRouteDoc({
                method,
                path,
                produces,
                description,
                apiDoc,
            });
        }
    }
    async handleResultData(res, next, servicePromise, headersToSet) {
        try {
            return await this.getResultData(res, await servicePromise, headersToSet);
        }
        catch (error) {
            return next(error);
        }
        finally {
            this.manageServiceTrace(res.trace);
        }
    }
    async handleResult(res, next, servicePromise, headersToSet) {
        try {
            return await this.getResult(res, await servicePromise, headersToSet);
        }
        catch (error) {
            return next(error);
        }
        finally {
            this.manageServiceTrace(res.trace);
        }
    }
    // <===========+ Helper Methods +============> //
    async getResultData(res, result, headersToSet) {
        this.setTransactionId(res);
        this.setHeaders(res, headersToSet);
        const encryptedResult = PayloadEncryptService_1.PayloadEncryptService.encrypt(result?.toResultDto());
        const encryptedResultWithoutMessage = PayloadEncryptService_1.PayloadEncryptService.encrypt(result?.toResultDto().data);
        res.status(Number(result.statusCode)).json(result.message ? encryptedResult : encryptedResultWithoutMessage);
    }
    setHeaders(res, headersToSet) {
        if (headersToSet) {
            Object.entries(headersToSet).forEach(([key, value]) => res.setHeader(key, value));
        }
    }
    async getResult(res, result, headersToSet) {
        this.setTransactionId(res);
        this.setHeaders(res, headersToSet);
        res.status(Number(result.statusCode)).json(result);
    }
    setProducesCode(applicationStatus, httpStatus) {
        if (!StatusMapping_1.default[applicationStatus]) {
            StatusMapping_1.default[applicationStatus] = httpStatus;
        }
    }
    setTransactionId(res) {
        res.setHeader(HttpHeader_enum_1.HttpHeaderEnum.TRANSACTION_ID, res.trace.transactionId);
    }
    async manageServiceTrace(trace) {
        if (trace?.context) {
            trace.finish(new Date());
            try {
                const logMessage = this.createServiceTraceLogMessage(trace);
                if (trace.success) {
                    this.loggingProvider.success(logMessage);
                }
                else {
                    this.loggingProvider.warning(logMessage);
                }
            }
            catch (error) {
                this.loggingProvider.error(`context: ${this.serviceContext} name: serviceTraceError message: ${error.message} stack: ${error.stack}`);
            }
        }
    }
    createServiceTraceLogMessage(trace) {
        return `
      Service Trace Log:
      Context: ${trace.context}
      Transaction ID: ${trace.transactionId}
      Origin: ${trace.origin}
      Client IP: ${trace.client?.ip}
      User Agent: ${trace.client?.agent}
      Start Date: ${trace.startDate}
      End Date: ${trace.endDate}
      Success: ${trace.success}
      Payload: ${JSON.stringify(trace.payload)}
      Metadata: ${JSON.stringify(trace.metadata)}
    `;
    }
}
exports.default = BaseController;
//# sourceMappingURL=Base.controller.js.map