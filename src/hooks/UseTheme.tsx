import { useEffect } from 'react';

const UseTheme = () => {
  useEffect(() => {
    // Verificar si el navegador soporta `prefers-color-scheme`
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Función para aplicar el tema
    const applyTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-bs-theme', 'light');
      }
    };

    // Aplicar el tema inicial
    applyTheme(mediaQuery);

    // Escuchar cambios en las preferencias de tema
    const handler = (e: MediaQueryListEvent) => applyTheme(e);
    mediaQuery.addEventListener('change', handler);

    // Limpieza al desmontar el componente
    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, []);
};

export default UseTheme;