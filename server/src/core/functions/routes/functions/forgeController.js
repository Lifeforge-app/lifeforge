/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @fileoverview Forge Controller - Type-safe Express.js route controller builder
 *
 * This module provides a fluent API for creating Express.js route controllers with:
 * - Automatic request/response validation using Zod schemas
 * - Type-safe request handlers with full TypeScript inference
 * - Built-in error handling and standardized responses
 * - Middleware support and existence checking for referenced entities
 * - Support for downloadable content and custom response handling
 *
 * The main exports are:
 * - `forgeController`: Factory for creating new controller builders
 * - `bulkRegisterControllers`: Utility for registering multiple controllers
 *
 * @example
 * ```typescript
 * const controller = forgeController
 *   .route('POST /users')
 *   .input({
 *     body: z.object({ name: z.string(), email: z.string().email() })
 *   })
 *   .callback(async ({ body, pb }) => {
 *     const user = await pb.collection('users').create(body)
 *     return { id: user.id, success: true }
 *   })
 * // controller now has OutputType = { id: string, success: boolean }
 * type ControllerOutput = InferControllerOutput<typeof controller>
 *
 * controller.register(router)
 * ```
 */
import { PBService, checkExistence } from '@functions/database';
import { BaseResponse } from '@typescript/base_response';
import { Request, Response } from 'express';
import { Server } from 'socket.io';
import { Context, InferZodType, InputSchema } from '../../../../../../shared/src/typescript/forge_controller.types';
import { ClientError, clientError, serverError, successWithBaseResponse } from '../utils/response';
/**
 * A fluent builder class for creating type-safe Express.js route controllers with validation.
 * Provides comprehensive schema validation, middleware support, and automatic error handling.
 *
 * @template TInput - InputSchema containing body, query, and params validation schemas
 * @template TOutput - The inferred return type from the callback function
 *
 * @example
 * ```typescript
 * const controller = new ForgeControllerBuilder()
 *   .route('POST /users')
 *   .input({
 *     body: z.object({ name: z.string() }),
 *     params: z.object({ id: z.string() })
 *   })
 *   .callback(async ({ body, params }) => {
 *     // Handler logic here
 *     return { success: true }
 *   })
 * ```
 */
