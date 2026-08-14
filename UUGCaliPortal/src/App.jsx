import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { HeaderProvider, useHeader } from './context/HeaderContext';
import AppLayout from './layouts/AppLayout';
import MainPage from './pages/MainPage';
import MyLibraryPage from './pages/MyLibraryPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import ViewProjectPage from './pages/ViewProjectPage';
import ArchitecturePage from './pages/ArchitecturePage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import DocsPage from './pages/DocsPage';
import SupportPage from './pages/SupportPage';
import NotFoundPage from './pages/NotFoundPage';
import CommunityNetworkPage from './pages/CommunityNetworkPage';
import ProjectsPage from './pages/ProjectsPage';
import UpdateProjectPage from './pages/UploadProjectPage';
import PackageRegistryPage from './pages/PackageRegistryPage';
import PackageUploadPage from './pages/PackageUploadPage';

// 1. Mapeo entre URLs y Vistas
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

  '/projects': 'projects',
  '/update-project': 'update-project',
  '/project': 'project-detail',

  '/packages': 'packages',
  '/package-upload': 'package-upload',

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

  projects: { showLogo: true, showSearch: true, category: 'Projects' },
  'update-project': { showLogo: true, showSearch: false, category: 'Projects' },
  'project-detail': { showLogo: true, showSearch: false, category: 'Projects' },

  packages: { showLogo: true, showSearch: true, category: 'Engine' },
  'package-upload': { showLogo: true, showSearch: false, category: 'Engine' },

  library: { showLogo: true, showSearch: true, category: 'Projects' },
};

function AppContent() {
  const { setShowLogo, setShowSearch, setActiveCategory, setSearchQuery } = useHeader();

  const [activeTab, setActiveTabState] = useState(() => {
    const currentPath = window.location.pathname;
    return ROUTE_MAP[currentPath] || 'main';
  });

  // Estados globales para los elementos seleccionados
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null); // Corregido: Declaración de estado para paquete

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
    setSearchQuery(''); // Limpiar búsqueda
  }, [activeTab, setShowLogo, setShowSearch, setActiveCategory, setSearchQuery]);

  const setActiveTab = (tabId, shouldPushState = true) => {
    setActiveTabState(tabId);
    if (shouldPushState) {
      const path = TAB_TO_PATH[tabId] || '/';
      window.history.pushState({ tabId }, '', path);
    }
  };

  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.tabId) {
        setActiveTabState(event.state.tabId);
      } else {
        const path = window.location.pathname;
        setActiveTabState(ROUTE_MAP[path] || 'main');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
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
          <ViewProjectPage
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
        return <UpdateProjectPage setActiveTab={setActiveTab} />;
      
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