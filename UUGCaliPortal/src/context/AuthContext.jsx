import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Clave para guardar en localStorage
const AUTH_STORAGE_KEY = 'uug_auth_user';

// Mockup del perfil Administrador
const MOCK_ADMIN_USER = {
  name: 'Diego Ortiz',
  role: 'Community Lead',
  desc: "Multimedia engineer with experience in web development and video games, from architecture to production. Leader of the UUG in the city of Cali, Colombia.",
  stats: [
    { name: 'Published Projects', value: 1 },
    { name: 'Published Assets', value: 2 },
    { name: 'Community Events', value: 5 },
  ],
  email: 'museortiz@gmail.com',
  password: '123456', // Solo para simulación
  isAdmin: true,
  avatar: '/DiegoOrtiz-Avatar.jpg',
};

export function AuthProvider({ children }) {
  // Inicialización perezosa: intenta leer el usuario guardado en localStorage
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Error al recuperar sesión de localStorage:', error);
      return null;
    }
  });

  // Inicia sesión como Admin con credenciales o datos por defecto
  const login = (email, password) => {
    // Comprobación base mockup (para producción aquí irá la llamada a la API)
    if (email && password) {
      const loggedUser = {
        ...MOCK_ADMIN_USER,
        email: email || MOCK_ADMIN_USER.email,
      };

      // Guardamos en estado y en localStorage
      setUser(loggedUser);
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(loggedUser));
      } catch (error) {
        console.error('Error al guardar sesión en localStorage:', error);
      }

      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error('Error al remover sesión de localStorage:', error);
    }
  };

  const isLoggedIn = !!user;
  const isAdmin = user?.isAdmin || false;

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}