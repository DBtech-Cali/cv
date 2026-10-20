import { describe, expect, it } from 'vitest';
import { atencionesAcademico, atencionesNutricion, atencionesPorBloque, hito, informes, nivelRiesgo, planDeCaso } from './calendario';
import { sumarMeses } from './fechas';

const fechas = (xs: { fecha: string }[]) => xs.map((x) => x.fecha);

describe('día ancla y fin de mes', () => {
  it('lleva al último día cuando el mes no tiene el día', () => {
    expect(sumarMeses('2027-01-31', 1)).toBe('2027-02-28');
    expect(sumarMeses('2028-01-31', 1)).toBe('2028-02-29');
    expect(sumarMeses('2026-03-31', 1)).toBe('2026-04-30');
  });
});

describe('ingreso 7 de mayo de 2026', () => {
  const ing = '2026-05-07';
  it('plan y seguimientos', () => {
    expect(planDeCaso(ing)).toBe('2026-06-07');
    expect([1, 2, 3, 4].map((k) => hito(ing, k))).toEqual(['2026-09-07', '2026-12-07', '2027-03-07', '2027-06-07']);
  });
  it('Trabajo social y Psicología: 3 por bloque, la tercera 5 días antes del seguimiento siguiente', () => {
    const xs = atencionesPorBloque(ing, '2027-06-06');
    expect(fechas(xs)).toEqual([
      '2026-10-07', '2026-11-07', '2026-12-02',
      '2027-01-07', '2027-02-07', '2027-03-02',
      '2027-04-07', '2027-05-07', '2027-06-02',
    ]);
    expect(xs[0].etiqueta).toBe('Atención 7');
    expect(xs[0].grupo).toBe('Bloque 1 · 1º → 2º seguimiento');
  });
  it('Académico: ingreso hasta el día 15, la primera a los 15 días', () => {
    expect(fechas(atencionesAcademico(ing, '2026-09-30'))).toEqual(['2026-05-22', '2026-06-07', '2026-07-07', '2026-08-07', '2026-09-07']);
  });
  it('Nutrición: desde el ingreso con la frecuencia elegida', () => {
    expect(fechas(atencionesNutricion(ing, 'mensual', '2026-09-30'))).toEqual(['2026-06-07', '2026-07-07', '2026-08-07', '2026-09-07']);
    expect(fechas(atencionesNutricion(ing, 'quincenal', '2026-07-10'))).toEqual(['2026-05-22', '2026-06-07', '2026-06-22', '2026-07-07']);
    expect(fechas(atencionesNutricion(ing, 'trimestral', '2027-05-31'))).toEqual(['2026-08-07', '2026-11-07', '2027-02-07', '2027-05-07']);
  });
  it('nivel de riesgo mensual', () => {
    expect(fechas(nivelRiesgo(ing, '2026-10-31'))).toEqual(['2026-07-07', '2026-08-07', '2026-09-07', '2026-10-07']);
  });
  it('informes empiezan con la preliminar y crecen con el tiempo', () => {
    expect(informes(ing, '2026-07-15').map((i) => i.id)).toEqual(['preliminar', 'eval_integradora', 'acta_integradora', 'plan', 'correo_plan']);
    expect(informes(ing, '2026-07-15')[0].fecha).toBe('2026-05-12');
    expect(informes(ing, '2026-07-15')[1].fecha).toBe('2026-05-29');
    expect(informes(ing, '2026-10-15').map((i) => i.id)).toContain('correo_seg_1');
  });
});

describe('Académico: ingreso del día 16 en adelante', () => {
  it('ese mes no tiene atención', () => {
    expect(fechas(atencionesAcademico('2026-05-20', '2026-08-31'))).toEqual(['2026-06-20', '2026-07-20', '2026-08-20']);
  });
  it('el día 15 todavía tiene atención ese mes', () => {
    expect(fechas(atencionesAcademico('2026-05-15', '2026-06-30'))).toEqual(['2026-05-30', '2026-06-15']);
  });
});

describe('ingreso 31 de enero de 2027', () => {
  const ing = '2027-01-31';
  it('ancla 28 en seguimientos y atenciones por bloque', () => {
    expect(planDeCaso(ing)).toBe('2027-02-28');
    expect([1, 2, 3].map((k) => hito(ing, k))).toEqual(['2027-05-28', '2027-08-28', '2027-11-28']);
    expect(fechas(atencionesPorBloque(ing, '2027-11-27'))).toEqual(['2027-06-28', '2027-07-28', '2027-08-23', '2027-09-28', '2027-10-28', '2027-11-23']);
  });
  it('Académico usa el día del ingreso (31) con la regla de fin de mes', () => {
    expect(fechas(atencionesAcademico(ing, '2027-07-31'))).toEqual(['2027-02-28', '2027-03-31', '2027-04-30', '2027-05-31', '2027-06-30', '2027-07-31']);
  });
});

describe('ingreso 30 de octubre de 2026', () => {
  const ing = '2026-10-30';
  it('un bloque que ya empezó se muestra completo', () => {
    expect(fechas(atencionesPorBloque('2026-05-07', '2026-09-07'))).toEqual(['2026-10-07', '2026-11-07', '2026-12-02']);
  });
  it('el ancla vuelve después de febrero', () => {
    expect(planDeCaso(ing)).toBe('2026-11-30');
    expect([1, 2, 3].map((k) => hito(ing, k))).toEqual(['2027-02-28', '2027-05-30', '2027-08-30']);
    expect(fechas(atencionesPorBloque(ing, '2027-08-29'))).toEqual(['2027-03-30', '2027-04-30', '2027-05-25', '2027-06-30', '2027-07-30', '2027-08-25']);
  });
});
