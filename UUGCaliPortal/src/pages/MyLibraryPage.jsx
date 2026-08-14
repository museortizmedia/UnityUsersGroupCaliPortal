import React, { useState } from 'react';
import { useHeader } from '../context/HeaderContext';

export default function MyLibraryPage({ setActiveTab, setSelectedProjectId, setSelectedPackage }) {
  // Extraemos las propiedades necesarias desde HeaderContext
  const { searchQuery, pinnedAssets = [], togglePin } = useHeader();
  
  // Estado para el filtro interno de la página: 'All' | 'Projects' | 'Packages'
  const [libraryTypeFilter, setLibraryTypeFilter] = useState('All');

  // Helper para determinar de forma segura si un asset es un Proyecto o un Paquete
  const checkIsProject = (asset) => {
    const rawType = String(asset?.type || '').toLowerCase();
    const rawCategory = String(asset?.category || '').toLowerCase();
    
    return (
      rawType === 'project' ||
      rawCategory === 'projects' ||
      Boolean(asset?.coverImage) || // Los proyectos traen coverImage
      Boolean(asset?.status)        // Los proyectos traen status
    );
  };

  // Navegación interactiva al hacer clic en la tarjeta
  const handleCardClick = (asset) => {
    const isProject = checkIsProject(asset);

    if (isProject) {
      if (typeof setSelectedProjectId === 'function') {
        setSelectedProjectId(asset.id);
      }
      if (typeof setActiveTab === 'function') {
        setActiveTab('project-detail');
      }
    } else {
      if (typeof setSelectedPackage === 'function') {
        setSelectedPackage(asset);
      }
      if (typeof setActiveTab === 'function') {
        setActiveTab('package-registry');
      }
    }
  };

  // Filtrado de elementos guardados
  const filteredAssets = pinnedAssets.filter((asset) => {
    if (!asset) return false;

    // 1. Coincidencia por Búsqueda (Buscador Global)
    const query = (searchQuery ?? '').trim().toLowerCase();
    const title = String(asset.title || asset.name || '').toLowerCase();
    const description = String(asset.description || '').toLowerCase();
    const tags = Array.isArray(asset.tags) ? asset.tags : [];
    
    const matchesSearch =
      query === '' ||
      title.includes(query) ||
      description.includes(query) ||
      tags.some((tag) => String(tag).toLowerCase().includes(query));

    // 2. Coincidencia por Filtro de Tipo Local (Todos / Proyectos / Paquetes)
    const isProject = checkIsProject(asset);
    const matchesTypeFilter =
      libraryTypeFilter === 'All' ||
      (libraryTypeFilter === 'Projects' && isProject) ||
      (libraryTypeFilter === 'Packages' && !isProject);

    return matchesSearch && matchesTypeFilter;
  });

  return (
    <div className="space-y-6 mb-12">
      {/* Header Local de la Página */}
      <div className="border-b border-black/10 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold text-black tracking-tight">
              Library
            </h1>
            <span className="bg-black/10 text-black font-['JetBrains_Mono'] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {pinnedAssets.length}
            </span>
          </div>
          <p className="text-xs font-['JetBrains_Mono'] text-[#45464d] mt-1">
            Proyectos y paquetes marcados con estrella en tu sesión actual.
          </p>
        </div>

        {/* Control Bar: Filtros de Tipo */}
        <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md p-1 border border-black/10 rounded-lg shadow-sm">
          {['All', 'Projects', 'Packages'].map((filter) => (
            <button
              key={filter}
              onClick={() => setLibraryTypeFilter(filter)}
              className={`px-3 py-1 rounded text-xs font-['JetBrains_Mono'] uppercase tracking-wider transition-all cursor-pointer ${
                libraryTypeFilter === filter
                  ? 'bg-black text-white shadow-sm'
                  : 'text-[#45464d] hover:text-black hover:bg-black/5'
              }`}
            >
              {filter === 'All' ? 'Todos' : filter === 'Projects' ? 'Proyectos' : 'Paquetes'}
            </button>
          ))}
        </div>
      </div>

      {/* Indicador de Filtro Activo por Búsqueda */}
      {searchQuery && (
        <div className="text-xs font-['JetBrains_Mono'] text-black/60 bg-black/5 px-3 py-1.5 rounded-full border border-black/10 inline-flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">search</span>
          <span>
            Filtrando por: "<strong className="text-black">{searchQuery}</strong>"
          </span>
        </div>
      )}

      {/* Grid de Elementos Guardados */}
      {filteredAssets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map((asset) => {
            const isProject = checkIsProject(asset);
            const itemTitle = asset.title || asset.name || 'Sin Título';

            return (
              <div
                key={asset.id || asset.name}
                onClick={() => handleCardClick(asset)}
                className="bg-white/40 backdrop-blur-md border border-black/10 hover:border-black/30 rounded-xl p-5 transition-all shadow-sm flex flex-col justify-between group relative cursor-pointer"
              >
                <div>
                  {/* Encabezado de Tarjeta */}
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <span
                      className={`text-[10px] font-['JetBrains_Mono'] uppercase tracking-wider px-2 py-0.5 border rounded font-bold ${
                        isProject
                          ? 'bg-purple-500/10 text-purple-700 border-purple-500/20'
                          : 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
                      }`}
                    >
                      {isProject ? 'Project' : asset.type || 'Package'}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-['JetBrains_Mono'] text-[#45464d]">
                        {asset.version || 'v1.0.0'}
                      </span>

                      {/* Botón Desmarcar Estrella */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePin(asset);
                        }}
                        className="text-amber-500 hover:text-amber-600 transition-colors cursor-pointer p-1 rounded hover:bg-black/5"
                        title="Quitar de favoritos"
                      >
                        <span className="material-symbols-outlined text-lg leading-none">star</span>
                      </button>
                    </div>
                  </div>

                  {/* Título */}
                  <h3 className="font-['Space_Grotesk'] font-bold text-lg text-black mb-2 leading-snug group-hover:underline">
                    {itemTitle}
                  </h3>

                  {/* Descripción */}
                  {asset.description && (
                    <p className="font-['Inter'] text-xs text-[#45464d] line-clamp-2 mb-2">
                      {asset.description}
                    </p>
                  )}
                </div>

                {/* Footer / Etiquetas */}
                <div className="mt-4 pt-3 border-t border-black/5 flex flex-wrap gap-1.5 items-center">
                  {Array.isArray(asset.tags) && asset.tags.length > 0 ? (
                    asset.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-['JetBrains_Mono'] text-[#45464d] bg-white/60 px-1.5 py-0.5 rounded border border-black/5"
                      >
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] font-['JetBrains_Mono'] text-[#45464d]">
                      #{asset.category?.toLowerCase() || 'general'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Estado Vacío */
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white/40 backdrop-blur-md border border-dashed border-black/20 rounded-xl">
          <span className="material-symbols-outlined text-4xl text-black/30 mb-2">
            star_outline
          </span>
          <h3 className="font-['Space_Grotesk'] font-bold text-lg text-black">
            No tienes elementos guardados
          </h3>
          <p className="text-xs font-['JetBrains_Mono'] text-[#45464d] mt-1 max-w-sm">
            {searchQuery
              ? `No se encontraron marcadores que coincidan con "${searchQuery}".`
              : 'Presiona la estrella en cualquier proyecto o paquete para fijarlo en tu librería.'}
          </p>
        </div>
      )}
    </div>
  );
}