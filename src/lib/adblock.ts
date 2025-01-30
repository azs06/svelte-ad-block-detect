export async function detectAdBlock() {
    try {
      const googleAdUrl = 'https://pagead2.googlesyndication.com/pagead/show_ads.js';
      const response = await fetch(new Request(googleAdUrl), {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store'
      });
      // If the request fails
      await response.json();
      // If the request succeeds but returns a non-2xx status
      if (!response.ok && response.url === googleAdUrl) {
        return true;
      }
      
      return false;
    } catch (error) {
      return true;
    }
  }