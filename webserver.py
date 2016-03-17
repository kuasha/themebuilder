import SimpleHTTPServer
import SocketServer

import SimpleHTTPServer

class NoCacheHTTPRequestHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        SimpleHTTPServer.SimpleHTTPRequestHandler.end_headers(self)

PORT = 8000

Handler = NoCacheHTTPRequestHandler

httpd = SocketServer.TCPServer(("", PORT), Handler)

print "Serving at port", PORT
httpd.serve_forever()