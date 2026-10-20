// Evaluación de la carpeta: qué se exige hoy en cada pestaña y cuánto se cumple.
// Ver docs/contenido-carpeta.md.
import {
  ATENCIONES_INGRESO_PSICOLOGIA, ATENCIONES_INGRESO_TRABAJO_SOCIAL, atencionesAcademico, atencionesNutricion, atencionesPorBloque, hito, informes,
  nivelRiesgo, type Programada,
} from './calendario';
import { corta, type Fecha, partes, sumarDias, sumarMeses } from './fechas';
import type { Marca, Nino, Responsable } from './modelo';

export type TabId =
  | 'inicial' | 'socio_legal' | 'informes' | 'trabajo_social' | 'psicologia'
  | 'historia_medica' | 'nutricion' | 'academico' | 'proyecto_vida';

export const TABS: { id: TabId; nombre: string; responsable: Responsable }[] = [
  { id: 'inicial', nombre: 'Inicial', responsable: 'general' },
  { id: 'socio_legal', nombre: 'Socio legal', responsable: 'general' },
  { id: 'informes', nombre: 'Informes', responsable: 'general' },
  { id: 'trabajo_social', nombre: 'Trabajo social', responsable: 'trabajo_social' },
  { id: 'psicologia', nombre: 'Psicología', responsable: 'psicologia' },
  { id: 'historia_medica', nombre: 'Historia médica', responsable: 'nutricion' },
  { id: 'nutricion', nombre: 'Nutrición', responsable: 'nutricion' },
  { id: 'academico', nombre: 'Académico', responsable: 'pedagogia' },
  { id: 'proyecto_vida', nombre: 'Proyecto de vida', responsable: 'pedagogia' },
];

/** Todos los comodines valen una semana desde la fecha de envío. */
export const DIAS_COMODIN = 7;

/** Vigencia del peso y talla para un niño regular, en meses. */
export const MESES_TALLAJE_REGULAR = 6;

/**
 * Cómo se presenta un ítem:
 * - doc: casilla; programada: fecha del calendario; opcional: no suma;
 * - comodin: cubre faltantes; interruptor: activa otros ítems (traslado).
 */
export type TipoItem = 'doc' | 'programada' | 'opcional' | 'comodin' | 'interruptor';
export type EstadoItem = 'ok' | 'pendiente' | 'vencido' | 'futuro' | 'cubierto' | 'neutro';

export interface ItemEval {
  id: string; // clave en Nino.marcas
  etiqueta: string;
  tipo: TipoItem;
  marca?: Marca;
  exigible: boolean;
  cumple: boolean;
  estado: EstadoItem;
  nota?: string;
  /** Dato que se pide al marcar. */
  pide?: 'fecha' | 'anio';
  grupo?: string;
  fecha?: Fecha; // fecha programada
  fechaOculta?: boolean; // se exige en `fecha`, pero el ítem no lleva fecha propia (actas, correos, atenciones de ingreso)
  vence?: Fecha; // fin de vigencia de un documento o comodín
  responsable: Responsable;
}

export interface TabEval {
  id: TabId;
  nombre: string;
  responsable: Responsable;
  items: ItemEval[];
  exigibles: number;
  cumplidos: number;
  pct: number | null; // null: nada exigible aún
  avisos: string[];
}

export interface CarpetaEval {
  tabs: TabEval[];
  pct: number | null;
}

/** Hasta dónde se generan fechas futuras para mostrar en líneas de tiempo y agenda. */
const HORIZONTE_DIAS = 120;

export function comodinVigente(m: Marca | undefined, hoy: Fecha): boolean {
  return !!m?.fecha && sumarDias(m.fecha, DIAS_COMODIN) >= hoy;
}

class Constructor {
  items: ItemEval[] = [];
  avisos: string[] = [];
  constructor(private nino: Nino, private hoy: Fecha, private responsable: Responsable) {}

  get exigeSinFecha() {
    return this.hoy >= this.nino.fechaIngreso;
  }

  marca(id: string) {
    return this.nino.marcas[id];
  }

