const express = require('express');
const bodyParser = require('body-parser');
const { generateDiagramPNG } = require('./diagramRenderer');
const exampleConcept = require('./example-concept.json');

const app = express();
const port = 3000;

app.use(bodyParser.json({ limit: '5mb' }));

app.get('/', (req, res) => {
  res.send('<h4>Welcome to the SNOMED CT Diagram API</h4>' +
      '<ul>' +
      '<li><a href="test">Generate test diagram</a></li>' +
      '<li><a href="https://github.com/ihtsdo/snomed-diagram-api" target="_blank">Documentation</a></li>' +
      '</ul>')
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

app.get('/test', async (req, res) => {
  const concept = exampleConcept;

  try {
    const imageBuffer = await generateDiagramPNG(concept);
    res.set('Content-Type', 'image/png');
    res.set('Content-Disposition', 'inline; filename="diagram.png"');
    res.end(imageBuffer, 'binary');
  } catch (err) {
    console.error('Error generating diagram for test endpoint:', err);
    res.status(500).send({ error: 'Failed to generate test diagram' });
  }
});

app.listen(port, () => {
  console.log(`Diagram generator API listening at http://localhost:${port}`);
});
