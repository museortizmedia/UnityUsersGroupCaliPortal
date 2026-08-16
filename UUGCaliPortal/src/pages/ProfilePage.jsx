import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage({ setActiveTab }) {
  const { user, isLoggedIn, logout } = useAuth();

  // Protección de ruta: Si no hay sesión activa, redirige a 'main'
  useEffect(() => {
    if (!isLoggedIn) {
      if (setActiveTab) {
        setActiveTab('main');
      } else {
        window.location.pathname = '/';
      }
    }
  }, [isLoggedIn, setActiveTab]);

  // Si no está logueado, evita renderizar contenido mientras se ejecuta el redireccionamiento
  if (!isLoggedIn || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    if (setActiveTab) {
      setActiveTab('main');
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-white/40 backdrop-blur-md border border-black/5 rounded-xl p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          className="w-24 h-24 rounded-full bg-[#eae7e9] object-cover border-2 border-black/10"
          alt={user.name}
          src={user.avatar}
          draggable={false}
        />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="font-['Space_Grotesk'] text-3xl font-bold">{user.name}</h1>
                {user.isAdmin && (
                  <span className="bg-black text-white text-[10px] px-2 py-0.5 rounded font-['JetBrains_Mono'] uppercase tracking-wider">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-[#45464d] font-['JetBrains_Mono'] text-xs mt-1">{user.role} @ UUG Cali</p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button className="bg-black text-white px-6 py-2 rounded text-xs font-['JetBrains_Mono'] uppercase tracking-widest hover:bg-black/80 transition-colors cursor-pointer">
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded text-xs font-['JetBrains_Mono'] uppercase tracking-widest transition-colors cursor-pointer"
              >
                Log Out
              </button>
            </div>
          </div>

          <p className="font-['Inter'] text-sm text-[#45464d] mt-4 max-w-2xl">
            {user.desc}
          </p>
        </div>
      </div>

      {/* Stats Grid Dinámico */}
      {user.stats && user.stats.length > 0 && (
        <div className={`grid grid-cols-1 md:grid-cols-${user.stats.length} gap-6`}>
          {user.stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-black/5 text-center">
              <span className="font-['Space_Grotesk'] text-4xl font-bold text-black">
                {stat.value}
              </span>
              <p className="font-['JetBrains_Mono'] text-xs text-[#45464d] mt-1 uppercase">
                {stat.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}