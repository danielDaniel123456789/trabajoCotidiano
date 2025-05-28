from http.server import BaseHTTPRequestHandler, HTTPServer
import json

class RequestHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_len = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_len)
        with open('datos.json', 'wb') as f:
            f.write(post_data)
        print("Datos recibidos:", post_data.decode())
        self.send_response(200)
        self.end_headers()

server_address = ('', 5000)
httpd = HTTPServer(server_address, RequestHandler)
print("Servidor escuchando en puerto 5000...")
httpd.serve_forever()
