import React from 'react';
import { useHeader } from '../context/HeaderContext';
import { useAuth } from '../context/AuthContext';

export default function Header({ setActiveTab }) {
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
      <div className="flex justify-between items-center px-4 md:px-12 py-3 max-w-[1440px] mx-auto w-full gap-4">

        {/* Logo dinámico */}
        {showLogo ? (
          <div className="min-w-[160px]" onClick={() => setActiveTab('main')}>
            <div className="font-['Space_Grotesk'] text-2xl tracking-tighter text-black font-bold whitespace-nowrap cursor-pointer">
              CaliUUG
            </div>
          </div>
        ) : (
          <></> /* Spacer cuando se oculta */
        )}


        {/* Categorías de Clasificación */}
        <div className="hidden md:flex items-center space-x-6 font-['Inter'] text-sm">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                className={`py-1 px-2 rounded-md ${isActive
                  ? 'text-black font-bold border-b-2 border-black'
                  : 'text-[#45464d] hover:text-black font-medium'
                  }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Zona derecha: Búsqueda y Botones */}
        <div className="flex items-center space-x-3 text-black">
          {/* Input de Búsqueda con reserva de espacio */}
          <div className={`relative flex items-center ${!showSearch ? 'invisible' : ''}`}>
            <span className="material-symbols-outlined absolute left-2.5 text-black/40 text-lg pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="pl-8 pr-3 py-1.5 bg-black/5 hover:bg-black/10 focus:bg-white text-xs font-['JetBrains_Mono'] text-black rounded-lg border border-black/10 focus:border-black outline-none transition-all w-36 sm:w-48 focus:w-60"
            />
            {searchQuery && showSearch && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 text-black/40 hover:text-black text-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>

          {/*<button className="hover:scale-[1.02] transition-transform duration-200 flex items-center cursor-pointer p-1">
            <span className="material-symbols-outlined">notifications</span>
          </button>*/}

          {isLoggedIn && (
            <button
              onClick={() => setActiveTab('profile')}
              className="hover:scale-[1.02] transition-transform duration-200 flex items-center cursor-pointer p-1"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}