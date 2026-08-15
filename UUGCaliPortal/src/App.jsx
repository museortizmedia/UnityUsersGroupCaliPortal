import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { HeaderProvider, useHeader } from './context/HeaderContext';

import AppLayout from './layouts/AppLayout';
import NotFoundPage from './pages/NotFoundPage';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import CommunityNetworkPage from './pages/CommunityNetworkPage';

import DocsPage from './pages/DocsPage';
import SupportPage from './pages/SupportPage';

import ArchitecturePage from './pages/ArchitecturePage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';

import EventsPage from './pages/EventsPage';
import EventUploadPage from './pages/EventUploadPage';

import ProjectsPage from './pages/ProjectsPage';
import ProjectUploadPage from './pages/ProjectUploadPage';
import ProjectViewPage from './pages/ProjectViewPage';

import PackageRegistryPage from './pages/PackageRegistryPage';
import PackageUploadPage from './pages/PackageUploadPage';
import PackageDetailPage from './pages/PackageDetailPage';

import MyLibraryPage from './pages/MyLibraryPage';

// 1. Mapeo entre URLs en el Hash y Vistas
const ROUTE_MAP = {
  '/': 'main',
  '/login': 'login',
  '/profile': 'profile',
  '/community': 'community',

  '/docs': 'docs',
  '/support': 'support',

  '/architecture': 'architecture',
  '/privacy': 'privacy',
  '/terms': 'terms',

  '/events': 'events',
  '/event-update': 'event-update',

  '/projects': 'projects',
  '/update-project': 'update-project',
  '/project': 'project-detail',

  '/packages': 'packages',
  '/package-upload': 'package-upload',
  '/package': 'package',

  '/library': 'library',
};

const TAB_TO_PATH = Object.fromEntries(
  Object.entries(ROUTE_MAP).map(([path, tab]) => [tab, path])
);

// 2. Diccionario Centralizado de Configuración para el Header
const PAGE_HEADER_CONFIG = {
  main: { showLogo: true, showSearch: false, category: 'Engine' },
  login: { showLogo: true, showSearch: false, category: 'Community' },
  profile: { showLogo: true, showSearch: false, category: 'Community' },
  community: { showLogo: true, showSearch: false, category: 'Community' },

  docs: { showLogo: true, showSearch: true, category: 'Engine' },
  support: { showLogo: true, showSearch: false, category: 'Community' },

  architecture: { showLogo: true, showSearch: false, category: 'Engine' },
  privacy: { showLogo: true, showSearch: false, category: 'Forum' },
  terms: { showLogo: true, showSearch: false, category: 'Forum' },

  events: { showLogo: true, showSearch: true, category: 'Projects' },
  'event-update': { showLogo: true, showSearch: false, category: 'Projects' },

  projects: { showLogo: true, showSearch: true, category: 'Projects' },
  'update-project': { showLogo: true, showSearch: false, category: 'Projects' },
  'project-detail': { showLogo: true, showSearch: false, category: 'Projects' },

  packages: { showLogo: true, showSearch: true, category: 'Engine' },
  'package-upload': { showLogo: true, showSearch: false, category: 'Engine' },
  package: { showLogo: true, showSearch: true, category: 'Engine' },

  library: { showLogo: true, showSearch: true, category: 'Projects' },
};

