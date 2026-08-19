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


import projectsDataInfo from './data/projects.json';
import packeagesDataInfo from './data/packages.json'

// Mapeo entre URLs base del Hash y vistas internas
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
  '/project': 'project',

  '/packages': 'packages',
  '/package-upload': 'package-upload',
  '/package': 'package',

  '/library': 'library',
};

const TAB_TO_PATH = Object.fromEntries(
  Object.entries(ROUTE_MAP).map(([path, tab]) => [tab, path])
);

// Configuración centralizada para el Header
const PAGE_HEADER_CONFIG = {
  main: { showLogo: true, showSearch: false, category: 'Engine' },
  login: { showLogo: true, showSearch: false, category: 'Engine' },
  profile: { showLogo: true, showSearch: false, category: 'Engine' },
  community: { showLogo: true, showSearch: false, category: 'Community' },

  docs: { showLogo: true, showSearch: true, category: '' },
  support: { showLogo: true, showSearch: false, category: 'Community' },

  architecture: { showLogo: true, showSearch: false, category: 'Community' },
  privacy: { showLogo: true, showSearch: false, category: 'Engine' },
  terms: { showLogo: true, showSearch: false, category: 'Engine' },

  events: { showLogo: true, showSearch: true, category: 'Events' },
  'event-update': { showLogo: true, showSearch: false, category: 'Events' },

  projects: { showLogo: true, showSearch: true, category: '' },
  'update-project': { showLogo: true, showSearch: false, category: 'Projects' },
  project: { showLogo: true, showSearch: false, category: 'Projects' },

  packages: { showLogo: true, showSearch: true, category: '' },
  'package-upload': { showLogo: true, showSearch: false, category: 'Packages' },
  package: { showLogo: true, showSearch: false, category: 'Packages' },

  library: { showLogo: true, showSearch: true, category: '' },
};

// Helper dinámico para descomponer el hash en { path, tab, id }
const parseHash = () => {
  const hash = window.location.hash.replace(/^#/, '');
  const cleanPath = hash.startsWith('/') ? hash : `/${hash}`;
  const segments = cleanPath.split('/').filter(Boolean);

  if (segments.length === 0) {
    return { path: '/', tab: 'main', id: null };
  }

  const rootPath = `/${segments[0]}`;
  const tab = ROUTE_MAP[rootPath] || 'main';
  const id = segments[1] ? decodeURIComponent(segments[1]) : null;

  return { path: rootPath, tab, id };
};

function AppContent() {
  const { setShowLogo, setShowSearch, setActiveCategory, setSearchQuery } = useHeader();

  // Interceptador para servir feed.xml estático
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

  // 1. Inicialización leyendo la Pestaña e IDs directamente de la URL inicial
  const [activeTab, setActiveTabState] = useState(() => parseHash().tab);

  const [selectedProjectId, setSelectedProjectId] = useState(() => {
    const { tab, id } = parseHash();
    return tab === 'project' ? id : null;
  });

  const [selectedPackage, setSelectedPackage] = useState(() => {
    const { tab, id } = parseHash();
    return tab === 'package' ? id : null;
  });

  // Actualiza la configuración del Header según el tab activo
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

  // 2. Función para cambiar pestaña y actualizar el Hash en la barra de direcciones
  const setActiveTab = (tabId, idParam = null, shouldPushState = true) => {
    if (tabId === 'packages') {
      setSelectedPackage(null);
    }
    if (tabId === 'projects') {
      setSelectedProjectId(null);
    }

    setActiveTabState(tabId);

    if (shouldPushState) {
      let path = TAB_TO_PATH[tabId] || '/';

      // Construcción de rutas parametrizadas dinámicas
      if (tabId === 'project' && idParam) {
        path = `/project/${encodeURIComponent(idParam)}`;
      } else if (tabId === 'package' && idParam) {
        // Acepta ID numérico/slug o la propiedad de objeto si se envía un objeto
        const pkgId = typeof idParam === 'object' ? (idParam.id || idParam.name) : idParam;
        path = `/package/${encodeURIComponent(pkgId)}`;
      }

      window.location.hash = path;
    }
  };

  // 3. Listener para detectar cambios en el hash (atrás/adelante en navegador o entrada directa)
  useEffect(() => {
    const handleHashChange = () => {
      const { tab, id } = parseHash();
      setActiveTabState(tab);

      if (tab === 'project') {
        setSelectedProjectId(id);
      } else if (tab === 'package') {
        setSelectedPackage(id);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPage = () => {
    switch (activeTab) {
      case 'main':
        return <MainPage setActiveTab={setActiveTab} />;
      case 'login':
        return <LoginPage setActiveTab={setActiveTab} />;
      case 'profile':
        return <ProfilePage setActiveTab={setActiveTab} />;
      case 'community': return <CommunityNetworkPage />;

      case 'docs': return <DocsPage />;
      case 'support': return <SupportPage />;

      case 'architecture': return <ArchitecturePage />;
      case 'privacy': return <PrivacyPage />;
      case 'terms': return <TermsPage />;

      case 'events':
        return (
          <EventsPage
            setActiveTab={setActiveTab}
            selectedPackage={selectedPackage}
            setSelectedPackage={setSelectedPackage}
          />
        );

      case 'event-update':
        return (
          <EventUploadPage
            setActiveTab={setActiveTab}
            selectedPackage={selectedPackage}
            setSelectedPackage={setSelectedPackage}
          />
        );

      case 'projects':
        return (
          <ProjectsPage
            setActiveTab={setActiveTab}
            setSelectedProjectId={setSelectedProjectId}
          />
        );

      case 'update-project': return <ProjectUploadPage setActiveTab={setActiveTab} />;

      case 'project':
        return (
          <ProjectViewPage
            projectId={selectedProjectId}
            setActiveTab={setActiveTab}
          />
        );


      case 'packages':
        return (
          <PackageRegistryPage
            setActiveTab={setActiveTab}
            setSelectedPackage={setSelectedPackage}
          />
        );

      case 'package-upload': return <PackageUploadPage setActiveTab={setActiveTab} />;

      case 'package':
        return (
          <PackageDetailPage
            packageData={selectedPackage}
            onBack={() => {
              setSelectedPackage(null);
              setActiveTab('packages');
            }}
            packagesList={packeagesDataInfo}
          />
        );

      case 'library':
        return (
          <MyLibraryPage
            setActiveTab={setActiveTab}
            setSelectedProjectId={setSelectedProjectId}
            setSelectedPackage={setSelectedPackage}
          />
        );

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