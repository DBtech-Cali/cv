# Contenido de la carpeta — Semillas Salesianas

Qué debe contener cada pestaña de la carpeta física y cómo se calcula su cumplimiento.
Las fechas de plan de caso, seguimientos y atenciones están en
[`reglas-atencion.md`](reglas-atencion.md).

## 1. Reglas generales

### Porcentaje de cumplimiento por pestaña

- **% = ítems cumplidos / ítems exigibles a la fecha.**
- Los ítems **opcionales** y las **listas libres** no suman ni restan.
- Un ítem **con fecha** se exige desde el **día siguiente** a su fecha (el mismo día
  todavía se puede entregar sin que cuente como faltante).
- Un ítem **sin fecha** se exige desde el **día del ingreso**.
- Si una pestaña aún no tiene ítems exigibles, se muestra como "sin pendientes aún".
- Un ítem marcado pero **vencido** (por ejemplo, ADRES fuera de vigencia) cuenta
  como no cumplido.
- Cada casilla es **independiente**. Si un documento aparece en dos pestañas (ADRES,
  portabilidad, historia médica) es porque la carpeta lleva dos copias: se marca por
  separado en cada una.

### Porcentaje general del niño

- **Promedio de los porcentajes de las pestañas** que tienen ítems exigibles
  (las pestañas "sin pendientes aún" no entran en el promedio).

### Comodines (solicitudes de documentos que llegan de afuera)

Un comodín vigente hace que los documentos faltantes que cubre **cuenten como
cumplidos**. Un comodín vencido cuenta **como si no existiera**: los faltantes vuelven
a contar como faltantes.

- **Todos los comodines valen 1 semana** desde la fecha de envío.
  Ejemplo: solicitud del 7 de mayo vale hasta el 14 de mayo; desde el 15 está vencida.
- Una sola solicitud cubre **todos** los faltantes que le corresponden (uno o varios).
- Se registra la **fecha del último envío**; al reiterar se reemplaza (sin historial).
- **No se puede desmarcar** mientras falte algún documento que cubre.

| Pestaña | Cubre |
|---|---|
| Inicial | Los 4 documentos de la pestaña |
| Socio legal | Las 3 valoraciones (Psicología, Trabajo social, Nutrición) |

Ninguna otra pestaña tiene comodín.

Ejemplo de cálculo (Inicial, 4 requeridos, 2 faltan):

| Situación | Resultado |
|---|---|
| Comodín vigente | 100 % |
| Comodín vencido | 2/4 = 50 % |
| Sin comodín | 2/4 = 50 % |

## 2. Pestañas

Orden: Inicial · Socio legal · Informes · Trabajo social · Psicología · Historia
médica · Nutrición · Académico · Proyecto de vida.

### 2.1 Inicial

| Ítem | Tipo | Comodín |
|---|---|---|
| Lista de chequeo | Requerido | Sí |
| Boleta de ingreso | Requerido | Sí |
| Ficha de ingreso | Requerido | Sí |
| Pacto de convivencia | Requerido | Sí |
| Correo de solicitud | Comodín, 1 semana | — |

### 2.2 Socio legal

Todo se exige a **todos** los niños (modalidad especial). Cada ítem es una casilla
propia.

| Ítem | Tipo | Comodín |
|---|---|---|
| Acta de buen trato | Requerido | No |
| Auto de trámite | Requerido | No |
| Valoración de Psicología | Requerido | Sí |
| Valoración de Trabajo social | Requerido | Sí |
| Valoración de Nutrición | Requerido | Sí |
| Declaración ante la Unidad de Víctimas | Requerido | No |
| Denuncia | Requerido | No |
| ADRES (afiliación en salud) | Requerido, **vigencia 3 meses** desde la fecha del documento | No |
| Portabilidad | Requerido | No |
| Entrevista GAO | Requerido | No |
| Solicitud de cupo (la hace la Defensora para esta modalidad) | Requerido | No |
| Solicitud de CODA | Requerido | No |
| CODA | Requerido | No |
| Historial médico | Requerido | No |
| Tarjeta de identidad | Requerido | No |
| Solicitud de valoraciones | Comodín, 1 semana | — |

