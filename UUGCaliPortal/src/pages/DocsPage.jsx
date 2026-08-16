import React, { useState } from 'react';

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState('community'); // 'community' | 'showcase' | 'submit'

  // Estado del formulario de envío
  const [formData, setFormData] = useState({
    title: '',
    type: 'package', // 'package' | 'project'
    author: '',
    repositoryUrl: '',
    demoUrl: '',
    description: '',
    tags: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch("https://formsubmit.co/ajax/museortiz@gmail.com", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          _subject: `[UUG Cali] Nueva publicación: ${formData.title}`,
          _template: "table",
          ...formData
        })
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        setErrorMsg("Hubo un problema al procesar el envío. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      setErrorMsg("Error de red al conectar con el servicio de correo.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'package',
      author: '',
      repositoryUrl: '',
      demoUrl: '',
      description: '',
      tags: ''
    });
    setSubmitted(false);
    setErrorMsg(null);
  };

  return (
    <div className="bg-white/40 backdrop-blur-md border border-black/5 rounded-xl p-6 md:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Encabezado y Navegación Principal */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-black/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-black/5 text-black font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest px-2.5 py-1 rounded border border-black/10 font-bold">
              Unity Users Group Cali
            </span>
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold text-black tracking-tight">
            Comunidad & Ecosistema Local
          </h1>
          <p className="font-['Inter'] text-sm text-[#45464d] mt-1 max-w-2xl">
            Espacio para conectar con la comunidad de desarrolladores en la ciudad, visibilizar proyectos locales en Unity y compartir paquetes o herramientas Git.
          </p>
        </div>

        {/* Control de Pestañas */}
        <div className="flex items-center gap-1 bg-white/60 backdrop-blur-md p-1 border border-black/10 rounded-lg shadow-sm shrink-0 flex-wrap">
          <button
            onClick={() => setActiveTab('community')}
            className={`px-3.5 py-2 rounded text-xs font-['JetBrains_Mono'] uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'community'
                ? 'bg-black text-white shadow-sm'
                : 'text-[#45464d] hover:text-black hover:bg-black/5'
            }`}
          >
            <span className="material-symbols-outlined text-sm">groups</span>
            <span>Comunidad</span>
          </button>

          <button
            onClick={() => setActiveTab('showcase')}
            className={`px-3.5 py-2 rounded text-xs font-['JetBrains_Mono'] uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'showcase'
                ? 'bg-black text-white shadow-sm'
                : 'text-[#45464d] hover:text-black hover:bg-black/5'
            }`}
          >
            <span className="material-symbols-outlined text-sm">sports_esports</span>
            <span>Showcase Local</span>
          </button>

          <button
            onClick={() => setActiveTab('submit')}
            className={`px-3.5 py-2 rounded text-xs font-['JetBrains_Mono'] uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'submit'
                ? 'bg-black text-white shadow-sm'
                : 'text-[#45464d] hover:text-black hover:bg-black/5'
            }`}
          >
            <span className="material-symbols-outlined text-sm">add_box</span>
            <span>Publicar</span>
          </button>
        </div>
      </div>

      {/* SECCIÓN 1: SOBRE EL GRUPO DE USUARIOS DE UNITY */}
      {activeTab === 'community' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Card Principal: Propósito */}
          <div className="bg-white p-6 md:p-8 rounded-xl border border-black/5 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-black text-2xl">diversity_3</span>
              <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-black">
                ¿Qué es el Unity Users Group?
              </h2>
            </div>
            <p className="font-['Inter'] text-sm text-[#45464d] leading-relaxed">
              Somos un colectivo abierto de desarrolladores, diseñadores, artistas y creadores que utilizan <strong>Unity</strong> para dar vida a una infinidad de proyectos: desde videojuegos independientes, simulaciones e interacciones 3D, hasta experiencias educativas, realidad aumentada e instalaciones interactivas.
            </p>
          </div>

          {/* Grid de Pilares / Encuentros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-black/5 space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-black/5 flex items-center justify-center">
                <span className="material-symbols-outlined text-black text-xl">event_repeat</span>
              </div>
              <h3 className="font-['Space_Grotesk'] font-bold text-base text-black">
                5 Reuniones Presenciales al Año
              </h3>
              <p className="font-['Inter'] text-xs text-[#45464d] leading-relaxed">
                Nos encontramos físicamente cinco veces durante el año en la ciudad para compartir avances, probar builds de proyectos y conectar de forma directa con otros creadores.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-black/5 space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-black/5 flex items-center justify-center">
                <span className="material-symbols-outlined text-black text-xl">handshake</span>
              </div>
              <h3 className="font-['Space_Grotesk'] font-bold text-base text-black">
                Formar Comunidad
              </h3>
              <p className="font-['Inter'] text-xs text-[#45464d] leading-relaxed">
                Generamos un espacio seguro e inclusivo de networking, colaboración y retroalimentación técnica donde tanto principiantes como expertos pueden crecer juntos.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-black/5 space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-black/5 flex items-center justify-center">
                <span className="material-symbols-outlined text-black text-xl">rocket_launch</span>
              </div>
              <h3 className="font-['Space_Grotesk'] font-bold text-base text-black">
                Aportar a la Industria
              </h3>
              <p className="font-['Inter'] text-xs text-[#45464d] leading-relaxed">
                Impulsamos el desarrollo tecnológico y creativo regional, promoviendo el talento local y creando herramientas de código abierto útiles para el sector.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECCIÓN 2: SHOWCASE LOCAL & REPOSITORIOS */}
      {activeTab === 'showcase' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-black/5 pb-3">
            <h2 className="font-['Space_Grotesk'] text-xl font-bold text-black flex items-center gap-2">
              <span className="material-symbols-outlined">code</span>
              Proyectos Locales & Paquetes Git
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-black/5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="bg-black/5 text-black font-['JetBrains_Mono'] text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-black/10">
                  Showcase Destacado
                </span>
                <span className="font-['JetBrains_Mono'] text-xs text-[#45464d]">Cali, CO</span>
              </div>
              <h3 className="font-['Space_Grotesk'] font-bold text-lg text-black">
                Experiencias Interactivas & Proyectos 3D
              </h3>
              <p className="font-['Inter'] text-xs text-[#45464d] leading-relaxed">
                Descubre los proyectos desarrollados por miembros del grupo en la ciudad, desde juegos independientes hasta experiencias educativas e interactivas.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('submit')}
                  className="bg-black text-white px-4 py-2 rounded font-['JetBrains_Mono'] text-xs uppercase tracking-wider hover:bg-black/80 transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Someter mi Proyecto</span>
                  <span className="material-symbols-outlined text-sm">east</span>
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-black/5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="bg-black/5 text-black font-['JetBrains_Mono'] text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-black/10">
                  Open Source
                </span>
                <span className="font-['JetBrains_Mono'] text-xs text-[#45464d]">Git / UPM</span>
              </div>
              <h3 className="font-['Space_Grotesk'] font-bold text-lg text-black">
                Librerías & Módulos para Desarrolladores
              </h3>
              <p className="font-['Inter'] text-xs text-[#45464d] leading-relaxed">
                Accede a enlaces directos de repositorios Git con paquetes reutilizables para Unity diseñados por la comunidad para agilizar tus desarrollos.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('submit')}
                  className="bg-black/5 hover:bg-black hover:text-white border border-black/10 text-black px-4 py-2 rounded font-['JetBrains_Mono'] text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Compartir Enlace Git</span>
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECCIÓN 3: FORMULARIO DE PUBLICACIÓN */}
      {activeTab === 'submit' && (
        <div className="max-w-3xl mx-auto animate-fadeIn">
          {submitted ? (
            <div className="bg-white border border-emerald-500/30 rounded-xl p-8 text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-3xl">check_circle</span>
              </div>
              <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-black">
                ¡Registro Enviado!
              </h2>
              <p className="font-['Inter'] text-xs text-[#45464d] max-w-md mx-auto">
                Tu proyecto/paquete <strong>"{formData.title}"</strong> ha sido registrado. Un organizador revisará la información antes de integrarlo al catálogo.
              </p>
              <button
                onClick={resetForm}
                className="bg-black text-white px-5 py-2.5 rounded font-['JetBrains_Mono'] text-xs uppercase tracking-widest hover:bg-black/80 transition-colors cursor-pointer"
              >
                Enviar Otro Elemento
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-black/5 rounded-xl p-6 md:p-8 space-y-6 shadow-sm">
              <div className="border-b border-black/5 pb-4">
                <h2 className="font-['Space_Grotesk'] text-xl font-bold text-black">
                  Publicar Proyecto o Paquete Git
                </h2>
                <p className="font-['JetBrains_Mono'] text-xs text-[#45464d] mt-0.5">
                  Formulario directo para desarrolladores de la comunidad Unity.
                </p>
              </div>

              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded p-3 text-xs font-['Inter']">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
                <div className="space-y-1">
                  <label className="font-['JetBrains_Mono'] text-xs text-black font-bold uppercase">
                    Nombre del Elemento *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Ej. Cali Interactive Map / URP Utils"
                    className="w-full bg-black/5 border border-black/10 rounded px-3 py-2 text-xs font-['Inter'] focus:outline-none focus:border-black"
                  />
                </div>

                {/* Tipo */}
                <div className="space-y-1">
                  <label className="font-['JetBrains_Mono'] text-xs text-black font-bold uppercase">
                    Tipo de Publicación *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full bg-black/5 border border-black/10 rounded px-3 py-2 text-xs font-['Inter'] focus:outline-none focus:border-black cursor-pointer"
                  >
                    <option value="package">Paquete Git / UPM (Para Devs)</option>
                    <option value="project">Proyecto Unity (Showcase Local)</option>
                  </select>
                </div>

                {/* Autor */}
                <div className="space-y-1">
                  <label className="font-['JetBrains_Mono'] text-xs text-black font-bold uppercase">
                    Creador / Equipo *
                  </label>
                  <input
                    type="text"
                    name="author"
                    required
                    value={formData.author}
                    onChange={handleInputChange}
                    placeholder="Tu nombre o estudio local"
                    className="w-full bg-black/5 border border-black/10 rounded px-3 py-2 text-xs font-['Inter'] focus:outline-none focus:border-black"
                  />
                </div>

                {/* URL Git / Repo */}
                <div className="space-y-1">
                  <label className="font-['JetBrains_Mono'] text-xs text-black font-bold uppercase">
                    Enlace Git / Repositorio *
                  </label>
                  <input
                    type="url"
                    name="repositoryUrl"
                    required
                    value={formData.repositoryUrl}
                    onChange={handleInputChange}
                    placeholder="https://github.com/usuario/mi-repo.git"
                    className="w-full bg-black/5 border border-black/10 rounded px-3 py-2 text-xs font-['JetBrains_Mono'] focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* URL Demo (Opcional) */}
              <div className="space-y-1">
                <label className="font-['JetBrains_Mono'] text-xs text-black font-bold uppercase">
                  URL de Demo o WebGL (Opcional)
                </label>
                <input
                  type="url"
                  name="demoUrl"
                  value={formData.demoUrl}
                  onChange={handleInputChange}
                  placeholder="https://itch.io / https://mi-demo.com"
                  className="w-full bg-black/5 border border-black/10 rounded px-3 py-2 text-xs font-['JetBrains_Mono'] focus:outline-none focus:border-black"
                />
              </div>

              {/* Descripción */}
              <div className="space-y-1">
                <label className="font-['JetBrains_Mono'] text-xs text-black font-bold uppercase">
                  Descripción Corta *
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Explica de qué trata tu juego/proyecto o qué resuelve tu paquete de Unity..."
                  className="w-full bg-black/5 border border-black/10 rounded px-3 py-2 text-xs font-['Inter'] focus:outline-none focus:border-black"
                />
              </div>

              {/* Etiquetas */}
              <div className="space-y-1">
                <label className="font-['JetBrains_Mono'] text-xs text-black font-bold uppercase">
                  Etiquetas (separadas por comas)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="3d, indie, upm, ui"
                  className="w-full bg-black/5 border border-black/10 rounded px-3 py-2 text-xs font-['JetBrains_Mono'] focus:outline-none focus:border-black"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded font-['JetBrains_Mono'] text-xs uppercase tracking-widest hover:bg-black/80 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
              >
                <span>{loading ? 'Enviando...' : 'Enviar Publicación'}</span>
                <span className="material-symbols-outlined text-sm">
                  {loading ? 'hourglass_top' : 'send'}
                </span>
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}