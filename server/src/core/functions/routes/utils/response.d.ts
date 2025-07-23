import { Response } from 'express';
import { BaseResponse } from '../../../typescript/base_response';
export declare class ClientError extends Error {
    code: number;
    constructor(message: any, code?: number);
    static isClientError(error: unknown): error is ClientError;
}
export declare function successWithBaseResponse<T>(res: Response<BaseResponse<T>>, data: T): void;
export declare function clientError(res: Response, message?: any, code?: number): void;
export declare function serverError(res: Response, message?: string): void;
