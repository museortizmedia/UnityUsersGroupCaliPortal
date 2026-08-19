import React from 'react';
import projectsData from '../data/projects.json';
import { useEvents } from '../hooks/useEvents';
import { useAuth } from '../context/AuthContext';
import { useMemo } from 'react';

// Mapeo de meses en español (tal como están en tu JSON)
const MONTHS_ES = [
  'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
  'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'
];

const MONTH_MAP = {
  ENE: 0, FEB: 1, MAR: 2, ABR: 3, MAY: 4, JUN: 5,
  JUL: 6, AGO: 7, SEP: 8, OCT: 9, NOV: 10, DIC: 11
};

export default function MainPage({ setActiveTab }) {
  const { isLoggedIn } = useAuth();
  const { eventsData, loading } = useEvents();

  // Filtrar solo los eventos programados para HOY y limitar a máximo 2
  const todayEvents = useMemo(() => {
    const now = new Date();
    const currentMonthIndex = now.getMonth();
    const currentYear = now.getFullYear();

    return [...eventsData].reverse().filter((event) => {
      if (!event.date) return false;

      // Divide "05 NOV 2026" -> ["05", "NOV", "2026"]
      const [, monthStr, yearStr] = event.date.trim().split(/\s+/);
      if (!monthStr) return false;

      const eventMonthIndex = MONTH_MAP[monthStr.toUpperCase()];

      // Si viene el año en la fecha, se valida; si no viene, asume el año actual
      const eventYear = yearStr ? parseInt(yearStr, 10) : currentYear;

      return eventMonthIndex === currentMonthIndex && eventYear === currentYear;
    });
  }, [eventsData]);

  const topShowcase = projectsData.find((p) => p.isTopShowcase) || projectsData[0];

  return (
    <>
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-16">
        <div className="lg:col-span-7 flex flex-col justify-center pr-0 lg:pr-12">
          <h1 className="font-['Space_Grotesk'] text-4xl md:text-6xl font-bold text-black mb-6 leading-tight">
            Creamos Mejores Juegos, Juntos.
          </h1>
          <p className="font-['Inter'] text-lg text-[#45464d] mb-8 max-w-xl">
            El colectivo de desarrolladores de Unity de élite en Cali, Colombia.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              className="bg-black text-white px-8 py-4 rounded font-['JetBrains_Mono'] text-xs uppercase tracking-widest hover:bg-[#8423a1] transition-colors border border-black cursor-pointer gap-4 flex items-center"
              onClick={() => {
                window.open('https://www.meetup.com/cali-unity-meetup/', '_blank');
              }}
            >
              <span className="material-symbols-outlined text-xs">group_add</span>
              Únete
            </button>
            <button
              onClick={() => setActiveTab && setActiveTab('projects')}
              className="bg-transparent text-black px-8 py-4 rounded font-['JetBrains_Mono'] text-xs uppercase tracking-widest hover:bg-[#f6f3f5] transition-colors border border-black/10 backdrop-blur-md cursor-pointer gap-4 flex items-center"
            >
              <span className="material-symbols-outlined text-xs">videogame_asset</span>
              Explorar Proyectos
            </button>
            <button
              onClick={() => setActiveTab && setActiveTab('projects')}
              className="bg-transparent text-black px-8 py-4 rounded font-['JetBrains_Mono'] text-xs uppercase tracking-widest hover:bg-[#f6f3f5] transition-colors border border-black/10 backdrop-blur-md cursor-pointer gap-4 flex items-center"
            >
              <span className="material-symbols-outlined text-xs">deployed_code</span>
              Explorar Packages
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 relative min-h-[350px] flex items-center justify-center bg-white/40 backdrop-blur-md border border-black/5 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f6f3f5] to-[#eae7e9] opacity-50"></div>
          <img
            alt="Logo CaliUUG"
            className="relative z-10 w-3/4 max-w-[280px] object-contain transition-transform duration-300 hover:scale-105"
            src="./UUGCali-Icon.png"
            draggable="false"
          />
        </div>
      </section>

      {/* Bento Grid Layout */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
        {/* Live Events Section (Spans 8 cols) */}
        <div className="lg:col-span-8 bg-white/40 backdrop-blur-md border border-black/5 rounded-xl p-4 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-8 border-b border-black/10 pb-4">
              <h2 className="font-['Space_Grotesk'] text-2xl font-semibold text-black flex items-center gap-2">
                <span className="material-symbols-outlined">event</span>
                Eventos
              </h2>
              <span className="font-['JetBrains_Mono'] text-xs text-[#45464d] border border-black/10 px-3 py-1 rounded-full uppercase">
                HOY
              </span>
            </div>

            <div className="space-y-4">
              {loading ? (
                <p className="font-['JetBrains_Mono'] text-xs text-[#45464d]">
                  Cargando eventos...
                </p>
              ) : todayEvents.length > 0 ? (
                todayEvents.map((event) => {
                  const isComplete = Boolean(event.location?.trim() && event.date?.trim());
                  const metaInfo = [
                    event.location?.trim(),
                    (event.time || event.date)?.trim()
                  ].filter(Boolean);

                  return (
                    <div
                      key={event.id}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3.5 sm:p-4 bg-white rounded-lg border border-black/10 hover:border-black/30 transition-all duration-200 gap-3 shadow-sm"
                    >
                      {/* Contenido Principal con límites de desbordamiento */}
                      <div className="min-w-0 flex-1 w-full space-y-1.5">
                        {/* Encabezado: Título con límite de líneas + Badge */}
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-['Inter'] text-base sm:text-lg text-black font-bold break-words leading-snug line-clamp-2">
                            {event.title}
                          </h3>
                          {event.featured && (
                            <span className="bg-black text-white font-['JetBrains_Mono'] text-[10px] uppercase px-2 py-0.5 rounded tracking-wider shrink-0 select-none">
                              Destacado
                            </span>
                          )}
                        </div>

                        {/* Metadatos: Hora y Ubicación */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-['JetBrains_Mono'] text-xs text-[#45464d]" title={event.time}>
                          {event.time && (
                            <span className="inline-flex items-center gap-1.5 shrink-0">
                              <span className="material-symbols-outlined text-sm text-black/60">schedule</span>
                              {event.time}
                            </span>
                          )}
                          {event.location && (
                            <span className="inline-flex items-center gap-1.5 shrink-0 truncate max-w-[200px] sm:max-w-[300px]" title={event.location}>
                              <span className="material-symbols-outlined text-sm text-black/60 shrink-0">location_on</span>
                              <span className="truncate">{event.location}</span>
                            </span>
                          )}
                          {!event.time && !event.location && (
                            <span className="text-black/40 italic">Sin detalles de ubicación/hora</span>
                          )}
                        </div>

                        {/* Descripción: Límite de 2 líneas con ellipsis */}
                        {event.description && (
                          <p className="font-['Inter'] text-xs sm:text-sm text-[#38393d] leading-relaxed break-words line-clamp-2">
                            {event.description}
                          </p>
                        )}
                      </div>

                      {/* Acción: Botón visualmente destacado para "Por Realizar" */}
                      <div className="shrink-0 w-full sm:w-auto pt-1 sm:pt-0">
                        {event.rsvpUrl ? (
                          <a
                            href={event.rsvpUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto text-center inline-block bg-black text-white font-['JetBrains_Mono'] text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-md shadow-md hover:bg-neutral-800 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 cursor-pointer"
                          >
                            {event.buttonText || (isComplete ? 'Finalizado' : 'Por Realizar')}
                          </a>
                        ) : (
                          <button
                            disabled={isComplete}
                            className={`w-full sm:w-auto inline-block font-['JetBrains_Mono'] text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-md transition-all duration-150 ${isComplete
                                ? 'bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed'
                                : 'bg-black text-white shadow-md hover:bg-neutral-800 active:scale-95 cursor-pointer'
                              }`}
                          >
                            {event.buttonText || (isComplete ? 'Finalizado' : 'Por Realizar')}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="font-['JetBrains_Mono'] text-xs text-[#45464d]">
                  No hay eventos programados para el día de hoy.
                </p>
              )}
            </div>
          </div>

          {/* Botón Ver Todo posicionado abajo */}
          <div className="flex flex-col sm:flex-row justify-end mt-6 gap-3 sm:gap-4">
            {isLoggedIn && (
              <button
                onClick={() => setActiveTab && setActiveTab('event-update')}
                className="w-full sm:w-auto justify-center bg-black text-white px-6 py-3 rounded font-['JetBrains_Mono'] text-xs uppercase tracking-widest hover:bg-[#45464d] transition-colors border border-black cursor-pointer flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">add</span> Nuevo Evento
              </button>
            )}
            <button
              onClick={() => setActiveTab && setActiveTab('events')}
              className="w-full sm:w-auto justify-center bg-black text-white px-6 py-3 rounded font-['JetBrains_Mono'] text-xs uppercase tracking-widest hover:bg-[#45464d] transition-colors border border-black cursor-pointer flex items-center gap-2"
            >
              Ver todo <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Top Showcase Section (Spans 4 cols) */}
        <div className="lg:col-span-4 bg-white/40 backdrop-blur-md border border-black/5 rounded-xl p-8 flex flex-col">
          <div className="mb-6 border-b border-black/10 pb-4">
            <h2 className="font-['Space_Grotesk'] text-2xl font-semibold text-black flex items-center gap-2">
              <span className="material-symbols-outlined">star</span>
              Proyecto Destacado
            </h2>
          </div>

          {topShowcase && (
            <div
              onClick={() => setActiveTab && setActiveTab('project')}
              className="flex-1 relative rounded overflow-hidden group min-h-60 cursor-pointer"
            >
              <div
                className="absolute inset-0 bg-cover bg-center w-full h-full group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: `url('${topShowcase.coverImage}')` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4">
                <span className="font-['JetBrains_Mono'] text-[10px] uppercase text-white border border-white/30 px-2 py-1 rounded-full mb-2 inline-block backdrop-blur-md">
                  {topShowcase.badge || 'DESTACADO'}
                </span>
                <h3 className="font-['Space_Grotesk'] text-lg text-white font-bold">
                  {topShowcase.title}
                </h3>
                <p className="font-['JetBrains_Mono'] text-xs text-white/70">
                  por {topShowcase.author}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Stats & Engine Review */}
        <div className="md:col-span-1 lg:col-span-3 bg-white/40 backdrop-blur-md border border-black/5 rounded-xl p-6 flex flex-col justify-center items-center text-center transition-all duration-300 hover:border-black/20">
          <span className="material-symbols-outlined text-4xl mb-2 text-black">groups</span>
          <div className="font-['Space_Grotesk'] text-4xl font-bold text-black">157</div>
          <div className="font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-[#45464d] mt-1">
            Miembros
          </div>
        </div>

        <div className="md:col-span-1 lg:col-span-3 bg-white/40 backdrop-blur-md border border-black/5 rounded-xl p-6 flex flex-col justify-center items-center text-center transition-all duration-300 hover:border-black/20">
          <span className="material-symbols-outlined text-4xl mb-2 text-[#34a853]">cloud_done</span>
          <div className="font-['Space_Grotesk'] text-4xl font-bold text-[#34a853]">99%</div>
          <div className="font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-[#45464d] mt-1">
            Disponibilidad del Servidor
          </div>
        </div>

        <div className="md:col-span-2 lg:col-span-6 bg-white/40 backdrop-blur-md border border-black/5 rounded-xl p-6 transition-all duration-300 hover:border-black/20 overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="font-['Space_Grotesk'] text-2xl font-semibold text-black mb-2">
              La Comunidad
            </h3>
            <p className="font-['Inter'] text-sm text-[#45464d] max-w-md">
              Descubre la vibrante red de desarrolladores y creadores con Unity en Cali.
            </p>
            <button
              className="mt-4 text-black font-['JetBrains_Mono'] text-xs uppercase tracking-widest border-b border-black pb-1 hover:text-[#8423a1] hover:border-[#8423a1] transition-colors inline-flex items-center gap-1 cursor-pointer"
              onClick={() => setActiveTab && setActiveTab('community')}
            >
              Conócenos <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-10 rotate-12 pointer-events-none">
            <span className="material-symbols-outlined text-[160px] text-black">architecture</span>
          </div>
        </div>
      </section>
    </>
  );
}