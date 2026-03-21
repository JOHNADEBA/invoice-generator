import { useEffect, useState, useRef } from "react";
import debounce from "lodash/debounce";

export function useLocalAutoSave<T>(
  key: string,
  data: T,
  interval: number = 2000,
) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const previousDataRef = useRef<T>(data);

  // Load initial data from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        // We don't set data here, just track that there's saved data
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
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
    }, interval),
  ).current;

  useEffect(() => {
    // Check if data has changed
    if (JSON.stringify(previousDataRef.current) !== JSON.stringify(data)) {
      setHasChanges(true);
      debouncedSave(data);
    }
  }, [data, debouncedSave]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  return { isSaving, lastSaved, hasChanges };
}
