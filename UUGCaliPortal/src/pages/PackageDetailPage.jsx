import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useHeader } from '../context/HeaderContext';

// Helper reutilizable para asegurar un ID único
export const getPackageAssetId = (pkg) => {
  if (!pkg) return '';
  if (pkg.id) return pkg.id;
  const raw = pkg.name || pkg.title || 'paquete';
  return raw.toLowerCase().replace(/\s+/g, '-');
};

// Sub-componente para renderizar la miniatura (Soporta imágenes y videos directos/embeds)
function MediaItem({
  src,
  alt,
  className = '',
  controls = false,
  autoPlay = false,
  isModal = false,
}) {
  const [isVideo, setIsVideo] = useState(false);

  useEffect(() => {
    setIsVideo(false);
  }, [src]);

  if (!src) return null;

  const isEmbed =
    src.includes('youtube.com') ||
    src.includes('youtu.be') ||
    src.includes('vimeo.com');

  const getEmbedUrl = (url = '') => {
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes('vimeo.com/')) {
      const id = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }
    return url;
  };

  if (isEmbed) {
    if (isModal) {
      return (
        <div className="w-full aspect-video max-h-[80vh] rounded-lg overflow-hidden shadow-2xl">
          <iframe
            src={getEmbedUrl(src)}
            title="Video Embed"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
    return (
      <div className="w-full h-full bg-gradient-to-br from-neutral-900 to-black flex flex-col items-center justify-center text-white/90 relative group-hover:scale-105 transition-transform duration-500">
        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg group-hover:bg-emerald-500 group-hover:text-black transition-all duration-300 group-hover:scale-110">
          <span className="material-symbols-outlined text-3xl">play_arrow</span>
        </div>
        <span className="text-[10px] font-['JetBrains_Mono'] tracking-widest uppercase mt-2.5 text-white/60 group-hover:text-white transition-colors">
          Video
        </span>
      </div>
    );
  }

  if (isVideo) {
    return (
      <video
        src={src}
        controls={controls}
        autoPlay={autoPlay}
        playsInline
        loop
        className={className}
      >
        Tu navegador no soporta la reproducción de video.
      </video>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setIsVideo(true)}
      className={className}
      loading="lazy"
      draggable={false}
    />
  );
}

export default function PackageDetailPage({ packageData, onBack, packagesList = [] }) {
  // Resolvemos el paquete activo: soporta tanto si recibe el objeto completo como si recibe un string ID/Nombre
  const activePackage = typeof packageData === 'string'
    ? packagesList.find(p => p.id === packageData || p.name === packageData)
    : packageData;

  const { togglePin, isPinned } = useHeader();
  const [copiedId, setCopiedId] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Controles de swipe táctil para mobile
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const scrollRef = useRef(null);

  // Si después de buscar no se encuentra el paquete en la lista
  if (!activePackage) {
    return (
      <div className="p-8 text-center bg-white/40 backdrop-blur-md border border-black/5 rounded-xl my-8">
        <p className="font-['JetBrains_Mono'] text-sm text-[#45464d] mb-4">
          No se pudo encontrar la información del paquete solicitado.
        </p>
        <button
          onClick={onBack}
          className="bg-black text-white px-4 py-2 rounded font-['JetBrains_Mono'] text-xs uppercase tracking-wider cursor-pointer"
        >
          Volver al Catálogo
        </button>
      </div>
    );
  }

  // Extraemos variables directamente de activePackage
  const gitLink = activePackage.gitUrl || activePackage.installCmd;
  const pkgId = getPackageAssetId(activePackage);
  const pinned = isPinned(pkgId);
  const mediaList = Array.isArray(activePackage.media) ? activePackage.media : [];

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
      title: activePackage.name || activePackage.title,
      name: activePackage.name || activePackage.title,
      type: activePackage.type || 'Paquete UPM',
      category: activePackage.category || 'Paquetes',
      version: activePackage.version || 'v1.0.0',
      description: activePackage.description || '',
      tags: activePackage.tags || [],
    });
  };

  // Desplazamiento horizontal de la galería
  const scrollGallery = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Navegación del Modal / Lightbox
  const handleNext = useCallback(() => {
    if (selectedIndex === null || mediaList.length === 0) return;
    setSelectedIndex((prev) => (prev + 1) % mediaList.length);
  }, [selectedIndex, mediaList.length]);

  const handlePrev = useCallback(() => {
    if (selectedIndex === null || mediaList.length === 0) return;
    setSelectedIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
  }, [selectedIndex, mediaList.length]);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  // Atajos de teclado (Esc y flechas)
  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, handleNext, handlePrev, handleClose]);

  // Gestos táctiles para móviles
  const minSwipeDistance = 50;
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) handleNext();
    if (distance < -minSwipeDistance) handlePrev();
  };

  const isEmbedMedia = (url = '') =>
    url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');

  // Convierte una cadena de fecha o Date en un texto dinámico/humano
  const formatLastUpdated = (dateString) => {
    if (!dateString) return 'Reciente';

    // Si ya viene escrito explícitamente "Hace..." o "Reciente" desde el backend
    if (typeof dateString === 'string' && (dateString.toLowerCase().includes('hace') || dateString === 'Reciente')) {
      return dateString;
    }

    const date = new Date(dateString);
    // Si la fecha no es válida, devolvemos el valor original
    if (isNaN(date.getTime())) return dateString;

    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    // Lógica de rangos
    if (diffInSeconds < 60) {
      return 'Hace un momento';
    }
    if (diffInMinutes < 60) {
      return `Hace ${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''}`;
    }
    if (diffInHours < 24) {
      return `Hace ${diffInHours} hr${diffInHours > 1 ? 's' : ''}`;
    }
    if (diffInDays === 1) {
      return 'Ayer';
    }
    if (diffInDays < 7) {
      return `Hace ${diffInDays} días`;
    }

    // Si pasaron más de 7 días, mostrar fecha formateada (ej. "12 ago 2026")
    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
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
                {activePackage.icon || 'extension'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-black tracking-tight">
                  {activePackage.name}
                </h1>
                {activePackage.isOfficial && (
                  <span className="bg-black/5 text-black text-[10px] font-['JetBrains_Mono'] uppercase tracking-wider px-2.5 py-1 rounded border border-black/10 font-bold">
                    Verificado UUG
                  </span>
                )}

                {/* Botón Guardar / Marcador */}
                <button
                  onClick={handleTogglePin}
                  className={`p-1.5 rounded-full backdrop-blur transition-all flex items-center justify-center border ${pinned
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
                {activePackage.description}
              </p>
            </div>
          </div>

          {/* Copiar Enlace Git */}
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
        {/* Documentación y Galería */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* GALERÍA MULTIMEDIA */}
          {mediaList.length > 0 && (
            <div className="bg-white/40 backdrop-blur-md border border-black/5 rounded-xl p-6 space-y-4 select-none">
              <div className="flex items-center justify-between">
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-black flex items-center gap-2">
                  <span className="material-symbols-outlined text-black/80">
                    photo_library
                  </span>
                  Muestras y Capturas
                  <span className="text-xs font-['JetBrains_Mono'] font-normal bg-black/5 px-2.5 py-0.5 rounded-full border border-black/10 text-black/60">
                    {mediaList.length}
                  </span>
                </h3>
                <span className="text-[11px] font-['JetBrains_Mono'] text-black/40 hidden sm:inline-block">
                  Haz clic para ampliar
                </span>
              </div>

              {/* Contenedor Galería */}
              <div className="relative group/gallery">
                {/* Flecha Izquierda */}
                <div className="absolute left-0 top-0 bottom-0 z-10 w-16 bg-gradient-to-r from-white/90 via-white/40 to-transparent opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-300 flex items-center justify-start pl-1 pointer-events-none rounded-l-xl">
                  <button
                    onClick={() => scrollGallery('left')}
                    className="pointer-events-auto bg-black/80 hover:bg-black text-white w-9 h-9 rounded-full backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg transform hover:scale-110 flex items-center justify-center"
                    title="Anterior"
                  >
                    <span className="material-symbols-outlined text-xl">
                      chevron_left
                    </span>
                  </button>
                </div>

                {/* Lista Horizontal de Items */}
                <div
                  ref={scrollRef}
                  className="flex gap-4 overflow-x-auto pb-3 pt-1 px-1 snap-x snap-mandatory no-scrollbar scroll-smooth"
                >
                  {mediaList.map((url, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedIndex(index)}
                      className="flex-none w-[calc(100%-1rem)] sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.67rem)] snap-start group relative aspect-video bg-neutral-900 rounded-xl overflow-hidden border border-black/10 shadow-sm hover:shadow-xl hover:border-black/30 transition-all duration-300 cursor-pointer"
                    >
                      <MediaItem
                        src={url}
                        alt={`Muestra ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                      />

                      {/* Tag de # arriba a la derecha */}
                      <div className="absolute top-2.5 right-2.5 z-10 font-['JetBrains_Mono'] text-[11px] font-semibold bg-black/60 text-white/90 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                        #{index + 1}
                      </div>

                      {/* Icono de zoom en el centro (solo en hover) */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-4xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 drop-shadow-lg">
                          zoom_in
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Flecha Derecha */}
                <div className="absolute right-0 top-0 bottom-0 z-10 w-16 bg-gradient-to-l from-white/90 via-white/40 to-transparent opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-300 flex items-center justify-end pr-1 pointer-events-none rounded-r-xl">
                  <button
                    onClick={() => scrollGallery('right')}
                    className="pointer-events-auto bg-black/80 hover:bg-black text-white w-9 h-9 rounded-full backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg transform hover:scale-110 flex items-center justify-center"
                    title="Siguiente"
                  >
                    <span className="material-symbols-outlined text-xl">
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Documentación / Readme */}
          <div className="bg-white/40 backdrop-blur-md border border-black/5 rounded-xl p-8">
            <h2 className="font-['Space_Grotesk'] text-xl font-bold text-black mb-4">
              Documentación e Instalación
            </h2>
            <div className="font-['Inter'] text-sm text-[#45464d] leading-relaxed space-y-4">
              <div className="font-['Inter'] text-sm text-[#45464d] leading-relaxed whitespace-pre-line">
                {activePackage.readme ||
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
          {Array.isArray(activePackage.tags) && activePackage.tags.length > 0 && (
            <div className="bg-white/40 backdrop-blur-md border border-black/5 rounded-xl p-6">
              <h3 className="font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-black font-bold mb-3">
                Etiquetas y Clasificación
              </h3>
              <div className="flex flex-wrap gap-2">
                {activePackage.tags.map((tag) => (
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
              <span className="text-black font-bold">{activePackage.version || 'v1.0.0'}</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-[#45464d]">Categoría</span>
              <span className="text-black font-bold">{activePackage.category || 'General'}</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-[#45464d]">Compatibilidad Unity</span>
              <span className="text-black font-bold">
                {activePackage.unityVersion || '2021.3 LTS+'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-[#45464d]">Última Actualización</span>
              <span className="text-black font-bold">
                {formatLastUpdated(activePackage.lastUpdated)}
              </span>
            </div>

            {activePackage.author && (
              <div className="flex justify-between items-center py-1">
                <span className="text-[#45464d]">Autor</span>
                <span className="text-black font-bold">{activePackage.author}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LIGHTBOX / MODAL PARA AMPLIAR */}
      {selectedIndex !== null && mediaList[selectedIndex] && (
        <div
          onClick={handleClose}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 md:p-6 select-none animate-fadeIn"
        >
          {/* Header del Modal */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-6xl flex items-center justify-between text-white z-30 py-2 px-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <span className="font-['JetBrains_Mono'] text-xs font-semibold bg-emerald-500 text-black px-2.5 py-1 rounded">
                {selectedIndex + 1} / {mediaList.length}
              </span>
              <span className="font-['JetBrains_Mono'] text-xs text-white/70 hidden sm:inline-block">
                {isEmbedMedia(mediaList[selectedIndex]) ? 'Video Interactivo' : 'Vista Ampliada'}
              </span>
            </div>

            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-full transition-all cursor-pointer font-['JetBrains_Mono'] text-xs flex items-center gap-1 border border-transparent hover:border-white/20"
              title="Cerrar (Esc)"
            >
              <span>Cerrar</span>
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Visualizador Principal */}
          <div
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className="relative w-full max-w-6xl flex-1 flex items-center justify-center my-4"
          >
            {/* Flecha Anterior */}
            {mediaList.length > 1 && (
              <button
                onClick={handlePrev}
                className="hidden sm:flex absolute left-2 md:left-4 z-30 text-white/80 hover:text-white bg-black/60 hover:bg-black/90 p-3 rounded-full backdrop-blur-md border border-white/10 transition-all cursor-pointer shadow-2xl hover:scale-110"
                title="Anterior (Flecha Izquierda)"
              >
                <span className="material-symbols-outlined text-3xl">chevron_left</span>
              </button>
            )}

            {/* Contenido Ampliado */}
            <div className="w-full h-full flex items-center justify-center max-h-[82vh]">
              <MediaItem
                src={mediaList[selectedIndex]}
                alt={`Ampliada ${selectedIndex + 1}`}
                controls={true}
                autoPlay={true}
                isModal={true}
                className="max-h-[82vh] w-auto max-w-full object-contain rounded-xl shadow-2xl border border-white/10"
              />
            </div>

            {/* Flecha Siguiente */}
            {mediaList.length > 1 && (
              <button
                onClick={handleNext}
                className="hidden sm:flex absolute right-2 md:right-4 z-30 text-white/80 hover:text-white bg-black/60 hover:bg-black/90 p-3 rounded-full backdrop-blur-md border border-white/10 transition-all cursor-pointer shadow-2xl hover:scale-110"
                title="Siguiente (Flecha Derecha)"
              >
                <span className="material-symbols-outlined text-3xl">chevron_right</span>
              </button>
            )}
          </div>

          {/* Footer Modal */}
          <div className="text-white/40 font-['JetBrains_Mono'] text-[11px] tracking-wide pb-1">
            Navega con las flechas <span className="text-white/70">←</span> <span className="text-white/70">→</span> o deslizamiento táctil
          </div>
        </div>
      )}
    </div>
  );
}