**Traslado de otra institución:** casilla "Viene de traslado". Si se marca, se exigen
además:

| Ítem | Tipo |
|---|---|
| Acta de ubicación | Requerido |
| Asistencia técnica | Requerido |
| Solicitud de cupo del traslado (distinta a la de la Defensora) | Requerido |

ADRES: al marcarlo se registra su fecha. Ejemplo con hoy 13 oct: ADRES del 13 jul es
válido (último día); del 12 jul está vencido.

### 2.3 Informes

Pestaña que **crece con el tiempo**. Solo se exige lo que ya debió existir.

| Ítem | Se exige desde |
|---|---|
| Evaluación preliminar | Ingreso + 5 días |
| Evaluación integradora (distinta a la preliminar) | Ingreso + 22 días |
| Acta de caso de la evaluación integradora | Misma fecha que la evaluación integradora |
| Plan de caso | Ingreso + 1 mes (día ancla) |
| Correo de envío del plan de caso | Misma fecha que el plan de caso |
| Seguimiento N | Plan de caso + 3·N meses |
| Correo de envío del seguimiento N | Misma fecha que el seguimiento N |

Sin comodín.

### 2.4 Trabajo social

| Ítem | Tipo |
|---|---|
| Responsable del nivel de riesgo | Selector: Trabajo social o Psicología |
| Solicitud de llamada | Requerido, sin fecha |
| Atenciones de Trabajo social | 6 sin fecha antes del 1er seguimiento, luego 3 por bloque (ver `reglas-atencion.md`) |
| Seguimientos de nivel de riesgo | Si Trabajo social es la responsable |
| Formato hoja de llamada | Opcional (se deposita al final), no afecta el % |
| Solicitudes de visita | Lista libre: fecha, persona y parentesco. No afecta el % |

Sin comodín.

### 2.5 Psicología

| Ítem | Tipo |
|---|---|
| Atenciones de ingreso: valoración de consumo, estado físico, adaptación, seguimiento a la adaptación, gustos y preferencias, estado emocional | Sin fecha; exigibles desde el día siguiente al 1er seguimiento |
| Atenciones mensuales | 3 por bloque desde el 1er seguimiento (ver `reglas-atencion.md`) |
| Seguimientos de nivel de riesgo | Si Psicología es la responsable |

Sin comodín.

### 2.6 Historia médica

| Ítem | Tipo |
|---|---|
| ADRES | Requerido, **vigencia 3 meses** (copia propia, independiente de la de Socio legal) |
| Portabilidad | Requerido |
| Historia médica | Requerido |

Sin comodín.

### 2.7 Nutrición

| Ítem | Tipo |
|---|---|
| Evaluación nutricional inicial (del nutricionista de la modalidad, distinta a la valoración de Socio legal) | Requerido |
| Peso y talla, con fecha completa | Requerido, con vigencia |
| Casilla "Caso especial" (exceso / déficit de peso) | Activa las atenciones y la frecuencia propia del peso y talla |
| Atenciones de Nutrición | Solo si es caso especial, con la frecuencia que elija la nutricionista (ver `reglas-atencion.md`) |

Vigencia del peso y talla desde su fecha:

- Niño regular: **6 meses**.
- Caso especial: **1, 2 o 3 meses**, según elija la nutricionista. Al desactivar el
  caso especial vuelve a 6 meses.

Sin comodín.

### 2.8 Académico

| Ítem | Tipo |
|---|---|
| Valoración inicial pedagógica | Requerido, **ingreso + 20 días** |
| Atenciones de Académico | Mensuales desde el ingreso (ver `reglas-atencion.md`) |
| Matrícula del año en curso (se registra el año) | Requerido |
| Vinculaciones (deporte, arte, etc.) | Lista libre: nombre y fecha opcional. No afecta el % |
| Cursos (cuando recibe certificado) | Lista libre: nombre y fecha opcional. No afecta el % |

Matrícula: desde el 1 de enero se exige la del nuevo año.

Sin comodín.

### 2.9 Proyecto de vida

| Ítem | Tipo |
|---|---|
| Exploración vocacional | Requerido, sin fecha |
| Plan de vida | Requerido, sin fecha |

Sin comodín.
