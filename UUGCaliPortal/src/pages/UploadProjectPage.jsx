import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchJsonFromGithub, applyJsonCrudOperation } from '../helpers/githubService';

const REPO_OWNER = 'museortizmedia';
const REPO_NAME = 'UnityUsersGroupCaliPortal';
const FILE_PATH = 'UUGCaliPortal/src/data/projects.json';

// --- COMPONENTE REUTILIZABLE: TAG INPUT ---
function TagInput({ tags = [], onChange, placeholder = 'Escribe y presiona Enter o coma...' }) {
  const [inputValue, setInputValue] = useState('');

  const addTag = (value) => {
    const trimmed = value.trim().replace(/^,+|,+$/g, '');
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const newTags = pastedData
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t && !tags.includes(t));

    if (newTags.length > 0) {
      onChange([...tags, ...newTags]);
    }
  };

  const removeTag = (indexToRemove) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-1.5 p-2 bg-white border border-black/10 focus-within:border-black rounded transition-colors min-h-[38px]">
        {tags.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="inline-flex items-center gap-1 bg-black text-white px-2 py-0.5 rounded font-['JetBrains_Mono'] text-[11px] font-medium"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="hover:bg-white/20 rounded p-0.5 transition-colors cursor-pointer flex items-center justify-center border-none bg-transparent text-white"
            >
              <span className="material-symbols-outlined text-[12px]">close</span>
            </button>
          </span>
        ))}

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={() => inputValue && addTag(inputValue)}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 bg-transparent border-none outline-none font-['JetBrains_Mono'] text-xs text-black min-w-[100px] py-0.5"
        />
      </div>
      <p className="font-['JetBrains_Mono'] text-[9px] text-[#45464d] mt-1">
        Presiona <kbd className="bg-black/5 px-1 rounded font-bold">Enter</kbd> o <kbd className="bg-black/5 px-1 rounded font-bold">,</kbd> para agregar.
      </p>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL ---
