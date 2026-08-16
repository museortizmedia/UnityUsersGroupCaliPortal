import React, { useState } from 'react';
import { useHeader } from '../context/HeaderContext';

// Helper reutilizable para asegurar un ID único
export const getPackageAssetId = (pkg) => {
  if (pkg.id) return pkg.id;
  const raw = pkg.name || pkg.title || 'paquete';
  return raw.toLowerCase().replace(/\s+/g, '-');
};

export default function PackageDetailPage({ packageData, onBack }) {
  const { togglePin, isPinned } = useHeader();
  const [copiedId, setCopiedId] = useState(null);

  if (!packageData) return null;

  const gitLink = packageData.gitUrl || packageData.installCmd;
  const pkgId = getPackageAssetId(packageData);
  const pinned = isPinned(pkgId);

  const handleCopy = (textToCopy, id) => {
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleTogglePin = (e) => {
    e.stopPropagation();
    togglePin({
      id: pkgId,
      title: packageData.name || packageData.title,
      name: packageData.name || packageData.title,
      type: packageData.type || 'Paquete UPM',
      category: packageData.category || 'Paquetes',
      version: packageData.version || 'v1.0.0',
      description: packageData.description || '',
      tags: packageData.tags || [],
    });
  };

  return (
    <div className="mb-12">
      {/* Botón Volver */}
      <button
        onClick={onBack}
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
              <span className="material-symbols-outlined text-3xl">
                {packageData.icon || 'extension'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-black tracking-tight">
                  {packageData.name}
                </h1>
                {packageData.isOfficial && (
                  <span className="bg-black/5 text-black text-[10px] font-['JetBrains_Mono'] uppercase tracking-wider px-2.5 py-1 rounded border border-black/10 font-bold">
                    Verificado UUG
                  </span>
                )}

                {/* Botón Guardar / Marcador */}
                <button
                  onClick={handleTogglePin}
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
                {packageData.description}
              </p>
            </div>
          </div>

          {/* Copiar Enlace Git - Ajustado para ocupar el mismo ancho en móviles */}
          <div className="w-full md:w-auto shrink-0 flex flex-col items-stretch md:items-end gap-2">
            <button
              onClick={() => handleCopy(gitLink, pkgId)}
              className="w-full bg-black text-white px-6 py-3 rounded font-['JetBrains_Mono'] text-xs uppercase tracking-widest hover:bg-black/80 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">
                {copiedId === pkgId ? 'check' : 'code'}
              </span>
              <span>{copiedId === pkgId ? '¡URL Copiada!' : 'Copiar Git URL'}</span>
            </button>
            {gitLink && (
              <code className="w-full md:w-auto font-['JetBrains_Mono'] text-[11px] text-[#45464d] bg-black/5 px-3 py-1.5 rounded border border-black/5 truncate text-center md:text-left md:max-w-md">
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
              <div className="font-['Inter'] text-sm text-[#45464d] leading-relaxed whitespace-pre-line">
                {packageData.readme ||
                  'Este paquete incluye recursos y módulos optimizados para flujos de trabajo en Unity.\nVerifica que la versión de tu Editor sea compatible antes de la instalación.'}
              </div>

              <h3 className="font-['Space_Grotesk'] text-base font-bold text-black pt-4">
                Guía de instalación en Unity (UPM)
              </h3>
              <ol className="list-decimal list-inside space-y-2 font-['JetBrains_Mono'] text-xs bg-black/5 p-4 rounded border border-black/5 text-black">
                <li>Copia la <strong>URL de Git</strong> del paquete desde la parte superior.</li>
                <li>Abre tu proyecto en Unity Editor.</li>
                <li>
                  Dirígete al menú principal:{' '}
                  <code className="bg-white/80 px-1 py-0.5 rounded font-bold">
                    Window &gt; Package Manager
                  </code>.
                </li>
                <li>
                  Haz clic en el icono <strong>+</strong> (esquina superior izquierda) y selecciona{' '}
                  <strong>"Add package from git URL..."</strong>.
                </li>
                <li>Pega la URL del repositorio y haz clic en <strong>Add</strong>.</li>
              </ol>
            </div>
          </div>

          {/* Etiquetas */}
          {Array.isArray(packageData.tags) && packageData.tags.length > 0 && (
            <div className="bg-white/40 backdrop-blur-md border border-black/5 rounded-xl p-6">
              <h3 className="font-[#JetBrains_Mono'] text-xs uppercase tracking-wider text-black font-bold mb-3">
                Etiquetas y Clasificación
              </h3>
              <div className="flex flex-wrap gap-2">
                {packageData.tags.map((tag) => (
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
              <span className="text-black font-bold">{packageData.version || 'v1.0.0'}</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-[#45464d]">Categoría</span>
              <span className="text-black font-bold">{packageData.category || 'General'}</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-[#45464d]">Compatibilidad Unity</span>
              <span className="text-black font-bold">
                {packageData.unityVersion || '2021.3 LTS+'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-[#45464d]">Última Actualización</span>
              <span className="text-black font-bold">
                {packageData.lastUpdated || 'Reciente'}
              </span>
            </div>

            {packageData.author && (
              <div className="flex justify-between items-center py-1">
                <span className="text-[#45464d]">Autor</span>
                <span className="text-black font-bold">{packageData.author}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}