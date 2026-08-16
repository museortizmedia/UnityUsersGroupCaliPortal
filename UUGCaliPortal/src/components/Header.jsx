import React from 'react';
import { useHeader } from '../context/HeaderContext';
import { useAuth } from '../context/AuthContext';

export default function Header({ setActiveTab, toggleSidebar, isSidebarOpen }) {
  const {
    showLogo,
    showSearch,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
  } = useHeader();

  const { isLoggedIn } = useAuth();

  const categories = ['Engine', 'Projects', 'Forum', 'Community'];

  return (
    <nav className="bg-[#fcf8fa]/80 backdrop-blur-xl fixed top-0 w-full z-40 border-b border-black/10">
      <div className="flex justify-between items-center px-4 md:px-12 py-3 max-w-[1400px] mx-auto w-full gap-2 sm:gap-4">

        {/* LADO IZQUIERDO: Perfil (Móvil) + Logo */}
        <div className="flex items-center gap-2">

          {/* Logo */}
          {showLogo ? (
            <div className="min-w-[120px] sm:min-w-[160px]" onClick={() => setActiveTab('main')}>
              <div className="font-['Space_Grotesk'] text-xl sm:text-2xl tracking-tighter text-black font-bold whitespace-nowrap cursor-pointer">
                UUG Cali
              </div>
            </div>
          ) : null}
        </div>

        {/* CENTRO: Categorías (Ocultas en móvil) */}
        <div className="hidden md:flex items-center space-x-6 font-['Inter'] text-sm">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`py-1 px-2 rounded-md transition-colors ${isActive
                    ? 'text-black font-bold border-b-2 border-black'
                    : 'text-[#45464d] hover:text-black font-medium'
                  }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* LADO DERECHO: Búsqueda + Perfil (Escritorio) + Hamburguesa (Móvil) */}
        <div className="flex items-center space-x-2 sm:space-x-3 text-black">
          {/* Búsqueda */}
          <div className={`relative flex items-center ${!showSearch ? 'invisible' : ''}`}>
            <span className="material-symbols-outlined absolute left-2.5 text-black/40 text-lg pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="pl-8 pr-7 py-1.5 bg-black/5 hover:bg-black/10 focus:bg-white text-xs font-['JetBrains_Mono'] text-black rounded-lg border border-black/10 focus:border-black outline-none transition-all w-28 sm:w-48 focus:w-36 sm:focus:w-60"
            />
            {searchQuery && showSearch && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 text-black/40 hover:text-black text-xs cursor-pointer flex items-center"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>


          {/* Perfil en móvil */}
          {isLoggedIn && (
            <button
              onClick={() => setActiveTab('profile')}
              className="p-1 text-black hover:opacity-80 transition-opacity flex items-center"
              aria-label="Ir al Perfil"
            >
              <span className="material-symbols-outlined text-2xl">account_circle</span>
            </button>
          )}

          



          {/* Menú Hamburguesa (Móvil) -> Abre/Cierra el Sidebar */}
          <button
            onClick={toggleSidebar}
            className="md:hidden p-1 text-black hover:opacity-80 transition-opacity flex items-center justify-center"
            aria-label="Abrir Menú Lateral"
          >
            <span className="material-symbols-outlined text-2xl">
              {isSidebarOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

      </div>
    </nav>
  );
}