  /** Documento sin fecha, que puede estar cubierto por un comodín. */
  doc(id: string, etiqueta: string, cubierto = false) {
    const marca = this.marca(id);
    const exigible = this.exigeSinFecha;
    const cumple = !!marca || (cubierto && exigible);
    const estado: EstadoItem = marca ? 'ok' : cumple ? 'cubierto' : exigible ? 'pendiente' : 'futuro';
    this.items.push({
      id, etiqueta, tipo: 'doc', marca, exigible, cumple, estado,
      nota: estado === 'cubierto' ? 'Cubierto por la solicitud enviada' : undefined,
      responsable: this.responsable,
    });
  }

  /** Documento con fecha y vigencia en meses desde la fecha del documento. */
  vigente(id: string, etiqueta: string, meses: number) {
    const marca = this.marca(id);
    const exigible = this.exigeSinFecha;
    const vence = marca?.fecha ? sumarMeses(marca.fecha, meses) : undefined;
    const ok = !!vence && this.hoy <= vence;
    const nota = !marca ? `Vigencia: ${meses === 1 ? '1 mes' : `${meses} meses`} desde la fecha del documento`
      : !vence ? 'Falta la fecha del documento'
      : ok ? `Vigente hasta el ${corta(vence, this.hoy)}`
      : `Venció el ${corta(vence, this.hoy)}: no cuenta aunque esté marcado`;
    this.items.push({
      id, etiqueta, tipo: 'doc', marca, exigible, cumple: exigible && ok,
      estado: ok ? 'ok' : exigible ? (marca ? 'vencido' : 'pendiente') : 'futuro',
      nota, pide: 'fecha', vence, responsable: this.responsable,
    });
  }

  /** Documento del año en curso (se registra el año). Desde el 1 de enero se exige el del año nuevo. */
  anual(id: string, etiqueta: string) {
    const marca = this.marca(id);
    const anio = partes(this.hoy).y;
    const deEsteAnio = marca?.anio === anio;
    const exigible = this.exigeSinFecha;
    this.items.push({
      id, etiqueta: `${etiqueta} ${anio}`, tipo: 'doc', marca, exigible, cumple: exigible && deEsteAnio,
      estado: deEsteAnio ? 'ok' : marca ? 'vencido' : exigible ? 'pendiente' : 'futuro',
      nota: marca && !deEsteAnio ? `La marcada es de ${marca.anio}: se necesita la de ${anio}` : undefined,
      pide: 'anio', responsable: this.responsable,
    });
  }

  opcional(id: string, etiqueta: string, nota = 'Opcional: no suma ni resta') {
    const marca = this.marca(id);
    this.items.push({ id, etiqueta, tipo: 'opcional', marca, exigible: false, cumple: false, estado: 'neutro', nota, responsable: this.responsable });
  }

  /** Casilla que activa otros ítems. Devuelve si está marcada. */
  interruptor(id: string, etiqueta: string, nota: string) {
    const marca = this.marca(id);
    this.items.push({ id, etiqueta, tipo: 'interruptor', marca, exigible: false, cumple: false, estado: 'neutro', nota, responsable: this.responsable });
    return !!marca;
  }

  /** Comodín: vale una semana desde su fecha de envío. */
  comodin(id: string, etiqueta: string, cubre: string) {
    const marca = this.marca(id);
    const vence = marca?.fecha ? sumarDias(marca.fecha, DIAS_COMODIN) : undefined;
    const vigente = comodinVigente(marca, this.hoy);
    const nota = !marca ? `Cubre ${cubre} durante 1 semana`
      : vigente ? `Enviada el ${corta(marca.fecha!, this.hoy)} · vigente hasta el ${corta(vence!, this.hoy)}`
      : `Venció el ${corta(vence!, this.hoy)}: ya no cubre. Reitera la solicitud con la fecha nueva`;
    this.items.push({ id, etiqueta, tipo: 'comodin', marca, exigible: false, cumple: false, estado: !marca ? 'neutro' : vigente ? 'ok' : 'vencido', nota, pide: 'fecha', vence, responsable: this.responsable });
  }

  /**
   * Actividad del calendario. Se exige desde el día siguiente a `fecha`.
   * Con `sinFecha`, el ítem no muestra fecha propia y esa nota explica hasta cuándo hacerlo.
   */
  programada(id: string, etiqueta: string, fecha: Fecha, opts: { grupo?: string; responsable?: Responsable; sinFecha?: string } = {}) {
    const marca = this.marca(id);
    const exigible = this.hoy > fecha;
    const estado: EstadoItem = marca ? 'ok' : exigible ? 'vencido' : 'futuro';
    this.items.push({
      id, etiqueta, tipo: 'programada', marca, exigible, cumple: exigible && !!marca, estado,
      grupo: opts.grupo, fecha, fechaOculta: !!opts.sinFecha, nota: opts.sinFecha,
      responsable: opts.responsable ?? this.responsable,
    });
  }

