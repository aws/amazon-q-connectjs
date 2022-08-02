(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["WisdomJS"] = factory();
	else
		root["WisdomJS"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 571:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
const index_1 = __webpack_require__(607);
(() => {
    const connect = __webpack_require__.g.connect || {};
    const wisdomjs = connect.WisdomJS || {};
    connect.wisdomjs = wisdomjs;
    __webpack_require__.g.connect = connect;
    wisdomjs.Client = index_1.Client;
    wisdomjs.WisdomClient = index_1.WisdomClient;
    wisdomjs.commands = {
        GetAuthorizedWidgetsForUser: index_1.GetAuthorizedWidgetsForUser,
        ListIntegrationAssociations: index_1.ListIntegrationAssociations,
        SearchSessions: index_1.SearchSessions,
        QueryAssistant: index_1.QueryAssistant,
        GetContent: index_1.GetContent,
        GetRecommendations: index_1.GetRecommendations,
        NotifyRecommendationsReceived: index_1.NotifyRecommendationsReceived,
        GetContact: index_1.GetContact,
    };
})();


/***/ }),

/***/ 934:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Client = void 0;
const runtimeConfig_browser_1 = __webpack_require__(673);
const serviceIds_1 = __webpack_require__(710);
class Client {
    constructor(config) {
        const _config = (0, runtimeConfig_browser_1.getRuntimeConfig)(config);
        this.config = _config;
        if (document.readyState === 'complete') {
            this.initFrameConduit();
        }
        else {
            document.addEventListener('readystatechange', () => {
                if (document.readyState === 'complete') {
                    this.initFrameConduit();
                }
            });
        }
    }
    initFrameConduit() {
        var _a, _b;
        if (this.config.frameWindow || this.config.instanceUrl.includes((_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.origin))
            return;
        const iframe = document.querySelector('iframe[src*="wisdom-v2"]');
        if (iframe && iframe.contentWindow) {
            this.config.frameWindow = iframe;
        }
        else {
            try {
                let container = document.querySelector('wisdom-container');
                if (!container) {
                    container = document.createElement('div');
                    container.id = 'wisdom-container';
                    document.body.appendChild(container);
                }
                (_b = window === null || window === void 0 ? void 0 : window.connect) === null || _b === void 0 ? void 0 : _b.agentApp.initApp(serviceIds_1.ServiceIds.Wisdom, 'wisdom-container', `${this.config.instanceUrl}/wisdom-v2/`, {
                    style: 'display: none',
                });
                this.config.frameWindow = document.getElementById(serviceIds_1.ServiceIds.Wisdom);
            }
            catch (e) {
                console.error('There was an error initializing Wisdom');
            }
        }
    }
    async call(command, options) {
        const handler = command.resolveRequestHandler(this.config, options);
        return handler().then((response) => response);
    }
}
exports.Client = Client;


/***/ }),

/***/ 849:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Command = void 0;
const httpRequest_1 = __webpack_require__(180);
const urlParser_1 = __webpack_require__(315);
const buildAmzTarget_1 = __webpack_require__(517);
class Command {
    serialize(configuration) {
        return new httpRequest_1.HttpRequest({
            ...(0, urlParser_1.parseUrl)(configuration.endpoint),
            headers: {
                ...configuration.headers,
                ...(0, buildAmzTarget_1.buildAmzTarget)(this.clientMethod, configuration),
            },
            body: JSON.stringify(this.clientInput),
            frameWindow: configuration.frameWindow,
        });
    }
}
exports.Command = Command;


/***/ }),

/***/ 378:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetAuthorizedWidgetsForUser = void 0;
const command_1 = __webpack_require__(849);
const clientMethods_1 = __webpack_require__(294);
const serviceIds_1 = __webpack_require__(710);
class GetAuthorizedWidgetsForUser extends command_1.Command {
    constructor(clientInput) {
        super();
        this.clientInput = clientInput;
        this.clientMethod = clientMethods_1.ClientMethods.GetAuthorizedWidgetsForUser;
    }
    resolveRequestHandler(configuration, options) {
        const { requestHandler } = configuration;
        return () => requestHandler.handle(this.serialize(configuration), options || {});
    }
    serialize(configuration) {
        return super.serialize({
            ...configuration,
            serviceId: serviceIds_1.ServiceIds.AgentApp,
        });
    }
}
exports.GetAuthorizedWidgetsForUser = GetAuthorizedWidgetsForUser;


