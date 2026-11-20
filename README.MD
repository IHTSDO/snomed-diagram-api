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
# Add NodeJS debian package source
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Update package list
sudo apt-get update

# Install NodeJS 20.x
sudo apt-get install nodejs
```

#### Installation
```bash
# Install the package (requires sudo)
sudo dpkg -i snomed-diagram-api-*.deb

# If there are dependency issues, fix them with:
sudo apt-get install -f

# Setup puppeteer with fixed version of chrome
sudo -u snomed-diagram PUPPETEER_CACHE_DIR=/opt/snomed-diagram-api/.cache/puppeteer npx puppeteer browsers install chrome@134.0.6998.35

# Add chrome dependencies (Ubuntu 24.04 and later, which use the t64 package names)
sudo apt-get install -y \
  libgbm1 libdrm2 libxshmfence1 libx11-xcb1 libxcomposite1 libxdamage1 libxrandr2 \
  libatk-bridge2.0-0t64 libatk1.0-0t64 libgtk-3-0t64 libnss3 libxss1 libasound2t64 \
  libcups2t64 libxkbcommon0 libxkbcommon-x11-0 libxfixes3 libglib2.0-0t64 \
  fonts-liberation ca-certificates xdg-utils
```

On Ubuntu 22.04 and earlier, use the original package names instead: `libatk-bridge2.0-0 libatk1.0-0 libgtk-3-0 libasound2 libcups2 libglib2.0-0`.
On 24.04, apt maps the other `t64` renames automatically, but `libasound2` is a virtual package and fails with
`Package 'libasound2' has no installation candidate`, so `libasound2t64` must be named explicitly.

Chrome is only launched on the first diagram request, so a missing Chrome or missing libraries do not stop the service
starting. They show up as `Could not find Chrome` or shared-library errors in `err.log`.

### Service Management

The package installs the application as a system service managed by supervisorctl.
The process is named `snomed-diagram-api_00` inside the group `snomed-diagram-api`, so always use the group
form with a trailing colon (or `snomed-diagram-api:*`). A bare `snomed-diagram-api` fails with `ERROR (no such process)`.

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
