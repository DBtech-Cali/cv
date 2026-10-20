import { type ReactNode, useState } from 'react';
import { FRECUENCIAS_NUTRICION, type FrecuenciaNutricion } from '../dominio/calendario';
import { type ItemEval, MESES_TALLAJE_REGULAR, type TabEval } from '../dominio/carpeta';
import { corta, type Fecha, partes } from '../dominio/fechas';
import { type CasoNutricion, type Marca, type Nino, RESPONSABLES, type Usuario } from '../dominio/modelo';
import { ahoraISO } from '../datos/repositorio';
import { Barra, Dialogo, Icono, ICONOS, ICONOS_TAB, useApp } from './comunes';

const ESTADO_PASTILLA: Partial<Record<ItemEval['estado'], [string, string]>> = {
  vencido: ['Vencido', 'pastilla--rojo'],
  pendiente: ['Pendiente', 'pastilla--rojo'],
  cubierto: ['Comodín', 'pastilla--violeta'],
};

export function Pestana({ nino, tab, sesion }: { nino: Nino; tab: TabEval; sesion: Usuario }) {
  const { repo, hoy, usuario } = useApp();
  const [editando, setEditando] = useState<ItemEval | null>(null);
  const ic = ICONOS_TAB[tab.id];

  const marcar = (it: ItemEval, extra: Partial<Marca> = {}) =>
    repo.marcar(nino.id, it.id, { por: sesion.id, en: ahoraISO(), ...extra }, sesion.id);
  const desmarcar = (it: ItemEval) => repo.marcar(nino.id, it.id, null, sesion.id);
  const cubiertos = tab.items.some((i) => i.estado === 'cubierto');

  const alternar = (it: ItemEval) => {
    if (it.pide) return setEditando(it);
    if (it.marca) return desmarcar(it);
    return marcar(it);
  };

  const docs = tab.items.filter((i) => i.tipo === 'doc' || i.tipo === 'opcional' || (i.tipo === 'programada' && !i.grupo));
  const comodines = tab.items.filter((i) => i.tipo === 'comodin');
  const interruptores = tab.items.filter((i) => i.tipo === 'interruptor');
  const grupos = [...new Set(tab.items.filter((i) => i.tipo === 'programada' && i.grupo).map((i) => i.grupo!))];
  const marcadoPor = (m?: Marca) => (m ? `Marcado por ${usuario(m.por)?.nombre ?? '—'} · ${corta(m.en.slice(0, 10), hoy)}` : '');

  return (
    <>
      <section className="fila-wrap" style={{ gap: '16px 24px' }}>
        <span className="icono-tab" style={{ width: 64, height: 64, borderRadius: 20, background: ic.fondo }}><Icono d={ic.d} tam={32} color={ic.tinta} /></span>
        <div style={{ flex: '1 1 260px' }}>
          <h1 className="titulo">{tab.nombre}</h1>
          <p className="bajada">Reporte: {RESPONSABLES[tab.responsable]} · lo que tiene fecha se exige desde el día siguiente.</p>
        </div>
        <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="txt-tenue">{tab.pct === null ? 'Nada exigible aún' : `${tab.cumplidos} de ${tab.exigibles} exigibles`}</span>
          <Barra pct={tab.pct} gruesa etiqueta={tab.nombre} />
        </div>
      </section>

      {tab.avisos.map((a) => <div key={a} className="aviso" role="note">{a}</div>)}

      {tab.id === 'nutricion' && <CasoEspecial nino={nino} />}
      {(tab.id === 'psicologia' || tab.id === 'trabajo_social') && <ResponsableRiesgo nino={nino} tab={tab.id} />}

      {interruptores.map((it) => (
        <section key={it.id} className="tarjeta tarjeta--pad fila-wrap" style={{ gap: 16 }}>
          <button type="button" role="switch" aria-checked={!!it.marca} aria-label={it.etiqueta} className="casilla casilla--interruptor" onClick={() => alternar(it)}>
            {it.marca && <Icono d={ICONOS.check} tam={22} color="#fff" grosor={3} />}
          </button>
          <span className="item__texto">
            <span className="item__nombre">{it.etiqueta}</span>
            <span className="item__nota">{it.marca ? marcadoPor(it.marca) : it.nota}</span>
          </span>
        </section>
      ))}

      {docs.length > 0 && (
        <section className="tarjeta items" aria-label="Documentos">
          {docs.map((it) => {
            const pastilla = ESTADO_PASTILLA[it.estado];
            const conFecha = it.tipo === 'programada';
            return (
              <div key={it.id} className="item">
                <button
                  type="button" role="checkbox" aria-checked={!!it.marca} aria-label={it.etiqueta}
                  className={`casilla ${it.estado === 'vencido' && it.marca ? 'casilla--alerta' : ''}`}
                  onClick={() => alternar(it)}
                >
                  {it.marca && <Icono d={ICONOS.check} tam={22} color="#fff" grosor={3} />}
                </button>
                <span className="item__texto">
                  <span className="item__nombre">{it.etiqueta}</span>
                  {conFecha && it.fecha && !it.fechaOculta && <span className="item__nota">Fecha: {corta(it.fecha, hoy)}</span>}
                  {it.nota && <span className={`item__nota ${it.estado === 'vencido' ? 'txt-rojo' : ''}`}>{it.nota}</span>}
                  {it.marca && <span className="item__nota">{marcadoPor(it.marca)}{it.marca.anio ? ` · año ${it.marca.anio}` : ''}</span>}
                </span>
                {it.tipo === 'opcional' && <span className="pastilla">Opcional</span>}
                {pastilla && <span className={`pastilla ${pastilla[1]}`}>{pastilla[0]}</span>}
                {it.tipo === 'programada' && !it.marca && it.estado === 'futuro' && <span className="pastilla">Programado</span>}
              </div>
            );
          })}
        </section>
      )}

      {grupos.map((g) => (
        <section key={g} className="tarjeta tarjeta--pad" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h2 className="subtitulo">{g}</h2>
          <div className="linea">
            {tab.items.filter((i) => i.grupo === g).map((it) => {
              const clase = it.marca ? 'nodo--ok' : it.estado === 'vencido' ? 'nodo--vencido' : '';
              const estado = it.marca ? `Hecha · ${usuario(it.marca.por)?.nombre ?? '—'}` : it.estado === 'vencido' ? 'Vencida' : 'Programada';
              return (
                <button key={it.id} type="button" className={`nodo ${clase}`} aria-pressed={!!it.marca} aria-label={`${it.etiqueta}, ${corta(it.fecha!, hoy)}: ${estado}`} onClick={() => alternar(it)}>
                  <span className="nodo__punto">{it.marca && <Icono d={ICONOS.check} tam={18} color="#fff" grosor={3.2} />}</span>
                  <span style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="nodo__fecha">{corta(it.fecha!, hoy).toUpperCase()}</span>
                    <span className="nodo__estado">{estado}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ))}

      {tab.id === 'trabajo_social' && <Visitas nino={nino} />}
      {tab.id === 'academico' && <><Vinculaciones nino={nino} /><Cursos nino={nino} /></>}

      {comodines.length > 0 && (
        <div className="fila-wrap" style={{ alignItems: 'stretch', gap: 16 }}>
          {comodines.length > 0 && (
            <section className="tarjeta tarjeta--pad seccion-comodin" style={{ flex: '1 1 380px', display: 'flex', flexDirection: 'column', gap: 12 }} aria-label="Solicitudes">
              <span className="etiqueta-mono" style={{ color: 'var(--primario)' }}>Comodín · solicitud de documentos</span>
              {comodines.map((it) => (
                <div key={it.id} className="fila-wrap" style={{ flexWrap: 'nowrap' }}>
                  <button type="button" role="checkbox" aria-checked={!!it.marca} aria-label={it.etiqueta} className={`casilla ${it.estado === 'vencido' ? 'casilla--alerta' : ''}`} onClick={() => alternar(it)}>
                    {it.marca && <Icono d={ICONOS.check} tam={22} color="#fff" grosor={3} />}
                  </button>
                  <span className="item__texto">
                    <span className="item__nombre">{it.etiqueta}</span>
                    <span className={`item__nota ${it.estado === 'vencido' ? 'txt-rojo' : it.estado === 'ok' ? 'txt-ambar' : ''}`}>{it.nota}</span>
                  </span>
                </div>
              ))}
            </section>
          )}
        </div>
      )}

      {editando && (
        <DialogoDato
          it={editando}
          bloqueaDesmarcar={editando.tipo === 'comodin' && cubiertos ? 'No se puede desmarcar mientras falte algún documento que cubre. Actualiza la fecha si reiteraste la solicitud.' : null}
          onGuardar={(extra) => marcar(editando, extra).then(() => setEditando(null))}
          onDesmarcar={() => desmarcar(editando).then(() => setEditando(null))}
          onCerrar={() => setEditando(null)}
        />
      )}
    </>
  );
}

function DialogoDato({ it, bloqueaDesmarcar, onGuardar, onDesmarcar, onCerrar }: {
  it: ItemEval;
  bloqueaDesmarcar: string | null;
  onGuardar: (extra: Partial<Marca>) => void;
  onDesmarcar: () => void;
  onCerrar: () => void;
}) {
  const { hoy } = useApp();
  const [fecha, setFecha] = useState(it.marca?.fecha ?? hoy);
  const [anio, setAnio] = useState(it.marca?.anio ?? partes(hoy).y);
  const valido = it.pide === 'fecha' ? !!fecha && fecha <= hoy : it.pide === 'anio' ? anio > 2000 : true;
  return (
    <Dialogo titulo={it.etiqueta} onCerrar={onCerrar}>
      {it.pide === 'fecha' && (
        <label className="campo">
          {it.tipo === 'comodin' ? 'Fecha de envío' : 'Fecha del documento'}
          <input type="date" value={fecha} max={hoy} onChange={(e) => setFecha(e.target.value)} />
        </label>
      )}
      {it.pide === 'anio' && (
        <label className="campo">
          Año de la matrícula
          <input type="number" value={anio} onChange={(e) => setAnio(Number(e.target.value))} />
        </label>
      )}
      {it.marca && bloqueaDesmarcar && <p className="txt-ambar" style={{ margin: 0 }}>{bloqueaDesmarcar}</p>}
      <div className="fila-wrap">
        <button type="button" className="btn btn--primario" disabled={!valido} onClick={() => onGuardar(it.pide === 'fecha' ? { fecha } : it.pide === 'anio' ? { anio } : {})}>
          {it.marca ? 'Guardar cambios' : 'Marcar'}
        </button>
        {it.marca && <button type="button" className="btn btn--peligro" disabled={!!bloqueaDesmarcar} onClick={onDesmarcar}>Desmarcar</button>}
        <button type="button" className="btn btn--suave" onClick={onCerrar}>Cancelar</button>
      </div>
    </Dialogo>
  );
}

const CASO_INICIAL: Omit<CasoNutricion, 'desde'> = { tallajeMeses: 3, atenciones: 'mensual' };

function CasoEspecial({ nino }: { nino: Nino }) {
  const { repo, hoy } = useApp();
  const caso = nino.nutricion;
  const guardar = (cambios: Partial<CasoNutricion>) => caso && repo.actualizarNino(nino.id, { nutricion: { ...caso, ...cambios } });
  return (
    <section className="tarjeta tarjeta--pad" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="fila-wrap" style={{ gap: 16, flexWrap: 'nowrap' }}>
        <button
          type="button" role="switch" aria-checked={!!caso} aria-label="Caso especial de nutrición"
          className="casilla casilla--interruptor"
          onClick={() => repo.actualizarNino(nino.id, { nutricion: caso ? null : { desde: hoy, ...CASO_INICIAL } })}
        >
          {caso && <Icono d={ICONOS.check} tam={22} color="#fff" grosor={3} />}
        </button>
        <span className="item__texto">
          <span className="item__nombre">Caso especial (exceso o déficit de peso)</span>
          <span className="item__nota">
            {caso
              ? `Marcado el ${corta(caso.desde, hoy)}. Las atenciones se cuentan desde el ingreso. Al desactivarlo deja de exigirse todo lo del caso especial.`
              : `Peso y talla cada ${MESES_TALLAJE_REGULAR} meses. Al activarlo eliges cada cuánto van el peso y talla y las atenciones.`}
          </span>
        </span>
      </div>
      {caso && (
        <div className="fila-wrap" style={{ alignItems: 'flex-start', gap: '14px 28px' }}>
          <Opciones
            titulo="Peso y talla"
            valor={caso.tallajeMeses}
            opciones={[[1, 'Cada mes'], [2, 'Cada 2 meses'], [3, 'Cada 3 meses']]}
            onCambio={(v) => guardar({ tallajeMeses: v })}
          />
          <Opciones
            titulo="Atenciones"
            valor={caso.atenciones}
            opciones={(Object.entries(FRECUENCIAS_NUTRICION) as [FrecuenciaNutricion, string][])}
            onCambio={(v) => guardar({ atenciones: v })}
          />
        </div>
      )}
    </section>
  );
}

function Opciones<T extends string | number>({ titulo, valor, opciones, onCambio }: {
  titulo: string;
  valor: T;
  opciones: [T, string][];
  onCambio: (v: T) => void;
}) {
  return (
    <div role="group" aria-label={titulo} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span className="etiqueta-mono">{titulo}</span>
      <div className="fila-wrap" style={{ gap: 8 }}>
        {opciones.map(([v, txt]) => (
          <button key={String(v)} type="button" className="chip" aria-pressed={valor === v} onClick={() => onCambio(v)}>{txt}</button>
        ))}
      </div>
    </div>
  );
}

function ResponsableRiesgo({ nino, tab }: { nino: Nino; tab: 'psicologia' | 'trabajo_social' }) {
  const { repo } = useApp();
  const actual = nino.responsableRiesgo;
  if (actual && actual !== tab) {
    return <p className="txt-tenue" style={{ margin: 0 }}>El seguimiento de nivel de riesgo lo lleva {RESPONSABLES[actual]}.</p>;
  }
  return (
    <section className="tarjeta tarjeta--pad fila-wrap" style={{ gap: 16 }}>
      <button
        type="button" role="switch" aria-checked={actual === tab} aria-label={`Nivel de riesgo a cargo de ${RESPONSABLES[tab]}`}
        className="casilla"
        onClick={() => repo.actualizarNino(nino.id, { responsableRiesgo: actual === tab ? null : tab })}
      >
        {actual === tab && <Icono d={ICONOS.check} tam={22} color="#fff" grosor={3} />}
      </button>
      <span className="item__texto">
        <span className="item__nombre">Llevo el seguimiento de nivel de riesgo</span>
        <span className="item__nota">Mensual desde el plan de caso. Se registra en la pestaña de quien lo lleva.</span>
      </span>
    </section>
  );
}

interface Campo {
  clave: string;
  etiqueta: string;
  tipo?: 'date';
  requerido?: boolean;
  ejemplo?: string;
}

/** Lista libre que no suma al porcentaje: vinculaciones, cursos y solicitudes de visita. */
function ListaLibre<T extends { id: string }>({ titulo, vacio, lista, campos, mostrar, onGuardar }: {
  titulo: string;
  vacio: string;
  lista: T[];
  campos: Campo[];
  mostrar: (x: T) => ReactNode;
  onGuardar: (lista: T[]) => void;
}) {
  const vacioForm = () => Object.fromEntries(campos.map((c) => [c.clave, '']));
  const [f, setF] = useState<Record<string, string>>(vacioForm);
  const valido = campos.every((c) => !c.requerido || f[c.clave].trim());
  const agregar = () => {
    if (!valido) return;
    const nuevo = Object.fromEntries(campos.filter((c) => f[c.clave].trim()).map((c) => [c.clave, f[c.clave].trim()]));
    onGuardar([...lista, { id: String(Date.now()), ...nuevo } as unknown as T]);
    setF(vacioForm());
  };
  return (
    <section className="tarjeta tarjeta--pad" style={{ display: 'flex', flexDirection: 'column', gap: 12 }} aria-label={titulo}>
      <div className="fila-wrap">
        <h2 className="subtitulo">{titulo}</h2>
        <span className="pastilla">No suma al porcentaje</span>
      </div>
      {lista.length === 0 && <p className="txt-tenue" style={{ margin: 0 }}>{vacio}</p>}
      {lista.map((x) => (
        <div key={x.id} className="fila-wrap registro">
          <span>{mostrar(x)}</span>
          <button type="button" className="btn btn--suave" onClick={() => onGuardar(lista.filter((y) => y.id !== x.id))}>Quitar</button>
        </div>
      ))}
      <div className="fila-wrap" style={{ alignItems: 'flex-end' }}>
        {campos.map((c) => (
          <label key={c.clave} className="campo" style={{ flex: c.tipo === 'date' ? '1 1 160px' : '2 1 200px' }}>
            {c.etiqueta}{c.requerido ? '' : ' (opcional)'}
            <input type={c.tipo ?? 'text'} value={f[c.clave]} placeholder={c.ejemplo} onChange={(e) => setF({ ...f, [c.clave]: e.target.value })} />
          </label>
        ))}
        <button type="button" className="btn btn--primario" disabled={!valido} onClick={agregar}>Agregar</button>
      </div>
    </section>
  );
}

function Vinculaciones({ nino }: { nino: Nino }) {
  const { repo, hoy } = useApp();
  return (
    <ListaLibre
      titulo="Vinculaciones"
      vacio="Sin vinculaciones registradas."
      lista={nino.vinculaciones ?? []}
      campos={[{ clave: 'nombre', etiqueta: 'Nombre', requerido: true, ejemplo: 'Ej.: Fútbol, grupo de danza' }, { clave: 'fecha', etiqueta: 'Fecha', tipo: 'date' }]}
      mostrar={(v) => <><strong>{v.nombre}</strong>{v.fecha && <span className="txt-tenue"> · {corta(v.fecha, hoy)}</span>}</>}
      onGuardar={(vinculaciones) => repo.actualizarNino(nino.id, { vinculaciones })}
    />
  );
}

function Cursos({ nino }: { nino: Nino }) {
  const { repo, hoy } = useApp();
  return (
    <ListaLibre
      titulo="Cursos con certificado"
      vacio="Sin cursos registrados."
      lista={nino.cursos ?? []}
      campos={[
        { clave: 'nombre', etiqueta: 'Curso', requerido: true, ejemplo: 'Ej.: Manipulación de alimentos' },
        { clave: 'entidad', etiqueta: 'Entidad que certifica', requerido: true, ejemplo: 'Ej.: SENA' },
        { clave: 'fecha', etiqueta: 'Fecha', tipo: 'date' },
      ]}
      mostrar={(c) => <><strong>{c.nombre}</strong><span className="txt-tenue"> · {c.entidad}{c.fecha ? ` · ${corta(c.fecha, hoy)}` : ''}</span></>}
      onGuardar={(cursos) => repo.actualizarNino(nino.id, { cursos })}
    />
  );
}

function Visitas({ nino }: { nino: Nino }) {
  const { repo, hoy } = useApp();
  const orden = (xs: { fecha: Fecha }[]) => [...xs].sort((a, b) => a.fecha.localeCompare(b.fecha));
  return (
    <ListaLibre
      titulo="Solicitudes de visita"
      vacio="Sin solicitudes de visita registradas."
      lista={orden(nino.visitas ?? []) as NonNullable<Nino['visitas']>}
      campos={[
        { clave: 'fecha', etiqueta: 'Fecha', tipo: 'date', requerido: true },
        { clave: 'persona', etiqueta: 'Persona', requerido: true, ejemplo: 'Ej.: Juanita Pérez' },
        { clave: 'parentesco', etiqueta: 'Parentesco', ejemplo: 'Ej.: tía' },
      ]}
      mostrar={(v) => <><strong>Solicitud de visita · {v.persona}</strong><span className="txt-tenue">{v.parentesco ? ` (${v.parentesco})` : ''} · {corta(v.fecha, hoy)}</span></>}
      onGuardar={(visitas) => repo.actualizarNino(nino.id, { visitas })}
    />
  );
}
