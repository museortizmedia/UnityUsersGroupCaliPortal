import React, { useState } from 'react';

export default function PackageUploadPage() {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Gráficos y Shaders',
    version: 'v1.0.0',
    description: '',
    gitUrl: '',
    unityVersion: '2022.3 LTS+',
    author: '',
    tags: '',
    readme: '',
    isOfficial: false,
    icon: 'extension'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const categories = [
    'Gráficos y Shaders',
    'Animación',
    'Herramientas y Utilidades',
    'Modelos 3D y Entornos',
    'Audio y Sonido',
    'IU y Sistemas'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };

      // Auto-generar sugerencia de URL de Git al escribir el nombre del paquete
      if (name === 'name' && !prev.gitUrlManual) {
        const slug = value.toLowerCase().replace(/[^a-z0-9]/g, '-');
        updated.gitUrl = slug ? `https://github.com/caliuug/${slug}.git` : '';
      }
      return updated;
    });
  };

  // Construir objeto formateado idéntico al esquema de packages.json
  const generatedPayload = {
    id: formData.name ? formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'id-paquete',
    name: formData.name || '@grupo/nombre-paquete',
    description: formData.description || 'Resumen corto de la funcionalidad del paquete...',
    isOfficial: formData.isOfficial,
    icon: formData.icon || 'extension',
    category: formData.category,
    version: formData.version || 'v1.0.0',
    downloads: '0',
    lastUpdated: 'Hace un momento',
    gitUrl: formData.gitUrl || 'https://github.com/usuario/repositorio.git',
    unityVersion: formData.unityVersion || '2022.3 LTS+',
    author: formData.author || 'Desarrollador Comunidad',
    tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean) : ['Unity'],
    readme: formData.readme || 'Documentación y guía de uso del paquete.'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      console.log('Package Payload JSON:', generatedPayload);
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  const copyToClipboardJson = () => {
    navigator.clipboard.writeText(JSON.stringify(generatedPayload, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <>
      {/* Sección Encabezado */}
      <section className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-black/5 text-black font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest px-2.5 py-1 rounded border border-black/10 font-bold">
              Portal de Publicación
            </span>
          </div>
          <h1 className="font-['Space_Grotesk'] text-4xl md:text-5xl font-bold text-black tracking-tight">
            Publicar Paquete UPM
          </h1>
          <p className="font-['Inter'] text-lg text-[#45464d] max-w-2xl mt-2">
            Registra tu repositorio de Git (herramientas, shaders o librerías) compatible con Unity Package Manager para compartirlo con la comunidad.
          </p>
        </div>
      </section>

      {submitted ? (
        /* Confirmación de éxito con opción de copiar JSON */
        <section className="bg-white/40 backdrop-blur-md border border-black/10 rounded-xl p-12 text-center max-w-2xl mx-auto my-8">
          <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-3xl">check</span>
          </div>
          <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-black mb-2">
            ¡Paquete Registrado con Éxito!
          </h2>
          <p className="font-['Inter'] text-sm text-[#45464d] mb-6">
            El paquete <code className="font-['JetBrains_Mono'] font-bold text-black">{formData.name}</code> está listo para incorporarse al archivo <code className="font-['JetBrains_Mono']">packages.json</code>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={copyToClipboardJson}
              className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded font-['JetBrains_Mono'] text-xs uppercase tracking-widest hover:bg-black/80 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">
                {copiedJson ? 'check' : 'content_copy'}
              </span>
              <span>{copiedJson ? '¡JSON Copiado!' : 'Copiar Objeto JSON'}</span>
            </button>

            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: '',
                  category: 'Gráficos y Shaders',
                  version: 'v1.0.0',
                  description: '',
                  gitUrl: '',
                  unityVersion: '2022.3 LTS+',
                  author: '',
                  tags: '',
                  readme: '',
                  isOfficial: false,
                  icon: 'extension'
                });
              }}
              className="w-full sm:w-auto bg-white border border-black/10 text-black px-6 py-3 rounded font-['JetBrains_Mono'] text-xs uppercase tracking-widest hover:bg-black/5 transition-colors cursor-pointer"
            >
              Registrar Otro Paquete
            </button>
          </div>
        </section>
      ) : (
        /* Formulario Principal */
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-8 mb-16">
          
          {/* Columna Izquierda: Información de integración Git & Vista Previa JSON */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
            {/* Caja Informativa sobre Repositorio Git */}
            <div className="bg-white/40 backdrop-blur-md border border-black/10 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-black">code_blocks</span>
                <h3 className="font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-black font-bold">
                  Integración Directa vía Git
                </h3>
              </div>
              <p className="font-['Inter'] text-xs text-[#45464d] leading-relaxed mb-4">
                Los paquetes no almacenan archivos pesados localmente. Unity Package Manager se conecta directamente a la URL de tu repositorio de Git. Asegúrate de incluir la extensión <code className="font-['JetBrains_Mono'] text-black font-semibold">.git</code> al final del enlace.
              </p>
              <div className="bg-black/5 border border-black/10 rounded p-3 text-[11px] font-['JetBrains_Mono'] text-black/80">
                <p className="font-bold mb-1">💡 Requisito UPM:</p>
                <p>El repositorio en Git debe contener un archivo <code className="text-black font-bold">package.json</code> válido en la raíz de la rama principal.</p>
              </div>
            </div>

            {/* Previsualizador JSON en Tiempo Real */}
            <div className="bg-black text-white rounded-xl p-6 font-['JetBrains_Mono'] text-xs shadow-inner">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 text-white/50 text-[10px] uppercase tracking-widest">
                <span>Previsualización del packages.json</span>
                <span className="material-symbols-outlined text-sm">terminal</span>
              </div>
              <pre className="overflow-x-auto text-emerald-400 font-normal leading-relaxed text-[11px] max-h-[350px] scrollbar-thin">
                {JSON.stringify(generatedPayload, null, 2)}
              </pre>
            </div>
          </div>

          {/* Columna Derecha: Campos del Formulario */}
          <div className="col-span-12 lg:col-span-7 bg-white/40 backdrop-blur-md border border-black/5 rounded-xl p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              
              {/* Nombre y Versión */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 sm:col-span-8">
                  <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-black font-bold mb-2">
                    Nombre del Paquete *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="ej: @caliuug/core-renderer"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-white/60 border border-black/10 focus:border-black rounded px-4 py-2 font-['Inter'] text-sm text-black placeholder:text-[#45464d]/50 outline-none transition-colors"
                  />
                </div>
                <div className="col-span-12 sm:col-span-4">
                  <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-black font-bold mb-2">
                    Versión *
                  </label>
                  <input
                    type="text"
                    name="version"
                    required
                    placeholder="v1.0.0"
                    value={formData.version}
                    onChange={handleInputChange}
                    className="w-full bg-white/60 border border-black/10 focus:border-black rounded px-4 py-2 font-['JetBrains_Mono'] text-sm text-black outline-none transition-colors"
                  />
                </div>
              </div>

              {/* URL del Repositorio Git */}
              <div>
                <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-black font-bold mb-2">
                  URL del Repositorio Git *
                </label>
                <input
                  type="url"
                  name="gitUrl"
                  required
                  placeholder="https://github.com/usuario/repositorio.git"
                  value={formData.gitUrl}
                  onChange={(e) => {
                    handleInputChange(e);
                    setFormData((prev) => ({ ...prev, gitUrlManual: true }));
                  }}
                  className="w-full bg-white/60 border border-black/10 focus:border-black rounded px-4 py-2 font-['JetBrains_Mono'] text-xs text-black placeholder:text-[#45464d]/50 outline-none transition-colors"
                />
              </div>

              {/* Categoría e Icono */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 sm:col-span-8">
                  <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-black font-bold mb-2">
                    Categoría *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-white/60 border border-black/10 focus:border-black rounded px-4 py-2 font-['JetBrains_Mono'] text-xs text-black outline-none transition-colors cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-12 sm:col-span-4">
                  <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-black font-bold mb-2">
                    Ícono (Material Symbol)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="icon"
                      placeholder="extension"
                      value={formData.icon}
                      onChange={handleInputChange}
                      className="w-full bg-white/60 border border-black/10 focus:border-black rounded pl-4 pr-10 py-2 font-['JetBrains_Mono'] text-xs text-black outline-none transition-colors"
                    />
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-black text-lg">
                      {formData.icon || 'extension'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Versión de Unity y Autor */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 sm:col-span-6">
                  <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-black font-bold mb-2">
                    Soporte de Versión Unity
                  </label>
                  <input
                    type="text"
                    name="unityVersion"
                    placeholder="ej: 2022.3 LTS+"
                    value={formData.unityVersion}
                    onChange={handleInputChange}
                    className="w-full bg-white/60 border border-black/10 focus:border-black rounded px-4 py-2 font-['JetBrains_Mono'] text-xs text-black outline-none transition-colors"
                  />
                </div>
                <div className="col-span-12 sm:col-span-6">
                  <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-black font-bold mb-2">
                    Autor / Comunidad
                  </label>
                  <input
                    type="text"
                    name="author"
                    placeholder="ej: Unity Users Group Cali"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full bg-white/60 border border-black/10 focus:border-black rounded px-4 py-2 font-['Inter'] text-xs text-black outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Resumen Corto */}
              <div>
                <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-black font-bold mb-2">
                  Resumen Corto *
                </label>
                <textarea
                  name="description"
                  required
                  rows="2"
                  placeholder="Descripción breve de la función principal de este paquete o herramienta..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full bg-white/60 border border-black/10 focus:border-black rounded px-4 py-2 font-['Inter'] text-sm text-black placeholder:text-[#45464d]/50 outline-none transition-colors resize-none"
                ></textarea>
              </div>

              {/* Etiquetas y Documentación */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12">
                  <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-black font-bold mb-2">
                    Etiquetas / Tags (Separadas por coma)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    placeholder="URP, Shaders, PBR, Lighting"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full bg-white/60 border border-black/10 focus:border-black rounded px-4 py-2 font-['JetBrains_Mono'] text-xs text-black outline-none transition-colors"
                  />
                </div>

                <div className="col-span-12">
                  <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-black font-bold mb-2">
                    Documentación / Resumen Readme
                  </label>
                  <textarea
                    name="readme"
                    rows="3"
                    placeholder="Detalles adicionales de instalación, dependencias o instrucciones de uso..."
                    value={formData.readme}
                    onChange={handleInputChange}
                    className="w-full bg-white/60 border border-black/10 focus:border-black rounded px-4 py-2 font-['Inter'] text-sm text-black placeholder:text-[#45464d]/50 outline-none transition-colors resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Checkbox Oficial */}
              <div className="pt-1">
                <label className="inline-flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isOfficial"
                    checked={formData.isOfficial}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-black/20 text-black focus:ring-0 cursor-pointer accent-black"
                  />
                  <span className="font-['Inter'] text-xs text-black font-medium">
                    Marcar como paquete oficial / verificado por la comunidad
                  </span>
                </label>
              </div>

            </div>

            {/* Acciones del formulario */}
            <div className="pt-4 border-t border-black/10 flex items-center justify-end gap-4">
              <button
                type="button"
                className="px-6 py-3 rounded font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-[#45464d] hover:text-black hover:bg-black/5 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.name || !formData.gitUrl}
                className="bg-black text-white px-8 py-3 rounded font-['JetBrains_Mono'] text-xs uppercase tracking-widest hover:bg-black/80 disabled:opacity-40 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">publish</span>
                    <span>Publicar Paquete</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </form>
      )}
    </>
  );
}