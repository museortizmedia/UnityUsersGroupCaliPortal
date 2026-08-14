import React, { useState } from 'react';
import { useHeader } from '../context/HeaderContext';
import { useAuth } from '../context/AuthContext';
import projectsDataInfo from '../data/projects.json';

// Helper para asegurar un ID único en los proyectos
const getProjectAssetId = (project) => {
  if (project.id) return project.id;
  const raw = project.title || project.name || 'project';
  return raw.toLowerCase().replace(/\s+/g, '-');
};

export default function ProjectsPage({
  setActiveTab,
  setSelectedProjectId, // Recibimos la función para actualizar el ID activo
  projectsData = projectsDataInfo,
}) {
  // Consumimos togglePin e isPinned desde el context
  const { searchQuery, activeCategory, togglePin, isPinned } = useHeader();
  const { isLoggedIn } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Función helper para redirigir a la vista de detalle con el ID correcto
  const handleSelectProject = (projectId) => {
    if (setSelectedProjectId) {
      setSelectedProjectId(projectId);
    }
    if (setActiveTab) {
      setActiveTab('project-detail');
    }
  };

  // Helper para armar y guardar/quitar el objeto en la librería
  const handleTogglePinProject = (e, project) => {
    e.stopPropagation(); // Evita navegar al detalle del proyecto al dar clic a la estrella
    const assetId = getProjectAssetId(project);

    togglePin({
      id: assetId,
      title: project.title || project.name,
      name: project.title || project.name,
      type: project.type || 'Project',
      category: project.category || 'Projects',
      version: project.version || 'v1.0.0',
      description: project.description || '',
      tags: project.tags || project.technologies || [],
    });
  };

  // Normalización y filtrado de proyectos
  const filteredProjects = (projectsData ?? []).filter((project) => {
    // Búsqueda por texto (Search Context)
    const query = (searchQuery ?? '').trim().toLowerCase();

    // Categoría activa (Context)
    const rawCategory = (activeCategory ?? '').trim().toLowerCase();
    const projectCategory = (project?.category ?? '').trim().toLowerCase();

    const isShowingAllCategories =
      rawCategory === '' ||
      rawCategory === 'projects' ||
      rawCategory === 'all' ||
      rawCategory === 'all categories';

    const matchesCategory = isShowingAllCategories || projectCategory === rawCategory;
    if (!matchesCategory) return false;

    // Filtro local por Estado
    const projectStatus = (project?.status ?? '').trim().toLowerCase();
    const statusFilter = selectedStatus.trim().toLowerCase();
    const matchesStatus = statusFilter === 'all' || projectStatus === statusFilter;
    if (!matchesStatus) return false;

    if (query === '') return true;

    const title = (project?.title ?? '').toLowerCase();
    const description = (project?.description ?? '').toLowerCase();
    const author = (project?.author ?? '').toLowerCase();
    const tags = Array.isArray(project?.tags) ? project.tags : [];
    const technologies = Array.isArray(project?.technologies) ? project.technologies : [];

    return (
      title.includes(query) ||
      description.includes(query) ||
      author.includes(query) ||
      tags.some((t) => String(t).toLowerCase().includes(query)) ||
      technologies.some((tech) => String(tech).toLowerCase().includes(query))
    );
  });

  const getStatusBadge = (status) => {
    switch ((status ?? '').toLowerCase()) {
      case 'publicado':
      case 'completed':
      case 'production':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'demo':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'prototipo':
      case 'in progress':
      case 'alpha':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'sin publicar':
      case 'concept':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'sin completar':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default:
        return 'bg-white/10 text-white/80 border-white/20';
    }
  };

  const featuredProject = filteredProjects[0];
  const secondaryProjects = filteredProjects.slice(1);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/10 pb-6">
        <div>
          <h2 className="font-['Space_Grotesk'] text-3xl md:text-5xl font-bold text-black tracking-tight">
            Explorar Proyectos en Unity
          </h2>
          <p className="font-['Inter'] text-sm md:text-base text-[#45464d] mt-2 max-w-3xl">
            Galería técnica seleccionada de títulos en desarrollo activo. Filtra por estado de despliegue.
          </p>
        </div>

        {/* Pro Filter Bar */}
        <div className="bg-white/80 backdrop-blur border border-black/10 rounded-lg p-2 flex flex-wrap gap-2 items-center shadow-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 border-r border-black/10">
            <span className="material-symbols-outlined text-[16px] text-[#45464d]">
              filter_list
            </span>
            <span className="font-[#JetBrains_Mono] text-xs uppercase text-[#45464d] font-semibold">
              Filtros
            </span>
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-transparent border-none text-xs font-[#JetBrains_Mono] text-black focus:ring-0 cursor-pointer hover:bg-black/5 rounded px-2 py-1 uppercase"
          >
            <option value="All">Estado: Todos</option>
            <option value="Publicado">Publicado</option>
            <option value="Prototipo">Prototipo</option>
            <option value="Demo">Demo</option>
            <option value="Sin publicar">Sin publicar</option>
            <option value="Sin completar">Sin completar</option>
          </select>
        </div>
      </div>

      {/* Bento Grid Gallery */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[300px] gap-4">

          {/* Featured Project */}
          {featuredProject && (() => {
            const featuredId = getProjectAssetId(featuredProject);
            const isFeaturedPinned = isPinned(featuredId);

            return (
              <div
                onClick={() => handleSelectProject(featuredProject.id || featuredId)}
                className="md:col-span-8 row-span-2 group relative overflow-hidden rounded-xl border border-black/10 bg-black min-h-[500px] cursor-pointer"
              >
                {featuredProject.coverImage ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-80"
                    style={{ backgroundImage: `url('${featuredProject.coverImage}')` }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Botón de Estrella para el Proyecto Destacado */}
                <button
                  onClick={(e) => handleTogglePinProject(e, featuredProject)}
                  className={`absolute top-4 right-4 z-20 p-2.5 rounded-full backdrop-blur transition-all flex items-center justify-center cursor-pointer border ${isFeaturedPinned
                      ? 'bg-amber-400 border-amber-500 text-black shadow-md'
                      : 'bg-black/40 border-white/20 text-white hover:bg-black/70'
                    }`}
                  title={isFeaturedPinned ? 'Quitar de la librería' : 'Guardar en la librería'}
                >
                  <span className="material-symbols-outlined text-lg leading-none">
                    {isFeaturedPinned ? 'star' : 'star_outline'}
                  </span>
                </button>

                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-col justify-end">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-white/10 backdrop-blur border border-white/20 px-3 py-1 rounded text-white font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider">
                      {featuredProject.badge || 'DESTACADO'}
                    </span>

                    <span className={`backdrop-blur px-3 py-1 rounded font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider border font-medium ${getStatusBadge(featuredProject.status)}`}>
                      {featuredProject.status ?? 'SIN ESTADO'}
                    </span>
                  </div>

                  <h3 className="font-['Space_Grotesk'] font-bold text-white text-3xl md:text-5xl mb-2">
                    {featuredProject.title}
                  </h3>

                  {featuredProject.description && (
                    <p className="text-white/80 font-['Inter'] text-sm md:text-base max-w-xl mb-6 line-clamp-2">
                      {featuredProject.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-white/70 font-['JetBrains_Mono'] text-xs">
                    {featuredProject.author && (
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">group</span>
                        {featuredProject.author}
                      </div>
                    )}
                    {featuredProject.version && (
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">memory</span>
                        {featuredProject.version}
                      </div>
                    )}
                    {featuredProject.category && (
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">category</span>
                        {featuredProject.category}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Secondary Projects Grid */}
          {secondaryProjects.map((project) => {
            const projId = getProjectAssetId(project);
            const isProjPinned = isPinned(projId);

            return (
              <div
                key={projId}
                onClick={() => handleSelectProject(project.id || projId)}
                className="md:col-span-4 row-span-1 group relative overflow-hidden rounded-xl border border-black/10 bg-black cursor-pointer"
              >
                {project.coverImage ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-70"
                    style={{ backgroundImage: `url('${project.coverImage}')` }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Botón de Estrella para Proyectos Secundarios */}
                <button
                  onClick={(e) => handleTogglePinProject(e, project)}
                  className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur transition-all flex items-center justify-center cursor-pointer border ${isProjPinned
                      ? 'bg-amber-400 border-amber-500 text-black shadow-md'
                      : 'bg-black/40 border-white/20 text-white hover:bg-black/70'
                    }`}
                  title={isProjPinned ? 'Quitar de la librería' : 'Guardar en la librería'}
                >
                  <span className="material-symbols-outlined text-base leading-none">
                    {isProjPinned ? 'star' : 'star_outline'}
                  </span>
                </button>

                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-['Space_Grotesk'] font-bold text-white text-xl truncate pr-2">
                      {project.title}
                    </h3>

                    <span className={`px-2 py-0.5 rounded font-['JetBrains_Mono'] text-[9px] uppercase tracking-wider border font-medium ${getStatusBadge(project.status)}`}>
                      {project.status ?? 'SIN ESTADO'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-white/70 font-['JetBrains_Mono'] text-[11px] mb-3">
                    <span>{project.author ?? 'CaliUUG'}</span>
                    {project.version && (
                      <>
                        <span>•</span>
                        <span>{project.version}</span>
                      </>
                    )}
                  </div>

                  {Array.isArray(project.technologies) && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="bg-white/10 backdrop-blur border border-white/20 px-2 py-0.5 rounded text-white font-['JetBrains_Mono'] text-[10px]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Tarjeta de Acción "Publicar Proyecto" */}
          {isLoggedIn && (
            <div
              className="md:col-span-4 row-span-1 rounded-xl border border-dashed border-black/20 bg-white/50 flex items-center justify-center cursor-pointer hover:bg-white transition-colors p-6 group"
              onClick={() => setActiveTab && setActiveTab('update-project')}
            >
              <div className="text-center">
                <span className="material-symbols-outlined text-4xl text-[#45464d] mb-2 group-hover:text-black transition-colors">
                  add_circle
                </span>
                <h4 className="font-['Space_Grotesk'] font-bold text-black text-lg">
                  Publicar Proyecto
                </h4>
                <p className="font-['JetBrains_Mono'] text-xs text-[#45464d] mt-1">
                  Únete a la galería
                </p>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* Estado Vacío */
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-dashed border-black/20 rounded-xl">
          <span className="material-symbols-outlined text-4xl text-black/30 mb-2">
            folder_off
          </span>
          <h3 className="font-['Space_Grotesk'] font-bold text-lg text-black">
            No se encontraron proyectos
          </h3>
          <p className="text-xs font-['JetBrains_Mono'] text-[#45464d] mt-1 max-w-sm">
            Ningún elemento coincide con tus criterios de búsqueda actuales
            {searchQuery ? ` ("${searchQuery}")` : ''}.
          </p>
        </div>
      )}
    </div>
  );
}