export class ForgeControllerBuilder {
    /** The HTTP method for this route (get, post, put, patch, delete) */
    _method = 'get';
    /** The URL path for this route */
    _path = '';
    /** Array of Express middleware functions to apply to this route */
    _middlewares = [];
    /** Zod validation schemas for request body, query, and params */
    _schema = {
        body: undefined,
        query: undefined,
        params: undefined
    };
    /** HTTP status code to return on successful response */
    _statusCode = 200;
    /** Whether to skip sending the default success response */
    _noDefaultResponse = false;
    /** Configuration for automatic existence checking of referenced entities */
    _existenceCheck = {};
    /** Human-readable description of what this endpoint does */
    _description = '';
    /** Whether this endpoint returns downloadable content */
    _isDownloadable = false;
    /** The main request handler function with proper typing for request/response objects */
    _handler;
    /**
     * Creates a new builder instance with updated schema types while preserving current configuration.
     * This is used internally to maintain immutability when chaining methods.
     *
     * @template NewInput - New input schema type
     * @template NewOutput - New output type
     * @param overrides - Partial schema overrides to apply
     * @returns New builder instance with updated types
     */
    cloneWith(overrides) {
        const builder = new ForgeControllerBuilder();
        builder._method = this._method;
        builder._path = this._path;
        builder._middlewares = [...this._middlewares];
        builder._schema = { ...this._schema, ...overrides };
        builder._statusCode = this._statusCode;
        builder._existenceCheck = this._existenceCheck;
        builder._noDefaultResponse = this._noDefaultResponse;
        builder._description = this._description;
        builder._isDownloadable = this._isDownloadable;
        return builder;
    }
    /**
     * Sets the HTTP method and path for this route controller.
     *
     * @param routeString - Route definition in format "METHOD /path" (e.g., "GET /users" or "POST /users/:id")
     * @returns This builder instance for method chaining
     * @throws {Error} When route string format is invalid or method is not supported
     *
     * @example
     * ```typescript
     * controller.route('GET /users/:id')
     * controller.route('POST /users')
     * ```
     */
    route(routeString) {
        const parts = routeString.split(' ');
        if (parts.length !== 2) {
            throw new Error("Route string must be in the format 'METHOD /path'. Example: 'GET /users'");
        }
        this._method = parts[0].toLowerCase();
        if (!['get', 'post', 'put', 'patch', 'delete'].includes(this._method)) {
            throw new Error(`Invalid method: ${this._method}. Must be one of: get, post, put, patch, delete.`);
        }
        if (!parts[1].startsWith('/')) {
            throw new Error(`Path must start with a slash. Given: ${this._path}. Example: '/users'`);
        }
        this._path = parts[1];
        return this;
    }
    /**
     * Adds Express middleware functions to be executed before the main route handler.
     * Middleware functions are executed in the order they are added.
     *
     * @param middlewares - One or more Express middleware functions
     * @returns This builder instance for method chaining
     *
     * @example
     * ```typescript
     * controller.middlewares(authMiddleware, validationMiddleware)
     * ```
     */
    middlewares(...middlewares) {
        this._middlewares.push(...middlewares);
        return this;
    }
    /**
     * Sets Zod validation schemas for request input (body, query parameters, and route parameters).
     * This enables automatic validation and type inference for the route handler.
     *
     * @template T - Object containing optional input schema definitions
     * @param input - Object with optional body, query, and params Zod schemas
     * @returns New builder instance with updated input schema types
     *
     * @example
     * ```typescript
     * controller.input({
     *   body: z.object({ name: z.string(), age: z.number() }),
     *   query: z.object({ page: z.string().optional() }),
     *   params: z.object({ id: z.string() })
     * })
     * ```
     */
    input(input) {
        return this.cloneWith({
            ...input
        });
    }
    /**
     * Sets the HTTP status code to return on successful response.
     *
     * @param code - HTTP status code (e.g., 200, 201, 204)
     * @returns This builder instance for method chaining
     *
     * @example
     * ```typescript
     * controller.statusCode(201) // For created resources
     * controller.statusCode(204) // For no content responses
     * ```
     */
    statusCode(code) {
        this._statusCode = code;
        return this;
    }
    /**
     * Disables the automatic success response wrapper.
     * Use this when you need full control over the response format or for streaming responses.
     *
     * @returns This builder instance for method chaining
     *
     * @example
     * ```typescript
     * controller
     *   .noDefaultResponse()
     *   .callback(({ res }) => {
     *     res.json({ custom: 'response' }) // Manual response handling
     *   })
     * ```
     */
    noDefaultResponse() {
        this._noDefaultResponse = true;
        return this;
    }
    /**
     * Configures automatic existence validation for referenced entities in request data.
     * Before the main handler executes, specified fields will be checked against database collections.
     *
     * @template T - The request section to validate ('params' | 'body' | 'query')
     * @param type - Which part of the request to validate
     * @param map - Mapping of field names to collection names for existence checking
     * @returns This builder instance for method chaining
     *
     * @example
     * ```typescript
     * // Check if user exists when userId is provided in request body
     * controller.existenceCheck('body', { userId: 'users' })
     *
     * // Check optional fields (wrapped in brackets)
     * controller.existenceCheck('query', { categoryId: '[categories]' })
     *
     * // Check arrays of IDs
     * controller.existenceCheck('body', { tagIds: 'tags' })
     * ```
     */
    existenceCheck(type, map) {
        this._existenceCheck[type] = map;
        return this;
    }
    /**
     * Sets a human-readable description for this endpoint.
     * This description can be used for API documentation generation.
     *
     * @param desc - Descriptive text explaining what this endpoint does
     * @returns This builder instance for method chaining
     *
     * @example
     * ```typescript
     * controller.description('Creates a new user account with email verification')
     * ```
     */
    description(desc) {
        this._description = desc;
        return this;
    }
    /**
     * Marks this endpoint as returning downloadable content.
     * Sets appropriate headers and disables the default response wrapper.
     * Automatically sets status code to 200 and enables noDefaultResponse.
     *
     * @returns This builder instance for method chaining
     *
     * @example
     * ```typescript
     * controller
     *   .isDownloadable()
     *   .callback(({ res }) => {
     *     res.setHeader('Content-Disposition', 'attachment; filename="export.csv"')
     *     res.send(csvData)
     *   })
     * ```
     */
    isDownloadable() {
        this._isDownloadable = true;
        this._noDefaultResponse = true;
        this._statusCode = 200;
        return this;
    }
    /**
     * Sets the main request handler function with comprehensive error handling and validation.
     * The callback receives validated and typed request data along with response utilities.
     * The return type is automatically inferred and made available as a generic parameter.
     *
     * @param cb - The route handler function that processes the request
     * @returns New builder instance with inferred output type
     *
     * @example
     * ```typescript
     * const controller = controller.callback(async ({ req, res, body, params, query, pb, io }) => {
     *   // body, params, query are fully typed based on input schemas
     *   const user = await pb.collection('users').getOne(params.id)
     *   return { success: true, user } // Return type is automatically inferred and captured
     * })
     * // controller now has the return type { success: boolean, user: User } as OutputType
     * ```
     */
    callback(cb) {
        const schema = this._schema;
        const options = {
            statusCode: this._statusCode,
            noDefaultResponse: this._noDefaultResponse,
            existenceCheck: this._existenceCheck,
            isDownloadable: this._isDownloadable
        };
        async function __handler(req, res) {
            try {
                for (const type of ['body', 'query', 'params']) {
                    const validator = schema[type];
                    if (validator) {
                        const result = validator.safeParse(req[type]);
                        if (!result.success) {
                            return clientError(res, {
                                location: type,
                                message: JSON.parse(result.error.message)
                            });
                        }
                        if (type === 'body') {
                            req.body = result.data;
                        }
                        else if (type === 'query') {
                            req.query = result.data;
                        }
                        else if (type === 'params') {
                            req.params = result.data;
                        }
                    }
                    if (options.existenceCheck?.[type]) {
                        for (const [key, collection] of Object.entries(options.existenceCheck[type])) {
                            const optional = collection.match(/\^?\[(.*)\]$/);
                            const value = req[type][key];
                            if (optional && !value)
                                continue;
                            if (Array.isArray(value)) {
                                for (const val of value) {
                                    if (!(await checkExistence(req, res, collection.replace(/\^?\[(.*)\]$/, '$1'), val))) {
                                        return;
                                    }
                                }
                            }
                            else {
                                if (!(await checkExistence(req, res, collection.replace(/\^?\[(.*)\]$/, '$1'), value))) {
                                    return;
                                }
                            }
                        }
                    }
                }
                if (options.isDownloadable) {
                    res.setHeader('X-Lifeforge-Downloadable', 'true');
                    res.setHeader('Access-Control-Expose-Headers', 'X-Lifeforge-Downloadable');
                }
                const result = await cb({
                    req,
                    res,
                    io: req.io,
                    pb: req.pb,
                    params: req.params,
                    body: req.body,
                    query: req.query
                });
                if (!options.noDefaultResponse) {
                    res.status(options.statusCode || 200);
                    successWithBaseResponse(res, result);
                }
            }
            catch (err) {
                if (ClientError.isClientError(err)) {
                    return clientError(res, err.message, err.code);
                }
                console.error('Internal error:', err instanceof Error ? err.message : err);
                serverError(res, 'Internal server error');
            }
        }
        __handler.meta = {
            description: this._description,
            schema,
            options
        };
        this._handler = __handler;
        // Create a new builder instance with the inferred return type
        const newBuilder = new ForgeControllerBuilder();
        newBuilder._method = this._method;
        newBuilder._path = this._path;
        newBuilder._middlewares = [...this._middlewares];
        newBuilder._schema = this._schema;
        newBuilder._statusCode = this._statusCode;
        newBuilder._existenceCheck = this._existenceCheck;
        newBuilder._noDefaultResponse = this._noDefaultResponse;
        newBuilder._description = this._description;
        newBuilder._isDownloadable = this._isDownloadable;
        newBuilder._handler = __handler;
        return newBuilder;
    }
    /**
     * Registers this controller with an Express router.
     * This must be called after setting up the route, schema, and callback.
     *
     * @param router - Express router instance to register the route with
     * @throws {Error} When path, method, or handler are missing
     *
     * @example
     * ```typescript
     * import forgeRouter from '@functions/forgeRouter'
     * controller.register(router)
     * ```
     */
    register(router) {
        if (!this._path || !this._method) {
            throw new Error('Missing path or method. Use route() before register()');
        }
        if (!this._handler) {
            throw new Error('Missing handler. Use .callback() before .register()');
        }
        router[this._method](this._path, ...this._middlewares, this._handler);
    }
}
/**
 * Initial builder class that requires input schemas to be set before proceeding.
 * This enforces the pattern where routes must have input validation defined.
 */
