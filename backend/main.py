import json
import psycopg2
from http.server import HTTPServer, BaseHTTPRequestHandler
from psycopg2.extras import RealDictCursor

DB_CONFIG = {
    "dbname": "LFG",
    "user": "postgres",
    "password": "123",
    "host": "localhost",
    "port": "5432"
}

class SimpleHandler(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers()

    def do_GET(self):
        if self.path == '/ads':
            self._set_headers()
            conn = psycopg2.connect(**DB_CONFIG)
            cur = conn.cursor(cursor_factory=RealDictCursor)
            cur.execute("SELECT * FROM ads ORDER BY id DESC")
            data = cur.fetchall()
            cur.close()
            conn.close()
            self.wfile.write(json.dumps(data).encode())

    def do_POST(self):
        if self.path == '/ads':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)

            conn = psycopg2.connect(**DB_CONFIG)
            cur = conn.cursor()
            cur.execute(
                "INSERT INTO ads (name, game, role, description) VALUES (%s, %s, %s, %s)",
                (data['name'], data['game'], data['role'], data['desc'])
            )
            conn.commit()
            cur.close()
            conn.close()

            self._set_headers()
            self.wfile.write(json.dumps({"status": "ok"}).encode())


def run(server_class=HTTPServer, handler_class=SimpleHandler, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"Сервер запущен на http://localhost:{port}")
    httpd.serve_forever()

if __name__ == '__main__':
    run()
