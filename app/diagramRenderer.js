const puppeteer = require('puppeteer');
const path = require('path');

// Global browser instance to reuse
let browser = null;

async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });
    
    // Handle browser disconnection
    browser.on('disconnected', () => {
      console.log('Browser disconnected, will create new instance on next request');
      browser = null;
    });
  }
  return browser;
}

async function generateDiagramPNG(concept) {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    const htmlPath = 'file://' + path.join(__dirname, 'template.html');
    await page.goto(htmlPath);

    await page.evaluate((concept) => {
      window.renderConceptDiagram(concept);
    }, concept);

    await page.waitForSelector('#diagram-container svg', { timeout: 5000 });

    // Get the SVG dimensions and add some padding
    const dimensions = await page.evaluate(() => {
      const svg = document.querySelector('#diagram-container svg');
      const bbox = svg.getBBox();
      return {
        width: Math.ceil(bbox.width + 40), // Add 20px padding on each side
        height: Math.ceil(bbox.height + 40)
      };
    });

    // Set the viewport to match the SVG dimensions
    await page.setViewport({
      width: dimensions.width,
      height: dimensions.height,
      deviceScaleFactor: 1
    });

    // Set the container size to match the SVG
    await page.evaluate((dimensions) => {
      const container = document.querySelector('#diagram-container');
      container.style.width = `${dimensions.width}px`;
      container.style.height = `${dimensions.height}px`;
    }, dimensions);

    const element = await page.$('#diagram-container');
    const pngBuffer = await element.screenshot({ 
      type: 'png',
      omitBackground: true
    });

    return pngBuffer;
  } finally {
    // Always close the page to free memory, but keep browser instance
    await page.close();
  }
}

// Cleanup function to close browser on application shutdown
async function cleanup() {
  if (browser) {
    console.log('Closing browser instance...');
    await browser.close();
    browser = null;
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('Received SIGINT, cleaning up...');
  await cleanup();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, cleaning up...');
  await cleanup();
  process.exit(0);
});

module.exports = { generateDiagramPNG, cleanup };
