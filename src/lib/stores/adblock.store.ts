// adblock.store.js
import { writable } from "svelte/store";
import { BROWSER } from "esm-env";
import { detectAdBlock } from "$lib/adblock"; 

const createAdBlockStore = () => {
  const { subscribe, set } = writable(null);
  if (BROWSER) {
    detectAdBlock()
      .then((adBlockEnabled) => {
        set(adBlockEnabled);
      })
      .catch(() => {
        set(null); // Fallback in case of unexpected errors
      });
  }

  return { subscribe };
};

export const adBlockEnabled = createAdBlockStore();
