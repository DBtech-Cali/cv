import type { FrecuenciaNutricion } from './calendario';
import type { Fecha } from './fechas';

export type Cargo = 'psicologia' | 'trabajo_social' | 'nutricion' | 'pedagogia' | 'coordinacion' | 'gestion_caso' | 'soporte';
export type Responsable = 'psicologia' | 'trabajo_social' | 'nutricion' | 'pedagogia' | 'general';

export const CARGOS: Record<Cargo, string> = {
  psicologia: 'Psicóloga',
  trabajo_social: 'Trabajadora social',
  nutricion: 'Nutricionista',
  pedagogia: 'Pedagogo',
  coordinacion: 'Coordinador',
  gestion_caso: 'Gestor de caso',
  soporte: 'Soporte',
};

export const RESPONSABLES: Record<Responsable, string> = {
  psicologia: 'Psicología',
  trabajo_social: 'Trabajo social',
  nutricion: 'Nutrición',
  pedagogia: 'Pedagogía',
  general: 'General',
};

export interface Usuario {
  id: string;
  nombre: string;
  cargo: Cargo;
  pin: string;
  email: string;
  activo: boolean;
}

/** Coordinación, gestión de caso y soporte tienen los mismos permisos de administración. */
export const esAdmin = (u: Usuario | null | undefined) => !!u && (u.cargo === 'coordinacion' || u.cargo === 'gestion_caso' || u.cargo === 'soporte');

/** Un ítem marcado. Si no hay marca, el ítem no está marcado. */
export interface Marca {
  por: string; // id del usuario
  en: string; // fecha y hora ISO
  fecha?: Fecha; // fecha del documento (ADRES, peso y talla, comodines)
  anio?: number; // año (matrícula)
}

export interface Vinculacion {
  id: string;
  nombre: string;
  fecha?: Fecha;
}

/** Curso con certificado (Académico). */
export interface Curso {
  id: string;
  nombre: string;
  entidad: string;
  fecha?: Fecha;
}

/** Solicitud de visita (Trabajo social). */
export interface Visita {
  id: string;
  fecha: Fecha;
  persona: string;
  parentesco?: string;
}

/** Caso especial de Nutrición: desde cuándo y con qué frecuencias. */
export interface CasoNutricion {
  desde: Fecha;
  /** Vigencia del peso y talla, en meses. */
  tallajeMeses: 1 | 2 | 3;
  atenciones: FrecuenciaNutricion;
}

export interface Prestamo {
  por: string;
  desde: string; // fecha y hora ISO
}

export interface Nino {
  id: string;
  nombres: string;
  primerApellido: string;
  segundoApellido?: string;
  fechaIngreso: Fecha;
  fechaNacimiento?: Fecha;
  caja: number;
  activo: boolean;
  fechaEgreso?: Fecha;
  responsableRiesgo?: 'psicologia' | 'trabajo_social' | null;
  /** Caso especial de Nutrición; null si no está activo. */
  nutricion?: CasoNutricion | null;
  prestamo?: Prestamo | null;
  marcas: Record<string, Marca>;
  vinculaciones?: Vinculacion[];
  cursos?: Curso[];
  visitas?: Visita[];
}

export interface Movimiento {
  id?: string;
  ninoId: string;
  tipo: 'retiro' | 'devolucion';
  por: string;
  en: string;
}

export interface Revision {
  id?: string;
  texto: string;
  por: string;
  en: string;
}

export function nombreCompleto(n: Pick<Nino, 'nombres' | 'primerApellido' | 'segundoApellido'>): string {
  return `${[n.primerApellido, n.segundoApellido].filter(Boolean).join(' ')}, ${n.nombres}`;
}

export function ordenarNinos<T extends Pick<Nino, 'nombres' | 'primerApellido' | 'segundoApellido'>>(xs: T[]): T[] {
  const clave = (n: T) => `${n.primerApellido} ${n.segundoApellido ?? ''} ${n.nombres}`;
  return [...xs].sort((a, b) => clave(a).localeCompare(clave(b), 'es', { sensitivity: 'base' }));
}