class ForgeControllerBuilderWithoutSchema {
    /** The route string in "METHOD /path" format */
    _routeString;
    /** Human-readable description of what this endpoint does */
    _description = '';
    /**
     * Creates a new builder instance that requires schema configuration.
     *
     * @param routeString - Route definition in "METHOD /path" format
     */
    constructor(routeString) {
        this._routeString = routeString;
    }
    /**
     * Sets a description for this endpoint before schema configuration.
     *
     * @param desc - Descriptive text explaining what this endpoint does
     * @returns This builder instance for method chaining
     */
    description(desc) {
        this._description = desc;
        return this;
    }
    /**
     * Sets the input validation schemas and transitions to the full builder.
     * This method transforms the initial builder into a fully-featured controller builder.
     *
     * @template T - Object containing optional input schema definitions
     * @param input - Object with optional body, query, and params Zod schemas
     * @returns New fully-featured builder instance with input schema types applied
     *
     * @example
     * ```typescript
     * forgeController
     *   .route('POST /users')
     *   .input({
     *     body: z.object({ name: z.string() }),
     *     params: z.object({ id: z.string() })
     *   })
     *   .callback(async ({ body }) => {
     *     // body is now typed
     *     return { success: true }
     *   })
     * ```
     */
    input(input) {
        return new ForgeControllerBuilder()
            .input(input)
            .route(this._routeString)
            .description(this._description);
    }
}
/**
 * Main factory object for creating type-safe route controllers.
 * Provides a fluent API for building Express route handlers with validation.
 *
 * @example
 * ```typescript
 * const getUserController = forgeController
 *   .route('GET /users/:id')
 *   .description('Retrieves a single user by ID')
 *   .input({
 *     params: z.object({ id: z.string() })
 *   })
 *   .existenceCheck('params', { id: 'users' })
 *   .callback(async ({ params, pb }) => {
 *     const user = await pb.collection('users').getOne(params.id)
 *     return { user }
 *   })
 * // getUserController now has OutputType = { user: User }
 * type UserOutput = InferControllerOutput<typeof getUserController>
 * ```
 */
const forgeController = {
    /**
     * Creates a new controller builder for the specified route.
     *
     * @template TInput - InputSchema containing body, query, and params validation schemas
     * @template TOutput - The inferred return type from the callback function
     * @param routeString - Route definition in "METHOD /path" format (e.g., "GET /users/:id")
     * @returns New controller builder instance
     */
    route: (routeString) => new ForgeControllerBuilderWithoutSchema(routeString)
};
export default forgeController;
