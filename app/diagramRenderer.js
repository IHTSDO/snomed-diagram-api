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

  const element = await page.$('#diagram-container');
  const pngBuffer = await element.screenshot({ type: 'png' });

  await browser.close();
  return pngBuffer;
}

module.exports = { generateDiagramPNG };
