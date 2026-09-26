import { useEffect } from 'react';

function useAutoDismiss(value, onClear, delay = 4000) {
  useEffect(() => {
    if (!value) return;
    const timer = setTimeout(() => onClear(), delay);
    return () => clearTimeout(timer);
  }, [value, onClear, delay]);
}

export default useAutoDismiss;