  calendario(prefijo: string, xs: Programada[]) {
    for (const p of xs) this.programada(`${prefijo}.${p.id}`, p.etiqueta, p.fecha, { grupo: p.grupo });
  }

  tab(id: TabId): TabEval {
    const def = TABS.find((t) => t.id === id)!;
    const exig = this.items.filter((i) => i.exigible);
    const ok = exig.filter((i) => i.cumple).length;
    return {
      id, nombre: def.nombre, responsable: def.responsable, items: this.items, avisos: this.avisos,
      exigibles: exig.length, cumplidos: ok, pct: exig.length ? Math.round((ok / exig.length) * 100) : null,
    };
  }
}

/** Las 6 atenciones de ingreso (sin fecha propia) y luego 3 por bloque trimestral. */
function atencionesConIngreso(c: Constructor, nino: Nino, hoy: Fecha, hasta: Fecha, area: 'psicologia' | 'trabajo_social') {
  const seg1 = hito(nino.fechaIngreso, 1);
  const nota = hoy > seg1 ? `Debía hacerse antes del 1er seguimiento (${corta(seg1, hoy)})` : `Hacer antes del 1er seguimiento (${corta(seg1, hoy)})`;
  const nombres = area === 'psicologia' ? ATENCIONES_INGRESO_PSICOLOGIA : ATENCIONES_INGRESO_TRABAJO_SOCIAL;
  nombres.forEach((etiqueta, i) => c.programada(`ate.${area}.${i + 1}`, etiqueta, seg1, { sinFecha: nota }));
  c.calendario(`ate.${area}`, atencionesPorBloque(nino.fechaIngreso, hasta));
}

function riesgo(c: Constructor, nino: Nino, hasta: Fecha, area: 'psicologia' | 'trabajo_social') {
  if (!nino.responsableRiesgo) {
    c.avisos.push('Falta definir quién lleva el seguimiento de nivel de riesgo (Psicología o Trabajo social).');
    return;
  }
  if (nino.responsableRiesgo !== area) return;
  for (const r of nivelRiesgo(nino.fechaIngreso, hasta)) {
    c.programada(`riesgo.${r.id}`, r.etiqueta, r.fecha, { grupo: 'Seguimiento de nivel de riesgo' });
  }
}

