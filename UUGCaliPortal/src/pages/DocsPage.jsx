import React, { useState } from 'react';

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState('community'); // 'community' | 'showcase' | 'submit'

  // URL del formulario final
  const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfAQU2x6kMtVS72Qowq_dH53ndLpcbQmeabKPXZnGZGbK9srQ/viewform?usp=publish-editor";

  // Estado para el formulario preliminar interactivo
  const [formData, setFormData] = useState({
    resourceType: 'project', // 'project' | 'package'
    gitUrl: '',
    projectUrl: '',
    location: 'cali', // 'cali' | 'valle' | 'other'
    otherLocationName: '',
    email: '',
    noBadContent: false,
    noMalware: false,
    termsAccepted: false
  });

  const [formErrors, setFormErrors] = useState([]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateAndSubmit = (e) => {
    e.preventDefault();
    const errors = [];

    // Validar Package / Git URL
    if (formData.resourceType === 'package') {
      const isGit = formData.gitUrl.includes('github.com') || 
                    formData.gitUrl.includes('gitlab.com') || 
                    formData.gitUrl.includes('bitbucket.org') ||
                    formData.gitUrl.endsWith('.git');
      if (!formData.gitUrl.trim()) {
        errors.push("Debes proporcionar el enlace al repositorio Git.");
      } else if (!isGit) {
        errors.push("Para paquetes/librerías debe ser un enlace directo a un repositorio Git público (GitHub, GitLab, Bitbucket, etc.), no una versión publicada.");
      }
    }

    // Validar Proyecto URL
    if (formData.resourceType === 'project' && !formData.projectUrl.trim()) {
      errors.push("Debes proporcionar el enlace a la página o ejecutable de tu proyecto.");
    }

    // Validaciones de Contenido y Malware para proyectos
    if (formData.resourceType === 'project') {
      if (!formData.noBadContent) {
        errors.push("Debes confirmar que el proyecto no contiene violencia extrema, sexo o discriminación.");
      }
      if (!formData.noMalware) {
        errors.push("Debes declarar que el archivo/ejecutable está libre de virus o malware.");
      }
    }

    // Validar Correo
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errors.push("Debes ingresar un correo electrónico válido para contacto.");
    }

    // Validar Términos
    if (!formData.termsAccepted) {
      errors.push("Debes aceptar las condiciones de evaluación.");
    }

    setFormErrors(errors);

    if (errors.length === 0) {
      // Redirigir al formulario de Google Forms
      window.open(GOOGLE_FORM_URL, '_blank');
    }
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

      {/* SECCIÓN 3: ENCUESTA Y FORMULARIO PRELIMINAR */}
      {activeTab === 'submit' && (
        <div className="max-w-3xl mx-auto animate-fadeIn space-y-6">
          <div className="bg-white border border-black/10 rounded-xl p-6 md:p-8 space-y-6 shadow-sm">
            
            <div className="border-b border-black/10 pb-4">
              <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-black flex items-center gap-2">
                <span className="material-symbols-outlined">assignment</span>
                Formulario de Postulación de Recurso
              </h2>
              <p className="font-['Inter'] text-xs text-[#45464d] mt-1">
                Completa los datos y verifica las políticas antes de acceder al formulario oficial de envío.
              </p>
            </div>

            <form onSubmit={validateAndSubmit} className="space-y-6">
              
              {/* 1. Tipo de Recurso */}
              <div className="space-y-2">
                <label className="font-['Space_Grotesk'] font-bold text-sm text-black block">
                  1. ¿Qué tipo de recurso deseas postular?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`p-4 border rounded-lg cursor-pointer flex items-center gap-3 transition-all ${
                    formData.resourceType === 'project' ? 'border-black bg-black/5 font-bold' : 'border-black/10 hover:border-black/30'
                  }`}>
                    <input
                      type="radio"
                      name="resourceType"
                      value="project"
                      checked={formData.resourceType === 'project'}
                      onChange={handleInputChange}
                      className="accent-black"
                    />
                    <div>
                      <span className="block text-xs font-['Space_Grotesk'] text-black">Proyecto / Juego / Experiencia</span>
                      <span className="block text-[11px] font-normal text-[#45464d]">Build, juego o ejecutable</span>
                    </div>
                  </label>

                  <label className={`p-4 border rounded-lg cursor-pointer flex items-center gap-3 transition-all ${
                    formData.resourceType === 'package' ? 'border-black bg-black/5 font-bold' : 'border-black/10 hover:border-black/30'
                  }`}>
                    <input
                      type="radio"
                      name="resourceType"
                      value="package"
                      checked={formData.resourceType === 'package'}
                      onChange={handleInputChange}
                      className="accent-black"
                    />
                    <div>
                      <span className="block text-xs font-['Space_Grotesk'] text-black">Package / Librería de Unity</span>
                      <span className="block text-[11px] font-normal text-[#45464d]">Código reusable / UPM</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* 2. URL del Recurso */}
              <div className="space-y-2">
                <label className="font-['Space_Grotesk'] font-bold text-sm text-black block">
                  2. Enlace del {formData.resourceType === 'package' ? 'Repositorio Git' : 'Proyecto'}
                </label>
                
                {formData.resourceType === 'package' ? (
                  <div>
                    <input
                      type="url"
                      name="gitUrl"
                      placeholder="https://github.com/usuario/mi-paquete-unity.git"
                      value={formData.gitUrl}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-black/15 rounded-lg text-xs font-['JetBrains_Mono'] focus:outline-none focus:border-black"
                    />
                    <p className="text-[11px] text-[#45464d] mt-1.5 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-amber-600">info</span>
                      Debe ser un enlace público a Git (GitHub, GitLab, Bitbucket). No se aceptan paquetes ya publicados (Asset Store, NPM) ni archivos sueltos.
                    </p>
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      name="projectUrl"
                      placeholder="https://itch.io/mi-juego o enlace a landing / demo"
                      value={formData.projectUrl}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-black/15 rounded-lg text-xs font-['JetBrains_Mono'] focus:outline-none focus:border-black"
                    />
                    <p className="text-[11px] text-[#45464d] mt-1.5">
                      Enlace donde se pueda visualizar o probar la experiencia.
                    </p>
                  </div>
                )}
              </div>

              {/* 3. Ubicación Geográfica */}
              <div className="space-y-2">
                <label className="font-['Space_Grotesk'] font-bold text-sm text-black block">
                  3. Ubicación del Desarrollador / Equipo
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-black/15 rounded-lg text-xs font-['Inter'] focus:outline-none focus:border-black bg-white"
                >
                  <option value="cali">Santiago de Cali, Colombia</option>
                  <option value="valle">Otro municipio del Valle del Cauca</option>
                  <option value="other">Fuera del Valle del Cauca / Internacional</option>
                </select>

                {formData.location === 'valle' && (
                  <input
                    type="text"
                    name="otherLocationName"
                    placeholder="Especifica el municipio (ej: Palmira, Jamundí, Buga...)"
                    value={formData.otherLocationName}
                    onChange={handleInputChange}
                    className="w-full p-2.5 mt-2 border border-black/15 rounded-lg text-xs font-['Inter'] focus:outline-none focus:border-black"
                  />
                )}

                {formData.location === 'other' && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800 flex items-start gap-2">
                    <span className="material-symbols-outlined text-sm shrink-0 mt-0.5">warning</span>
                    <span>Priorizamos iniciativas locales. Las postulaciones fuera del Valle del Cauca quedan sujetas a revisión de cupos y disponibilidad por parte del comité evaluador.</span>
                  </div>
                )}
              </div>

              {/* 4. Correo de Contacto */}
              <div className="space-y-2">
                <label className="font-['Space_Grotesk'] font-bold text-sm text-black block">
                  4. Correo electrónico de contacto
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="tu.correo@ejemplo.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-black/15 rounded-lg text-xs font-['Inter'] focus:outline-none focus:border-black"
                />
              </div>

              {/* 5. Reglas de Contenido y Seguridad (Solo para Proyectos) */}
              {formData.resourceType === 'project' && (
                <div className="p-4 bg-black/5 rounded-lg border border-black/10 space-y-3">
                  <span className="font-['JetBrains_Mono'] text-[11px] font-bold text-black uppercase block">
                    Declaraciones de Contenido e Integridad
                  </span>
                  
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs font-['Inter'] text-[#45464d]">
                    <input
                      type="checkbox"
                      name="noBadContent"
                      checked={formData.noBadContent}
                      onChange={handleInputChange}
                      className="mt-0.5 accent-black shrink-0"
                    />
                    <span>Confirmo que el proyecto <strong>NO contiene</strong> violencia extrema o explícita, contenido sexual/NSFW, discursos de odio ni discriminación de ningún tipo.</span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer text-xs font-['Inter'] text-[#45464d]">
                    <input
                      type="checkbox"
                      name="noMalware"
                      checked={formData.noMalware}
                      onChange={handleInputChange}
                      className="mt-0.5 accent-black shrink-0"
                    />
                    <span>Declaro que el archivo ejecutable o contenido descargable está completamente libre de virus, malware o scripts perjudiciales.</span>
                  </label>
                </div>
              )}

              {/* 6. Aceptación de Términos de Evaluación */}
              <div className="p-4 bg-white border border-black/15 rounded-lg space-y-2">
                <span className="font-['JetBrains_Mono'] text-[11px] font-bold text-black uppercase block flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">gavel</span>
                  Términos del Proceso de Evaluación
                </span>
                <ul className="text-[11px] text-[#45464d] space-y-1 list-disc pl-4 font-['Inter']">
                  <li>El envío de la postulación <strong>NO garantiza</strong> la publicación inmediata.</li>
                  <li>Un equipo evalúa la solicitud y puede ponerse en contacto vía correo electrónico para solicitar aclaraciones o ajustes.</li>
                </ul>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-['Inter'] text-black font-semibold pt-2 border-t border-black/5 mt-2">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleInputChange}
                    className="accent-black shrink-0"
                  />
                  <span>Comprendo y acepto los términos de evaluación y publicación.</span>
                </label>
              </div>

              {/* Lista de Errores */}
              {formErrors.length > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-1">
                  {formErrors.map((err, idx) => (
                    <p key={idx} className="text-xs text-red-600 font-['Inter'] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">error</span>
                      {err}
                    </p>
                  ))}
                </div>
              )}

              {/* Botón Submit / Ir al Formulario */}
              <div className="pt-2 text-center">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-black text-white px-8 py-3.5 rounded font-['JetBrains_Mono'] text-xs uppercase tracking-widest hover:bg-black/80 transition-all shadow-md inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Validar y Abrir Formulario Oficial</span>
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}
    </div>
  );
}