import { NextResponse, type NextRequest } from 'next/server';

import connectRequest         from '@/lib/services/fetch.service';
import { METHOD }             from '@/lib/services/http-codes';
import { ENV }                from '@/config/envs/env';
import { EXTERNAL_ENDPOINT }  from '@/lib/endpoint';


interface RouteParams {
    params: Promise<{ id: string }>;
}


export async function DELETE( _request: NextRequest, { params }: RouteParams ): Promise<NextResponse> {
    try {
        const { id } = await params;
        const adId   = Number( id );

        if ( isNaN( adId ) ) {
            return NextResponse.json({ message: 'ID inválido' }, { status: 400 });
        }

        await connectRequest<void>({
            endpoint     : `${ ENV.RESERVAS.API_URL }/${ EXTERNAL_ENDPOINT.ADS.DELETE( adId ) }`,
            method       : METHOD.DELETE,
            isInternal   : false,
            extraHeaders : {
                Authorization : `Key ${ ENV.RESERVAS.API_KEY }`,
            },
        });

        return new NextResponse( null, { status: 204 });
    } catch ( error: unknown ) {
        const message = error instanceof Error ? error.message : 'Error al eliminar publicidad';
        return NextResponse.json({ message }, { status: 500 });
    }
}
