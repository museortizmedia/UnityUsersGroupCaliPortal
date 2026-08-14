import React, { createContext, useContext, useState, useEffect } from 'react';

const HeaderContext = createContext(null);

const STORAGE_KEY = 'my_library_pinned_assets';

export function HeaderProvider({ children }) {
  const [showLogo, setShowLogo] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Cargar estado inicial desde localStorage (array vacío por defecto)
  const [pinnedAssets, setPinnedAssets] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading library assets from localStorage:', e);
      return [];
    }
  });

  // Guardar cambios en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pinnedAssets));
    } catch (e) {
      console.error('Error saving library assets to localStorage:', e);
    }
  }, [pinnedAssets]);

  // Agregar un elemento
  const addAsset = (asset) => {
    setPinnedAssets((prev) => {
      if (prev.some((item) => item.id === asset.id)) return prev;

      // Normalización para garantizar consistencia entre proyectos y paquetes
      const normalizedAsset = {
        ...asset,
        title: asset.title || asset.name || 'Untitled Asset',
        name: asset.name || asset.title || 'Untitled Asset',
        addedAt: new Date().toISOString(),
      };

      return [...prev, normalizedAsset];
    });
  };

  // Remover un elemento por ID
  const removeAsset = (assetId) => {
    setPinnedAssets((prev) => prev.filter((item) => item.id !== assetId));
  };

  // Alternar favorito (Estrella)
  const togglePin = (asset) => {
    if (pinnedAssets.some((item) => item.id === asset.id)) {
      removeAsset(asset.id);
    } else {
      addAsset(asset);
    }
  };

  // Verificar si un ID está marcado como favorito
  const isPinned = (assetId) => pinnedAssets.some((item) => item.id === assetId);

  return (
    <HeaderContext.Provider
      value={{
        showLogo,
        setShowLogo,
        showSearch,
        setShowSearch,
        searchQuery,
        setSearchQuery,
        activeCategory,
        setActiveCategory,
        pinnedAssets,
        addAsset,
        removeAsset,
        togglePin,
        isPinned,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('useHeader debe ser usado dentro de un HeaderProvider');
  }
  return context;
}