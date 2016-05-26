var http = require('http');

var server = new http.Server();

var clients = [];

server.on('request', function(request, response) {
    var url = require('url').parse(request.url);

    //返回用户UI
    if(url.pathname == '/') {
        var ui = require('fs').readFileSync("index.html");

        response.writeHead(200, {"Content-Type": "text/html"});
        response.write(ui);
        response.end();
        return;
    }

    if(url.pathname != '/chat') {
        response.writeHead(404);
        response.end();
    }

    if(url.pathname == '/chat') {

        if(request.method == 'POST') { //用户发送消息

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

                //清空所有长连接
                clients = [];
            })
        }
        else if(request.method == 'GET') { //用户建立长连接
            response.writeHead(200);
            clients.push(response);

            request.on('end', function() {
                clients.splice(clients.indexOf(response), 1);
            })
        }
    }
});

server.listen(3030);