import { NextResponse, type NextRequest } from 'next/server';

import type { Publicidad }      from '@/lib/models/ads';
import { EXTERNAL_ENDPOINT }    from '@/lib/endpoint';
import { ENV }                  from '@/config/envs/env';


export async function POST( request: NextRequest ) : Promise<NextResponse> {
	try {
		const formData = await request.formData();

		const response = await fetch( `${ ENV.RESERVAS.API_URL }/${ EXTERNAL_ENDPOINT.ADS.UPLOAD }`, {
			method  : 'POST',
			body    : formData,
			headers : {
				Authorization : 'Key ' + ENV.RESERVAS.API_KEY,
			},
		});

		if ( !response.ok ) {
			const errorData = await response.json().catch(() => ({}));

            return NextResponse.json( {
                message : errorData.message || 'Error al crear publicidad en el servidor externo'
            }, {
                status : response.status
            });
		}

		const data = await response.json() as Publicidad;

		return NextResponse.json( data, { status : 201 });
	} catch ( error: unknown ) {
		const message = error instanceof Error ? error.message : 'Error al crear publicidad';

        return NextResponse.json({ message }, { status : 500 });
	}
}
