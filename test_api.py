import urllib.request
import json
import urllib.error

data = json.dumps({"prompt":"test1234", "provider":"google", "api_key":"test"}).encode()
req = urllib.request.Request("http://localhost:8000/api/v1/schema-ai/generate", data=data, headers={"Content-Type":"application/json"})
try:
    print(urllib.request.urlopen(req).read().decode())
except urllib.error.HTTPError as e:
    print(e.code)
    print(e.read().decode())
