import { format }   from 'date-fns';
import { es }       from 'date-fns/locale';


export const CAMPUS_MAPPING = [
	{
		name      : 'Peñalolén',
		buildings : [ 1, 2, 3, 4, 5, 6 ],
	},
	{
		name      : 'Errázuriz',
		buildings : [ 7 ],
	},
	{
		name      : 'Vitacura',
		buildings : [ 8 ],
	},
	{
		name      : 'Viña del Mar',
		buildings : [ 9, 10, 11, 12, 13, 14 ],
	},
];


export function getCampusesForBuildings( buildings : number[] ) : string[] {
	const campusNames : string[] = [];

    CAMPUS_MAPPING.forEach(( campus ) => {
		if ( campus.buildings.some(( id ) => buildings.includes( id ))) {
			campusNames.push( campus.name );
		}
	});

    return campusNames;
}


// export function formatDate( dateStr : string ) : string {
// 	if ( !dateStr ) return '';

// 	const parts = dateStr.split( '-' );

// 	if ( parts.length !== 3 ) return dateStr;

// 	const year  = parts[ 0 ];
// 	const month = parts[ 1 ];
// 	const day   = parts[ 2 ].split('T')[0];

// 	return `${ day }/${ month }/${ year }`;
// }



export function parseLocalDate( dateStr : string ) : Date {
	const [ year, month, day ] = dateStr.split( '-' ).map( Number );
	return new Date( year, month - 1, day );
}


export function formatDate( dateStr : string ) : string {
	if ( !dateStr ) {
		return '';
	}
	const date = parseLocalDate( dateStr );
	return format( date, 'dd MMM yyyy', { locale: es } );
}


export function formatTime( timeStr : string ) : string {
	if ( !timeStr ) return '';

    const parts = timeStr.split( ':' );

    if ( parts.length < 2 ) return timeStr;

    return `${ parts[ 0 ] }:${ parts[ 1 ] }`;
}
