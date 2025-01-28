// adblock.store.js
import { writable } from "svelte/store";
import { browser } from "$app/environment"; // SvelteKit environment detection
import { detectAdBlock } from "$lib/adblock"; // Import the adblock detection function

const createAdBlockStore = () => {
  const { subscribe, set } = writable(null);

  if (browser) {
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
