import React, { useState, useEffect, useCallback, useRef } from 'react';
import projectsDataInfo from '../data/projects.json';

const normalize = (str = '') =>
  str.toLowerCase().replace(/[^a-z0-9]/g, '');

// Sub-componente híbrido: Soporta Imágenes, Videos directos y Embeds (YouTube/Vimeo)
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
          Video YouTube / Vimeo
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

export default function ProjectViewPage({
  projectId,
  setActiveTab,
  projectsData = projectsDataInfo,
  packagesList = [],
}) {
  const project =
    projectsData.find((p) => p.id === projectId) || projectsData[0] || {};

  const [selectedIndex, setSelectedIndex] = useState(null);

  // Estados para controlar gestos táctiles (Swipe) dentro del Modal
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const mediaList = Array.isArray(project.media) ? project.media : [];
  const scrollRef = useRef(null);

  // Desplazamiento horizontal de la galería
  const scrollGallery = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // NAVEGACIÓN EN LIGHTBOX
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

  // Control por teclado (Flechas y Esc)
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

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) handleNext();
    if (distance < -minSwipeDistance) handlePrev();
  };

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

  const isEmbedMedia = (url = '') =>
    url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');

  // Función para encontrar un paquete por ID exacto, Nombre exacto o coincidencia normalizada
  const findMatchingPackage = (techName) => {
    if (!techName || !packagesList.length) return null;

    return packagesList.find((pkg) => {
      const matchId = pkg.id && pkg.id.toLowerCase() === techName.toLowerCase();
      const matchName = pkg.name && pkg.name.toLowerCase() === techName.toLowerCase();
      const matchNormalized =
        normalize(pkg.id) === normalize(techName) ||
        normalize(pkg.name) === normalize(techName);

      return matchId || matchName || matchNormalized;
    });
  };
  const handleTechClick = (pkg) => {
    setActiveTab('package', pkg);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6">
      {/* NAVEGACIÓN Y REGRESO */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab && setActiveTab('projects')}
          className="inline-flex items-center gap-2 font-['JetBrains_Mono'] text-xs text-[#45464d] hover:text-black uppercase transition-colors cursor-pointer bg-transparent border-none p-0 group"
        >
          <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-1 transition-transform duration-200">
            arrow_back
          </span>
          Volver a Proyectos
        </button>

        <span className="font-['JetBrains_Mono'] text-xs text-black/40">
          ID: {project.id ?? 'N/A'}
        </span>
      </div>

      {/* BANNER PRINCIPAL DE HEADER */}
      <div className="bg-white/40 backdrop-blur-md border border-black/10 rounded-2xl overflow-hidden shadow-sm">
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
                  rel="noopener noreferrer"
                  download
                  className="flex-1 md:flex-none text-center bg-emerald-500 text-black px-6 py-3 rounded-lg text-xs font-['JetBrains_Mono'] uppercase tracking-widest hover:bg-emerald-400 transition-colors cursor-pointer font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/20"
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
          {/* COLUMNA IZQUIERDA */}
          <div className="lg:col-span-8 space-y-8">
            <div>
              <h2 className="font-['Space_Grotesk'] text-xl font-bold mb-3 text-black">
                Resumen del Proyecto
              </h2>
              <p className="font-['Inter'] text-[#45464d] leading-relaxed whitespace-pre-line text-sm md:text-base">
                {project.description ||
                  'No hay una descripción detallada para este proyecto todavía.'}
              </p>
            </div>

            {/* GALERÍA MULTIMEDIA ESTILIZADA */}
            {mediaList.length > 0 && (
              <div className="space-y-4 pt-2 select-none">
                <div className="flex items-center justify-between">
                  <h3 className="font-['Space_Grotesk'] text-lg font-bold text-black flex items-center gap-2">
                    <span className="material-symbols-outlined text-black/80">
                      photo_library
                    </span>
                    Galería Multimedia
                    <span className="text-xs font-['JetBrains_Mono'] font-normal bg-black/5 px-2.5 py-0.5 rounded-full border border-black/10 text-black/60">
                      {mediaList.length}
                    </span>
                  </h3>
                  <span className="text-[11px] font-['JetBrains_Mono'] text-black/40 hidden sm:inline-block">
                    Haz clic para ampliar
                  </span>
                </div>

                {/* Contenedor relativo para la Galería */}
                <div className="relative group/gallery">
                  {/* Flecha Izquierda con Degradado */}
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

                  {/* Contenedor de Scroll Horizontal */}
                  <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto pb-3 pt-1 px-1 snap-x snap-mandatory no-scrollbar scroll-smooth"
                  >
                    {mediaList.map((url, index) => {
                      return (
                        <div
                          key={index}
                          onClick={() => setSelectedIndex(index)}
                          className="flex-none w-[calc(100%-1rem)] sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.67rem)] snap-start group relative aspect-video bg-neutral-900 rounded-xl overflow-hidden border border-black/10 shadow-sm hover:shadow-xl hover:border-black/30 transition-all duration-300 cursor-pointer"
                        >
                          <MediaItem
                            src={url}
                            alt={`Galería ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                          />

                          {/* Tag de # arriba a la derecha */}
                          <div className="absolute top-2.5 right-2.5 z-10 font-['JetBrains_Mono'] text-[11px] font-semibold bg-black/60 text-white/90 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                            #{index + 1}
                          </div>

                          {/* Lupa de zoom blanca en el centro (solo visible en hover) */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-4xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 drop-shadow-lg">
                              zoom_in
                            </span>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                  {/* Flecha Derecha con Degradado */}
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

            {Array.isArray(project.technologies) &&
              project.technologies.length > 0 && (
                <div>
                  <h3 className="font-['Space_Grotesk'] text-lg font-bold mb-3 text-black">
                    Arquitectura y Tecnologías
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    {project.technologies.map((tech) => {
                      const matchedPkg = findMatchingPackage(tech);

                      if (matchedPkg) {
                        return (
                          <button
                            key={tech}
                            onClick={() => handleTechClick(matchedPkg)}
                            title={`Ver paquete UPM: ${matchedPkg.name}`}
                            className="inline-flex items-center gap-1.5 bg-black hover:bg-emerald-500 text-white hover:text-black border border-black px-3 py-1.5 rounded-lg font-['JetBrains_Mono'] text-xs font-medium transition-all duration-200 cursor-pointer shadow-sm group"
                          >
                            <span className="material-symbols-outlined text-[15px] leading-none text-emerald-400 group-hover:text-black transition-colors">
                              extension
                            </span>
                            <span>{tech}</span>
                            <span className="material-symbols-outlined text-[13px] leading-none opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                              arrow_outward
                            </span>
                          </button>
                        );
                      }

                      return (
                        <span
                          key={tech}
                          className="inline-flex items-center bg-black/5 border border-black/10 px-3 py-1.5 rounded-lg font-['JetBrains_Mono'] text-xs text-black font-medium"
                        >
                          {tech}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

            {Array.isArray(project.tags) && project.tags.length > 0 && (
              <div>
                <h3 className="font-['Space_Grotesk'] text-xs font-bold mb-2 text-black/60 uppercase font-['JetBrains_Mono'] tracking-wider">
                  Etiquetas y Clasificación
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[#45464d] font-['JetBrains_Mono'] text-xs bg-black/[0.03] px-2.5 py-1 rounded border border-black/5 before:content-['#'] before:text-black/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-black text-white p-6 rounded-2xl space-y-4 shadow-md">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <span className="material-symbols-outlined text-emerald-400">
                  sports_esports
                </span>
                <h3 className="font-['Space_Grotesk'] font-bold text-base">
                  Versiones y Descargas
                </h3>
              </div>

              <p className="font-['Inter'] text-xs text-white/70 leading-relaxed">
                Obtén el ejecutable optimizado o explora el código fuente del proyecto.
              </p>

              <div className="space-y-2 pt-2">
                {project.downloadUrl ? (
                  <a
                    href={project.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-['JetBrains_Mono'] font-bold text-xs uppercase py-3 px-4 rounded-lg flex items-center justify-between transition-colors shadow-md"
                  >
                    <span>Descargar Compilación</span>
                    <span className="material-symbols-outlined text-[18px]">
                      download
                    </span>
                  </a>
                ) : (
                  <div className="text-xs font-['JetBrains_Mono'] text-white/40 bg-white/5 p-3 rounded-lg text-center border border-white/10">
                    Sin ejecutable adjunto
                  </div>
                )}

                {project.repositoryUrl && (
                  <a
                    href={project.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-white/10 hover:bg-white/20 text-white font-['JetBrains_Mono'] text-xs uppercase py-3 px-4 rounded-lg flex items-center justify-between transition-colors border border-white/10"
                  >
                    <span>Código Fuente</span>
                    <span className="material-symbols-outlined text-[18px]">
                      code
                    </span>
                  </a>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-black/10 space-y-4 shadow-sm">
              <h3 className="font-['Space_Grotesk'] text-lg font-bold border-b border-black/10 pb-2 text-black">
                Ficha Técnica
              </h3>
              <div className="font-['JetBrains_Mono'] text-xs space-y-3 text-[#45464d]">
                <div className="flex justify-between items-center">
                  <span>Autor:</span>
                  <strong className="text-black font-semibold">
                    {project.author ?? 'Anónimo'}
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span>Versión:</span>
                  <strong className="text-black font-semibold">
                    {project.version ?? '-'}
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span>Estado:</span>
                  <strong className="text-black font-semibold uppercase">
                    {project.status ?? '-'}
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span>Licencia:</span>
                  <strong className="text-black font-semibold">
                    {project.license ?? '-'}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LIGHTBOX MODAL MEJORADO (AMPLIACIÓN CINE) */}
      {selectedIndex !== null && mediaList[selectedIndex] && (
        <div
          onClick={handleClose}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 md:p-6 select-none animate-fadeIn"
        >
          {/* HEADER DEL MODAL */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-6xl flex items-center justify-between text-white z-30 py-2 px-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <span className="font-['JetBrains_Mono'] text-xs font-semibold bg-emerald-500 text-black px-2.5 py-1 rounded">
                {selectedIndex + 1} / {mediaList.length}
              </span>
              <span className="font-['JetBrains_Mono'] text-xs text-white/70 hidden sm:inline-block">
                {isEmbedMedia(mediaList[selectedIndex]) ? 'Video Interactivo' : 'Vista de Imagen'}
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

          {/* CONTENEDOR CENTRAL DE MULTIMEDIA */}
          <div
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className="relative w-full max-w-6xl flex-1 flex items-center justify-center my-4"
          >
            {/* Botón Anterior */}
            {mediaList.length > 1 && (
              <button
                onClick={handlePrev}
                className="hidden sm:flex absolute left-2 md:left-4 z-30 text-white/80 hover:text-white bg-black/60 hover:bg-black/90 p-3 rounded-full backdrop-blur-md border border-white/10 transition-all cursor-pointer shadow-2xl hover:scale-110"
                title="Anterior (Flecha Izquierda)"
              >
                <span className="material-symbols-outlined text-3xl">chevron_left</span>
              </button>
            )}

            {/* Elemento Multimedia Principal */}
            <div className="w-full h-full flex items-center justify-center max-h-[82vh]">
              <MediaItem
                src={mediaList[selectedIndex]}
                alt={`Medio ampliado ${selectedIndex + 1}`}
                controls={true}
                autoPlay={true}
                isModal={true}
                className="max-h-[82vh] w-auto max-w-full object-contain rounded-xl shadow-2xl border border-white/10"
              />
            </div>

            {/* Botón Siguiente */}
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

          {/* FOOTER INDICADOR EN MODAL */}
          <div className="text-white/40 font-['JetBrains_Mono'] text-[11px] tracking-wide pb-1">
            Navega con las flechas <span className="text-white/70">←</span> <span className="text-white/70">→</span> o deslizamiento táctil
          </div>
        </div>
      )}
    </div>
  );
}