import { NextResponse, type NextRequest } from 'next/server';

import connectRequest         from '@/lib/services/fetch.service';
import { METHOD }             from '@/lib/services/http-codes';
import { ENV }                from '@/config/envs/env';
import { EXTERNAL_ENDPOINT }  from '@/lib/endpoint';
import type { CreateAdDto, Publicidad } from '@/lib/models/ads';


export async function POST( request: NextRequest ): Promise<NextResponse> {
    try {
        const body = await request.json() as CreateAdDto;

        const data = await connectRequest<Publicidad>({
            endpoint     : `${ ENV.RESERVAS.API_URL }/${ EXTERNAL_ENDPOINT.ADS.CREATE }`,
            method       : METHOD.POST,
            isInternal   : false,
            body,
            extraHeaders : {
                Authorization : `Key ${ ENV.RESERVAS.API_KEY }`,
            },
        });

        return NextResponse.json( data, { status: 201 });
    } catch ( error: unknown ) {
        const message = error instanceof Error ? error.message : 'Error al crear publicidad';
        return NextResponse.json({ message }, { status: 500 });
    }
}