// Helper para extraer la ruta limpia desde el hash
const getHashPath = () => {
  const hash = window.location.hash.replace(/^#/, '');
  return hash || '/';
};

function AppContent() {
  const { setShowLogo, setShowSearch, setActiveCategory, setSearchQuery } = useHeader();

  // Interceptador para servir feed.xml estático directamente en localhost/desarrollo
  useEffect(() => {
    const checkFeed = async () => {
      const pathname = window.location.pathname;
      const hash = window.location.hash;

      if (pathname.endsWith('/feed.xml') || hash === '#/feed.xml' || hash === '#feed.xml') {
        try {
          const baseUrl = import.meta.env.BASE_URL.endsWith('/')
            ? import.meta.env.BASE_URL
            : `${import.meta.env.BASE_URL}/`;
            
          const response = await fetch(`${baseUrl}feed.xml`);
          if (response.ok) {
            const xmlText = await response.text();
            document.open();
            document.write(xmlText);
            document.close();
          }
        } catch (error) {
          console.error('Error al cargar feed.xml:', error);
        }
      }
    };

    checkFeed();
  }, []);

  // Inicialización leyendo la ruta contenida en el hash de la URL
  const [activeTab, setActiveTabState] = useState(() => {
    const currentHashPath = getHashPath();
    return ROUTE_MAP[currentHashPath] || 'main';
  });

  // Estados globales para los elementos seleccionados
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Efecto que actualiza la configuración del Header según el diccionario
  useEffect(() => {
    const config = PAGE_HEADER_CONFIG[activeTab] || {
      showLogo: true,
      showSearch: false,
      category: 'Engine',
    };

    setShowLogo(config.showLogo ?? true);
    setShowSearch(config.showSearch ?? false);
    setActiveCategory(config.category ?? 'Engine');
    setSearchQuery('');
  }, [activeTab, setShowLogo, setShowSearch, setActiveCategory, setSearchQuery]);

  // Cambia la pestaña y actualiza el Hash de la barra de navegación
  const setActiveTab = (tabId, shouldPushState = true) => {
    setActiveTabState(tabId);
    if (shouldPushState) {
      const path = TAB_TO_PATH[tabId] || '/';
      window.location.hash = path;
    }
  };

  // Escucha los cambios manuales en el hash
  useEffect(() => {
    const handleHashChange = () => {
      const currentHashPath = getHashPath();
      setActiveTabState(ROUTE_MAP[currentHashPath] || 'main');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPage = () => {
    switch (activeTab) {
      case 'main': 
        return <MainPage setActiveTab={setActiveTab} />;
      case 'library':
        return (
          <MyLibraryPage
            setActiveTab={setActiveTab}
            setSelectedProjectId={setSelectedProjectId}
            setSelectedPackage={setSelectedPackage}
          />
        );
      case 'login': 
        return <LoginPage setActiveTab={setActiveTab} />;
      case 'profile': 
        return <ProfilePage setActiveTab={setActiveTab} />;

      case 'project-detail':
        return (
          <ProjectViewPage
            projectId={selectedProjectId}
            setActiveTab={setActiveTab}
          />
        );

      case 'architecture': return <ArchitecturePage />;
      case 'privacy': return <PrivacyPage />;
      case 'terms': return <TermsPage />;
      case 'docs': return <DocsPage />;
      case 'support': return <SupportPage />;
      case 'community': return <CommunityNetworkPage />;

      case 'projects':
        return (
          <ProjectsPage
            setActiveTab={setActiveTab}
            setSelectedProjectId={setSelectedProjectId}
          />
        );

      case 'update-project': 
        return <ProjectUploadPage setActiveTab={setActiveTab} />;
      
      case 'packages': 
        return (
          <PackageRegistryPage 
            setActiveTab={setActiveTab} 
            selectedPackage={selectedPackage}
            setSelectedPackage={setSelectedPackage}
          />
        );
      
      case 'package-upload': 
        return <PackageUploadPage setActiveTab={setActiveTab} />;
      
      case 'event-update':
        return <EventUploadPage
            setActiveTab={setActiveTab} 
            selectedPackage={selectedPackage}
            setSelectedPackage={setSelectedPackage}
          />
      
      case 'events':
        return <EventsPage
          setActiveTab={setActiveTab} 
            selectedPackage={selectedPackage}
            setSelectedPackage={setSelectedPackage}
          />
      
      default: 
        return <NotFoundPage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderPage()}
    </AppLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HeaderProvider>
        <AppContent />
      </HeaderProvider>
    </AuthProvider>
  );
}