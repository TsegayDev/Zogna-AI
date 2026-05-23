'use client';

import * as React from 'react';

export function AppInitializer() {
  React.useEffect(() => {
    const handleLoad = () => {
      document.body.classList.add('loaded');
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return null;
}
