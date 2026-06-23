import { NextResponse, type NextRequest } from 'next/server';

import connectRequest         from '@/lib/services/fetch.service';
import { METHOD }             from '@/lib/services/http-codes';
import { ENV }                from '@/config/envs/env';
import { EXTERNAL_ENDPOINT }  from '@/lib/endpoint';
import type { UpdateAdDto, Publicidad } from '@/lib/models/ads';


interface RouteParams {
    params: Promise<{ id: string }>;
}


export async function PATCH( request: NextRequest, { params }: RouteParams ): Promise<NextResponse> {
    try {
        const { id } = await params;
        const adId   = Number( id );

        if ( isNaN( adId ) ) {
            return NextResponse.json({ message: 'ID inválido' }, { status: 400 });
        }

        const body = await request.json() as UpdateAdDto;

        const data = await connectRequest<Publicidad>({
            endpoint     : `${ ENV.RESERVAS.API_URL }/${ EXTERNAL_ENDPOINT.ADS.UPDATE( adId ) }`,
            method       : METHOD.PATCH,
            isInternal   : false,
            body,
            extraHeaders : {
                Authorization : `Key ${ ENV.RESERVAS.API_KEY }`,
            },
        });

        return NextResponse.json( data );
    } catch ( error: unknown ) {
        const message = error instanceof Error ? error.message : 'Error al actualizar publicidad';
        return NextResponse.json({ message }, { status: 500 });
    }
}