/***/ }),

/***/ 93:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetContact = void 0;
const command_1 = __webpack_require__(849);
const clientMethods_1 = __webpack_require__(294);
const serviceIds_1 = __webpack_require__(710);
class GetContact extends command_1.Command {
    constructor(clientInput) {
        super();
        this.clientInput = clientInput;
        this.clientMethod = clientMethods_1.ClientMethods.GetContact;
    }
    resolveRequestHandler(configuration, options) {
        const { requestHandler } = configuration;
        return () => requestHandler.handle(this.serialize(configuration), options || {});
    }
    serialize(configuration) {
        const { awsAccountId, instanceId, contactId } = this.clientInput;
        if ((awsAccountId === undefined) || !awsAccountId.length) {
            throw new Error('Invalid awsAccountId.');
        }
        if ((instanceId === undefined) || !instanceId.length) {
            throw new Error('Invalid instanceId.');
        }
        if ((contactId === undefined) || !contactId.length) {
            throw new Error('Invalid contactId.');
        }
        return super.serialize({
            ...configuration,
            serviceId: serviceIds_1.ServiceIds.Lcms,
        });
    }
}
exports.GetContact = GetContact;


/***/ }),

/***/ 869:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetContent = void 0;
const command_1 = __webpack_require__(849);
const clientMethods_1 = __webpack_require__(294);
class GetContent extends command_1.Command {
    constructor(clientInput) {
        super();
        this.clientInput = clientInput;
        this.clientMethod = clientMethods_1.ClientMethods.GetContent;
    }
    resolveRequestHandler(configuration, options) {
        const { requestHandler } = configuration;
        return () => requestHandler.handle(this.serialize(configuration), options || {});
    }
    serialize(configuration) {
        const { contentId, knowledgeBaseId } = this.clientInput;
        if ((contentId === undefined) || !contentId.length) {
            throw new Error('Invalid contentId.');
        }
        if ((knowledgeBaseId === undefined) || !knowledgeBaseId.length) {
            throw new Error('Invalid knowledgeBaseId.');
        }
        return super.serialize(configuration);
    }
}
exports.GetContent = GetContent;


/***/ }),

/***/ 185:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetRecommendations = void 0;
const command_1 = __webpack_require__(849);
const clientMethods_1 = __webpack_require__(294);
class GetRecommendations extends command_1.Command {
    constructor(clientInput) {
        super();
        this.clientInput = clientInput;
        this.clientMethod = clientMethods_1.ClientMethods.GetRecommendations;
    }
    resolveRequestHandler(configuration, options) {
        const { requestHandler } = configuration;
        return () => requestHandler.handle(this.serialize(configuration), options || {});
    }
    serialize(configuration) {
        const { assistantId, sessionId } = this.clientInput;
        if ((assistantId === undefined) || !assistantId.length) {
            throw new Error('Invalid assistantId.');
        }
        if ((sessionId === undefined) || !sessionId.length) {
            throw new Error('Invalid sessionId.');
        }
        return super.serialize(configuration);
    }
}
exports.GetRecommendations = GetRecommendations;


/***/ }),

/***/ 885:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(655);
tslib_1.__exportStar(__webpack_require__(378), exports);
tslib_1.__exportStar(__webpack_require__(869), exports);
tslib_1.__exportStar(__webpack_require__(185), exports);
tslib_1.__exportStar(__webpack_require__(901), exports);
tslib_1.__exportStar(__webpack_require__(359), exports);
tslib_1.__exportStar(__webpack_require__(314), exports);
tslib_1.__exportStar(__webpack_require__(801), exports);
tslib_1.__exportStar(__webpack_require__(93), exports);


