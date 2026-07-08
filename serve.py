import http.server, socketserver, os
os.chdir('/Users/toba/Desktop/ollacloud')
handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(('', 8099), handler) as httpd:
    httpd.serve_forever()
