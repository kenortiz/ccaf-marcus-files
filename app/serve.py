"""Optional: serve the app locally (python3 serve.py). Opening index.html directly also works."""
import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
from http.server import HTTPServer, SimpleHTTPRequestHandler

print("Serving The Marcus Files at http://127.0.0.1:8765")
HTTPServer(("127.0.0.1", 8765), SimpleHTTPRequestHandler).serve_forever()
