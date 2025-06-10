const puppeteer = require('puppeteer');
const path = require('path');

async function generateDiagramPNG(concept) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

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

  await browser.close();
  return pngBuffer;
}

module.exports = { generateDiagramPNG };
