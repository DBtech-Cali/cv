import { describe, expect, it } from 'vitest';
import { agenda, catalogoItems, reportePorItem } from './agenda';
import { evaluarCarpeta, TABS } from './carpeta';
import type { Marca, Nino } from './modelo';

const m = (extra: Partial<Marca> = {}): Marca => ({ por: 'u1', en: '2026-05-10T10:00:00Z', ...extra });

function nino(marcas: Record<string, Marca> = {}, extra: Partial<Nino> = {}): Nino {
  return { id: 'n1', nombres: 'Lady', primerApellido: 'Gómez', fechaIngreso: '2026-05-07', caja: 6, activo: true, marcas, ...extra };
}

const tab = (n: Nino, hoy: string, id: string) => evaluarCarpeta(n, hoy).tabs.find((t) => t.id === id)!;
const item = (n: Nino, hoy: string, tabId: string, id: string) => tab(n, hoy, tabId).items.find((i) => i.id === id);

describe('Estructura', () => {
  it('9 pestañas en el orden acordado', () => {
    expect(TABS.map((t) => t.nombre)).toEqual([
      'Inicial', 'Socio legal', 'Informes', 'Trabajo social', 'Psicología', 'Historia médica', 'Nutrición', 'Académico', 'Proyecto de vida',
    ]);
  });
});

describe('Inicial y comodín de 1 semana', () => {
  const base = { 'inicial.lista_chequeo': m(), 'inicial.boleta': m() };
  it('sin comodín, los faltantes cuentan', () => {
    expect(tab(nino(base), '2026-06-01', 'inicial').pct).toBe(50);
  });
  it('comodín vigente cubre los faltantes durante 7 días', () => {
    const n = nino({ ...base, 'inicial.comodin': m({ fecha: '2026-05-07' }) });
    expect(tab(n, '2026-05-14', 'inicial').pct).toBe(100);
    expect(tab(n, '2026-05-15', 'inicial').pct).toBe(50);
  });
});

describe('Socio legal', () => {
  it('15 documentos independientes; el comodín cubre solo las valoraciones', () => {
    const t0 = tab(nino(), '2026-05-08', 'socio_legal');
    expect(t0.exigibles).toBe(15);
    const n = nino({ 'socio.comodin': m({ fecha: '2026-05-08' }) });
    const t = tab(n, '2026-05-10', 'socio_legal');
    expect(t.cumplidos).toBe(3);
    expect(t.items.find((i) => i.id === 'socio.denuncia')?.estado).toBe('pendiente');
  });
  it('ADRES vence a los 3 meses', () => {
    const n = nino({ 'socio.adres': m({ fecha: '2026-07-13' }) });
    expect(item(n, '2026-10-13', 'socio_legal', 'socio.adres')?.cumple).toBe(true);
    expect(item(n, '2026-10-14', 'socio_legal', 'socio.adres')?.estado).toBe('vencido');
  });
  it('traslado agrega tres documentos', () => {
    const n = nino({ 'socio.traslado': m() });
    const t = tab(n, '2026-05-08', 'socio_legal');
    expect(t.exigibles).toBe(18);
    expect(t.items.map((i) => i.id)).toEqual(expect.arrayContaining(['socio.acta_ubicacion', 'socio.asistencia_tecnica', 'socio.cupo_traslado', 'socio.cupo']));
  });
});

describe('Historia médica', () => {
  it('su ADRES es independiente del de Socio legal', () => {
    const n = nino({ 'socio.adres': m({ fecha: '2026-10-01' }) });
    expect(item(n, '2026-10-13', 'historia_medica', 'hm.adres')?.estado).toBe('pendiente');
    expect(tab(n, '2026-10-13', 'historia_medica').exigibles).toBe(3);
  });
});

describe('Informes y exigencia desde el día siguiente', () => {
  it('la preliminar se exige desde ingreso + 6 días', () => {
    expect(tab(nino(), '2026-05-12', 'informes').pct).toBeNull();
    expect(tab(nino(), '2026-05-13', 'informes').exigibles).toBe(1);
  });
  it('a los 5 meses exige preliminar, integradora, acta, plan, correo y el 1er seguimiento con su correo', () => {
    expect(tab(nino(), '2026-10-15', 'informes').exigibles).toBe(7);
  });
});

describe('Psicología y Trabajo social', () => {
  it('las 6 atenciones de ingreso no cuentan hasta el día siguiente al 1er seguimiento', () => {
    const psico = (hoy: string) => tab(nino(), hoy, 'psicologia').items.filter((i) => /^ate\.psicologia\.[1-6]$/.test(i.id));
    expect(psico('2026-09-07').map((i) => i.etiqueta)).toEqual([
      'Valoración de consumo', 'Estado físico', 'Adaptación', 'Seguimiento a la adaptación', 'Gustos y preferencias', 'Estado emocional',
    ]);
    expect(psico('2026-09-07').every((i) => !i.exigible && i.fechaOculta)).toBe(true);
    expect(psico('2026-09-08').every((i) => i.estado === 'vencido')).toBe(true);
  });
  it('Trabajo social: tres con nombre, tres numeradas y luego el calendario por bloque', () => {
    const t = tab(nino({ 'ts.solicitud_llamada': m() }), '2026-10-08', 'trabajo_social');
    expect(t.items.filter((i) => /^ate\.trabajo_social\.[1-6]$/.test(i.id)).map((i) => i.etiqueta)).toEqual([
      'Llamada de contacto', 'Cambio de SIM card', 'Adaptación', 'Atención 4', 'Atención 5', 'Atención 6',
    ]);
    expect(t.items.find((i) => i.id === 'ate.trabajo_social.7')?.fecha).toBe('2026-10-07');
    // solicitud de llamada + 6 de ingreso + atención 7 (la hoja de llamada es opcional)
    expect(t.exigibles).toBe(8);
  });
  it('el nivel de riesgo va en la pestaña de la responsable', () => {
    const n = nino({}, { responsableRiesgo: 'psicologia' });
    const ids = (id: string) => tab(n, '2026-10-14', id).items.map((i) => i.id);
    expect(ids('psicologia')).toContain('riesgo.1');
    expect(ids('trabajo_social')).not.toContain('riesgo.1');
  });
});

