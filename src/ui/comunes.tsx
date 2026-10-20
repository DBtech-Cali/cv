import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import type { TabId } from '../dominio/carpeta';
import { type Fecha, larga } from '../dominio/fechas';
import type { Usuario } from '../dominio/modelo';
import type { Datos, Repositorio } from '../datos/repositorio';

export interface Contexto {
  repo: Repositorio;
  datos: Datos;
  hoy: Fecha;
  usuario: (id: string | undefined) => Usuario | undefined;
}

export const Ctx = createContext<Contexto | null>(null);
export const useApp = () => useContext(Ctx)!;

/** Rutas con hash: #/, #/nino/ID, #/nino/ID/TAB, #/agenda, #/admin/SECCION. */
export function useRuta(): string[] {
  const leer = () => window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  const [ruta, setRuta] = useState(leer);
  useEffect(() => {
    const f = () => setRuta(leer());
    window.addEventListener('hashchange', f);
    return () => window.removeEventListener('hashchange', f);
  }, []);
  return ruta;
}

export const ir = (ruta: string) => {
  window.location.hash = ruta;
};

export function banda(pct: number | null): string {
  if (pct === null) return 'banda-nada';
  if (pct < 50) return 'banda-rojo';
  if (pct < 90) return 'banda-ambar';
  return 'banda-verde';
}

export function Barra({ pct, gruesa, etiqueta }: { pct: number | null; gruesa?: boolean; etiqueta?: string }) {
  return (
    <span className={`progreso ${banda(pct)}`}>
      <span
        className={`pista ${gruesa ? 'pista--gruesa' : ''}`}
        role="progressbar"
        aria-label={etiqueta ?? 'Avance'}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct ?? undefined}
      >
        <span className="pista__lleno" style={{ width: `${pct ?? 0}%` }} />
      </span>
      <span className="pct">{pct === null ? '—' : `${pct} %`}</span>
    </span>
  );
}

/** Avatar de la app: una estrella que celebra (ojos cerrados, sonrisa y destellos) cuando algo llega al 100 %. */
export function Estrella({ tam = 44, feliz }: { tam?: number; feliz?: boolean }) {
  return (
    <svg width={tam} height={tam} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="M24 7 L29.1 19.3 L42.2 20.3 L32.2 28.9 L35.3 41.6 L24 34.6 L12.7 41.6 L15.8 28.9 L5.8 20.3 L18.9 19.3 Z"
        fill="#FF9F1C" stroke="#FF9F1C" strokeWidth="4" strokeLinejoin="round"
      />
      <circle cx="17.5" cy="29" r="1.9" fill="#FF5D73" opacity=".75" />
      <circle cx="30.5" cy="29" r="1.9" fill="#FF5D73" opacity=".75" />
      {feliz ? (
        <>
          <path d="M18 26l2-2 2 2M26 26l2-2 2 2M21.5 29.5q2.5 2 5 0" stroke="#12343B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M42 4l1 2.6 2.6 1-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1zM6 36l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" fill="#0E9F9A" />
        </>
      ) : (
        <>
          <circle cx="20.5" cy="25.5" r="2.2" fill="#12343B" />
          <circle cx="27.5" cy="25.5" r="2.2" fill="#12343B" />
        </>
      )}
    </svg>
  );
}

export function Icono({ d, tam = 20, color = 'currentColor', grosor = 2 }: { d: string; tam?: number; color?: string; grosor?: number }) {
  return (
    <svg width={tam} height={tam} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={grosor} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export const ICONOS = {
  atras: 'M15 18l-6-6 6-6',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  buscar: 'M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14zM20 20l-4-4',
  caja: 'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10',
  reloj: 'M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zM12 7v5l3 2',
  candado: 'M7 11h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2zM8 11V8a4 4 0 0 1 8 0v3',
  descargar: 'M12 4v11M7 10l5 5 5-5M5 20h14',
  correo: 'M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM3.5 7l8.5 6 8.5-6',
  escudo: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
};

const TONOS = {
  turquesa: { fondo: '#DDF5F3', tinta: '#0B7C78' },
  cielo: { fondo: '#E1EFFF', tinta: '#2563B0' },
  mango: { fondo: '#FFF0D6', tinta: '#A35A00' },
  coral: { fondo: '#FFE3E7', tinta: '#C4304A' },
  lila: { fondo: '#EFE9FF', tinta: '#6246C9' },
  lima: { fondo: '#EAF7D7', tinta: '#4B7A12' },
};

export const ICONOS_TAB: Record<TabId, { d: string; fondo: string; tinta: string }> = {
  inicial: { d: 'M5 21V4M5 4h11l-2 4 2 4H5', ...TONOS.turquesa },
  socio_legal: { d: 'M3 6h18v12H3zM7 10h4M7 14h6M15 10h3v4h-3z', ...TONOS.cielo },
  informes: { d: 'M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h7', ...TONOS.mango },
  trabajo_social: { d: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5.5a3 3 0 0 1 0 5.5M18 14c2 .7 3 2.8 3 6', ...TONOS.coral },
  psicologia: { d: 'M4 5h16v11H9l-5 4z', ...TONOS.lila },
  historia_medica: { d: 'M9.5 3h5v6.5H21v5h-6.5V21h-5v-6.5H3v-5h6.5z', ...TONOS.turquesa },
  nutricion: { d: 'M12 7c-3-2-7 0-7 5s3 9 5 9c1 0 1.5-.5 2-.5s1 .5 2 .5c2 0 5-4 5-9s-4-7-7-5zM12 7c0-2 1-4 3-4', ...TONOS.lima },
  academico: { d: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5', ...TONOS.mango },
  proyecto_vida: { d: 'M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zM15.5 8.5l-2 5-5 2 2-5z', ...TONOS.cielo },
};

export function Encabezado({ activa }: { activa: 'carpetas' | 'agenda' | 'admin' }) {
  const { hoy } = useApp();
  const dia = new Date(`${hoy}T12:00:00`).toLocaleDateString('es-CO', { weekday: 'short' }).replace('.', '');
  return (
    <header className="barra-sup no-imprimir">
      <div className="barra-sup__in">
        <a className="marca" href="#/">
          <Estrella />
          <span>
            <span className="marca__nombre">Casa de Protección</span>
            <span className="etiqueta-mono">Valdocco</span>
          </span>
        </a>
        <nav className="nav" aria-label="Secciones">
          <a href="#/" aria-current={activa === 'carpetas' ? 'page' : undefined}>Carpetas</a>
          <a href="#/agenda" aria-current={activa === 'agenda' ? 'page' : undefined}>Agenda</a>
          <a href="#/admin" aria-current={activa === 'admin' ? 'page' : undefined}>Administración</a>
        </nav>
        <span className="fecha-hoy">{dia} {larga(hoy)}</span>
      </div>
    </header>
  );
}

export function Dialogo({ titulo, children, onCerrar }: { titulo: string; children: ReactNode; onCerrar: () => void }) {
  useEffect(() => {
    const f = (e: KeyboardEvent) => e.key === 'Escape' && onCerrar();
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, [onCerrar]);
  return (
    <div className="velo" onClick={onCerrar}>
      <div className="dialogo" role="dialog" aria-modal="true" aria-label={titulo} onClick={(e) => e.stopPropagation()}>
        <h2 className="subtitulo">{titulo}</h2>
        {children}
      </div>
    </div>
  );
}
