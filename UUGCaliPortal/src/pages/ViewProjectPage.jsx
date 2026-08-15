import React from 'react';
import projectsDataInfo from '../data/projects.json';

export default function ViewProjectPage({
  projectId,
  setActiveTab,
  projectsData = projectsDataInfo,
}) {
  // Encuentra el proyecto seleccionado por el prop 'projectId', o toma el primero por defecto
  const project =
    projectsData.find((p) => p.id === projectId) || projectsData[0] || {};

  // Color de badge según el estado
  const getStatusBadge = (status) => {
    switch ((status ?? '').toLowerCase()) {
      case 'publicado':
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'demo':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'prototipo':
      case 'in progress':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'sin publicar':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default:
        return 'bg-white/10 text-white/80 border-white/20';
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* NAVEGACIÓN Y REGRESO */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab && setActiveTab('projects')}
          className="inline-flex items-center gap-2 font-['JetBrains_Mono'] text-xs text-[#45464d] hover:text-black uppercase transition-colors cursor-pointer bg-transparent border-none p-0"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Volver a Proyectos
        </button>

        <span className="font-['JetBrains_Mono'] text-xs text-black/40">
          ID: {project.id ?? 'N/A'}
        </span>
      </div>

      {/* BANNER PRINCIPAL DE HEADER */}
      <div className="bg-white/40 backdrop-blur-md border border-black/10 rounded-xl overflow-hidden shadow-sm">
        <div
          className="h-72 md:h-[420px] w-full bg-cover bg-center relative"
          style={{
            backgroundImage: `url('${project.coverImage ||
              'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800'
              }')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap gap-2 items-center">
                {project.category && (
                  <span className="font-['JetBrains_Mono'] text-xs uppercase bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 text-white">
                    {project.category}
                  </span>
                )}
                {project.badge && (
                  <span className="font-['JetBrains_Mono'] text-xs uppercase bg-amber-500/30 backdrop-blur-md px-3 py-1 rounded-full border border-amber-400/40 text-amber-200 font-semibold">
                    {project.badge}
                  </span>
                )}
                <span
                  className={`font-['JetBrains_Mono'] text-xs uppercase backdrop-blur-md px-3 py-1 rounded-full border font-medium ${getStatusBadge(
                    project.status
                  )}`}
                >
                  {project.status ?? 'Sin Estado'}
                </span>
              </div>

              <h1 className="font-['Space_Grotesk'] text-3xl md:text-5xl font-bold leading-tight">
                {project.title ?? 'Proyecto sin título'}
              </h1>
            </div>

            {/* BOTONES PRINCIPALES DE ACCIÓN */}
            <div className="flex flex-wrap gap-3 w-full md:w-auto">

              {project.downloadUrl && (
                <a
                  href={project.downloadUrl}
                  target="_blank"
                  download
                  className="flex-1 md:flex-none text-center bg-emerald-500 text-black px-6 py-3 rounded text-xs font-['JetBrains_Mono'] uppercase tracking-widest hover:bg-emerald-400 transition-colors cursor-pointer font-bold flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Descargar
                </a>
              )}
            </div>
          </div>
        </div>

        {/* CONTENIDO Y DETALLES DEL PROYECTO */}
        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* COLUMNA IZQUIERDA: Visión General, Specs & Tags */}
          <div className="lg:col-span-8 space-y-8">
            <div>
              <h2 className="font-['Space_Grotesk'] text-xl font-bold mb-3 text-black">
                Resumen del Proyecto
              </h2>
              <p className="font-['Inter'] text-[#45464d] leading-relaxed whitespace-pre-line text-sm md:text-base">
                {project.description || 'No hay una descripción detallada para este proyecto todavía.'}
              </p>
            </div>

            {Array.isArray(project.technologies) && project.technologies.length > 0 && (
              <div>
                <h3 className="font-['Space_Grotesk'] text-lg font-bold mb-3 text-black">
                  Arquitectura y Tecnologías
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="bg-black/5 border border-black/10 px-3 py-1.5 rounded font-['JetBrains_Mono'] text-xs text-black"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {Array.isArray(project.tags) && project.tags.length > 0 && (
              <div>
                <h3 className="font-['Space_Grotesk'] text-sm font-bold mb-2 text-black/70 uppercase font-['JetBrains_Mono']">
                  Etiquetas y Clasificación
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[#45464d] font-['JetBrains_Mono'] text-xs before:content-['#']"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA: Caja de Descargas Directas & Ficha Técnica */}
          <div className="lg:col-span-4 space-y-6">
            {/* CARD DE DESCARGAS Y REPOSITORIO */}
            <div className="bg-black text-white p-6 rounded-xl space-y-4 shadow-md">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <span className="material-symbols-outlined text-emerald-400">
                  sports_esports
                </span>
                <h3 className="font-['Space_Grotesk'] font-bold text-base">
                  Versiones y Descargas
                </h3>
              </div>

              <p className="font-['Inter'] text-xs text-white/70">
                Obtén el ejecutable optimizado o explora el código fuente del proyecto.
              </p>

              <div className="space-y-2 pt-2">
                {project.downloadUrl ? (
                  <a
                    href={project.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-['JetBrains_Mono'] font-bold text-xs uppercase py-2.5 px-4 rounded flex items-center justify-between transition-colors"
                  >
                    <span>Descargar Compilación</span>
                    <span className="material-symbols-outlined text-[18px]">download</span>
                  </a>
                ) : (
                  <div className="text-xs font-['JetBrains_Mono'] text-white/40 bg-white/5 p-3 rounded text-center border border-white/10">
                    Sin ejecutable adjunto
                  </div>
                )}

                {project.repositoryUrl && (
                  <a
                    href={project.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-white/10 hover:bg-white/20 text-white font-['JetBrains_Mono'] text-xs uppercase py-2.5 px-4 rounded flex items-center justify-between transition-colors border border-white/10"
                  >
                    <span>Código Fuente</span>
                    <span className="material-symbols-outlined text-[18px]">code</span>
                  </a>
                )}
              </div>
            </div>

            {/* TABLA DE DETALLES */}
            <div className="bg-white p-6 rounded-xl border border-black/10 space-y-4 shadow-sm">
              <h3 className="font-['Space_Grotesk'] text-lg font-bold border-b border-black/10 pb-2 text-black">
                Ficha Técnica
              </h3>
              <div className="font-['JetBrains_Mono'] text-xs space-y-3 text-[#45464d]">
                <div className="flex justify-between items-center">
                  <span>Autor:</span>
                  <strong className="text-black font-semibold">{project.author ?? 'Anónimo'}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span>Versión:</span>
                  <strong className="text-black font-semibold">{project.version ?? '-'}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span>Estado:</span>
                  <strong className="text-black font-semibold uppercase">{project.status ?? '-'}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span>Licencia:</span>
                  <strong className="text-black font-semibold">{project.license ?? '-'}</strong>
                </div>
              </div>
            </div>
          </div>
          {JSON.stringify(project, null, 2) && (
            <pre className="lg:col-span-12 bg-black/5 p-4 rounded text-xs font-['JetBrains_Mono'] overflow-x-auto">
              {JSON.stringify(project, null, 2)}
            </pre>
          )}

        </div>
      </div>
    </div>
  );
}