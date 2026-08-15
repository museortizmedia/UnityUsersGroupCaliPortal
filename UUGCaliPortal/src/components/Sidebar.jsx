import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ activeTab, setActiveTab, isOpen }) {
  const { user, isLoggedIn, logout } = useAuth();

  // Opciones de menú según el estado de sesión
  const menuItems = [
    { id: 'main', label: 'Main', icon: 'grid_view' },
    { id: 'projects', label: 'Projects', icon: 'videogame_asset' },
    { id: 'packages', label: 'Packages', icon: 'deployed_code' },
    { id: 'library', label: 'My Library', icon: 'package' },
    { id: 'community', label: 'Community', icon: 'groups' },
    //...(isLoggedIn ? [{ id: 'event-update', label: 'Events', icon: 'calendar_clock', level: 2 }] : []),
  ];

  return (
    <aside
      className={`sticky top-0 h-screen bg-[#fcf8fa] text-black font-['JetBrains_Mono'] text-xs uppercase tracking-widest border-r border-black/10 flex flex-col py-6 transition-all duration-300 ease-in-out shrink-0 ${
        isOpen ? 'w-72 opacity-100' : 'w-0 opacity-0 overflow-hidden border-r-0'
      }`}
    >
      <div className="flex flex-col h-full w-72 overflow-hidden">
        {/* Título de la app */}
        <div className="px-6 mb-8 pt-2 shrink-0">
          <div className="font-['Space_Grotesk'] text-2xl text-black font-semibold mb-1 whitespace-nowrap">
            Developer Lab
          </div>
          <div className="text-[#45464d] font-normal lowercase whitespace-nowrap">
            Engine v4.2.1
          </div>
        </div>

        {/* Bloque del Perfil (Solo si el usuario está logueado) */}
        {isLoggedIn ? (
          <div className="px-6 mb-6 shrink-0">
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-3 w-full text-left p-2 -ml-2 rounded-lg hover:bg-black/5 transition-colors cursor-pointer group"
            >
              <img
                className="w-10 h-10 rounded-full bg-[#eae7e9] object-cover border border-black/10 group-hover:border-black transition-colors"
                alt="User Profile"
                src={user.avatar}
                draggable="false"
              />
              <div className="overflow-hidden">
                <div className="font-['Space_Grotesk'] font-bold text-black group-hover:underline truncate">
                  {user.name}
                </div>
                <div className="text-[10px] text-[#45464d] font-normal lowercase truncate">
                  {user.role}
                </div>
              </div>
            </button>
          </div>
        ) : (
          <div className="px-6 mb-6 shrink-0">
            <button
              onClick={() => setActiveTab('login')}
              className="w-full flex items-center justify-center gap-2 p-3 border border-black/20 rounded-lg hover:border-black hover:bg-black/5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">login</span>
              Enter
            </button>
          </div>
        )}

        {/* Lista de Navegación (Flex-1 + overflow-y-auto para scroll interno únicamente aquí) */}
        <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 text-left pl-6 py-3 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-black font-bold border-l-4 border-black bg-[#f6f3f5]'
                    : 'text-[#45464d] hover:text-black hover:bg-[#f6f3f5]'
                } ${item.level === 2 ? 'pl-10' : ''}`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Bloque inferior: mt-auto asegura que esto se empuje al fondo del sidebar */}
        <div className="mt-auto shrink-0 pt-4">
          {/* Acciones para publicar o cerrar sesión */}
          {isLoggedIn && (
            <div className="px-6 mb-4 space-y-2">
              { isLoggedIn && <>
                <button
                  onClick={() => setActiveTab('update-project')}
                  className="w-full bg-black text-white py-3 rounded hover:bg-[#45464d] transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  New Project
                </button>
                
                <button
                  onClick={() => setActiveTab('package-upload')}
                  className="w-full bg-black text-white py-3 rounded hover:bg-[#45464d] transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  New Package
                </button>

                <button
                  onClick={() => setActiveTab('event-update')}
                  className="w-full bg-black text-white py-3 rounded hover:bg-[#45464d] transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  New Event
                </button> 
              </>}

              <button
                onClick={logout}
                className="w-full text-red-600 hover:text-red-800 py-2 transition-colors cursor-pointer text-left flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                Log Out
              </button>
            </div>
          )}

          {/* Enlaces de soporte/docs siempre anclados abajo */}
          <div className="px-6 space-y-2 border-t border-black/5 pt-4">
            <button
              onClick={() => setActiveTab('support')}
              className={`flex items-center gap-3 w-full text-left transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'support' ? 'text-black font-bold' : 'text-[#45464d] hover:text-black'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">help</span> Support
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`flex items-center gap-3 w-full text-left transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'docs' ? 'text-black font-bold' : 'text-[#45464d] hover:text-black'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">description</span> Docs
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}