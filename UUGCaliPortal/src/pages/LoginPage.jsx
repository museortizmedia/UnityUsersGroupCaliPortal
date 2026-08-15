import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ setActiveTab }) {
  const { login, isLoggedIn } = useAuth();

  // Redirige al perfil si ya está autenticado
  if (isLoggedIn) {
    setActiveTab('profile');
    return null;
  }

  // Estados del formulario
  const [email, setEmail] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!githubToken.startsWith('github_pat_') && !githubToken.startsWith('ghp_')) {
      setErrorMessage('Ingresa un Personal Access Token de GitHub válido (comienza con ghp_ o github_pat_).');
      return;
    }

    const success = login(email, githubToken);

    if (success) {
      setActiveTab('profile');
    } else {
      setErrorMessage('Credenciales no válidas. Revisa tu correo o tu Access Token.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-white p-8 rounded-xl border border-black/10 shadow-sm">
        <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-black mb-2">
          Acceso Administrador
        </h1>
        <p className="text-sm text-[#45464d] mb-6 font-['JetBrains_Mono'] leading-relaxed">
          Inicia sesión con tu token de GitHub para moderar contenidos, gestionar la vitrina y autorizar commits automáticos en los archivos del sistema.
        </p>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded text-xs font-['JetBrains_Mono'] flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">error</span>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 font-['JetBrains_Mono'] text-xs">
          {/* Email */}
          <div>
            <label className="block mb-1 text-black font-medium">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="diego@caliuug.org"
              required
              className="w-full px-3 py-2 border border-black/20 rounded focus:border-black outline-none transition-colors"
            />
          </div>

          {/* GitHub Access Token */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-black font-medium">GitHub Access Token</label>
              <a
                href="https://github.com/settings/tokens?type=beta"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-black/50 hover:text-black underline"
              >
                ¿Cómo obtenerlo?
              </a>
            </div>
            <div className="relative flex items-center">
              <input
                type={showToken ? 'text' : 'password'}
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxx o github_pat_..."
                required
                className="w-full pl-3 pr-10 py-2 border border-black/20 rounded focus:border-black outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowToken((prev) => !prev)}
                className="absolute right-2.5 text-black/50 hover:text-black transition-colors cursor-pointer flex items-center"
                title={showToken ? 'Ocultar token' : 'Mostrar token'}
              >
                <span className="material-symbols-outlined text-xs">
                  {showToken ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded hover:bg-[#45464d] transition-colors cursor-pointer uppercase font-bold tracking-widest mt-2"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}