export default function UploadProjectPage() {
  const { githubToken } = useAuth();

  const [fullJsonData, setFullJsonData] = useState([]);
  const [rawJsonText, setRawJsonText] = useState('[]');
  const [isRawEditing, setIsRawEditing] = useState(false);
  const [jsonError, setJsonError] = useState('');
  const [openAccordionId, setOpenAccordionId] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // Cargar datos iniciales
  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);

      try {
        const { data } = await fetchJsonFromGithub({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          path: FILE_PATH,
          token: githubToken,
        });

        const list = Array.isArray(data) ? data : [];
        setFullJsonData(list);
        setRawJsonText(JSON.stringify(list, null, 2));
        if (list.length > 0) setOpenAccordionId(list[0].id);
      } catch (err) {
        setJsonError('No se pudo obtener el archivo projects.json desde GitHub.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [githubToken]);

  const handleItemChange = (index, updatedItem) => {
    const updatedList = [...fullJsonData];
    updatedList[index] = updatedItem;
    setFullJsonData(updatedList);
    setRawJsonText(JSON.stringify(updatedList, null, 2));
  };

  const handleAddNewProject = () => {
    const newId = `proj-${Date.now()}`;
    const newProject = {
      id: newId,
      title: 'Nuevo Proyecto',
      author: 'CaliUUG Team',
      category: 'General',
      description: '',
      status: 'Prototipo',
      version: 'v1.0.0',
      license: 'MIT',
      tags: [],
      technologies: [],
      coverImage: '',
      downloadUrl: '',
      githubUrl: '',
      badge: '',
      featured: false,
    };

    const updatedList = [...fullJsonData, newProject];
    setFullJsonData(updatedList);
    setRawJsonText(JSON.stringify(updatedList, null, 2));
    setOpenAccordionId(newId);
  };

  const handleDeleteProject = (indexToDelete) => {
    const updatedList = fullJsonData.filter((_, idx) => idx !== indexToDelete);
    setFullJsonData(updatedList);
    setRawJsonText(JSON.stringify(updatedList, null, 2));
  };

  const handleRawJsonChange = (e) => {
    const text = e.target.value;
    setRawJsonText(text);
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        setFullJsonData(parsed);
        setJsonError('');
      } else {
        setJsonError('El JSON debe ser un arreglo de objetos [ ... ]');
      }
    } catch (err) {
      setJsonError('Sintaxis de JSON inválida');
    }
  };

  const handleExecuteCommit = async () => {
    setIsSubmitting(true);
    setStatusMsg({ type: '', text: '' });

    if (!githubToken) {
      setStatusMsg({
        type: 'error',
        text: 'Se requiere iniciar sesión con GitHub Token desde la página de Login.',
      });
      setIsSubmitting(false);
      return;
    }

    if (jsonError) {
      setStatusMsg({
        type: 'error',
        text: 'Corrige el error de sintaxis en el JSON antes de hacer commit.',
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
        commitMessage: `crud(projects): sync projects.json (${fullJsonData.length} items)`,
      });

      setStatusMsg({ type: 'success', text: '¡Commit enviado exitosamente a projects.json!' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-black/10 pb-4">
        <div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-black">CRUD Proyectos</h1>
          <p className="font-['JetBrains_Mono'] text-xs text-[#45464d]">
            Gestiona proyectos mediante formularios independientes en acordeón o editor directo.
          </p>
        </div>
        <button
          onClick={handleAddNewProject}
          className="px-4 py-2 bg-black text-white rounded font-['JetBrains_Mono'] text-xs uppercase font-bold hover:bg-neutral-800 cursor-pointer"
        >
          + Nuevo Proyecto
        </button>
      </div>

      {statusMsg.text && (
        <div
          className={`p-4 rounded font-['JetBrains_Mono'] text-xs ${
            statusMsg.type === 'error'
              ? 'bg-red-100 text-red-800 border border-red-300'
              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      {/* Grid de 2 Columnas */}
      <div className="grid grid-cols-12 gap-6">
        {/* Columna Izquierda: Lista de Acordeones */}
        <div className="col-span-12 lg:col-span-7 space-y-3">
          <div className="flex justify-between items-center px-1">
            <span className="font-['JetBrains_Mono'] text-xs uppercase font-bold text-black">
              Proyectos Registrados ({fullJsonData.length})
            </span>
            {isLoading && (
              <span className="font-['JetBrains_Mono'] text-xs text-amber-600 animate-pulse">
                Cargando...
              </span>
            )}
          </div>

          {fullJsonData.map((project, index) => {
            const isOpen = openAccordionId === (project.id || index);
            return (
              <ProjectAccordionItem
                key={project.id || index}
                project={project}
                index={index}
                isOpen={isOpen}
                onToggle={() => setOpenAccordionId(isOpen ? null : project.id || index)}
                onChange={(updated) => handleItemChange(index, updated)}
                onDelete={() => handleDeleteProject(index)}
              />
            );
          })}

          <button
            onClick={handleAddNewProject}
            className="w-full py-3 border-2 border-dashed border-black/20 text-black/60 rounded-xl font-['JetBrains_Mono'] text-xs font-bold uppercase hover:border-black hover:text-black transition-all cursor-pointer"
          >
            + Agregar Otro Proyecto
          </button>
        </div>

        {/* Columna Derecha: Panel Negro Texto Libre */}
        <div className="col-span-12 lg:col-span-5 bg-neutral-900 text-white rounded-xl p-6 font-['JetBrains_Mono'] flex flex-col justify-between shadow-xl h-fit sticky top-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs text-white/50 border-b border-white/10 pb-2">
              <span className="flex items-center gap-2">
                <span>Inspect & Commit</span>
                <button
                  onClick={() => setIsRawEditing(!isRawEditing)}
                  className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold cursor-pointer ${
                    isRawEditing ? 'bg-amber-500 text-black' : 'bg-white/10 text-white'
                  }`}
                >
                  {isRawEditing ? 'Bloquear Editor' : 'Modo Texto Libre'}
                </button>
              </span>
              <span className="text-emerald-400 font-bold">projects.json</span>
            </div>

            {jsonError && (
              <div className="text-[11px] text-red-400 bg-red-950/50 p-2 border border-red-500/30 rounded">
                ⚠️ {jsonError}
              </div>
            )}

            <textarea
              readOnly={!isRawEditing}
              value={rawJsonText}
              onChange={handleRawJsonChange}
              className={`w-full h-[500px] p-3 rounded text-xs font-['JetBrains_Mono'] leading-relaxed bg-black/60 outline-none resize-none scrollbar-thin ${
                isRawEditing
                  ? 'text-amber-300 border border-amber-500/50 focus:border-amber-400'
                  : 'text-emerald-400 border border-white/10'
              }`}
            />
          </div>

          <button
            onClick={handleExecuteCommit}
            disabled={isSubmitting || !!jsonError}
            className="w-full py-3 mt-4 bg-white text-black font-['JetBrains_Mono'] text-xs font-bold uppercase rounded hover:bg-neutral-200 disabled:opacity-30 cursor-pointer flex justify-center items-center gap-2"
          >
            {isSubmitting ? <span>GUARDANDO COMMIT...</span> : <span>SUBIR COMMIT A GITHUB</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- ITEM DEL ACORDEÓN ---
function ProjectAccordionItem({ project, index, isOpen, onToggle, onChange, onDelete }) {
  const [localData, setLocalData] = useState({
    ...project,
    tags: Array.isArray(project.tags) ? project.tags : [],
    technologies: Array.isArray(project.technologies) ? project.technologies : [],
  });

  useEffect(() => {
    setLocalData({
      ...project,
      tags: Array.isArray(project.tags) ? project.tags : [],
      technologies: Array.isArray(project.technologies) ? project.technologies : [],
    });
  }, [project]);

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    const updated = { ...localData, [name]: val };
    setLocalData(updated);
    onChange(updated);
  };

  const handleArrayChange = (field, newArray) => {
    const updated = { ...localData, [field]: newArray };
    setLocalData(updated);
    onChange(updated);
  };

  return (
    <div className="border border-black/10 bg-white rounded-xl overflow-hidden shadow-sm transition-all">
      {/* Header Acordeón */}
      <div
        onClick={onToggle}
        className="p-4 bg-neutral-50 hover:bg-neutral-100 flex justify-between items-center cursor-pointer select-none border-b border-black/5"
      >
        <div className="flex items-center gap-3 overflow-hidden pr-2">
          <span className="font-['JetBrains_Mono'] text-xs font-bold bg-black text-white px-2 py-0.5 rounded">
            #{index}
          </span>
          <span className="font-['Space_Grotesk'] text-sm font-bold text-black truncate">
            {localData.title || 'Proyecto Sin Título'}
          </span>
          <span className="font-['JetBrains_Mono'] text-[10px] text-neutral-500 truncate hidden sm:inline">
            ({localData.id})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="px-2 py-1 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded text-xs font-['JetBrains_Mono'] font-bold transition-colors cursor-pointer border-none"
            title="Eliminar Proyecto"
          >
            Eliminar
          </button>
          <span className="text-black/40 font-bold text-xs pl-2">{isOpen ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* Cuerpo Acordeón */}
      {isOpen && (
        <div className="p-5 space-y-4 bg-white">
          {/* Identificación */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-['JetBrains_Mono'] uppercase font-bold mb-1">
                ID Único
              </label>
              <input
                type="text"
                name="id"
                value={localData.id || ''}
                onChange={handleFieldChange}
                className="w-full border p-2 text-xs rounded font-['JetBrains_Mono']"
              />
            </div>
            <div>
              <label className="block text-[10px] font-['JetBrains_Mono'] uppercase font-bold mb-1">
                Título *
              </label>
              <input
                type="text"
                name="title"
                value={localData.title || ''}
                onChange={handleFieldChange}
                required
                className="w-full border p-2 text-xs rounded font-['Inter']"
              />
            </div>
          </div>

          {/* Autoría y Categoría */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-['JetBrains_Mono'] uppercase font-bold mb-1">
                Autor
              </label>
              <input
                type="text"
                name="author"
                value={localData.author || ''}
                onChange={handleFieldChange}
                className="w-full border p-2 text-xs rounded font-['Inter']"
              />
            </div>
            <div>
              <label className="block text-[10px] font-['JetBrains_Mono'] uppercase font-bold mb-1">
                Categoría
              </label>
              <input
                type="text"
                name="category"
                value={localData.category || ''}
                onChange={handleFieldChange}
                className="w-full border p-2 text-xs rounded font-['Inter']"
              />
            </div>
          </div>

          {/* Estado, Versión y Licencia */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-['JetBrains_Mono'] uppercase font-bold mb-1">
                Estado
              </label>
              <select
                name="status"
                value={localData.status || 'Prototipo'}
                onChange={handleFieldChange}
                className="w-full border p-2 text-xs rounded font-['Inter']"
              >
                <option value="Prototipo">Prototipo</option>
                <option value="En Desarrollo">En Desarrollo</option>
                <option value="Lanzado">Lanzado</option>
                <option value="Archivado">Archivado</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-['JetBrains_Mono'] uppercase font-bold mb-1">
                Versión
              </label>
              <input
                type="text"
                name="version"
                value={localData.version || ''}
                onChange={handleFieldChange}
                placeholder="v1.0.0"
                className="w-full border p-2 text-xs rounded font-['JetBrains_Mono']"
              />
            </div>

            <div>
              <label className="block text-[10px] font-['JetBrains_Mono'] uppercase font-bold mb-1">
                Licencia
              </label>
              <select
                name="license"
                value={localData.license || 'MIT'}
                onChange={handleFieldChange}
                className="w-full border p-2 text-xs rounded font-['Inter']"
              >
                <option value="MIT">MIT License</option>
                <option value="Apache-2.0">Apache 2.0</option>
                <option value="GPL-3.0">GPL v3.0</option>
                <option value="CC-BY-4.0">CC BY 4.0</option>
                <option value="Propietaria">Propietaria / Reservado</option>
              </select>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-[10px] font-['JetBrains_Mono'] uppercase font-bold mb-1">
              Descripción
            </label>
            <textarea
              name="description"
              rows="2"
              value={localData.description || ''}
              onChange={handleFieldChange}
              className="w-full border p-2 text-xs rounded font-['Inter']"
              rows={6}
            />
          </div>

          {/* Tags y Tecnologías */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-['JetBrains_Mono'] uppercase font-bold mb-1">
                Tags / Etiquetas
              </label>
              <TagInput
                tags={localData.tags}
                onChange={(newTags) => handleArrayChange('tags', newTags)}
                placeholder="Ej: Sci-Fi, Unity, Low-Poly..."
              />
            </div>
            <div>
              <label className="block text-[10px] font-['JetBrains_Mono'] uppercase font-bold mb-1">
                Tecnologías / Stack
              </label>
              <TagInput
                tags={localData.technologies}
                onChange={(newTechs) => handleArrayChange('technologies', newTechs)}
                placeholder="Ej: C#, Shader Graph, HLSL..."
              />
            </div>
          </div>

          {/* Imágenes y Badges */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-['JetBrains_Mono'] uppercase font-bold mb-1">
                URL Cover Image
              </label>
              <input
                type="text"
                name="coverImage"
                value={localData.coverImage || ''}
                onChange={handleFieldChange}
                className="w-full border p-2 text-xs rounded font-['JetBrains_Mono']"
              />
            </div>
            <div>
              <label className="block text-[10px] font-['JetBrains_Mono'] uppercase font-bold mb-1">
                Badge (Opcional)
              </label>
              <input
                type="text"
                name="badge"
                value={localData.badge || ''}
                onChange={handleFieldChange}
                className="w-full border p-2 text-xs rounded font-['Inter']"
              />
            </div>
          </div>

          {/* Enlaces externos */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-['JetBrains_Mono'] uppercase font-bold mb-1">
                URL Descarga / Demo
              </label>
              <input
                type="text"
                name="downloadUrl"
                value={localData.downloadUrl || ''}
                onChange={handleFieldChange}
                className="w-full border p-2 text-xs rounded font-['JetBrains_Mono']"
              />
            </div>

            <div>
              <label className="block text-[10px] font-['JetBrains_Mono'] uppercase font-bold mb-1">
                URL Repo GitHub
              </label>
              <input
                type="text"
                name="githubUrl"
                value={localData.githubUrl || ''}
                onChange={handleFieldChange}
                className="w-full border p-2 text-xs rounded font-['JetBrains_Mono']"
              />
            </div>
          </div>

          {/* Checkbox Destacado */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id={`featured-${index}`}
              name="featured"
              checked={localData.featured || false}
              onChange={handleFieldChange}
              className="rounded cursor-pointer"
            />
            <label
              htmlFor={`featured-${index}`}
              className="text-xs font-['JetBrains_Mono'] font-bold cursor-pointer"
            >
              Proyecto Destacado
            </label>
          </div>
        </div>
      )}
    </div>
  );
}