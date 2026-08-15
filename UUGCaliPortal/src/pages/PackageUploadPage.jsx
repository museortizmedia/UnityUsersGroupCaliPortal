import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchJsonFromGithub, applyJsonCrudOperation } from '../helpers/githubService';

const REPO_OWNER = 'museortizmedia';
const REPO_NAME = 'UnityUsersGroupCaliPortal';
const FILE_PATH = 'UUGCaliPortal/src/data/packages.json';

export default function PackageUploadPage() {
  const { githubToken } = useAuth();

  // Estados de datos de GitHub
  const [fullJsonData, setFullJsonData] = useState([]);
  const [rawJsonText, setRawJsonText] = useState('[]');
  const [isRawEditing, setIsRawEditing] = useState(false);
  const [jsonError, setJsonError] = useState('');
  const [openAccordionId, setOpenAccordionId] = useState(null);

  // Estado del formulario para CREAR/EDITAR
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

  // Estados de carga e interfaz
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const categories = [
    'Gráficos y Shaders',
    'Animación',
    'Herramientas y Utilidades',
    'Modelos 3D y Entornos',
    'Audio y Sonido',
    'IU y Sistemas'
  ];

  // 1. Cargar paquetes desde GitHub al montar
  useEffect(() => {
    const loadPackages = async () => {
      setIsLoading(true);
      setStatusMsg({ type: '', text: '' });

      try {
        const { data } = await fetchJsonFromGithub({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          path: FILE_PATH,
          token: githubToken
        });

        const list = Array.isArray(data) ? data : [];
        setFullJsonData(list);
        setRawJsonText(JSON.stringify(list, null, 2));
        if (list.length > 0) setOpenAccordionId(list[0].id);
      } catch (err) {
        setJsonError('No se pudo obtener el archivo packages.json desde GitHub.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPackages();
  }, [githubToken]);

  // Modificar formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };

      if (name === 'name' && !prev.gitUrlManual) {
        const slug = value.toLowerCase().replace(/[^a-z0-9]/g, '-');
        updated.gitUrl = slug ? `https://github.com/caliuug/${slug}.git` : '';
      }
      return updated;
    });
  };

  // Objeto formateado para la previsualización / inserción
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

  // Añadir un nuevo paquete al estado local
  const handleAddPackage = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.gitUrl) return;

    const newPackage = { ...generatedPayload };
    const updatedList = [newPackage, ...fullJsonData];

    setFullJsonData(updatedList);
    setRawJsonText(JSON.stringify(updatedList, null, 2));
    setOpenAccordionId(newPackage.id);

    // Resetear formulario
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

    setStatusMsg({ type: 'info', text: 'Paquete agregado a la lista local. Haz clic en "Enviar Commit" para guardar en GitHub.' });
  };

  // Manejador del Editor JSON Crudo
  const handleRawJsonChange = (e) => {
    const val = e.target.value;
    setRawJsonText(val);

    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        setFullJsonData(parsed);
        setJsonError('');
      } else {
        setJsonError('El JSON debe ser un Arreglo [] de paquetes.');
      }
    } catch (err) {
      setJsonError('Error de sintaxis JSON: ' + err.message);
    }
  };

  // Eliminar elemento de la lista local
  const handleDeletePackage = (id) => {
    const updatedList = fullJsonData.filter((item) => item.id !== id);
    setFullJsonData(updatedList);
    setRawJsonText(JSON.stringify(updatedList, null, 2));
  };

  // 2. Ejecutar Commit en GitHub
  const handleExecuteCommit = async () => {
    setIsSubmitting(true);
    setStatusMsg({ type: '', text: '' });

    if (!githubToken) {
      setStatusMsg({
        type: 'error',
        text: 'Se requiere iniciar sesión con GitHub Token desde la página de Login.'
      });
      setIsSubmitting(false);
      return;
    }

    if (jsonError) {
      setStatusMsg({
        type: 'error',
        text: 'Corrige el error de sintaxis en el JSON antes de hacer commit.'
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await applyJsonCrudOperation({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: FILE_PATH,
        token: githubToken,
        action: 'REPLACE_ALL',
        item: fullJsonData,
        commitMessage: `crud(packages): sync packages.json (${fullJsonData.length} items)`
      });

      setStatusMsg({ type: 'success', text: '¡Commit enviado exitosamente a packages.json!' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Encabezado */}
      <section className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-black/5 text-black font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest px-2.5 py-1 rounded border border-black/10 font-bold">
              Portal de Publicación
            </span>
          </div>
          <h1 className="font-['Space_Grotesk'] text-4xl md:text-5xl font-bold text-black tracking-tight">
            Gestión de Paquetes UPM
          </h1>
          <p className="font-['Inter'] text-lg text-[#45464d] max-w-2xl mt-2">
            Administra y publica paquetes de Unity (herramientas, shaders o librerías) en el archivo <code className="font-['JetBrains_Mono'] text-black font-semibold">packages.json</code>.
          </p>
        </div>

        {/* Botón de Commit Global */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleExecuteCommit}
            disabled={isSubmitting || isLoading || !!jsonError}
            className="bg-black text-white px-6 py-3 rounded font-['JetBrains_Mono'] text-xs uppercase tracking-widest hover:bg-black/80 disabled:opacity-40 transition-colors flex items-center gap-2 cursor-pointer shadow-md"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                <span>Enviando Commit...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">cloud_upload</span>
                <span>Guardar Cambios en GitHub</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* Mensajes de Feedback */}
      {statusMsg.text && (
        <div
          className={`mb-6 p-4 rounded-xl border flex items-center justify-between font-['Inter'] text-sm ${
            statusMsg.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-700'
              : statusMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined">
              {statusMsg.type === 'error' ? 'error' : statusMsg.type === 'success' ? 'check_circle' : 'info'}
            </span>
            <span>{statusMsg.text}</span>
          </div>
          <button onClick={() => setStatusMsg({ type: '', text: '' })} className="hover:opacity-75">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="bg-white/40 backdrop-blur-md border border-black/10 rounded-xl p-12 text-center my-8">
          <span className="material-symbols-outlined text-4xl animate-spin text-black mb-2">sync</span>
          <p className="font-['JetBrains_Mono'] text-sm text-[#45464d]">Cargando packages.json desde GitHub...</p>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-8 mb-16">
          {/* Columna Izquierda: Formulario para Agregar Nuevo Paquete */}
          <div className="col-span-12 lg:col-span-6 bg-white/40 backdrop-blur-md border border-black/5 rounded-xl p-6 md:p-8 flex flex-col justify-between space-y-6">
            <h2 className="font-['Space_Grotesk'] text-xl font-bold text-black border-b border-black/10 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined">add_box</span>
              Registrar Nuevo Paquete
            </h2>

            <form onSubmit={handleAddPackage} className="space-y-4">
              {/* Nombre y Versión */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 sm:col-span-8">
                  <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-black font-bold mb-1">
                    Nombre del Paquete *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="ej: @caliuug/core-renderer"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-white/60 border border-black/10 focus:border-black rounded px-3 py-2 font-['Inter'] text-sm text-black outline-none transition-colors"
                  />
                </div>
                <div className="col-span-12 sm:col-span-4">
                  <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-black font-bold mb-1">
                    Versión *
                  </label>
                  <input
                    type="text"
                    name="version"
                    required
                    placeholder="v1.0.0"
                    value={formData.version}
                    onChange={handleInputChange}
                    className="w-full bg-white/60 border border-black/10 focus:border-black rounded px-3 py-2 font-['JetBrains_Mono'] text-sm text-black outline-none transition-colors"
                  />
                </div>
              </div>

              {/* URL Git */}
              <div>
                <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-black font-bold mb-1">
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
                  className="w-full bg-white/60 border border-black/10 focus:border-black rounded px-3 py-2 font-['JetBrains_Mono'] text-xs text-black outline-none transition-colors"
                />
              </div>

              {/* Categoría e Ícono */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 sm:col-span-8">
                  <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-black font-bold mb-1">
                    Categoría *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-white/60 border border-black/10 focus:border-black rounded px-3 py-2 font-['JetBrains_Mono'] text-xs text-black outline-none cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-12 sm:col-span-4">
                  <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-black font-bold mb-1">
                    Ícono
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="icon"
                      placeholder="extension"
                      value={formData.icon}
                      onChange={handleInputChange}
                      className="w-full bg-white/60 border border-black/10 focus:border-black rounded pl-3 pr-8 py-2 font-['JetBrains_Mono'] text-xs text-black outline-none"
                    />
                    <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-black text-base">
                      {formData.icon || 'extension'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Soporte Unity y Autor */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 sm:col-span-6">
                  <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-black font-bold mb-1">
                    Soporte Unity
                  </label>
                  <input
                    type="text"
                    name="unityVersion"
                    placeholder="2022.3 LTS+"
                    value={formData.unityVersion}
                    onChange={handleInputChange}
                    className="w-full bg-white/60 border border-black/10 focus:border-black rounded px-3 py-2 font-['JetBrains_Mono'] text-xs text-black outline-none"
                  />
                </div>
                <div className="col-span-12 sm:col-span-6">
                  <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-black font-bold mb-1">
                    Autor / Comunidad
                  </label>
                  <input
                    type="text"
                    name="author"
                    placeholder="Unity Users Group Cali"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full bg-white/60 border border-black/10 focus:border-black rounded px-3 py-2 font-['Inter'] text-xs text-black outline-none"
                  />
                </div>
              </div>

              {/* Resumen Corto */}
              <div>
                <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-black font-bold mb-1">
                  Resumen Corto *
                </label>
                <textarea
                  name="description"
                  required
                  rows="2"
                  placeholder="Descripción breve..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full bg-white/60 border border-black/10 focus:border-black rounded px-3 py-2 font-['Inter'] text-xs text-black outline-none resize-none"
                ></textarea>
              </div>

              {/* Tags y Readme */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12">
                  <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-black font-bold mb-1">
                    Etiquetas (separadas por coma)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    placeholder="URP, Shaders, PBR"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full bg-white/60 border border-black/10 focus:border-black rounded px-3 py-2 font-['JetBrains_Mono'] text-xs text-black outline-none"
                  />
                </div>
                <div className="col-span-12">
                  <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-black font-bold mb-1">
                    Documentación / Readme
                  </label>
                  <textarea
                    name="readme"
                    rows="2"
                    placeholder="Instrucciones o notas adicionales..."
                    value={formData.readme}
                    onChange={handleInputChange}
                    className="w-full bg-white/60 border border-black/10 focus:border-black rounded px-3 py-2 font-['Inter'] text-xs text-black outline-none resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Checkbox Oficial */}
              <div>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isOfficial"
                    checked={formData.isOfficial}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-black/20 text-black accent-black cursor-pointer"
                  />
                  <span className="font-['Inter'] text-xs text-black font-medium">
                    Paquete Oficial / Verificado
                  </span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-black text-white px-6 py-2.5 rounded font-['JetBrains_Mono'] text-xs uppercase tracking-widest hover:bg-black/80 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  <span>Agregar a la Lista Local</span>
                </button>
              </div>
            </form>
          </div>

          {/* Columna Derecha: Vista de Acordeón + Editor RAW */}
          <div className="col-span-12 lg:col-span-6 flex flex-col gap-6">
            {/* Control Toggle Acordeón vs Raw */}
            <div className="flex items-center justify-between bg-white/40 backdrop-blur-md border border-black/10 rounded-xl p-3">
              <span className="font-['JetBrains_Mono'] text-xs font-bold text-black uppercase tracking-wider pl-2">
                Paquetes en Lista ({fullJsonData.length})
              </span>
              <button
                type="button"
                onClick={() => setIsRawEditing(!isRawEditing)}
                className="bg-black/5 border border-black/10 px-3 py-1.5 rounded font-['JetBrains_Mono'] text-xs text-black hover:bg-black/10 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">
                  {isRawEditing ? 'view_list' : 'code'}
                </span>
                <span>{isRawEditing ? 'Ver Acordeón' : 'Editar Raw JSON'}</span>
              </button>
            </div>

            {/* Vista 1: Acordeón de Paquetes */}
            {!isRawEditing ? (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {fullJsonData.length === 0 ? (
                  <div className="bg-white/30 border border-dashed border-black/20 rounded-xl p-8 text-center text-[#45464d] font-['Inter'] text-sm">
                    No hay paquetes cargados. Agrega uno con el formulario.
                  </div>
                ) : (
                  fullJsonData.map((item) => {
                    const isOpen = openAccordionId === item.id;
                    return (
                      <div
                        key={item.id}
                        className="bg-white/60 border border-black/10 rounded-xl overflow-hidden transition-all"
                      >
                        {/* Cabecera del Acordeón */}
                        <div
                          onClick={() => setOpenAccordionId(isOpen ? null : item.id)}
                          className="p-4 flex items-center justify-between cursor-pointer hover:bg-black/5 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-black">
                              {item.icon || 'extension'}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-['Space_Grotesk'] font-bold text-sm text-black">
                                  {item.name}
                                </h4>
                                {item.isOfficial && (
                                  <span className="bg-black text-white font-['JetBrains_Mono'] text-[9px] uppercase px-1.5 py-0.5 rounded font-bold">
                                    Oficial
                                  </span>
                                )}
                              </div>
                              <p className="font-['JetBrains_Mono'] text-[11px] text-[#45464d]">
                                {item.category} • {item.version}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePackage(item.id);
                              }}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Eliminar del lista"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                            </button>
                            <span className="material-symbols-outlined text-black">
                              {isOpen ? 'expand_less' : 'expand_more'}
                            </span>
                          </div>
                        </div>

                        {/* Contenido Expandible */}
                        {isOpen && (
                          <div className="px-4 pb-4 pt-1 border-t border-black/5 font-['Inter'] text-xs text-[#45464d] space-y-2 bg-white/30">
                            <p><strong>Descripción:</strong> {item.description}</p>
                            <p><strong>Git URL:</strong> <code className="font-['JetBrains_Mono'] text-black">{item.gitUrl}</code></p>
                            <p><strong>Autor:</strong> {item.author || 'N/A'} | <strong>Unity:</strong> {item.unityVersion}</p>
                            {item.tags && item.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {item.tags.map((tag, idx) => (
                                  <span key={idx} className="bg-black/5 text-black font-['JetBrains_Mono'] text-[10px] px-2 py-0.5 rounded border border-black/10">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              /* Vista 2: Editor JSON RAW */
              <div className="bg-black rounded-xl p-4 font-['JetBrains_Mono']">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3 text-white/50 text-[10px] uppercase tracking-widest">
                  <span>Edición Directa JSON</span>
                  {jsonError ? (
                    <span className="text-red-400 font-bold">Sintaxis Inválida</span>
                  ) : (
                    <span className="text-emerald-400 font-bold">JSON Válido</span>
                  )}
                </div>
                <textarea
                  value={rawJsonText}
                  onChange={handleRawJsonChange}
                  rows={20}
                  className="w-full bg-transparent text-emerald-400 font-['JetBrains_Mono'] text-xs outline-none resize-none leading-relaxed"
                ></textarea>
                {jsonError && (
                  <div className="mt-2 text-xs text-red-400 border-t border-red-500/30 pt-2">
                    {jsonError}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}