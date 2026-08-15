import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Clave para guardar en localStorage
const AUTH_STORAGE_KEY = 'uug_auth_user';

// Perfil Administrador Base
const MOCK_ADMIN_USER = {
  name: 'Diego Ortiz',
  role: 'Community Lead',
  desc: 'Ingeniero Multimedia con experiencia en desarrollo web y videojuegos, desde la arquitectura hasta la producción. Líder de la comunidad Unity Users Group en la ciudad de Cali, Colombia.',
  stats: [
    { name: 'Proyectos Publicados', value: 1 },
    { name: 'Assets Publicados', value: 2 },
    { name: 'Eventos de Comunidad', value: 5 },
  ],
  email: 'museortiz@gmail.com',
  isAdmin: true,
  avatar: '/DiegoOrtiz-Avatar.jpg',
};

export function AuthProvider({ children }) {
  // Inicialización perezosa leyendo el almacenamiento local
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Error al recuperar sesión de localStorage:', error);
      return null;
    }
  });

  // Autenticación guardando el Token de GitHub
  const login = (email, githubToken) => {
    // Validamos que exista un correo y un token ingresado
    if (email && githubToken) {
      const loggedUser = {
        ...MOCK_ADMIN_USER,
        email: email,
        githubToken: githubToken.trim(), // Token de GitHub guardado solo en el cliente
      };

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
  const githubToken = user?.githubToken || '';

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, isAdmin, githubToken, login, logout }}
    >
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