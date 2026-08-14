import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { ErrorBoundary } from '../components/ErrorBoundary';

export default function AppLayout({ activeTab, setActiveTab, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="bg-[#fcf8fa] text-[#1b1b1d] font-['Inter'] antialiased min-h-screen flex flex-col justify-between overflow-x-hidden">
      {/* Header Fijo */}
      <Header setActiveTab={setActiveTab} />

      <div className="flex flex-1 pt-16 md:pt-20 w-full relative">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
        />

        {/* Botón desplegable */}
        <button
          onClick={toggleSidebar}
          className={`fixed top-1/2 -translate-y-1/2 z-50 bg-white border border-black/15 hover:border-black/40 text-black w-6 h-10 flex items-center justify-center shadow-md cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 ${
            sidebarOpen ? 'left-72 rounded-r-full' : 'left-0 rounded-r-full'
          }`}
          title={sidebarOpen ? 'Colapsar menú' : 'Expandir menú'}
        >
          <span className="material-symbols-outlined text-sm font-bold">
            {sidebarOpen ? 'chevron_left' : 'chevron_right'}
          </span>
        </button>

        {/* Zona del contenido protegida contra fallos de renderizado */}
        <main className="flex-1 px-4 md:px-12 py-8 max-w-[1440px] mx-auto w-full transition-all duration-300 min-w-0">
          <ErrorBoundary key={activeTab}>
            {children}
          </ErrorBoundary>
        </main>
      </div>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}