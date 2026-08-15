import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchJsonFromGithub, applyJsonCrudOperation } from '../helpers/githubService';

const REPO_OWNER = 'museortizmedia';
const REPO_NAME = 'UnityUsersGroupCaliPortal';
const FILE_PATH = 'UUGCaliPortal/public/events.json';

const EMPTY_EVENT_FORM = {
  id: '',
  title: '',
  date: '',
  time: '',
  location: '',
  description: '',
  rsvpUrl: '',
  buttonText: 'Confirmar Asistencia',
  featured: false
};

export default function EventUploadPage() {
  const { githubToken } = useAuth();

  // Estados de datos de GitHub
  const [fullJsonData, setFullJsonData] = useState([]);
  const [rawJsonText, setRawJsonText] = useState('[]');
  const [isRawEditing, setIsRawEditing] = useState(false);
  const [jsonError, setJsonError] = useState('');
  const [openAccordionId, setOpenAccordionId] = useState(null);

  // Estado del formulario (Creación / Edición)
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_EVENT_FORM);

  // Estados de interfaz
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // 1. Cargar eventos desde GitHub al montar
  useEffect(() => {
    const loadEvents = async () => {
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
        setJsonError('No se pudo obtener el archivo events.json desde GitHub.');
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, [githubToken]);

  // Manejar cambios en campos del formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Cargar evento para edición
  const handleEditEvent = (item) => {
    setEditingId(item.id);

    setFormData({
      id: item.id || '',
      title: item.title || '',
      date: item.date || '',
      time: item.time || '',
      location: item.location || '',
      description: item.description || '',
      rsvpUrl: item.rsvpUrl || '',
      buttonText: item.buttonText || 'Confirmar Asistencia',
      featured: item.featured || false
    });
    setStatusMsg({ type: 'info', text: `Editando el evento: ${item.title}` });
  };

  // Cancelar Edición
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(EMPTY_EVENT_FORM);
    setStatusMsg({ type: '', text: '' });
  };

  // Guardar (Crear o Actualizar) en estado local
  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date) return;

    const eventSlug = formData.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newId = editingId || (formData.id.trim() ? formData.id.trim() : `event-${eventSlug || Date.now()}`);

    const eventPayload = {
      id: newId,
      title: formData.title,
      date: formData.date,
      time: formData.time || '',
      location: formData.location || '',
      description: formData.description || '',
      rsvpUrl: formData.rsvpUrl || '',
      buttonText: formData.buttonText || 'Confirmar Asistencia',
      featured: formData.featured
    };

    let updatedList;
    if (editingId) {
      updatedList = fullJsonData.map((item) => (item.id === editingId ? eventPayload : item));
      setStatusMsg({ type: 'info', text: 'Evento actualizado localmente. Recuerda hacer commit.' });
    } else {
      updatedList = [eventPayload, ...fullJsonData];
      setStatusMsg({ type: 'info', text: 'Evento agregado a la lista local. Haz clic en "Guardar Cambios" para subir a GitHub.' });
    }

    setFullJsonData(updatedList);
    setRawJsonText(JSON.stringify(updatedList, null, 2));
    setOpenAccordionId(newId);
    handleCancelEdit();
  };

  // Editor JSON Crudo
  const handleRawJsonChange = (e) => {
    const val = e.target.value;
    setRawJsonText(val);

    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        setFullJsonData(parsed);
        setJsonError('');
      } else {
        setJsonError('El JSON debe ser un Arreglo [] de eventos.');
      }
    } catch (err) {
      setJsonError('Error de sintaxis JSON: ' + err.message);
    }
  };

  // Eliminar evento
  const handleDeleteEvent = (id) => {
    const updatedList = fullJsonData.filter((item) => item.id !== id);
    setFullJsonData(updatedList);
    setRawJsonText(JSON.stringify(updatedList, null, 2));
    if (editingId === id) handleCancelEdit();
  };

  // Commit a GitHub
  const handleExecuteCommit = async () => {
    setIsSubmitting(true);
    setStatusMsg({ type: '', text: '' });

    if (!githubToken) {
      setStatusMsg({
        type: 'error',
        text: 'Se requiere iniciar sesión con GitHub Token.'
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
        commitMessage: `crud(events): sync events.json (${fullJsonData.length} items)`
      });

      setStatusMsg({ type: 'success', text: '¡Eventos guardados exitosamente en public/events.json!' });
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
              Public Feed Manager
            </span>
          </div>
          <h1 className="font-['Space_Grotesk'] text-4xl md:text-5xl font-bold text-black tracking-tight">
            Gestión de Eventos
          </h1>
          <p className="font-['Inter'] text-lg text-[#45464d] max-w-2xl mt-2">
            Administra los eventos de la comunidad servidos desde el directorio público (<code className="font-['JetBrains_Mono'] text-black font-semibold">public/events.json</code>).
          </p>
        </div>

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
                <span>Publicar Cambios</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* Alertas */}
      {statusMsg.text && (
        <div
          className={`mb-6 p-4 rounded-xl border flex items-center justify-between font-['Inter'] text-sm ${statusMsg.type === 'error'
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
          <p className="font-['JetBrains_Mono'] text-sm text-[#45464d]">Cargando eventos desde GitHub...</p>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-8 mb-16">
          {/* Formulario Fijo (Creación/Edición) - Columna Izquierda */}
          <div className="col-span-12 lg:col-span-6 bg-white/40 backdrop-blur-md border border-black/5 rounded-xl p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <h2 className="font-['Space_Grotesk'] text-xl font-bold text-black flex items-center gap-2">
                <span className="material-symbols-outlined">{editingId ? 'edit_calendar' : 'event_available'}</span>
                {editingId ? 'Editar Evento' : 'Registrar Nuevo Evento'}
              </h2>
              {editingId && (
                <button
                  onClick={handleCancelEdit}
                  className="font-['JetBrains_Mono'] text-xs text-black/60 hover:text-black underline cursor-pointer"
                >
                  Cancelar Edición
                </button>
              )}
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 sm:col-span-8">
                  <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-black font-bold mb-1">
                    Título del Evento *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="ej: Meetup Unity Cali 2026"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full bg-white/60 border border-black/10 focus:border-black rounded px-3 py-2 font-['Inter'] text-sm text-black outline-none"
                  />
                </div>
                <div className="col-span-12 sm:col-span-4">
                  <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-black font-bold mb-1">
                    ID
                  </label>
                  <input
                    type="text"
                    name="id"
                    placeholder="Auto-generado"
                    value={formData.id}
                    onChange={handleInputChange}
                    disabled={!!editingId}
                    className="w-full bg-white/60 border border-black/10 focus:border-black rounded px-3 py-2 font-['JetBrains_Mono'] text-xs text-black outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 sm:col-span-6">
                  <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-black font-bold mb-1">
                    Fecha (ej: 15 AGO) *
                  </label>
                  <input
                    type="text"
                    name="date"
                    required
                    placeholder="15 AGO"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full bg-white/60 border border-black/10 focus:border-black rounded px-3 py-2 font-['JetBrains_Mono'] text-xs text-black outline-none"
                  />
                </div>
                <div className="col-span-12 sm:col-span-6">
                  <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-black font-bold mb-1">
                    Hora
                  </label>
                  <input
                    type="text"
                    name="time"
                    placeholder="6:30 PM - 8:30 PM"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full bg-white/60 border border-black/10 focus:border-black rounded px-3 py-2 font-['JetBrains_Mono'] text-xs text-black outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-black font-bold mb-1">
                  Ubicación / Plataforma
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="Auditorio Principal / Discord / Zoom"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full bg-white/60 border border-black/10 focus:border-black rounded px-3 py-2 font-['Inter'] text-xs text-black outline-none"
                />
              </div>

              <div>
                <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-black font-bold mb-1">
                  Descripción
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Detalles del evento, agenda o ponentes..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full bg-white/60 border border-black/10 focus:border-black rounded p-3 font-['Inter'] text-sm text-black outline-none resize-y leading-relaxed"
                ></textarea>
              </div>

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 sm:col-span-7">
                  <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-black font-bold mb-1">
                    URL de Registro / RSVP
                  </label>
                  <input
                    type="url"
                    name="rsvpUrl"
                    placeholder="https://meetup.com/..."
                    value={formData.rsvpUrl}
                    onChange={handleInputChange}
                    className="w-full bg-white/60 border border-black/10 focus:border-black rounded px-3 py-2 font-['JetBrains_Mono'] text-xs text-black outline-none"
                  />
                </div>
                <div className="col-span-12 sm:col-span-5">
                  <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-black font-bold mb-1">
                    Texto del Botón
                  </label>
                  <input
                    type="text"
                    name="buttonText"
                    placeholder="Confirmar Asistencia"
                    value={formData.buttonText}
                    onChange={handleInputChange}
                    className="w-full bg-white/60 border border-black/10 focus:border-black rounded px-3 py-2 font-['Inter'] text-xs text-black outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-black/20 text-black accent-black cursor-pointer"
                  />
                  <span className="font-['Inter'] text-xs text-black font-medium">
                    Marcar como Evento Destacado
                  </span>
                </label>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-black text-white px-6 py-2.5 rounded font-['JetBrains_Mono'] text-xs uppercase tracking-widest hover:bg-black/80 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">{editingId ? 'save' : 'add'}</span>
                  <span>{editingId ? 'Actualizar en Lista Local' : 'Agregar a la Lista Local'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Columna Derecha: Acordeón + Editor RAW */}
          <div className="col-span-12 lg:col-span-6 flex flex-col gap-6">
            <div className="flex items-center justify-between bg-white/40 backdrop-blur-md border border-black/10 rounded-xl p-3">
              <span className="font-['JetBrains_Mono'] text-xs font-bold text-black uppercase tracking-wider pl-2">
                Eventos Programados ({fullJsonData.length})
              </span>
              <button
                type="button"
                onClick={() => setIsRawEditing(!isRawEditing)}
                className="bg-black/5 border border-black/10 px-3 py-1.5 rounded font-['JetBrains_Mono'] text-xs text-black hover:bg-black/10 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">
                  {isRawEditing ? 'view_list' : 'code'}
                </span>
                <span>{isRawEditing ? 'Ver Lista' : 'Editar Raw JSON'}</span>
              </button>
            </div>

            {!isRawEditing ? (
              <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
                {fullJsonData.length === 0 ? (
                  <div className="bg-white/30 border border-dashed border-black/20 rounded-xl p-8 text-center text-[#45464d] font-['Inter'] text-sm">
                    No hay eventos registrados.
                  </div>
                ) : (
                  fullJsonData.map((item) => {
                    const isOpen = openAccordionId === item.id;
                    const isBeingEdited = editingId === item.id;

                    return (
                      <div
                        key={item.id}
                        className={`bg-white/60 border rounded-xl overflow-hidden transition-all ${isBeingEdited ? 'border-black ring-1 ring-black' : 'border-black/10'
                          }`}
                      >
                        {/* Cabecera del Acordeón */}
                        <div
                          onClick={() => setOpenAccordionId(isOpen ? null : item.id)}
                          className="p-4 flex items-center justify-between cursor-pointer hover:bg-black/5 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-black/5 border border-black/10 rounded px-2.5 py-1 text-center min-w-[50px]">
                              <span className="block font-['JetBrains_Mono'] text-xs font-bold text-black uppercase">
                                {item.date || '---'}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-['Space_Grotesk'] font-bold text-sm text-black">
                                  {item.title || 'Evento Sin Título'}
                                </h4>
                                {item.featured && (
                                  <span className="bg-black text-white font-['JetBrains_Mono'] text-[9px] uppercase px-1.5 py-0.5 rounded font-bold">
                                    Destacado
                                  </span>
                                )}
                              </div>
                              <p className="font-['JetBrains_Mono'] text-[11px] text-[#45464d]">
                                {item.location || 'Sin ubicación'} {item.time ? `• ${item.time}` : ''}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditEvent(item);
                              }}
                              className="p-1.5 text-black/70 hover:bg-black/10 rounded transition-colors"
                              title="Editar evento"
                            >
                              <span className="material-symbols-outlined text-base">edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteEvent(item.id);
                              }}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Eliminar evento"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                            </button>

                            <span className="material-symbols-outlined text-black ml-1">
                              {isOpen ? 'expand_less' : 'expand_more'}
                            </span>
                          </div>
                        </div>

                        {/* Contenido Expandible del Acordeón */}
                        {isOpen && (
                          <div className="px-4 pb-4 pt-2 border-t border-black/5 font-['Inter'] text-xs text-[#45464d] space-y-2 bg-white/30">
                            {item.description && <p className="leading-relaxed"><strong>Descripción:</strong> {item.description}</p>}
                            {item.rsvpUrl && (
                              <p><strong>Enlace RSVP:</strong> <a href={item.rsvpUrl} target="_blank" rel="noopener noreferrer" className="font-['JetBrains_Mono'] text-black underline">{item.rsvpUrl}</a></p>
                            )}
                            <p><strong>Botón:</strong> {item.buttonText || 'Confirmar Asistencia'}</p>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              /* Editor Raw JSON */
              <div className="bg-black rounded-xl p-4 font-['JetBrains_Mono']">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3 text-white/50 text-[10px] uppercase tracking-widest">
                  <span>Edición Directa JSON (public/events.json)</span>
                  {jsonError ? (
                    <span className="text-red-400 font-bold">Sintaxis Inválida</span>
                  ) : (
                    <span className="text-emerald-400 font-bold">JSON Válido</span>
                  )}
                </div>
                <textarea
                  value={rawJsonText}
                  onChange={handleRawJsonChange}
                  rows={22}
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