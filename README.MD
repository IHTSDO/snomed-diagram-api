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

An example diagram can be generated using http://localhost:3000/test

## Maven Build and Debian Package Deployment

This project includes a Maven build configuration that creates a Debian package for easy deployment on Ubuntu systems with supervisorctl process management.

### Prerequisites

- Java 11 or higher
- Maven 3.6 or higher
- Node.js 18+ (will be installed automatically by the build)

### Building the Debian Package

```bash
# Clean and build the Debian package
mvn clean package

# The Debian package will be created at:
# target/snomed-diagram-api-1.1.0-all.deb
```

### Installing the Debian Package

#### Prerequisites
Before installing the package, ensure you have the required dependencies:

```bash
# Update package list
sudo apt-get update

# Install required dependencies
sudo apt-get install nodejs supervisor

# Install optional but recommended dependencies
sudo apt-get install npm chromium-browser
```

#### Installation
```bash
# Install the package (requires sudo)
sudo dpkg -i snomed-diagram-api-*.deb

# If there are dependency issues, fix them with:
sudo apt-get install -f

# Setup puppeteer with fixed version of chrome
sudo -u snomed-diagram PUPPETEER_CACHE_DIR=/opt/snomed-diagram-api/.cache/puppeteer npx puppeteer browsers install chrome@134.0.6998.35

```

### Service Management

The package installs the application as a system service managed by supervisorctl:

```bash
# Check service status
sudo supervisorctl status snomed-diagram-api:

# Start the service
sudo supervisorctl start snomed-diagram-api:

# Stop the service
sudo supervisorctl stop snomed-diagram-api:

# Restart the service
sudo supervisorctl restart snomed-diagram-api:

# View logs
sudo tail -f /var/log/snomed-diagram-api/out.log
sudo tail -f /var/log/snomed-diagram-api/err.log
```



### Package Contents

The Debian package installs:

- Application files: `/opt/snomed-diagram-api/`
- Supervisor config: `/etc/supervisor/conf.d/snomed-diagram-api.conf`
- Startup script: `/opt/snomed-diagram-api/start.sh`
- Logs: `/var/log/snomed-diagram-api/`

### Dependencies

The package automatically installs these system dependencies:
- Node.js 18+
- npm 9+
- supervisor
- chromium-browser (for Puppeteer)

### Development

For development, you can still use the standard Node.js workflow:

```bash
# Install dependencies
npm install

# Start in development mode
npm run dev

# Start in production mode
npm start
```

## Note
This is a quick and dirty app intended for internal backend use only.