describe('Nutrición', () => {
  it('niño regular: peso y talla vale 6 meses y no hay atenciones', () => {
    const n = nino({ 'nutricion.evaluacion_inicial': m(), 'nutricion.tallaje': m({ fecha: '2026-05-13' }) });
    expect(tab(n, '2026-11-13', 'nutricion').pct).toBe(100);
    expect(tab(n, '2026-11-14', 'nutricion').pct).toBe(50);
  });
  it('caso especial: vigencia elegida y atenciones desde el ingreso aunque se marque tarde', () => {
    const n = nino(
      { 'nutricion.evaluacion_inicial': m(), 'nutricion.tallaje': m({ fecha: '2026-09-01' }) },
      { nutricion: { desde: '2026-10-20', tallajeMeses: 2, atenciones: 'mensual' } },
    );
    const t = tab(n, '2026-10-23', 'nutricion');
    expect(t.items.find((i) => i.id === 'nutricion.tallaje')?.vence).toBe('2026-11-01');
    expect(t.items.find((i) => i.id === 'ate.nutricion.2026-06-07')?.estado).toBe('vencido');
    // evaluación + tallaje + 5 atenciones vencidas (jun a oct)
    expect(t.exigibles).toBe(7);
    expect(t.cumplidos).toBe(2);
  });
});

describe('Académico', () => {
  it('valoración inicial a los 20 días, matrícula del año y atenciones mensuales', () => {
    const t = tab(nino({ 'academico.matricula': m({ anio: 2026 }) }), '2026-06-08', 'academico');
    expect(t.items.find((i) => i.id === 'academico.valoracion_inicial')?.fecha).toBe('2026-05-27');
    // valoración (vencida) + matrícula + atenciones del 22 may y 7 jun
    expect(t.exigibles).toBe(4);
    expect(t.cumplidos).toBe(1);
  });
  it('desde el 1 de enero se exige la matrícula del año nuevo', () => {
    const n = nino({ 'academico.matricula': m({ anio: 2026 }) });
    expect(item(n, '2027-01-01', 'academico', 'academico.matricula')?.estado).toBe('vencido');
  });
});

describe('Proyecto de vida y promedio general', () => {
  it('dos documentos desde el ingreso', () => {
    expect(tab(nino({ 'pv.plan': m() }), '2026-05-07', 'proyecto_vida').pct).toBe(50);
  });
  it('el general es el promedio de pestañas con algo exigible', () => {
    const ev = evaluarCarpeta(nino(), '2026-05-08');
    const conPct = ev.tabs.filter((t) => t.pct !== null);
    expect(ev.pct).toBe(Math.round(conPct.reduce((s, t) => s + t.pct!, 0) / conPct.length));
  });
});

describe('Agenda', () => {
  it('clasifica vencidos, semana y mes', () => {
    const ev = agenda([nino({}, { responsableRiesgo: 'psicologia' })], '2026-06-20');
    expect(ev.find((e) => e.itemId === 'informes.plan')?.urgencia).toBe('vencido');
    expect(ev.find((e) => e.itemId === 'riesgo.1')?.urgencia).toBe('mes');
  });
  it('alerta de carpeta fuera más de 7 días', () => {
    const n = nino({}, { prestamo: { por: 'u1', desde: '2026-06-01T09:00:00Z' } });
    expect(agenda([n], '2026-06-09').some((e) => e.que.startsWith('Carpeta fuera'))).toBe(true);
    expect(agenda([n], '2026-06-08').some((e) => e.que.startsWith('Carpeta fuera'))).toBe(false);
  });
});

describe('Reporte por ítem', () => {
  it('lista a quién le falta o tiene vencido un documento sin cambiar datos', () => {
    const ids = catalogoItems('2026-10-16').map((i) => i.id);
    expect(ids).toEqual(expect.arrayContaining(['socio.adres', 'hm.adres', 'socio.cupo_traslado', 'academico.matricula', 'informes.preliminar']));
    expect(ids.some((id) => id.startsWith('ate.'))).toBe(false);
    const a = nino({ 'socio.adres': m({ fecha: '2026-09-01' }) }, { id: 'a', nombres: 'Ana' });
    const b = nino({ 'socio.adres': m({ fecha: '2026-05-01' }) }, { id: 'b', nombres: 'Beto' });
    const c = nino({}, { id: 'c', nombres: 'Caro' });
    const copia = JSON.stringify([a, b, c]);
    const filas = reportePorItem([a, b, c], '2026-10-16', 'socio.adres');
    expect(Object.fromEntries(filas.map((f) => [f.ninoId, f.estado]))).toEqual({ a: 'al_dia', b: 'vencido', c: 'falta' });
    expect(JSON.stringify([a, b, c])).toBe(copia);
  });
});
