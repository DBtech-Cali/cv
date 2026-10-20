# Reglas de atención — Semillas Salesianas

Fuente de verdad para calcular el calendario de cada niño o niña de la modalidad.
Toda la programación de fechas de la aplicación debe salir de estas reglas.

## 1. Principios generales

- **Todo se calcula desde la fecha de ingreso.** El calendario es fijo: nunca se
  recalcula aunque una actividad se haga tarde, porque se reporta a una autoridad.
- **Fechas exactas.** Sin márgenes de adelanto o atraso. Si una fecha cae en fin de
  semana o festivo se deja tal cual; es responsabilidad del profesional hacerla antes.
- **Programado vs. cumplido.** La aplicación separa:
  - lo **programado**: fechas calculadas, inmóviles;
  - lo **cumplido**: si el documento de esa actividad ya está en la carpeta.
- **Exigible desde el día siguiente.** Toda actividad con fecha cuenta como faltante
  a partir del día siguiente a su fecha; el mismo día todavía se puede entregar.

## 2. Día ancla y fin de mes

- **Plan de caso = fecha de ingreso + 1 mes calendario**, el mismo número de día.
- Si el mes siguiente no tiene ese día, el plan de caso cae en el **último día del mes**.
- **El día del plan de caso es el día ancla** de los seguimientos, del nivel de riesgo
  y de las atenciones de Trabajo social y Psicología.
- Cuando un mes no tiene el día ancla, **solo ese mes** usa su último día; el
  siguiente vuelve al día ancla.
- Las atenciones de **Académico** y de **Nutrición** se cuentan desde el **día del
  ingreso** (ver secciones 6 y 7), con la misma regla de fin de mes.

Ejemplos:

| Ingreso | Plan de caso | Día ancla |
|---|---|---|
| 7 may | 7 jun | 7 |
| 31 ene | 28 feb (29 si es bisiesto) | 28 (o 29) |
| 31 mar | 30 abr | 30 |
| 30 oct | 30 nov | 30 |

## 3. Seguimientos

- **Seguimiento N = plan de caso + 3·N meses**, en el día ancla.
- Se repiten cada 3 meses de forma indefinida, hasta el egreso.
- El tramo entre dos seguimientos consecutivos es un **bloque trimestral**.

## 4. Áreas con atenciones

| Área | Obligatoria | Regla |
|---|---|---|
| Trabajo social | Sí | Sección 5 |
| Psicología | Sí | Sección 5 |
| Académico (pedagogo) | Sí | Sección 6 |
| Nutrición | No — solo si es caso especial | Sección 7 |

## 5. Atenciones de Trabajo social y Psicología

Las dos áreas siguen el mismo calendario, cada una con su propio juego de atenciones.

### Ingreso → 1er seguimiento: 6 atenciones sin fecha

- Son **6 atenciones sin fecha propia**: se pueden hacer en cualquier momento antes
  del 1er seguimiento.
- Aparecen desde el ingreso, pero **no cuentan como pendientes** hasta el **día
  siguiente al 1er seguimiento**. Desde ese día, las que falten cuentan como vencidas.
- **Psicología** — cada una tiene nombre:
  1. Valoración de consumo
  2. Estado físico
  3. Adaptación
  4. Seguimiento a la adaptación
  5. Gustos y preferencias
  6. Estado emocional
- **Trabajo social** — sin nombre propio: Atención 1 a Atención 6.

### Desde el 1er seguimiento: 3 atenciones por bloque trimestral

Una atención mensual, en el día ancla. La tercera del bloque coincidiría con el
seguimiento siguiente, por eso se adelanta **5 días**:

1. Seguimiento que abre el bloque + 1 mes
2. Seguimiento que abre el bloque + 2 meses
3. Seguimiento siguiente − 5 días (fecha exacta)

Se repite en cada bloque, de forma indefinida, hasta el egreso.

## 6. Atenciones de Académico (pedagogo)

Mensuales, en el **día del ingreso** (con la regla de fin de mes):

- Si ingresa **del día 1 al 15** del mes: la 1ª atención es **ingreso + 15 días**.
  Después, ingreso + 1 mes, + 2 meses, + 3 meses…
- Si ingresa **del día 16 en adelante**: ese mes no tiene atención. La 1ª es
  **ingreso + 1 mes**; después, + 2 meses, + 3 meses…

Ejemplos: ingreso 7 may → 22 may, 7 jun, 7 jul, 7 ago… · ingreso 20 may → 20 jun,
20 jul, 20 ago…

