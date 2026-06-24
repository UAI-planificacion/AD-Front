import { NextResponse }       from 'next/server';

import connectRequest           from '@/lib/services/fetch.service';
import { METHOD }               from '@/lib/services/http-codes';
import { EXTERNAL_ENDPOINT }    from '@/lib/endpoint';
import type { Publicidad }      from '@/lib/models/ads';
import { ENV }                  from '@/config/envs/env';


export async function GET(): Promise<NextResponse> {
    try {
        const data = await connectRequest<Publicidad[]>({
            endpoint     : `${ ENV.RESERVAS.API_URL }/${ EXTERNAL_ENDPOINT.ADS.GET_ALL }`,
            method       : METHOD.GET,
            isInternal   : false,
            extraHeaders : {
                Authorization : `Key ${ ENV.RESERVAS.API_KEY }`,
            },
        });

        return NextResponse.json( data );
    } catch ( error: unknown ) {
        const message = error instanceof Error ? error.message : 'Error al obtener publicidades';
        return NextResponse.json({ message }, { status: 500 });
    }
}
