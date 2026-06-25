export const EXTERNAL_ENDPOINT = {
	ADS			: {
		GET_ALL	: 'publicidad',
		CURRENT	: 'publicidad/vigentes',
		CREATE	: 'publicidad',
		UPLOAD	: 'publicidad/upload',
		UPDATE	: ( id : number ) => 'publicidad/' + id,
		DELETE	: ( id : number ) => 'publicidad/' + id,
	},
	EDIFICIOS	: {
		GET_ALL	: 'edificio',
	},
	CAMPUS		: {
		GET_ALL	: 'campus',
	},
};


export const INTERNAL_ENDPOINT = {
	ADS			: {
		GET_ALL	: 'ads/get-all',
		CREATE	: 'ads/create',
		UPDATE	: ( id : number ) => 'ads/update/' + id,
		DELETE	: ( id : number ) => 'ads/delete/' + id,
	},
	EDIFICIOS	: {
		GET_ALL	: 'edificios',
	},
	CAMPUS		: {
		GET_ALL	: 'campus',
	},
};
