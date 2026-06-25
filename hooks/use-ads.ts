'use client';

import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationResult,
    type UseQueryResult,
} from '@tanstack/react-query';

import connectRequest       from '@/lib/services/fetch.service';
import { METHOD }           from '@/lib/services/http-codes';
import { INTERNAL_ENDPOINT } from '@/lib/endpoint';
import type {
    Publicidad,
    UpdateAdDto,
} from '@/lib/models/ads';


// ─── Query Keys ──────────────────────────────────────────────────────────────
export const ADS_QUERY_KEY = [ 'ads' ] as const;

// ─── Queries ─────────────────────────────────────────────────────────────────
export function useAds( isVigent? : boolean ) : UseQueryResult<Publicidad[], Error> {
	return useQuery( {
		queryKey : isVigent ? [ ...ADS_QUERY_KEY, 'vigentes' ] : ADS_QUERY_KEY,
		queryFn  : ( ) => connectRequest<Publicidad[]>( {
			endpoint	: isVigent ? `${ INTERNAL_ENDPOINT.ADS.GET_ALL }?vigentes=true` : INTERNAL_ENDPOINT.ADS.GET_ALL,
			method		: METHOD.GET,
			isInternal	: true,
		} ),
	} );
}

// ─── Mutations ───────────────────────────────────────────────────────────────
export function useCreateAd() : UseMutationResult<Publicidad, Error, FormData> {
	const queryClient = useQueryClient();

	return useMutation( {
		mutationFn : async ( formData : FormData ) => {
			const response = await fetch( '/api/ads/create', {
				method : 'POST',
				body   : formData,
			} );
			if ( !response.ok ) {
				const err = await response.json().catch( ( ) => ( { } ) );
				throw new Error( err.message || 'Error al crear la publicidad' );
			}
			return response.json() as Promise<Publicidad>;
		},
		onSuccess : ( ) => {
			queryClient.invalidateQueries( { queryKey : ADS_QUERY_KEY } );
		},
	} );
}


export function useUpdateAd(): UseMutationResult<Publicidad, Error, { id: number; dto: UpdateAdDto }> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn : ({ id, dto }: { id: number; dto: UpdateAdDto }) =>
            connectRequest<Publicidad>({
                endpoint   : INTERNAL_ENDPOINT.ADS.UPDATE( id ),
                method     : METHOD.PATCH,
                isInternal : true,
                body       : dto,
            }),
        onSuccess : () => {
            queryClient.invalidateQueries({ queryKey: ADS_QUERY_KEY });
        },
    });
}


export function useDeleteAd(): UseMutationResult<void, Error, number> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn : ( id: number ) => connectRequest<void>({
            endpoint   : INTERNAL_ENDPOINT.ADS.DELETE( id ),
            method     : METHOD.DELETE,
            isInternal : true,
        }),
        onSuccess : () => {
            queryClient.invalidateQueries({ queryKey: ADS_QUERY_KEY });
        },
    });
}
