const http = require('http');
const fs = require('fs');
const CONFIG = require('../../../config/config');
const logger = require('../Loggers');

const HttpHandler = {
    createServer() {
        const server = http.createServer(function(request, response) {

            request.on('error', err => {
                console.error(err);

                // Handle error...

                response.statusCode = 400;
                response.end('400: Bad Request');
                return;
            });
        
            response.on('error', err => {
                console.error(err);

                // Handle error...
            });

            var anyPending = false;

            function registerFile (req, res, urlPath, filePath, contentType) {
                if (req.url === urlPath) {
                    anyPending = true;
                    fs.readFile(filePath, (err, data) => {
                        if (err) {
                            console.log(err);
                            res.writeHeader(404, {"Content-Type": "text/plain"});
                            res.write('404: File Not Found');
                            res.end();
                        } else {
                            res.writeHeader(200, {"Content-Type": contentType});
                            res.write(data);  
                            res.end();
                        }
                    });
                }
            }

            registerFile(request, response, '/', './src/main/web/public/index.html', 'text/html');
            registerFile(request, response, '/style.css', './src/main/web/public/style.css', 'text/css');

            if (!anyPending) {
                response.writeHead(404, {'Content-Type': 'text/plain'});
                response.end('Sorry, unknown url');
            }
          });

        return server;
    },
    startServer(serverObj) {
        serverObj.listen(3000, function() { });
    }
}

module.exports = HttpHandler;