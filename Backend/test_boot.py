from fastapi.testclient import TestClient
import sys

# We just want to see if the app can be imported without syntax/dependency errors
try:
    from app.main import app
    client = TestClient(app)
    response = client.get("/")
    if response.status_code == 200:
        print("SUCCESS: App imported and responded successfully to /")
        sys.exit(0)
    else:
        print(f"FAILED: App responded with status code {response.status_code}")
        sys.exit(1)
except Exception as e:
    print(f"FAILED TO BOOT: {e}")
    sys.exit(1)
