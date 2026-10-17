import requests

url = "http://localhost:8000/api/v1/specialized/ml"
payload = {
    "task_type": "Classification",
    "scenario": "Customer Churn",
    "row_count": 1000,
    "region": "India",
    "dirty_percentage": 0
}
try:
    r = requests.post(url, json=payload)
    print("Status:", r.status_code)
    text = r.text
    print("Response Length:", len(text))
    print("Response Preview:", text[:500])
except Exception as e:
    print("Error:", e)
