import React from 'react';
import projectsData from '../data/projects.json';
import { useEvents } from '../hooks/useEvents';

// Mapeo de meses en español (tal como están en tu JSON)
const MONTHS_ES = [
  'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
  'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'
];

// Función helper para formatear la fecha de hoy al formato "DD MMM" (ej: "15 NOV")
const getTodayFormatted = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = MONTHS_ES[today.getMonth()];
  return `${day} ${month}`;
};

export default function MainPage({ setActiveTab }) {
  const { eventsData, loading } = useEvents();

  // 1. Obtener la fecha de hoy
  const todayStr = getTodayFormatted();

  // 2. Filtrar solo los eventos programados para HOY y limitar a máximo 2
  const todayEvents = (eventsData || [])
    .filter((event) => event.date.toUpperCase() === todayStr)
    .slice(0, 2);

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
        <div className="lg:col-span-8 bg-white/40 backdrop-blur-md border border-black/5 rounded-xl p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-8 border-b border-black/10 pb-4">
              <h2 className="font-['Space_Grotesk'] text-2xl font-semibold text-black flex items-center gap-2">
                <span className="material-symbols-outlined">event</span>
                Eventos en Vivo
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
                todayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white rounded border border-black/5 hover:border-black/20 transition-colors"
                  >
                    <div>
                      <h3 className="font-['Inter'] text-lg text-black font-bold">
                        {event.title}
                      </h3>
                      <p className="font-['JetBrains_Mono'] text-xs text-[#45464d] mt-1">
                        {event.location} \ {event.time || event.date}
                      </p>
                    </div>
                    <a
                      href={event.rsvpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 sm:mt-0 inline-block text-black font-['JetBrains_Mono'] text-xs uppercase tracking-widest border border-black px-4 py-2 rounded hover:bg-black hover:text-white transition-colors cursor-pointer"
                    >
                      {event.buttonText || 'Confirmar Asistencia'}
                    </a>
                  </div>
                ))
              ) : (
                <p className="font-['JetBrains_Mono'] text-xs text-[#45464d]">
                  No hay eventos programados para el día de hoy.
                </p>
              )}
            </div>
          </div>

          {/* Botón Ver Todo posicionado abajo a la derecha */}
          <div className="flex justify-end mt-4">
            <button
                onClick={() => setActiveTab && setActiveTab('community')}
                className="bg-black text-white px-6 py-3 rounded font-['JetBrains_Mono']  text-xs uppercase tracking-widest hover:bg-[#45464d] transition-colors border border-black  cursor-pointer flex items-center gap-2"
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
              onClick={() => setActiveTab && setActiveTab('project-detail')}
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