/***/ }),

/***/ 901:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListIntegrationAssociations = void 0;
const command_1 = __webpack_require__(849);
const clientMethods_1 = __webpack_require__(294);
const serviceIds_1 = __webpack_require__(710);
class ListIntegrationAssociations extends command_1.Command {
    constructor(clientInput) {
        super();
        this.clientInput = clientInput;
        this.clientMethod = clientMethods_1.ClientMethods.ListIntegrationAssociations;
    }
    resolveRequestHandler(configuration, options) {
        const { requestHandler } = configuration;
        return () => requestHandler.handle(this.serialize(configuration), options || {});
    }
    serialize(configuration) {
        const { InstanceId } = this.clientInput;
        if ((InstanceId === undefined) || !InstanceId.length) {
            throw new Error('Invalid InstanceId.');
        }
        return super.serialize({
            ...configuration,
            serviceId: serviceIds_1.ServiceIds.Acs,
        });
    }
}
exports.ListIntegrationAssociations = ListIntegrationAssociations;


/***/ }),

/***/ 359:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotifyRecommendationsReceived = void 0;
const command_1 = __webpack_require__(849);
const clientMethods_1 = __webpack_require__(294);
class NotifyRecommendationsReceived extends command_1.Command {
    constructor(clientInput) {
        super();
        this.clientInput = clientInput;
        this.clientMethod = clientMethods_1.ClientMethods.NotifyRecommendationsReceived;
    }
    resolveRequestHandler(configuration, options) {
        const { requestHandler } = configuration;
        return () => requestHandler.handle(this.serialize(configuration), options || {});
    }
    serialize(configuration) {
        const { assistantId, sessionId, recommendationIds } = this.clientInput;
        if ((assistantId === undefined) || !assistantId.length) {
            throw new Error('Invalid assistantId.');
        }
        if ((sessionId === undefined) || !sessionId.length) {
            throw new Error('Invalid sessionId.');
        }
        if ((recommendationIds === undefined) || !recommendationIds.length) {
            throw new Error('Invalid recommendationIds.');
        }
        return super.serialize(configuration);
    }
}
exports.NotifyRecommendationsReceived = NotifyRecommendationsReceived;


/***/ }),

/***/ 314:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QueryAssistant = void 0;
const command_1 = __webpack_require__(849);
const clientMethods_1 = __webpack_require__(294);
class QueryAssistant extends command_1.Command {
    constructor(clientInput) {
        super();
        this.clientInput = clientInput;
        this.clientMethod = clientMethods_1.ClientMethods.QueryAssistant;
    }
    resolveRequestHandler(configuration, options) {
        const { requestHandler } = configuration;
        return () => requestHandler.handle(this.serialize(configuration), options || {});
    }
    serialize(configuration) {
        const { assistantId, queryText } = this.clientInput;
        if ((assistantId === undefined) || !assistantId.length) {
            throw new Error('Invalid assistantId.');
        }
        if ((queryText === undefined) || !queryText.length) {
            throw new Error('Invalid queryText.');
        }
        return super.serialize(configuration);
    }
}
exports.QueryAssistant = QueryAssistant;


/***/ }),

/***/ 801:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SearchSessions = void 0;
const command_1 = __webpack_require__(849);
const clientMethods_1 = __webpack_require__(294);
class SearchSessions extends command_1.Command {
    constructor(clientInput) {
        super();
        this.clientInput = clientInput;
        this.clientMethod = clientMethods_1.ClientMethods.SearchSessions;
    }
    resolveRequestHandler(configuration, options) {
        const { requestHandler } = configuration;
        return () => requestHandler.handle(this.serialize(configuration), options || {});
    }
    serialize(configuration) {
        var _a;
        const { assistantId, searchExpression } = this.clientInput;
        if ((assistantId === undefined) || !assistantId.length) {
            throw new Error('Invalid assistantId.');
        }
        if ((searchExpression === undefined) || !(searchExpression === null || searchExpression === void 0 ? void 0 : searchExpression.filters) || !((_a = searchExpression === null || searchExpression === void 0 ? void 0 : searchExpression.filters) === null || _a === void 0 ? void 0 : _a.length)) {
            throw new Error('Invalid searchExpression.');
        }
        return super.serialize(configuration);
    }
}
exports.SearchSessions = SearchSessions;