export function evaluarCarpeta(nino: Nino, hoy: Fecha): CarpetaEval {
  const hasta = sumarDias(hoy, HORIZONTE_DIAS);
  const ingreso = nino.fechaIngreso;
  const tabs: TabEval[] = [];
  const nuevo = (id: TabId) => new Constructor(nino, hoy, TABS.find((t) => t.id === id)!.responsable);

  // Inicial: todo llega de afuera; el comodín cubre los cuatro documentos.
  {
    const c = nuevo('inicial');
    const cubre = comodinVigente(c.marca('inicial.comodin'), hoy);
    c.doc('inicial.lista_chequeo', 'Lista de chequeo', cubre);
    c.doc('inicial.boleta', 'Boleta de ingreso', cubre);
    c.doc('inicial.ficha', 'Ficha de ingreso', cubre);
    c.doc('inicial.pacto', 'Pacto de convivencia', cubre);
    c.comodin('inicial.comodin', 'Correo de solicitud', 'los documentos faltantes');
    tabs.push(c.tab('inicial'));
  }

  // Socio legal: el comodín cubre solo las tres valoraciones.
  {
    const c = nuevo('socio_legal');
    const cubre = comodinVigente(c.marca('socio.comodin'), hoy);
    c.doc('socio.buen_trato', 'Acta de buen trato');
    c.doc('socio.auto_tramite', 'Auto de trámite');
    c.doc('socio.val_psico', 'Valoración de Psicología', cubre);
    c.doc('socio.val_ts', 'Valoración de Trabajo social', cubre);
    c.doc('socio.val_nutri', 'Valoración de Nutrición', cubre);
    c.doc('socio.victimas', 'Declaración ante la Unidad de Víctimas');
    c.doc('socio.denuncia', 'Denuncia');
    c.vigente('socio.adres', 'ADRES · afiliación en salud', 3);
    c.doc('socio.portabilidad', 'Portabilidad');
    c.doc('socio.gao', 'Entrevista GAO');
    c.doc('socio.cupo', 'Solicitud de cupo (Defensoría)');
    c.doc('socio.sol_coda', 'Solicitud de CODA');
    c.doc('socio.coda', 'CODA');
    c.doc('socio.historial', 'Historial médico');
    c.doc('socio.ti', 'Tarjeta de identidad');
    const traslado = c.interruptor('socio.traslado', 'Viene de traslado de otra institución', 'Exige el acta de ubicación, la asistencia técnica y la solicitud de cupo del traslado');
    if (traslado) {
      c.doc('socio.acta_ubicacion', 'Acta de ubicación (traslado)');
      c.doc('socio.asistencia_tecnica', 'Asistencia técnica (traslado)');
      c.doc('socio.cupo_traslado', 'Solicitud de cupo del traslado');
    }
    c.comodin('socio.comodin', 'Solicitud de valoraciones', 'las tres valoraciones');
    tabs.push(c.tab('socio_legal'));
  }

  // Informes
  {
    const c = nuevo('informes');
    for (const i of informes(ingreso, hasta)) {
      const sinFecha = i.id.startsWith('correo') || i.id.startsWith('acta');
      c.programada(`informes.${i.id}`, i.etiqueta, i.fecha, { sinFecha: sinFecha ? `Se exige desde el ${corta(sumarDias(i.fecha, 1), hoy)}` : undefined });
    }
    tabs.push(c.tab('informes'));
  }

  // Trabajo social
  {
    const c = nuevo('trabajo_social');
    c.doc('ts.solicitud_llamada', 'Solicitud de llamada');
    c.opcional('ts.hoja_llamada', 'Formato hoja de llamada', 'Se deposita al final: no suma ni resta');
    atencionesConIngreso(c, nino, hoy, hasta, 'trabajo_social');
    riesgo(c, nino, hasta, 'trabajo_social');
    tabs.push(c.tab('trabajo_social'));
  }

  // Psicología
  {
    const c = nuevo('psicologia');
    atencionesConIngreso(c, nino, hoy, hasta, 'psicologia');
    riesgo(c, nino, hasta, 'psicologia');
    tabs.push(c.tab('psicologia'));
  }

  // Historia médica: copias propias, independientes de las de Socio legal.
  {
    const c = nuevo('historia_medica');
    c.vigente('hm.adres', 'ADRES · afiliación en salud', 3);
    c.doc('hm.portabilidad', 'Portabilidad');
    c.doc('hm.historia', 'Historia médica');
    tabs.push(c.tab('historia_medica'));
  }

  // Nutrición
  {
    const c = nuevo('nutricion');
    const caso = nino.nutricion;
    c.doc('nutricion.evaluacion_inicial', 'Evaluación nutricional inicial');
    const meses = caso ? caso.tallajeMeses : MESES_TALLAJE_REGULAR;
    c.vigente('nutricion.tallaje', `Peso y talla · cada ${meses === 1 ? 'mes' : `${meses} meses`}`, meses);
    // Desde el ingreso, sin importar cuándo se marcó el caso especial:
    // al pasar carpetas antiguas a la app aparecen las atenciones que debieron hacerse.
    if (caso) c.calendario('ate.nutricion', atencionesNutricion(ingreso, caso.atenciones, hasta));
    tabs.push(c.tab('nutricion'));
  }

  // Académico
  {
    const c = nuevo('academico');
    c.programada('academico.valoracion_inicial', 'Valoración inicial pedagógica', sumarDias(ingreso, 20));
    c.anual('academico.matricula', 'Matrícula');
    c.calendario('ate.academico', atencionesAcademico(ingreso, hasta));
    tabs.push(c.tab('academico'));
  }

  // Proyecto de vida
  {
    const c = nuevo('proyecto_vida');
    c.doc('pv.exploracion', 'Exploración vocacional');
    c.doc('pv.plan', 'Plan de vida');
    tabs.push(c.tab('proyecto_vida'));
  }

  const conPct = tabs.filter((t) => t.pct !== null);
  const pct = conPct.length ? Math.round(conPct.reduce((s, t) => s + (t.pct as number), 0) / conPct.length) : null;
  return { tabs, pct };
}
