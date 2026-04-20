export type ApiResponse<T> = {
    code: number;
    message: string;
    data: T;
} | {
    code: number;
    message: string;
    error: {
        code: string;
        message: string;
    };
};