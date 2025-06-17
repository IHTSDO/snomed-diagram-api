const express = require('express');
const bodyParser = require('body-parser');
const { generateDiagramPNG } = require('./diagramRenderer');

const app = express();
const port = 3000;

app.use(bodyParser.json({ limit: '5mb' }));

app.get('/', (req, res) => {
  res.send('Welcome to the SNOMED CT Diagram API. See documentation here: https://github.com/ihtsdo/snomed-diagram-api');
});

app.post('/diagram', async (req, res) => {
  const concept = req.body;

  try {
    const imageBuffer = await generateDiagramPNG(concept);
    res.set('Content-Type', 'image/png');
    res.set('Content-Disposition', 'inline; filename="diagram.png"');
    res.end(imageBuffer, 'binary');
  } catch (err) {
    console.error('Error generating diagram:', err);
    res.status(500).send({ error: 'Failed to generate diagram' });
  }
});

app.listen(port, () => {
  console.log(`Diagram generator API listening at http://localhost:${port}`);
});