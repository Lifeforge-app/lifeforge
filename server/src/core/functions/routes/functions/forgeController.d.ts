import { Context, InferZodType, InputSchema } from '../../../../../../shared/src/typescript/forge_controller.types';
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
export declare class ForgeControllerBuilder<TInput extends InputSchema = InputSchema, TOutput = unknown> {
    /** The HTTP method for this route (get, post, put, patch, delete) */
    protected _method: 'get' | 'post' | 'put' | 'patch' | 'delete';
    /** The URL path for this route */
    protected _path: string;
    /** Array of Express middleware functions to apply to this route */
    protected _middlewares: any[];
    /** Zod validation schemas for request body, query, and params */
    protected _schema: TInput;
    /** HTTP status code to return on successful response */
    protected _statusCode: number;
    /** Whether to skip sending the default success response */
    protected _noDefaultResponse: boolean;
    /** Configuration for automatic existence checking of referenced entities */
    protected _existenceCheck: any;
    /** Human-readable description of what this endpoint does */
    protected _description: string;
    /** Whether this endpoint returns downloadable content */
    protected _isDownloadable: boolean;
    /** The main request handler function with proper typing for request/response objects */
    private _handler?;
    /**
     * Creates a new builder instance with updated schema types while preserving current configuration.
     * This is used internally to maintain immutability when chaining methods.
     *
     * @template NewInput - New input schema type
     * @template NewOutput - New output type
     * @param overrides - Partial schema overrides to apply
     * @returns New builder instance with updated types
     */
    private cloneWith;
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
    route(routeString: string): this;
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
    middlewares(...middlewares: any[]): this;
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
    input<T extends InputSchema>(input: T): ForgeControllerBuilder<T, TOutput>;
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
    statusCode(code: number): this;
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
    noDefaultResponse(): this;
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
    existenceCheck<T extends 'params' | 'body' | 'query'>(type: T, map: T extends 'body' ? Partial<Record<keyof InferZodType<TInput['body']>, string>> : T extends 'query' ? Partial<Record<keyof InferZodType<TInput['query']>, string>> : T extends 'params' ? Partial<Record<keyof InferZodType<TInput['params']>, string>> : never): this;
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
    description(desc: string): this;
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
    isDownloadable(): this;
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
    callback<CB extends (context: Context<TInput, any>) => Promise<any>>(cb: CB): ForgeControllerBuilder<TInput, Awaited<ReturnType<CB>>>;
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
    register(router: import('express').Router): void;
}
/**
 * Initial builder class that requires input schemas to be set before proceeding.
 * This enforces the pattern where routes must have input validation defined.
 */
declare class ForgeControllerBuilderWithoutSchema {
    /** The route string in "METHOD /path" format */
    protected _routeString: string;
    /** Human-readable description of what this endpoint does */
    protected _description: string;
    /**
     * Creates a new builder instance that requires schema configuration.
     *
     * @param routeString - Route definition in "METHOD /path" format
     */
    constructor(routeString: string);
    /**
     * Sets a description for this endpoint before schema configuration.
     *
     * @param desc - Descriptive text explaining what this endpoint does
     * @returns This builder instance for method chaining
     */
    description(desc: string): this;
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
    input<T extends InputSchema>(input: T): ForgeControllerBuilder<T, unknown>;
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
declare const forgeController: {
    /**
     * Creates a new controller builder for the specified route.
     *
     * @template TInput - InputSchema containing body, query, and params validation schemas
     * @template TOutput - The inferred return type from the callback function
     * @param routeString - Route definition in "METHOD /path" format (e.g., "GET /users/:id")
     * @returns New controller builder instance
     */
    route: (routeString: string) => ForgeControllerBuilderWithoutSchema;
};
export default forgeController;