/***/ }),

/***/ 419:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FetchHttpHandler = void 0;
const communicationProxy_1 = __webpack_require__(477);
class FetchHttpHandler {
    constructor(config) {
        this.config = config !== null && config !== void 0 ? config : {};
        (0, communicationProxy_1.subscribeToChannel)(this.fetchRequestHandler.bind(this));
    }
    async responseHandler(response) {
        const { status, statusText, ok, headers, body } = response;
        const fetchHeaders = headers;
        const transformedHeaders = {};
        for (const pair of fetchHeaders.entries()) {
            transformedHeaders[pair[0]] = pair[1];
        }
        const hasReadableStream = body !== undefined;
        if (!hasReadableStream) {
            return response.blob()
                .then(() => {
                return {
                    status,
                    statusText,
                    ok,
                    headers: transformedHeaders,
                    body: response.json(),
                };
            });
        }
        const reader = body.getReader();
        let res = new Uint8Array(0);
        let isDone = false;
        while (!isDone) {
            const { done, value } = await reader.read();
            if (value) {
                const prior = res;
                res = new Uint8Array(prior.length + value.length);
                res.set(prior);
                res.set(value, prior.length);
            }
            isDone = done;
        }
        return {
            status,
            statusText,
            ok,
            headers: transformedHeaders,
            body: JSON.parse(new TextDecoder('utf8').decode(res)),
        };
    }
    async fetchRequestHandler(url, options) {
        const response = await fetch(url, options);
        return this.responseHandler(response);
    }
    async fetchRequest(url, options, frameWindow) {
        try {
            if (frameWindow) {
                const response = await (0, communicationProxy_1.fetchWithChannel)(frameWindow.contentWindow, frameWindow.src, { url, options });
                return Promise.resolve(response);
            }
            else {
                return this.fetchRequestHandler(url, options);
            }
        }
        catch (e) {
            console.log('Something went wrong during request.', e);
            return Promise.reject(e);
        }
    }
    requestTimeout(timeoutInMs) {
        return new Promise((_, reject) => {
            if (timeoutInMs) {
                setTimeout(() => {
                    const timeoutError = new Error(`Request did not complete within ${timeoutInMs} ms.`);
                    timeoutError.name = "TimeoutError";
                    reject(timeoutError);
                }, timeoutInMs);
            }
        });
    }
    abortRequest(abortSignal) {
        return new Promise((_, reject) => {
            if (abortSignal) {
                abortSignal.onabort = () => {
                    const abortError = new Error('Request aborted.');
                    abortError.name = 'AbortError';
                    reject(abortError);
                };
            }
        });
    }
    handle(request, options) {
        const { abortSignal } = options || {};
        const { requestTimeout } = this.config || {};
        if (abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.aborted) {
            const abortError = new Error("Request aborted");
            abortError.name = "AbortError";
            return Promise.reject(abortError);
        }
        const { protocol, hostname, port, path, method, headers, body, frameWindow } = request;
        const url = `${protocol}//${hostname}${port ? `:${port}` : ''}${path}`;
        const requestOptions = {
            method,
            headers,
            body,
            ...(!frameWindow && AbortController && abortSignal && { signal: abortSignal }),
        };
        return Promise.race([
            this.fetchRequest(url, requestOptions, frameWindow),
            this.requestTimeout(requestTimeout),
            this.abortRequest(abortSignal),
        ]);
    }
}
exports.FetchHttpHandler = FetchHttpHandler;


/***/ }),

