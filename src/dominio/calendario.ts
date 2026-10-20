// Calendario de atención de la Casa de Protección. Ver docs/reglas-atencion.md.
import { type Fecha, partes, sumarDias, sumarMeses } from './fechas';

export interface Programada {
  id: string;
  fecha: Fecha;
  etiqueta: string;
  grupo?: string;
}

export type FrecuenciaNutricion = 'quincenal' | 'mensual' | 'trimestral';

export const FRECUENCIAS_NUTRICION: Record<FrecuenciaNutricion, string> = {
  quincenal: '2 al mes',
  mensual: '1 al mes',
  trimestral: '1 al trimestre',
};

export function planDeCaso(ingreso: Fecha): Fecha {
  return sumarMeses(ingreso, 1);
}

/** Hito k: 0 = plan de caso, k >= 1 = seguimiento k. Siempre en el día ancla del plan. */
export function hito(ingreso: Fecha, k: number): Fecha {
  const plan = planDeCaso(ingreso);
  return k === 0 ? plan : sumarMeses(plan, 3 * k, partes(plan).d);
}

export function nombreHito(k: number): string {
  return k === 0 ? 'Plan de caso' : `${k}º seguimiento`;
}

/** Índice del bloque (hito k → hito k+1) que contiene la fecha. Antes del plan cuenta como bloque 0. */
export function bloqueDe(ingreso: Fecha, f: Fecha): number {
  let k = 0;
  while (hito(ingreso, k + 1) <= f) k++;
  return k;
}

/** Atenciones de ingreso de Psicología, en orden. Las de Trabajo social no tienen nombre. */
export const ATENCIONES_INGRESO_PSICOLOGIA = [
  'Valoración de consumo',
  'Estado físico',
  'Adaptación',
  'Seguimiento a la adaptación',
  'Gustos y preferencias',
  'Estado emocional',
];

/**
 * Trabajo social y Psicología desde el 1er seguimiento: 3 por bloque trimestral,
 * a 1 y 2 meses del seguimiento que lo abre y 5 días antes del siguiente.
 * Se numeran desde la 7 (las 6 primeras son las de ingreso, sin fecha).
 */
export function atencionesPorBloque(ingreso: Fecha, hasta: Fecha): Programada[] {
  const ancla = partes(planDeCaso(ingreso)).d;
  const out: Programada[] = [];
  for (let k = 1, n = 7; ; k++) {
    const abre = hito(ingreso, k);
    if (abre > hasta) break;
    const grupo = `Bloque ${k} · ${k}º → ${k + 1}º seguimiento`;
    for (const fecha of [sumarMeses(abre, 1, ancla), sumarMeses(abre, 2, ancla), sumarDias(hito(ingreso, k + 1), -5)]) {
      if (fecha <= hasta) out.push({ id: String(n), fecha, etiqueta: `Atención ${n}`, grupo });
      n++;
    }
  }
  return out;
}

const grupoAnual = (f: Fecha) => `Atenciones ${partes(f).y}`;

/**
 * Académico: mensuales en el día del ingreso. Si ingresa hasta el día 15, la primera es
 * a los 15 días; si ingresa del 16 en adelante, ese mes no tiene atención.
 */
export function atencionesAcademico(ingreso: Fecha, hasta: Fecha): Programada[] {
  const fechas: Fecha[] = partes(ingreso).d <= 15 ? [sumarDias(ingreso, 15)] : [];
  for (let m = 1; ; m++) {
    const f = sumarMeses(ingreso, m);
    if (f > hasta) break;
    fechas.push(f);
  }
  return fechas
    .filter((f) => f <= hasta)
    .map((fecha, i) => ({ id: String(i + 1), fecha, etiqueta: `Atención ${i + 1}`, grupo: grupoAnual(fecha) }));
}

/**
 * Nutrición en caso especial, desde el día del ingreso y con la frecuencia elegida.
 * El id es la fecha: si cambia la frecuencia, las atenciones que coinciden conservan su marca.
 */
export function atencionesNutricion(ingreso: Fecha, frecuencia: FrecuenciaNutricion, hasta: Fecha): Programada[] {
  const fechas: Fecha[] = [];
  for (let m = 0; ; m++) {
    if (frecuencia === 'quincenal') {
      const media = sumarDias(sumarMeses(ingreso, m), 15);
      if (media > hasta) break;
      fechas.push(media);
    }
    const paso = frecuencia === 'trimestral' ? 3 * (m + 1) : m + 1;
    const f = sumarMeses(ingreso, paso);
    if (f > hasta) break;
    fechas.push(f);
  }
  return fechas.map((fecha, i) => ({ id: fecha, fecha, etiqueta: `Atención de Nutrición ${i + 1}`, grupo: grupoAnual(fecha) }));
}

/** Seguimientos de nivel de riesgo: mensuales desde el plan de caso. */
export function nivelRiesgo(ingreso: Fecha, hasta: Fecha): Programada[] {
  const plan = planDeCaso(ingreso);
  const out: Programada[] = [];
  for (let m = 1; ; m++) {
    const fecha = sumarMeses(plan, m, partes(plan).d);
    if (fecha > hasta) break;
    out.push({ id: String(m), fecha, etiqueta: `Nivel de riesgo ${m}` });
  }
  return out;
}

/** Ítems de la pestaña Informes con su fecha de exigencia. */
export function informes(ingreso: Fecha, hasta: Fecha): Programada[] {
  const integradora = sumarDias(ingreso, 22);
  const plan = planDeCaso(ingreso);
  const out: Programada[] = [
    { id: 'preliminar', fecha: sumarDias(ingreso, 5), etiqueta: 'Evaluación preliminar' },
    { id: 'eval_integradora', fecha: integradora, etiqueta: 'Evaluación integradora' },
    { id: 'acta_integradora', fecha: integradora, etiqueta: 'Acta de caso de la evaluación integradora' },
    { id: 'plan', fecha: plan, etiqueta: 'Plan de caso' },
    { id: 'correo_plan', fecha: plan, etiqueta: 'Correo de envío del plan de caso' },
  ];
  for (let k = 1; ; k++) {
    const fecha = hito(ingreso, k);
    if (fecha > hasta) break;
    out.push(
      { id: `seg_${k}`, fecha, etiqueta: `${k}º seguimiento` },
      { id: `correo_seg_${k}`, fecha, etiqueta: `Correo de envío del ${k}º seguimiento` },
    );
  }
  return out.filter((p) => p.fecha <= hasta);
}
