export async function detectAdBlock() {
  try {
    // Method 1: Bait element with common ad class names
    const bait = document.createElement('div');
    bait.innerHTML = 'Advertisement'; // Add text content
    bait.className = 'ad-banner ads ad-placement ad-unit doubleclick advertisement';
    bait.style.height = '1px';
    bait.style.width = '1px';
    bait.style.position = 'absolute';
    bait.style.left = '-9999px';
    bait.style.top = '-9999px';
    document.body.appendChild(bait);

    // Wait for the next animation frame with a timeout to ensure the element is rendered
    await Promise.race([
      new Promise(resolve => requestAnimationFrame(resolve)),
      new Promise(resolve => setTimeout(resolve, 1000)) // Timeout after 1 second
    ]);

    // Check if the bait was hidden by an ad blocker
    const isBlockedByBait =
      window.getComputedStyle(bait).display === 'none' ||
      window.getComputedStyle(bait).visibility === 'hidden' ||
      bait.offsetHeight === 0 ||
      bait.offsetWidth === 0;

    document.body.removeChild(bait);

    // Method 2: Attempt to load a dummy ad script from a known ad domain
    let isBlockedByScript = false;
    try {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        script.onload = () => resolve(false);
        script.onerror = () => reject(true);
        document.head.appendChild(script);
        setTimeout(() => reject(false), 1500); // Timeout after 1.5 seconds
      });
    } catch {
      isBlockedByScript = true;
    }

    // Consider ad blocker active if either method indicates blocking
    return isBlockedByBait || isBlockedByScript;
  } catch (error) {
    console.error('Error in ad block detection:', error);
    return null; // Return null on error to indicate unknown state
  }
}