/***/ 180:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpRequest = void 0;
class HttpRequest {
    constructor(options) {
        this.method = options.method || 'POST';
        this.protocol = options.protocol
            ? options.protocol.charAt(options.protocol.length - 1) !== ':'
                ? `${options.protocol}:`
                : options.protocol
            : 'https:';
        this.hostname = options.hostname || 'localhost';
        this.port = options.port;
        this.path = options.path && options.path !== '/'
            ? options.path.charAt(0) !== '/'
                ? `/${options.path}`
                : options.path
            : '/agent-app/api';
        this.query = options.query || {};
        this.headers = options.headers || {};
        this.body = options.body;
        this.frameWindow = options.frameWindow;
    }
}
exports.HttpRequest = HttpRequest;


/***/ }),

/***/ 607:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(655);
tslib_1.__exportStar(__webpack_require__(934), exports);
tslib_1.__exportStar(__webpack_require__(863), exports);
tslib_1.__exportStar(__webpack_require__(885), exports);


/***/ }),

/***/ 253:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppNames = void 0;
var AppNames;
(function (AppNames) {
    AppNames["WisdomJS"] = "wisdom-js";
    AppNames["WisdomUI"] = "wisdom-ui";
})(AppNames = exports.AppNames || (exports.AppNames = {}));


/***/ }),

/***/ 416:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CallSources = void 0;
var CallSources;
(function (CallSources) {
    CallSources["AgentApp"] = "agent-app";
})(CallSources = exports.CallSources || (exports.CallSources = {}));


/***/ }),

/***/ 294:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientMethods = void 0;
var ClientMethods;
(function (ClientMethods) {
    ClientMethods["GetAuthorizedWidgetsForUser"] = "getAuthorizedWidgetsForUser";
    ClientMethods["GetContent"] = "getContent";
    ClientMethods["GetRecommendations"] = "getRecommendations";
    ClientMethods["ListIntegrationAssociations"] = "listIntegrationAssociations";
    ClientMethods["NotifyRecommendationsReceived"] = "notifyRecommendationsReceived";
    ClientMethods["QueryAssistant"] = "queryAssistant";
    ClientMethods["SearchSessions"] = "searchSessions";
    ClientMethods["GetContact"] = "getContact";
})(ClientMethods = exports.ClientMethods || (exports.ClientMethods = {}));


/***/ }),

/***/ 710:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceIds = void 0;
var ServiceIds;
(function (ServiceIds) {
    ServiceIds["Wisdom"] = "Wisdom";
    ServiceIds["AgentApp"] = "AgentApp";
    ServiceIds["Acs"] = "Acs";
    ServiceIds["Lcms"] = "Lcms";
})(ServiceIds = exports.ServiceIds || (exports.ServiceIds = {}));


/***/ }),

/***/ 924:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WidgetServices = void 0;
var WidgetServices;
(function (WidgetServices) {
    WidgetServices["Wisdom"] = "WisdomV2";
    WidgetServices["AgentApp"] = "AgentApp";
    WidgetServices["Acs"] = "Acs";
    WidgetServices["Lcms"] = "Lcms";
})(WidgetServices = exports.WidgetServices || (exports.WidgetServices = {}));


/***/ }),

/***/ 600:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.generateEndpoint = void 0;
const urlParser_1 = __webpack_require__(315);
const generateEndpoint = (instanceUrl) => {
    const { hostname, port, protocol, path } = (0, urlParser_1.parseUrl)(instanceUrl);
    return `${protocol}//${hostname}${port ? `:${port}` : ''}${path.replace(/\/$/, '')}/agent-app/api`;
};
exports.generateEndpoint = generateEndpoint;


/***/ }),

/***/ 517:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.buildAmzTarget = void 0;
const widgetServices_1 = __webpack_require__(924);
const buildAmzTarget = (clientMethod, { serviceId }) => {
    return {
        'x-amz-target': `AgentAppService.${widgetServices_1.WidgetServices[serviceId]}.${clientMethod}`,
    };
};
exports.buildAmzTarget = buildAmzTarget;


/***/ }),

