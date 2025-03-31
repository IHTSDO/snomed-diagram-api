# SNOMED CT Concept Diagram API
This API provides a way to generate a concept diagram for a given SNOMED CT concept. The diagram is generated as an SVG image and returned as a PNG file. 

## Usage
To start this Node.js microservice run `node app/server.js`.

To use the API first load the concept JSON object from Snowstorm using `GET
/browser/{branch}/concepts/{conceptId}`

Then make a POST request to this app's endpoint, sending the concept JSON in the body of the request. 
```
http://localhost:3000/diagram
```

The response will be the concept diagram as a PNG image.

## Note
Currently, this is a quick and dirty app that does not use best practise for build etc.
