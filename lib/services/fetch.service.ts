import { METHOD } from './http-codes';

const BASE_URL = process.env.NEXT_PUBLIC_REQUEST_BACK_URL as string;


type Connect = {
    endpoint      : string;
    method?       : METHOD;
    body?         : object;
    isInternal?   : boolean;
    responseType? : 'json' | 'text';
    extraHeaders? : Record<string, string>;
}


export type ApiError = {
    message : string;
    code    : string;
    status? : number;
    data?   : unknown;
}


export const isApiError = ( error: any ): error is ApiError =>
    typeof error === 'object' && error !== null && 'message' in error && 'code' in error;


export default async function connectRequest<T>({
    method = METHOD.GET,
    body,
    endpoint,
    isInternal = true,
    responseType = 'json',
    extraHeaders = {},
}: Connect ): Promise<T> {
    // If endpoint is a full URL, use it directly
    const isFullUrl = endpoint.startsWith( 'http' );
    const url       = isFullUrl
        ? endpoint
        : ( isInternal ? `/api/${ endpoint }` : `${ BASE_URL }/${ endpoint }` );

    const response = await fetch( url, {
        method,
        body    : body ? JSON.stringify( body ) : undefined,
        cache   : 'no-cache',
        headers : {
            'Content-Type' : 'application/json',
            Accept         : responseType === 'json' ? 'application/json' : '*/*',
            ...extraHeaders,
        }
    });


    if ( !response.ok ) {
        const errorData = await response.json().catch( () => ({}) );

        throw {
            message : errorData.message || 'Request failed',
            code    : `HTTP_${response.status}`,
            status  : response.status,
            data    : errorData,
        } as ApiError;
    }

    if ( response.status === 204 ) return true as T;

    if ( responseType === 'text' ) {
        return await response.text() as unknown as T;
    }

    return await response.json() as T;
}
