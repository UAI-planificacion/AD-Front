// ─── Entities ────────────────────────────────────────────────────────────────

export interface Publicidad {
    id                  : number;
    nombre              : string;
    tipo                : AdTipo;
    duracion            : number;
    fecha_inicio        : string;
    fecha_fin           : string;
    hora_inicio         : string;
    hora_fin            : string;
    archivo_url         : string;
    archivo_tipo        : string;
    archivo_tamano      : number;
    archivo_dimensiones : string;
    fecha_creacion      : string;
    fecha_modificacion  : string;
    activo              : boolean;
    edificios           : number[];
}

export interface Edificio {
    idedif      : number;
    nombre_edif : string;
    idcampus    : number;
    vigente     : boolean;
}

export interface Campus {
    idcampus      : number;
    nombre_campus : string;
    idsede        : number;
    vigente       : boolean;
}


// ─── Enums ───────────────────────────────────────────────────────────────────

export type AdTipo = 'imagen' | 'video';


// ─── DTOs ────────────────────────────────────────────────────────────────────

export interface CreateAdDto {
    nombre      : string;
    tipo        : AdTipo;
    duracion    : number;
    fecha_inicio : string;
    fecha_fin    : string;
    hora_inicio  : string;
    hora_fin     : string;
    archivo_url         : string;
    archivo_tipo        : string;
    archivo_tamano      : number;
    archivo_dimensiones : string;
    edificios   : number[];
}

export interface UpdateAdDto {
	nombre?			: string;
	fecha_inicio?	: string;
	fecha_fin?		: string;
	hora_inicio?	: string;
	hora_fin?		: string;
	duracion?		: number;
	edificios?		: number[];
	activo?			: boolean;
}


// ─── UI Helpers ──────────────────────────────────────────────────────────────

export interface AdKpiStats {
    total              : number;
    activas            : number;
    edificiosCubiertos : number;
    duracionPromedio   : number;
}


// ─── Helpers ─────────────────────────────────────────────────────────────────

export function buildKpiStats( ads: Publicidad[] ): AdKpiStats {
    const total            = ads.length;
    const activas          = ads.filter( ( a ) => a.activo ).length;
    const edificiosSet     = new Set( ads.flatMap( ( a ) => a.edificios ) );
    const duracionTotal    = ads.reduce( ( acc, a ) => acc + a.duracion, 0 );
    const duracionPromedio = total > 0 ? Math.round( duracionTotal / total ) : 0;

    return {
        total,
        activas,
        edificiosCubiertos : edificiosSet.size,
        duracionPromedio,
    };
}
