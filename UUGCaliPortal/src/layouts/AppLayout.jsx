import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { ErrorBoundary } from '../components/ErrorBoundary';

export default function AppLayout({ activeTab, setActiveTab, children }) {
  // Abierto por defecto solo si la pantalla es de PC (md: 768px o más)
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true;
  });

  // Maneja el redimensionamiento de la ventana en tiempo real
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 768;
      setSidebarOpen(isDesktop);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  // Maneja el cambio de pestaña: en móvil cierra el sidebar, en PC lo mantiene abierto
  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="bg-[#fcf8fa] text-[#1b1b1d] font-['Inter'] antialiased min-h-screen flex flex-col justify-between overflow-x-hidden">
      {/* Header Fijo */}
      <Header 
        setActiveTab={handleSelectTab} 
        toggleSidebar={toggleSidebar}
        isSidebarOpen={sidebarOpen}
      />

      <div className="flex flex-1 pt-16 md:pt-20 w-full relative">
        {/* Backdrop para cerrar tocando fuera en móvil */}
        {sidebarOpen && (
          <div 
            onClick={closeSidebar} 
            className="md:hidden fixed inset-0 bg-black/40 z-40 transition-opacity"
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleSelectTab}
          isOpen={sidebarOpen}
        />

        {/* Botón Flotante (Exclusivo para Escritorio) */}
        <button
          onClick={toggleSidebar}
          className={`hidden md:flex fixed top-1/2 -translate-y-1/2 z-50 bg-white border border-black/15 hover:border-black/40 text-black w-6 h-10 items-center justify-center shadow-md cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 ${
            sidebarOpen ? 'left-72 rounded-r-full' : 'left-0 rounded-r-full'
          }`}
          title={sidebarOpen ? 'Colapsar menú' : 'Expandir menú'}
        >
          <span className="material-symbols-outlined text-sm font-bold">
            {sidebarOpen ? 'chevron_left' : 'chevron_right'}
          </span>
        </button>

        {/* Contenido Principal */}
        <main className="flex-1 px-4 md:px-12 py-8 max-w-[1440px] mx-auto w-full transition-all duration-300 min-w-0">
          <ErrorBoundary key={activeTab}>
            {children}
          </ErrorBoundary>
        </main>
      </div>

      {/* Footer */}
      <Footer setActiveTab={handleSelectTab} />
    </div>
  );
}