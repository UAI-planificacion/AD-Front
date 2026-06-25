import { NextResponse }       from 'next/server';

import connectRequest           from '@/lib/services/fetch.service';
import { METHOD }               from '@/lib/services/http-codes';
import { EXTERNAL_ENDPOINT }    from '@/lib/endpoint';
import type { Publicidad }      from '@/lib/models/ads';
import { ENV }                  from '@/config/envs/env';


export async function GET( request : Request ) : Promise<NextResponse> {
	try {
		const { searchParams } = new URL( request.url );
		const isVigent = searchParams.get( 'vigentes' ) === 'true';

		const endpoint = isVigent ? EXTERNAL_ENDPOINT.ADS.VIGENT : EXTERNAL_ENDPOINT.ADS.GET_ALL;

		const data = await connectRequest<Publicidad[]>( {
			endpoint		: `${ ENV.RESERVAS.API_URL }/${ endpoint }`,
			method			: METHOD.GET,
			isInternal		: false,
			extraHeaders	: {
				Authorization	: `Key ${ ENV.RESERVAS.API_KEY }`,
			},
		} );

		return NextResponse.json( data );
	} catch ( error : unknown ) {
		const message = error instanceof Error ? error.message : 'Error al obtener publicidades';
		return NextResponse.json( { message }, { status : 500 } );
	}
}
