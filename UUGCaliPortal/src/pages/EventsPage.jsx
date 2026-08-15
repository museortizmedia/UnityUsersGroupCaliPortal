import React, { useState, useMemo, useEffect } from 'react';
import { useEvents } from '../hooks/useEvents';
import { useHeader } from '../context/HeaderContext';
import { useAuth } from '../context/AuthContext';

const EVENTS_PER_PAGE = 6;

// Helper para parsear la fecha "DD MMM" (ej: "15 AGO") a un objeto Date
const parseEventDate = (dateStr) => {
  if (!dateStr) return null;
  const MONTHS_ES = {
    ENE: 0, FEB: 1, MAR: 2, ABR: 3, MAY: 4, JUN: 5,
    JUL: 6, AGO: 7, SEP: 8, OCT: 9, NOV: 10, DIC: 11
  };
  const parts = dateStr.trim().split(' ');
  if (parts.length < 2) return null;

  const day = parseInt(parts[0], 10);
  const monthKey = parts[1].toUpperCase();
  const month = MONTHS_ES[monthKey];

  if (isNaN(day) || month === undefined) return null;

  const now = new Date();
  return new Date(now.getFullYear(), month, day);
};

export default function EventsPage({ setActiveTab, onSelectEvent }) {
  const { isLoggedIn } = useAuth();
  const { eventsData = [], loading } = useEvents();
  const { searchQuery, activeCategory } = useHeader();

  const [selectedFilter, setSelectedFilter] = useState('ALL'); // 'ALL' | 'TODAY' | 'THIS_MONTH' | 'FEATURED'
  const [page, setPage] = useState(0);

  // Reiniciar la paginación al cambiar la búsqueda o el filtro
  useEffect(() => {
    setPage(0);
  }, [searchQuery, activeCategory, selectedFilter]);

  // Filtrado de eventos por categoría, búsqueda y tiempo
  const filteredEvents = useMemo(() => {
    const list = [...eventsData].reverse();
    const query = (searchQuery ?? '').trim().toLowerCase();
    const rawCategory = (activeCategory ?? '').trim().toLowerCase();

    const now = new Date();
    const todayDay = now.getDate();
    const todayMonth = now.getMonth();

    return list.filter((event) => {
      const eventDate = parseEventDate(event.date);

      // 1. Filtros Temporales y de Destacados
      if (selectedFilter === 'FEATURED' && !Boolean(event.featured)) {
        return false;
      }

      if (selectedFilter === 'TODAY') {
        if (!eventDate) return false;
        if (eventDate.getDate() !== todayDay || eventDate.getMonth() !== todayMonth) {
          return false;
        }
      }

      if (selectedFilter === 'THIS_MONTH') {
        if (!eventDate) return false;
        if (eventDate.getMonth() !== todayMonth) {
          return false;
        }
      }

      // 2. Comprobar si la categoría del Header aplica
      const isGlobalCategory =
        rawCategory === '' ||
        rawCategory === 'all' ||
        rawCategory === 'all categories' ||
        rawCategory === 'events' ||
        rawCategory === 'eventos';

      if (!isGlobalCategory && event?.category) {
        const eventCategory = String(event.category).trim().toLowerCase();
        if (eventCategory !== rawCategory) return false;
      }

      // 3. Búsqueda libre por término
      if (query === '') return true;

      const title = (event?.title ?? '').toLowerCase();
      const location = (event?.location ?? '').toLowerCase();
      const description = (event?.description ?? '').toLowerCase();
      const tags = Array.isArray(event?.tags) ? event.tags : [];

      return (
        title.includes(query) ||
        location.includes(query) ||
        description.includes(query) ||
        tags.some((t) => String(t).toLowerCase().includes(query))
      );
    });
  }, [eventsData, searchQuery, activeCategory, selectedFilter]);

  // Paginación
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / EVENTS_PER_PAGE));
  const startIndex = page * EVENTS_PER_PAGE;
  const currentEvents = filteredEvents.slice(startIndex, startIndex + EVENTS_PER_PAGE);

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setPage(0);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <section className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-['Space_Grotesk'] text-3xl md:text-5xl font-semibold text-black mb-2">
            Todos los Eventos
          </h1>
          <p className="font-['Inter'] text-base text-[#45464d] max-w-2xl">
            Explora la agenda completa de meetups, talleres y showrooms de la comunidad.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isLoggedIn && (
            <button
              className="bg-transparent text-black px-6 py-3 rounded font-['JetBrains_Mono'] text-xs uppercase tracking-widest hover:bg-[#f6f3f5] transition-colors border border-black/10 backdrop-blur-md flex items-center gap-2 cursor-pointer"
              onClick={() => setActiveTab && setActiveTab('event-update')}
            >
              <span className="material-symbols-outlined text-sm">edit_calendar</span>
              <span>Publicar Evento</span>
            </button>
          )}
        </div>
      </section>

      {/* Barra de Filtros Locales */}
      <div className="bg-white/80 backdrop-blur-xl border border-black/10 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-2 text-[#45464d] font-['JetBrains_Mono'] text-xs">
          <span className="material-symbols-outlined text-sm">filter_list</span>
          <span>
            {searchQuery
              ? `Resultados para "${searchQuery}"`
              : `Mostrando eventos (${filteredEvents.length})`}
          </span>
        </div>

        {/* Botones de filtro: TODOS, HOY, ESTE MES, DESTACADOS */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => handleFilterChange('ALL')}
            className={`px-3 py-1.5 rounded font-['JetBrains_Mono'] text-xs uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
              selectedFilter === 'ALL'
                ? 'bg-black text-white'
                : 'bg-transparent text-[#45464d] hover:bg-[#f6f3f5]'
            }`}
          >
            Todos ({filteredEvents.length === eventsData.length ? eventsData.length : `${filteredEvents.length}/${eventsData.length}`})
          </button>

          <button
            onClick={() => handleFilterChange('TODAY')}
            className={`px-3 py-1.5 rounded font-['JetBrains_Mono'] text-xs uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              selectedFilter === 'TODAY'
                ? 'bg-black text-white'
                : 'bg-transparent text-[#45464d] hover:bg-[#f6f3f5]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">today</span>
            Hoy
          </button>

          <button
            onClick={() => handleFilterChange('THIS_MONTH')}
            className={`px-3 py-1.5 rounded font-['JetBrains_Mono'] text-xs uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              selectedFilter === 'THIS_MONTH'
                ? 'bg-black text-white'
                : 'bg-transparent text-[#45464d] hover:bg-[#f6f3f5]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">calendar_month</span>
            Este Mes
          </button>

          <button
            onClick={() => handleFilterChange('FEATURED')}
            className={`px-3 py-1.5 rounded font-['JetBrains_Mono'] text-xs uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              selectedFilter === 'FEATURED'
                ? 'bg-black text-white'
                : 'bg-transparent text-[#45464d] hover:bg-[#f6f3f5]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">star</span>
            Destacados
          </button>
        </div>
      </div>

      {/* Lista de Eventos */}
      {loading ? (
        <div className="p-12 text-center">
          <p className="font-['JetBrains_Mono'] text-sm text-[#45464d]">
            Cargando catálogo de eventos...
          </p>
        </div>
      ) : currentEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentEvents.map((event) => {
            const isComplete = Boolean(event.location?.trim() && event.date?.trim());
            const metaInfo = [
              event.location?.trim(),
              (event.time || event.date)?.trim()
            ].filter(Boolean);

            const fallbackText = isComplete ? 'Finalizado' : 'Por Realizar';

            return (
              <div
                key={event.id || event.title}
                className={`flex flex-col justify-between p-5 bg-white/80 backdrop-blur-xl rounded-xl border border-black/10 hover:border-black/30 transition-all ${
                  event.featured ? 'border-l-4 border-l-black' : ''
                }`}
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="font-['JetBrains_Mono'] text-xs text-[#45464d] font-semibold uppercase tracking-wider bg-[#f6f3f5] px-2 py-0.5 rounded">
                      {event.date || 'PRÓXIMAMENTE'}
                    </span>
                    {event.featured && (
                      <span className="bg-black text-white font-['JetBrains_Mono'] text-[10px] uppercase px-2 py-0.5 rounded tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">star</span>
                        Destacado
                      </span>
                    )}
                  </div>

                  <h3 className="font-['Inter'] text-lg font-bold text-black mb-2 truncate">
                    {event.title}
                  </h3>

                  <p className="font-['JetBrains_Mono'] text-xs text-[#45464d] flex items-center gap-1 mb-4 truncate">
                    <span className="material-symbols-outlined text-sm shrink-0">schedule</span>
                    <span className="truncate">
                      {metaInfo.length > 0 ? metaInfo.join(' \\ ') : 'Sin detalles de ubicación/hora'}
                    </span>
                  </p>
                </div>

                {/* Botón de Acción Homologado */}
                <div className="pt-3 border-t border-black/5 flex justify-end">
                  {event.rsvpUrl ? (
                    <a
                      href={event.rsvpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-black font-['JetBrains_Mono'] text-xs uppercase tracking-widest border border-black px-4 py-2 rounded hover:bg-black hover:text-white transition-colors cursor-pointer"
                    >
                      {event.buttonText || fallbackText}
                    </a>
                  ) : (
                    <button
                      disabled
                      className="inline-block text-black/40 font-['JetBrains_Mono'] text-xs uppercase tracking-widest border border-black/20 px-4 py-2 rounded cursor-not-allowed opacity-50"
                    >
                      {event.buttonText || fallbackText}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white/50 border border-black/10 rounded-xl p-12 text-center">
          <p className="font-['JetBrains_Mono'] text-sm text-[#45464d]">
            No se encontraron eventos con los criterios seleccionados.
          </p>
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-4 border-t border-black/10">
          <span className="font-['JetBrains_Mono'] text-xs text-[#45464d]">
            Página {page + 1} de {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 rounded border border-[#c6c6cd] font-['JetBrains_Mono'] text-xs text-black hover:border-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 rounded border border-[#c6c6cd] font-['JetBrains_Mono'] text-xs text-black hover:border-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}