import React, { useState } from 'react';
import { useHeader } from '../context/HeaderContext';
import { useAuth } from '../context/AuthContext';
import packagesData from '../data/packages.json';

// Helper para asegurar un ID único en paquetes
const getPackageAssetId = (pkg) => {
  if (pkg.id) return pkg.id;
  const raw = pkg.name || pkg.title || 'paquete';
  return raw.toLowerCase().replace(/\s+/g, '-');
};

export default function PackageRegistryPage({ setActiveTab }) {
  const { searchQuery, togglePin, isPinned } = useHeader();
  const { isLoggedIn } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);

  // Obtener categorías únicas dinámicamente
  const categories = ['Todos', ...new Set((packagesData ?? []).map((pkg) => pkg.category).filter(Boolean))];

  // Filtrado de paquetes
  const filteredPackages = (packagesData ?? []).filter((pkg) => {
    const query = (searchQuery ?? '').trim().toLowerCase();

    const matchesSearch =
      query === '' ||
      (pkg.name && pkg.name.toLowerCase().includes(query)) ||
      (pkg.description && pkg.description.toLowerCase().includes(query)) ||
      (pkg.category && pkg.category.toLowerCase().includes(query)) ||
      (Array.isArray(pkg.tags) && pkg.tags.some((tag) => String(tag).toLowerCase().includes(query)));

    const targetCategory = selectedCategory !== 'Todos' ? selectedCategory : null;

    const matchesCategory =
      !targetCategory ||
      (pkg.category && pkg.category.toLowerCase() === targetCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const handleCopy = (textToCopy, id) => {
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Helper para construir el objeto normalized asset para el Context
  const handleTogglePinPackage = (e, pkg) => {
    e.stopPropagation();
    const assetId = getPackageAssetId(pkg);

    togglePin({
      id: assetId,
      title: pkg.name || pkg.title,
      name: pkg.name || pkg.title,
      type: pkg.type || 'Paquete UPM',
      category: pkg.category || 'Paquetes',
      version: pkg.version || 'v1.0.0',
      description: pkg.description || '',
      tags: pkg.tags || [],
    });
  };

  // ==========================================
  // VISTA DE DETALLE DEL PAQUETE
  // ==========================================
  if (selectedPackage) {
    const gitLink = selectedPackage.gitUrl || selectedPackage.installCmd;
    const pkgId = getPackageAssetId(selectedPackage);
    const pinned = isPinned(pkgId);

    return (
      <div className="mb-12">
        {/* Botón Volver */}
        <button
          onClick={() => setSelectedPackage(null)}
          className="mb-6 flex items-center gap-2 font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-[#45464d] hover:text-black transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Volver al Catálogo
        </button>

        {/* Encabezado del Paquete */}
        <section className="bg-white/40 backdrop-blur-md border border-black/5 rounded-xl p-8 mb-8 relative">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="flex items-start space-x-5">
              <div className="w-16 h-16 rounded-lg bg-black text-white flex items-center justify-center shrink-0 border border-black/10">
                <span className="material-symbols-outlined text-3xl">{selectedPackage.icon || 'extension'}</span>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-black tracking-tight">
                    {selectedPackage.name}
                  </h1>
                  {selectedPackage.isOfficial && (
                    <span className="bg-black/5 text-black text-[10px] font-['JetBrains_Mono'] uppercase tracking-wider px-2.5 py-1 rounded border border-black/10 font-bold">
                      Verificado UUG
                    </span>
                  )}

                  {/* Botón de Guardar / Marcador */}
                  <button
                    onClick={(e) => handleTogglePinPackage(e, selectedPackage)}
                    className={`p-1.5 rounded-full backdrop-blur transition-all flex items-center justify-center border ${
                      pinned
                        ? 'bg-amber-400 border-amber-500 text-black shadow-sm'
                        : 'bg-black/5 border-black/10 text-[#45464d] hover:text-black hover:bg-black/10'
                    }`}
                    title={pinned ? 'Quitar de guardados' : 'Guardar en mi librería'}
                  >
                    <span className="material-symbols-outlined text-lg leading-none">
                      {pinned ? 'star' : 'star_outline'}
                    </span>
                  </button>
                </div>
                <p className="font-['Inter'] text-base text-[#45464d] max-w-2xl">
                  {selectedPackage.description}
                </p>
              </div>
            </div>

            {/* Copiar Enlace Git */}
            <div className="w-full md:w-auto shrink-0 flex flex-col items-stretch md:items-end gap-2">
              <button
                onClick={() => handleCopy(gitLink, pkgId)}
                className="bg-black text-white px-6 py-3 rounded font-['JetBrains_Mono'] text-xs uppercase tracking-widest hover:bg-black/80 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">
                  {copiedId === pkgId ? 'check' : 'code'}
                </span>
                <span>{copiedId === pkgId ? '¡URL Copiada!' : 'Copiar Git URL'}</span>
              </button>
              {gitLink && (
                <code className="font-['JetBrains_Mono'] text-[11px] text-[#45464d] bg-black/5 px-3 py-1.5 rounded border border-black/5 truncate max-w-xs md:max-w-md">
                  {gitLink}
                </code>
              )}
            </div>
          </div>
        </section>

        {/* Detalles Principales (2 Columnas) */}
        <div className="grid grid-cols-12 gap-8">
          {/* Documentación / Readme */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="bg-white/40 backdrop-blur-md border border-black/5 rounded-xl p-8">
              <h2 className="font-['Space_Grotesk'] text-xl font-bold text-black mb-4">
                Documentación e Instalación
              </h2>
              <div className="font-['Inter'] text-sm text-[#45464d] leading-relaxed space-y-4">
                <p>
                  {selectedPackage.readme || 
                    `Este paquete incluye recursos y módulos optimizados para flujos de trabajo en Unity. Verifica que la versión de tu Editor sea compatible antes de la instalación.`
                  }
                </p>

                <h3 className="font-['Space_Grotesk'] text-base font-bold text-black pt-4">
                  Guía de instalación en Unity (UPM)
                </h3>
                <ol className="list-decimal list-inside space-y-2 font-['JetBrains_Mono'] text-xs bg-black/5 p-4 rounded border border-black/5 text-black">
                  <li>Copia la <strong>URL de Git</strong> del paquete desde la parte superior.</li>
                  <li>Abre tu proyecto en Unity Editor.</li>
                  <li>Dirígete al menú principal: <code className="bg-white/80 px-1 py-0.5 rounded font-bold">Window &gt; Package Manager</code>.</li>
                  <li>Haz clic en el icono <strong>+</strong> (esquina superior izquierda) y selecciona <strong>"Add package from git URL..."</strong>.</li>
                  <li>Pega la URL del repositorio y haz clic en <strong>Add</strong>.</li>
                </ol>
              </div>
            </div>

            {/* Etiquetas */}
            {Array.isArray(selectedPackage.tags) && selectedPackage.tags.length > 0 && (
              <div className="bg-white/40 backdrop-blur-md border border-black/5 rounded-xl p-6">
                <h3 className="font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-black font-bold mb-3">
                  Etiquetas y Clasificación
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPackage.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-white/60 text-[#45464d] border border-black/10 px-3 py-1 rounded text-xs font-['JetBrains_Mono']"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Lateral de Metadatos */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-white/40 backdrop-blur-md border border-black/5 rounded-xl p-6 space-y-4 font-['JetBrains_Mono'] text-xs">
              <h3 className="uppercase tracking-wider text-black font-bold pb-2 border-b border-black/10">
                Especificaciones del Paquete
              </h3>

              <div className="flex justify-between items-center py-1">
                <span className="text-[#45464d]">Versión</span>
                <span className="text-black font-bold">{selectedPackage.version || 'v1.0.0'}</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-[#45464d]">Categoría</span>
                <span className="text-black font-bold">{selectedPackage.category || 'General'}</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-[#45464d]">Compatibilidad Unity</span>
                <span className="text-black font-bold">{selectedPackage.unityVersion || '2021.3 LTS+'}</span>
              </div>

              {/*<div className="flex justify-between items-center py-1">
                <span className="text-[#45464d]">Instalaciones</span>
                <span className="text-black font-bold">{selectedPackage.downloads ?? 0}</span>
              </div>*/}

              <div className="flex justify-between items-center py-1">
                <span className="text-[#45464d]">Última Actualización</span>
                <span className="text-black font-bold">{selectedPackage.lastUpdated || 'Reciente'}</span>
              </div>

              {selectedPackage.author && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#45464d]">Autor</span>
                  <span className="text-black font-bold">{selectedPackage.author}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VISTA LISTA PRINCIPAL
  // ==========================================
  return (
    <>
      {/* Encabezado */}
      <section className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-['Space_Grotesk'] text-4xl md:text-5xl font-bold text-black mb-3 tracking-tight">
            Explorar Paquetes de Unity
          </h1>
          <p className="font-['Inter'] text-lg text-[#45464d] max-w-2xl">
            Explora e integra módulos, herramientas y utilidades de Unity mantenidos por la comunidad vía Git.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isLoggedIn && (
            <button
              className="bg-transparent text-black px-6 py-3 rounded font-['JetBrains_Mono'] text-xs uppercase tracking-widest hover:bg-[#f6f3f5] transition-colors border border-black/10 backdrop-blur-md flex items-center gap-2 cursor-pointer"
              onClick={() => setActiveTab && setActiveTab('package-upload')}
            >
              <span className="material-symbols-outlined text-sm">publish</span>
              <span>Publicar Paquete</span>
            </button>
          )}
        </div>
      </section>

      {/* Guía Rápida de Instalación */}
      <section className="mb-8 bg-black/5 border border-black/10 rounded-xl p-5 font-['JetBrains_Mono']">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowInstructions(!showInstructions)}>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-black">help_outline</span>
            <span className="text-xs font-bold text-black uppercase tracking-wider">
              ¿Cómo instalar un paquete desde Git en Unity?
            </span>
          </div>
          <span className="material-symbols-outlined text-black text-sm">
            {showInstructions ? 'expand_less' : 'expand_more'}
          </span>
        </div>

        {showInstructions && (
          <div className="mt-4 pt-4 border-t border-black/10 text-xs text-[#45464d] space-y-2 font-['Inter']">
            <p>1. Copia la URL de Git correspondiente al paquete deseado.</p>
            <p>2. En Unity, dirígete al menú superior <strong>Window &gt; Package Manager</strong>.</p>
            <p>3. Haz clic en el ícono <strong>+</strong> en la esquina superior izquierda y elige <strong>"Add package from git URL..."</strong>.</p>
            <p>4. Pega la URL que copiaste y presiona <strong>Add</strong>.</p>
          </div>
        )}
      </section>

      {/* Barra de Filtros y Control */}
      <section className="mb-8 bg-white/40 backdrop-blur-md border border-black/5 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {searchQuery && searchQuery.trim() !== '' ? (
            <div className="text-xs font-['JetBrains_Mono'] text-black/60 bg-black/5 px-3 py-1.5 rounded-full border border-black/10 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">search</span>
              <span>
                Filtro activo: "<strong className="text-black">{searchQuery}</strong>"
              </span>
            </div>
          ) : (
            <span className="text-xs font-['JetBrains_Mono'] text-[#45464d]">
              Mostrando <strong className="text-black">{filteredPackages.length}</strong> paquetes disponibles
            </span>
          )}
        </div>

        {/* Filtros por Categoría */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded text-xs font-['JetBrains_Mono'] uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-black text-white'
                  : 'bg-white/60 text-[#45464d] border border-black/5 hover:border-black/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Tabla / Grid de Paquetes */}
      <section className="bg-white/40 backdrop-blur-md border border-black/5 rounded-xl overflow-hidden mb-12">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-black/10 bg-white/20 font-['JetBrains_Mono'] text-xs text-[#45464d] uppercase tracking-wider">
          <div className="col-span-12 md:col-span-5">Paquete / Proyecto</div>
          <div className="col-span-3 hidden md:block">Categoría / Versión</div>
          {/*<div className="col-span-2 hidden md:block text-right">Uso</div>*/}
          <div className="col-span-2 hidden md:block text-right">Acciones</div>
        </div>

        {filteredPackages.length > 0 ? (
          <div className="divide-y divide-black/5">
            {filteredPackages.map((pkg, idx) => {
              const gitUrl = pkg.gitUrl || pkg.installCmd;
              const pkgId = getPackageAssetId(pkg);
              const pinned = isPinned(pkgId);

              return (
                <div
                  key={pkgId || idx}
                  onClick={() => setSelectedPackage(pkg)}
                  className="grid grid-cols-12 gap-4 px-6 py-5 hover:bg-white/60 transition-colors group items-center cursor-pointer"
                >
                  <div className="col-span-12 md:col-span-5 flex items-start space-x-4">
                    <div className="w-10 h-10 rounded bg-black/5 text-black flex items-center justify-center shrink-0 border border-black/5 group-hover:bg-black group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-lg">{pkg.icon || 'extension'}</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-['Space_Grotesk'] text-lg font-bold text-black group-hover:underline">
                          {pkg.name}
                        </span>
                        {pkg.isOfficial && (
                          <span className="bg-black/5 text-black text-[10px] font-['JetBrains_Mono'] uppercase tracking-wider px-2 py-0.5 rounded border border-black/10">
                            Verificado
                          </span>
                        )}
                      </div>
                      <p className="font-['Inter'] text-xs text-[#45464d] line-clamp-1">
                        {pkg.description}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-3 flex flex-row md:flex-col justify-between md:justify-center mt-2 md:mt-0 font-['JetBrains_Mono'] text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-black/40"></span>
                      <span className="text-black font-medium">{pkg.category || 'General'}</span>
                    </div>
                    <span className="text-[#45464d] mt-1">{pkg.version || 'v1.0.0'}</span>
                  </div>

                  {/*<div className="col-span-6 md:col-span-2 flex items-center md:justify-end font-['JetBrains_Mono'] text-xs text-[#45464d]">
                    <span className="material-symbols-outlined text-sm mr-1.5 opacity-70">
                      download
                    </span>
                    {pkg.downloads ?? 0}
                  </div>*/}

                  <div className="col-span-6 md:col-span-2 flex items-center justify-end space-x-2">
                    {/* Botón de Marcador */}
                    <button
                      onClick={(e) => handleTogglePinPackage(e, pkg)}
                      className={`p-1.5 rounded transition-colors flex items-center justify-center cursor-pointer ${
                        pinned
                          ? 'text-amber-500 hover:text-amber-600'
                          : 'text-black/30 hover:text-black'
                      }`}
                      title={pinned ? 'Quitar de guardados' : 'Guardar en mi librería'}
                    >
                      <span className="material-symbols-outlined text-lg leading-none">
                        {pinned ? 'star' : 'star_outline'}
                      </span>
                    </button>

                    {/* Botón Copiar URL */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(gitUrl, pkgId);
                      }}
                      className="bg-white border border-black/10 hover:border-black text-black px-3 py-1.5 rounded font-['JetBrains_Mono'] text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm"
                      title="Copiar URL de Git para Unity"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {copiedId === pkgId ? 'check' : 'code'}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider hidden sm:inline">
                        {copiedId === pkgId ? 'Copiado' : 'Git URL'}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-[#45464d] font-['JetBrains_Mono'] text-xs">
            No se encontraron paquetes que coincidan con el criterio de búsqueda.
          </div>
        )}
      </section>
    </>
  );
}