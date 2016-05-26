var http = require('http');

var server = new http.Server();

var clients = [];

server.on('request', function(request, response) {
    var url = require('url').parse(request.url);

    if(url.pathname == '/') {

        var clientUI = require('fs').readFileSync("index.html");

        response.writeHead(200, {"Content-Type": "text/html"});
        response.write(clientUI);
        response.end();
        return;
    }


    if(url.pathname == '/chat') {
        if(request.method == 'POST') {

            var body = '';
            request.on('data', function(chunk) {
                body += chunk;
            })

            request.on('end', function() {
                var message = body;

                response.writeHead(200);
                response.end();

                clients.forEach(function(client) {
                    client.write(message);
                    client.end();
                })

                clients = [];
            })
        }
        else if(request.method == 'GET') {
            response.writeHead(200);
            clients.push(response);
            console.log(clients.length);
            request.on('end', function() {
                clients.splice(clients.indexOf(response), 1);
            })
        }
    }

});

server.listen(3030);