/***/ 477:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.subscribeToChannel = exports.fetchWithChannel = void 0;
const appNames_1 = __webpack_require__(253);
const fetchWithChannel = (destination, origin, data) => {
    return new Promise((resolve, reject) => {
        try {
            const channel = new MessageChannel();
            const { port1, port2 } = channel;
            port1.onmessage = (e) => {
                port1.close();
                resolve(e.data.data);
            };
            destination.postMessage({
                source: appNames_1.AppNames.WisdomJS,
                data,
            }, origin, [port2]);
        }
        catch (e) {
            reject(e);
        }
    });
};
exports.fetchWithChannel = fetchWithChannel;
const subscribeToChannel = (cb) => {
    window.addEventListener('message', async (e) => {
        if (e.data.source !== appNames_1.AppNames.WisdomJS)
            return;
        const port = e.ports[0];
        const { url, options } = e.data.data;
        const response = await cb(url, options);
        port.postMessage({
            source: appNames_1.AppNames.WisdomUI,
            data: response,
        });
    });
};
exports.subscribeToChannel = subscribeToChannel;


/***/ }),

/***/ 842:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getDefaultHeaders = void 0;
const BASE_HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};
const getDefaultHeaders = ({ callSource, serviceId }) => {
    return {
        ...BASE_HEADERS,
        'x-amazon-call-source': callSource,
        'x-amz-access-section': serviceId,
    };
};
exports.getDefaultHeaders = getDefaultHeaders;


/***/ }),

/***/ 673:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRuntimeConfig = void 0;
const runtimeConfig_shared_1 = __webpack_require__(157);
const fetchHttpHandler_1 = __webpack_require__(419);
const getDefaultHeaders_1 = __webpack_require__(842);
const DEFAULT_MAX_ATTEMPTS = 3;
const getRuntimeConfig = (config) => {
    var _a, _b, _c;
    const sharedRuntimeConfig = (0, runtimeConfig_shared_1.getRuntimeConfig)(config);
    return {
        ...sharedRuntimeConfig,
        ...config,
        headers: (_a = config.headers) !== null && _a !== void 0 ? _a : (0, getDefaultHeaders_1.getDefaultHeaders)(sharedRuntimeConfig),
        maxAttempts: (_b = config.maxAttempts) !== null && _b !== void 0 ? _b : DEFAULT_MAX_ATTEMPTS,
        requestHandler: (_c = config.requestHandler) !== null && _c !== void 0 ? _c : new fetchHttpHandler_1.FetchHttpHandler(),
    };
};
exports.getRuntimeConfig = getRuntimeConfig;


/***/ }),

/***/ 157:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRuntimeConfig = void 0;
const urlParser_1 = __webpack_require__(315);
const callSources_1 = __webpack_require__(416);
const serviceIds_1 = __webpack_require__(710);
const appConfig_1 = __webpack_require__(600);
const getRuntimeConfig = (config) => {
    var _a, _b, _c, _d;
    return {
        logger: (_a = config === null || config === void 0 ? void 0 : config.logger) !== null && _a !== void 0 ? _a : {},
        serviceId: (_b = config === null || config === void 0 ? void 0 : config.serviceId) !== null && _b !== void 0 ? _b : serviceIds_1.ServiceIds.Wisdom,
        callSource: (_c = config === null || config === void 0 ? void 0 : config.callSource) !== null && _c !== void 0 ? _c : callSources_1.CallSources.AgentApp,
        instanceUrl: (_d = config === null || config === void 0 ? void 0 : config.instanceUrl) !== null && _d !== void 0 ? _d : (0, urlParser_1.getBaseUrl)(),
        endpoint: (config === null || config === void 0 ? void 0 : config.endpoint) || (0, appConfig_1.generateEndpoint)((config === null || config === void 0 ? void 0 : config.instanceUrl) || (0, urlParser_1.getBaseUrl)()),
    };
};
exports.getRuntimeConfig = getRuntimeConfig;


/***/ }),

