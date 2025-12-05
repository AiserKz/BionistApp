import { useCallback } from "react";

export default function useSaveManager() {
  const saveItem = useCallback((key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  }, []);

  const getItem = useCallback((key: string) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }, []);

  const addToHistory = useCallback(
    (key: string, newPlate: any) => {
      const history = getItem(key) || [];
      history.push(newPlate);
      saveItem(key, history);
    },
    [getItem, saveItem]
  );

  const getHistory = useCallback(
    (key: string) => {
      return getItem(key) || [];
    },
    [getItem]
  );

  const clearHistory = useCallback((key: string) => {
    localStorage.removeItem(key);
  }, []);

  return { saveItem, getItem, addToHistory, getHistory, clearHistory };
}