## 7. Nutrición

- Se activa **solo cuando el nutricionista incluye al niño o niña** por afectación
  nutricional (exceso o déficit de peso), marcando **"Caso especial"** en la pestaña
  Nutrición.
- Al activarla, la nutricionista elige **por separado**:
  - **Frecuencia del peso y talla:** cada 1, 2 o 3 meses (es la vigencia del tallaje,
    ver `contenido-carpeta.md`).
  - **Frecuencia de las atenciones:**

    | Frecuencia | Fechas |
    |---|---|
    | 2 al mes | ingreso + 15 días, + 1 mes, + 1 mes y 15 días, + 2 meses… |
    | 1 al mes | ingreso + 1 mes, + 2 meses, + 3 meses… |
    | 1 al trimestre | ingreso + 3 meses, + 6 meses, + 9 meses… |

- Las atenciones se cuentan **desde el día del ingreso**, sin importar cuándo se
  marque el caso especial: al pasar carpetas antiguas a la app aparecen las atenciones
  que debieron hacerse. Si se cambia la frecuencia, el calendario se calcula de nuevo
  con la frecuencia nueva.
- La nutricionista **puede desactivarla** cuando el niño recupera o estabiliza su peso.
  Al desactivarla **deja de exigirse todo** lo del caso especial (incluidas atenciones
  ya vencidas) hasta que se vuelva a activar.

## 8. Seguimiento de nivel de riesgo

- **Todos** los niños lo tienen.
- **Mensual** desde el plan de caso, en el día ancla (misma regla de fin de mes):
  plan de caso + 1 mes, + 2 meses, + 3 meses… hasta el egreso.
  Ejemplo: plan 15 mar → 15 abr, 15 may, 15 jun, 15 jul…
- **Responsable** asignada por niño: Trabajo social **o** Psicología. Se registra en
  la pestaña de la responsable. No cambia en el tiempo.

## 9. Egreso

- Al egresar, la carpeta física con todo su material se traslada a otro lugar.
- En la aplicación el niño o niña **deja de verse** en el panel (solo se muestran los
  activos) y deja de generar fechas y pendientes.
- Los datos **no se borran**: quedan guardados como histórico.

## 10. Ejemplos completos

### Ingreso 7 de mayo de 2026

| Hito / bloque | Trabajo social y Psicología (c/u) | Académico |
|---|---|---|
| Ingreso — 7 may 2026 | 6 atenciones sin fecha (exigibles desde el 8 sep) | 22 may |
| **Plan de caso** — 7 jun 2026 | | 7 jun · 7 jul · 7 ago |
| **1er seguimiento** — 7 sep 2026 | 7 oct · 7 nov · 2 dic | 7 sep · 7 oct · 7 nov |
| **2º seguimiento** — 7 dic 2026 | 7 ene · 7 feb · 2 mar 2027 | 7 dic · 7 ene · 7 feb |
| **3er seguimiento** — 7 mar 2027 | 7 abr · 7 may · 2 jun 2027 | … |

Nutrición (caso especial, 1 al mes): 7 jun, 7 jul, 7 ago… · (2 al mes): 22 may, 7 jun,
22 jun, 7 jul…

### Ingreso 31 de enero de 2027 (fin de mes, año no bisiesto)

| Hito / bloque | Trabajo social y Psicología | Académico |
|---|---|---|
| Ingreso — 31 ene 2027 | 6 atenciones sin fecha (exigibles desde el 29 may) | enero sin atención (día 31) |
| **Plan de caso** — 28 feb 2027 (ancla 28) | | 28 feb · 31 mar · 30 abr |
| **1er seguimiento** — 28 may 2027 | 28 jun · 28 jul · 23 ago | 31 may · 30 jun · 31 jul |
| **2º seguimiento** — 28 ago 2027 | 28 sep · 28 oct · 23 nov | 31 ago · 30 sep · 31 oct |
| **3er seguimiento** — 28 nov 2027 | | |

### Ingreso 30 de octubre de 2026 (el ancla vuelve después de febrero)

| Hito / bloque | Trabajo social y Psicología |
|---|---|
| **Plan de caso** | 30 nov 2026 (día ancla: 30) |
| **1er seguimiento** | **28 feb 2027** (febrero no tiene 30) |
| Bloque 1 | 30 mar · 30 abr · 25 may |
| **2º seguimiento** | **30 may 2027** (vuelve al ancla) |
| Bloque 2 | 30 jun · 30 jul · 25 ago |
| **3er seguimiento** | 30 ago 2027 |
