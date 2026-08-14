import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ setActiveTab }) {
  const { login, isLoggedIn } = useAuth();

  if(isLoggedIn) { setActiveTab('profile'); return null; } // Redirige al perfil si ya está logueado

  // Estados de formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validación básica enviada al AuthContext
    const success = login(email, password);

    if (success) {
      setActiveTab('profile');
    } else {
      setErrorMessage('Invalid credentials. Check your email or password.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-white p-8 rounded-xl border border-black/10 shadow-sm">
        <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-black mb-2">
          Administrator Login
        </h1>
        <p className="text-sm text-[#45464d] mb-6 font-['JetBrains_Mono']">
          Accounts enabled to manage and moderate platform content, as well as to manage user accounts and permissions.
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
            <label className="block mb-1 text-black font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="diego@caliuug.org"
              required
              className="w-full px-3 py-2 border border-black/20 rounded focus:border-black outline-none transition-colors"
            />
          </div>

          {/* Password con Ojito */}
          <div>
            <label className="block mb-1 text-black font-medium">Password</label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-3 pr-10 py-2 border border-black/20 rounded focus:border-black outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2.5 text-black/50 hover:text-black transition-colors cursor-pointer flex items-center"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                <span className="material-symbols-outlined text-xs">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded hover:bg-[#45464d] transition-colors cursor-pointer uppercase font-bold tracking-widest mt-2"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}