import { writable } from "svelte/store";
import { BROWSER } from "esm-env";
import { detectAdBlock } from "$lib/adblock";

interface AdBlockState {
  enabled: boolean | null;
  error: string | null;
  lastChecked: number | null;
}

const createAdBlockStore = () => {
  const { subscribe, set, update } = writable<AdBlockState>({
    enabled: null,
    error: null,
    lastChecked: null
  });
  
  const checkAdBlock = async () => {
    try {
      const result = await detectAdBlock();
      update(state => ({
        ...state,
        enabled: result,
        error: null,
        lastChecked: Date.now()
      }));
    } catch (error) {
      console.error('Error detecting ad blocker:', error);
      update(state => ({
        ...state,
        enabled: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        lastChecked: Date.now()
      }));
    }
  };

  if (BROWSER) {
    // Initial check
    checkAdBlock();
    
    // Periodic recheck every 5 minutes (300000 ms)
    setInterval(checkAdBlock, 300000);
  }

  // Method to manually trigger a recheck
  const recheck = () => {
    if (BROWSER) {
      return checkAdBlock();
    }
    return Promise.resolve();
  };

  return { subscribe, recheck };
};

export const adBlockEnabled = createAdBlockStore();
