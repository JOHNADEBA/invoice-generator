import { useEffect, useState, useRef } from "react";
import debounce from "lodash/debounce";

export function useAutoSave<T>(key: string, data: T, interval: number = 3000) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const previousDataRef = useRef<T>(data);

  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved) setLastSaved(new Date());
  }, [key]);

  const debouncedSave = useRef(
    debounce(async (currentData: T) => {
      setIsSaving(true);
      try {
        localStorage.setItem(key, JSON.stringify(currentData));
        setLastSaved(new Date());
        setHasChanges(false);
        previousDataRef.current = currentData;
      } catch (error) {
        console.error("Auto-save failed:", error);
      } finally {
        setIsSaving(false);
      }
    }, interval)
  ).current;

  useEffect(() => {
    if (JSON.stringify(previousDataRef.current) !== JSON.stringify(data)) {
      setHasChanges(true);
      debouncedSave(data);
    }
  }, [data, debouncedSave]);

  useEffect(() => {
    return () => debouncedSave.cancel();
  }, [debouncedSave]);

  return { isSaving, lastSaved, hasChanges };
}