import React, { useRef, useEffect, useState } from 'react';
import { useHeader } from '../context/HeaderContext';
import { useAuth } from '../context/AuthContext';

export default function Header({ setActiveTab, toggleSidebar, isSidebarOpen }) {
  const {
    showLogo,
    showSearch,
    searchQuery,
    setSearchQuery,
    activeCategory,
  } = useHeader();

  const { isLoggedIn } = useAuth();
  const inputRef = useRef(null);
  
  // Estado para controlar la barra expandida en móviles
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Detectar el sistema operativo para el indicador de teclado
  const isMac = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  // Listener para el atajo de teclado (Ctrl+K / Cmd+K y ESC)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Atajo Ctrl+K / Cmd+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (showSearch) {
          // Si estamos en pantallas pequeñas, abrir el layout móvil primero
          if (window.innerWidth < 768) {
            setIsMobileSearchOpen(true);
          }
          
          // Enfocar inmediatamente el input en cualquier resolución a la primera
          requestAnimationFrame(() => {
            inputRef.current?.focus();
            inputRef.current?.select();
          });
        }
      }

      // Cerrar o desfocar con tecla Escape
      if (e.key === 'Escape') {
        setIsMobileSearchOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSearch]);

  // Asegurar foco automático al abrir buscador móvil por click en lupa
  useEffect(() => {
    if (isMobileSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  const categories = ['Engine', 'Events', 'Projects', 'Packages', 'Community'];

  return (
    <nav className="bg-[#fcf8fa]/85 backdrop-blur-xl fixed top-0 w-full z-40 border-b border-black/10 select-none h-14 flex items-center">
      <div className="flex justify-between items-center px-4 md:px-8 py-2.5 max-w-[1300px] mx-auto w-full gap-2 sm:gap-6">

        {/* MÓVIL: VISTA DE BÚSQUEDA COMPACTA EN HEADER */}
        {showSearch && isMobileSearchOpen ? (
          <div className="flex md:hidden items-center w-full gap-2 animate-in fade-in duration-150">
            <div className="relative flex-1 group">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40 group-focus-within:text-black text-xl pointer-events-none">
                search
              </span>
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar..."
                className="w-full pl-10 pr-9 py-1.5 bg-white text-sm font-['Inter'] text-black rounded-full border border-black/20 focus:border-black outline-none shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-black/40 hover:text-black rounded-full"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>
            <button
              onClick={() => {
                setIsMobileSearchOpen(false);
                setSearchQuery('');
              }}
              className="text-xs font-medium text-black/70 hover:text-black px-2 py-1.5 rounded-lg hover:bg-black/5 shrink-0"
            >
              Cancelar
            </button>
          </div>
        ) : (
          /* VISTA ESTÁNDAR (ESCRITORIO + MÓVIL NORMAL) */
          <>
            {/* LADO IZQUIERDO: Logo */}
            <div className="flex items-center shrink-0">
              {showLogo && (
                <div onClick={() => setActiveTab('main')} className="cursor-pointer select-none">
                  <div className="font-['Space_Grotesk'] text-xl sm:text-2xl tracking-tighter text-black font-bold whitespace-nowrap">
                    UUG Cali
                  </div>
                </div>
              )}
            </div>

            {/* CENTRO: Buscador (Escritorio) / Menú Informativo Estático */}
            <div className="flex-1 max-w-2xl mx-auto flex items-center justify-center">
              {showSearch ? (
                <div className="hidden md:block relative w-full group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-black/40 group-focus-within:text-black text-xl pointer-events-none transition-colors duration-200">
                    search
                  </span>
                  
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar proyectos, temas, usuarios..."
                    className="w-full pl-11 pr-20 py-2 bg-black/[0.04] hover:bg-black/[0.07] focus:bg-white text-sm font-['Inter'] text-black rounded-full border border-black/10 focus:border-black/30 outline-none transition-all duration-300 ease-out focus:scale-[1.01] focus:shadow-[0_8px_30px_rgba(0,0,0,0.12)] focus:ring-4 focus:ring-black/5"
                  />

                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {searchQuery ? (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="p-1 text-black/40 hover:text-black rounded-full hover:bg-black/5 transition-colors flex items-center justify-center"
                        aria-label="Limpiar búsqueda"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    ) : (
                      <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-medium text-black/40 bg-black/5 border border-black/10 rounded-md select-none">
                        {isMac ? '⌘K' : 'Ctrl+K'}
                      </kbd>
                    )}
                  </div>
                </div>
              ) : (
                /* MENÚ INFORMATIVO ESTÁTICO (Escritorio) */
                <div className="hidden md:flex items-center space-x-6 font-['Inter'] text-sm select-none">
                  {categories.map((category) => {
                    const isActive = activeCategory === category;
                    return (
                      <span
                        key={category}
                        className={`py-1 px-2 rounded-md transition-colors ${
                          isActive
                            ? 'text-black font-bold border-b-2 border-black'
                            : 'text-[#45464d] font-medium'
                        }`}
                      >
                        {category}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* LADO DERECHO: Íconos y Navegación */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0 text-black">
              {showSearch && (
                <button
                  onClick={() => setIsMobileSearchOpen(true)}
                  className="md:hidden p-2 hover:bg-black/5 rounded-full transition-colors flex items-center justify-center text-black/80 hover:text-black"
                  aria-label="Abrir buscador"
                >
                  <span className="material-symbols-outlined text-2xl">search</span>
                </button>
              )}

              {isLoggedIn && (
                <button
                  onClick={() => setActiveTab('profile')}
                  className="p-1.5 hover:bg-black/5 rounded-full transition-colors flex items-center"
                  aria-label="Ir al Perfil"
                >
                  <span className="material-symbols-outlined text-2xl">account_circle</span>
                </button>
              )}

              <button
                onClick={toggleSidebar}
                className="md:hidden p-1.5 hover:bg-black/5 rounded-full transition-colors flex items-center justify-center"
                aria-label="Abrir Menú Lateral"
              >
                <span className="material-symbols-outlined text-2xl">
                  {isSidebarOpen ? 'close' : 'menu'}
                </span>
              </button>
            </div>
          </>
        )}

      </div>
    </nav>
  );
}