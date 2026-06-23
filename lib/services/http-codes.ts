export const httpCodes: ShapeOption[] = [
    // 2xx Success
    { id: '1', value: '200', label: '200 - OK' },
    { id: '2', value: '201', label: '201 - Creado' },
    { id: '3', value: '202', label: '202 - Aceptado' },
    { id: '4', value: '204', label: '204 - Sin Contenido' },

    // 4xx Client Errors
    { id: '5', value: '400', label: '400 - Solicitud inválida' },
    { id: '6', value: '401', label: '401 - No autorizado' },
    { id: '7', value: '403', label: '403 - Prohibido' },
    { id: '8', value: '404', label: '404 - No encontrado' },
    { id: '9', value: '405', label: '405 - Método no permitido' },
    { id: '10', value: '409', label: '409 - Conflicto' },
    { id: '11', value: '422', label: '422 - Entidad no procesable' },
    { id: '12', value: '429', label: '429 - Demasiadas solicitudes' },

    // 5xx Server Errors
    { id: '13', value: '500', label: '500 - Error en el servidor' },
    { id: '14', value: '501', label: '501 - No implementado' },
    { id: '15', value: '502', label: '502 - Puerta de enlace incorrecta' },
    { id: '16', value: '503', label: '503 - Servicio no disponible' },
    { id: '17', value: '504', label: '504 - Tiempo de espera agotado' }
];


export const methods: ShapeOption[] = [
	{ id: '1', value: 'GET', 	label: 'GET' },
	{ id: '2', value: 'POST', 	label: 'POST' },
	{ id: '3', value: 'PUT', 	label: 'PUT' },
	{ id: '5', value: 'PATCH', 	label: 'PATCH' }
];


export type ShapeOption = {
    id?     : string;
    label   : string;
    value   : string;
}


export enum METHOD {
    GET     = 'GET',
    POST    = 'POST',
    DELETE  = 'DELETE',
    PUT     = 'PUT',
    PATCH   = 'PATCH',
}
