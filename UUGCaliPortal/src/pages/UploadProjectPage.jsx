import React, { useState } from 'react';

export default function UploadProjectPage() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    description: '',
    status: 'Prototipo',
    version: 'v1.0.0',
    tags: '',
    technologies: '',
    coverImage: '',
    badge: '',
    downloadUrl: '',
  });

  const [generatedJson, setGeneratedJson] = useState('');
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateJson = (e) => {
    e.preventDefault();

    // Generación de ID amigable (ej: "proj-nave-lumina")
    const slug = formData.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const newProject = {
      id: `proj-${slug || 'nuevo-proyecto'}`,
      title: formData.title.trim(),
      author: formData.author.trim() || 'CaliUUG Team',
      category: formData.category.trim() || 'General',
      description: formData.description.trim(),
      status: formData.status,
      version: formData.version.trim(),
      tags: formData.tags
        ? formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : [],
      technologies: formData.technologies
        ? formData.technologies.split(',').map((tech) => tech.trim()).filter(Boolean)
        : [],
      coverImage: formData.coverImage.trim(),
      badge: formData.badge.trim() || undefined,
      downloadUrl: formData.downloadUrl.trim() || undefined,
    };

    setGeneratedJson(JSON.stringify(newProject, null, 2));
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const requiresDownload = ['Publicado', 'Demo', 'Prototipo'].includes(formData.status);

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6 bg-white border border-black/10 rounded-xl shadow-sm">
      {/* Header */}
      <div className="border-b border-black/10 pb-4">
        <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-black">
          Nuevo Proyecto
        </h2>
        <p className="font-['JetBrains_Mono'] text-xs text-[#45464d] mt-1">
          Ingresa los metadatos para generar la estructura JSON que pegarás en tu archivo data.
        </p>
      </div>

      <form onSubmit={handleGenerateJson} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Título */}
          <div>
            <label className="block text-xs font-['JetBrains_Mono'] font-semibold text-black uppercase mb-1">
              Título *
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="Ej: Nave Lúmina Space Odyssey"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-black/10 rounded text-sm focus:outline-none focus:border-black font-['Inter']"
            />
          </div>

          {/* Autor */}
          <div>
            <label className="block text-xs font-['JetBrains_Mono'] font-semibold text-black uppercase mb-1">
              Autor / Equipo
            </label>
            <input
              type="text"
              name="author"
              placeholder="Ej: Muse Ortiz Media"
              value={formData.author}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-black/10 rounded text-sm focus:outline-none focus:border-black font-['Inter']"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-xs font-['JetBrains_Mono'] font-semibold text-black uppercase mb-1">
              Categoría
            </label>
            <input
              type="text"
              name="category"
              placeholder="Ej: Cyberpunk Racing / Interactive"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-black/10 rounded text-sm focus:outline-none focus:border-black font-['Inter']"
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-xs font-['JetBrains_Mono'] font-semibold text-black uppercase mb-1">
              Estado *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-black/10 rounded text-sm focus:outline-none focus:border-black font-['JetBrains_Mono'] bg-white"
            >
              <option value="Prototipo">Prototipo</option>
              <option value="Publicado">Publicado</option>
              <option value="Demo">Demo</option>
              <option value="Sin publicar">Sin publicar</option>
              <option value="Sin completar">Sin completar</option>
            </select>
          </div>

          {/* Versión */}
          <div>
            <label className="block text-xs font-['JetBrains_Mono'] font-semibold text-black uppercase mb-1">
              Versión
            </label>
            <input
              type="text"
              name="version"
              placeholder="Ej: v0.8.2"
              value={formData.version}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-black/10 rounded text-sm focus:outline-none focus:border-black font-['JetBrains_Mono']"
            />
          </div>

          {/* Badge */}
          <div>
            <label className="block text-xs font-['JetBrains_Mono'] font-semibold text-black uppercase mb-1">
              Badge (Opcional)
            </label>
            <input
              type="text"
              name="badge"
              placeholder="Ej: PROJECT OF THE WEEK"
              value={formData.badge}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-black/10 rounded text-sm focus:outline-none focus:border-black font-['JetBrains_Mono']"
            />
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-xs font-['JetBrains_Mono'] font-semibold text-black uppercase mb-1">
            Descripción
          </label>
          <textarea
            name="description"
            rows="3"
            placeholder="Breve resumen del proyecto..."
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-black/10 rounded text-sm focus:outline-none focus:border-black font-['Inter']"
          />
        </div>

        {/* Arreglos separados por coma */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-['JetBrains_Mono'] font-semibold text-black uppercase mb-1">
              Tecnologías (Separadas por coma)
            </label>
            <input
              type="text"
              name="technologies"
              placeholder="Unity, C#, Shader Graph"
              value={formData.technologies}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-black/10 rounded text-sm focus:outline-none focus:border-black font-['JetBrains_Mono']"
            />
          </div>

          <div>
            <label className="block text-xs font-['JetBrains_Mono'] font-semibold text-black uppercase mb-1">
              Tags (Separados por coma)
            </label>
            <input
              type="text"
              name="tags"
              placeholder="cyberpunk, racing, unity3d"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-black/10 rounded text-sm focus:outline-none focus:border-black font-['JetBrains_Mono']"
            />
          </div>
        </div>

        {/* Cover Image URL & Download URL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-['JetBrains_Mono'] font-semibold text-black uppercase mb-1">
              URL Imagen de Portada
            </label>
            <input
              type="url"
              name="coverImage"
              placeholder="https://lh3.googleusercontent.com/..."
              value={formData.coverImage}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-black/10 rounded text-sm focus:outline-none focus:border-black font-['JetBrains_Mono']"
            />
          </div>

          {/* URL Descarga del Ejecutable */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-['JetBrains_Mono'] font-semibold text-black uppercase">
                Enlace Ejecutable / Build {requiresDownload && <span className="text-amber-600 font-bold">(Recomendado para {formData.status})</span>}
              </label>
            </div>
            <input
              type="url"
              name="downloadUrl"
              placeholder="https://drive.google.com/file/d/..."
              value={formData.downloadUrl}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded text-sm focus:outline-none font-['JetBrains_Mono'] transition-colors ${
                requiresDownload && !formData.downloadUrl
                  ? 'border-amber-400 bg-amber-50/30 focus:border-amber-600'
                  : 'border-black/10 focus:border-black'
              }`}
            />
            {requiresDownload && !formData.downloadUrl && (
              <p className="text-[10px] font-['JetBrains_Mono'] text-amber-700 mt-1">
                💡 Este estado sugiere incluir un enlace directo a Google Drive, itch.io o Mega.
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white font-['JetBrains_Mono'] text-xs uppercase py-3 rounded font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          Generar Objeto JSON
        </button>
      </form>

      {/* Salida JSON */}
      {generatedJson && (
        <div className="pt-6 border-t border-black/10 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-['JetBrains_Mono'] font-bold text-black uppercase">
              Resultado (Copia este objeto)
            </span>
            <button
              onClick={handleCopy}
              className="text-xs font-['JetBrains_Mono'] bg-black/5 hover:bg-black/10 px-3 py-1 rounded transition-colors text-black font-semibold cursor-pointer"
            >
              {copied ? '¡Copiado!' : 'Copiar JSON'}
            </button>
          </div>

          <pre className="p-4 bg-neutral-900 text-emerald-400 font-['JetBrains_Mono'] text-xs rounded-lg overflow-x-auto border border-black">
            {generatedJson}
          </pre>
        </div>
      )}
    </div>
  );
}