/***/ 315:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseUrl = exports.getBaseUrl = void 0;
const getBaseUrl = () => {
    return __webpack_require__.g.location.href;
};
exports.getBaseUrl = getBaseUrl;
const parseUrl = (url) => {
    const { hostname, pathname, port, protocol } = new URL(url);
    return {
        hostname,
        port: port ? parseInt(port) : undefined,
        protocol,
        path: pathname,
    };
};
exports.parseUrl = parseUrl;


/***/ }),

/***/ 863:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WisdomClient = void 0;
const client_1 = __webpack_require__(934);
const commands_1 = __webpack_require__(885);
class WisdomClient extends client_1.Client {
    constructor(config) {
        super(config);
    }
    getAuthorizedWidgetsForUser(args, options) {
        const command = new commands_1.GetAuthorizedWidgetsForUser(args);
        return this.call(command, options);
    }
    getContent(args, options) {
        const command = new commands_1.GetContent(args);
        return this.call(command, options);
    }
    getRecommendations(args, options) {
        const command = new commands_1.GetRecommendations(args);
        return this.call(command, options);
    }
    listIntegrationAssociations(args, options) {
        const command = new commands_1.ListIntegrationAssociations(args);
        return this.call(command, options);
    }
    notifyRecommendationsReceived(args, options) {
        const command = new commands_1.NotifyRecommendationsReceived(args);
        return this.call(command, options);
    }
    queryAssistant(args, options) {
        const command = new commands_1.QueryAssistant(args);
        return this.call(command, options);
    }
    searchSessions(args, options) {
        const command = new commands_1.SearchSessions(args);
        return this.call(command, options);
    }
    getContact(args, options) {
        const command = new commands_1.GetContact(args);
        return this.call(command, options);
    }
}
exports.WisdomClient = WisdomClient;


/***/ }),

/***/ 655:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "__assign": () => (/* binding */ __assign),
/* harmony export */   "__asyncDelegator": () => (/* binding */ __asyncDelegator),
/* harmony export */   "__asyncGenerator": () => (/* binding */ __asyncGenerator),
/* harmony export */   "__asyncValues": () => (/* binding */ __asyncValues),
/* harmony export */   "__await": () => (/* binding */ __await),
/* harmony export */   "__awaiter": () => (/* binding */ __awaiter),
/* harmony export */   "__classPrivateFieldGet": () => (/* binding */ __classPrivateFieldGet),
/* harmony export */   "__classPrivateFieldIn": () => (/* binding */ __classPrivateFieldIn),
/* harmony export */   "__classPrivateFieldSet": () => (/* binding */ __classPrivateFieldSet),
/* harmony export */   "__createBinding": () => (/* binding */ __createBinding),
/* harmony export */   "__decorate": () => (/* binding */ __decorate),
/* harmony export */   "__exportStar": () => (/* binding */ __exportStar),
/* harmony export */   "__extends": () => (/* binding */ __extends),
/* harmony export */   "__generator": () => (/* binding */ __generator),
/* harmony export */   "__importDefault": () => (/* binding */ __importDefault),
/* harmony export */   "__importStar": () => (/* binding */ __importStar),
/* harmony export */   "__makeTemplateObject": () => (/* binding */ __makeTemplateObject),
/* harmony export */   "__metadata": () => (/* binding */ __metadata),
/* harmony export */   "__param": () => (/* binding */ __param),
/* harmony export */   "__read": () => (/* binding */ __read),
/* harmony export */   "__rest": () => (/* binding */ __rest),
/* harmony export */   "__spread": () => (/* binding */ __spread),
/* harmony export */   "__spreadArray": () => (/* binding */ __spreadArray),
/* harmony export */   "__spreadArrays": () => (/* binding */ __spreadArrays),
/* harmony export */   "__values": () => (/* binding */ __values)
/* harmony export */ });
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});

function __exportStar(m, o) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

/** @deprecated */
function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

/** @deprecated */
function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

function __classPrivateFieldIn(state, receiver) {
    if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
    return typeof state === "function" ? receiver === state : state.has(receiver);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	__webpack_require__(571);
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(607);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});