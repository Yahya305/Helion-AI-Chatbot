import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"
HEADERS = {"X-Guest-Id": "test-guest-123"}

def test_chat():
    # 1. Send Message
    print("Sending message...")
    payload = {
        "user_input": "Hello from python script",
        "thread_id": "test-thread-py-1"
    }
    try:
        resp = requests.post(f"{BASE_URL}/chat/send", json=payload, headers=HEADERS)
        print(f"Send Response Status: {resp.status_code}")
        print(f"Send Response Body: {resp.text}")
    except Exception as e:
        print(f"Send Failed: {e}")

    # 2. Get Messages
    print("\nFetching messages...")
    try:
        resp = requests.get(f"{BASE_URL}/chat/test-thread-py-1", headers=HEADERS)
        print(f"Get Response Status: {resp.status_code}")
        print(f"Get Response Body: {json.dumps(resp.json(), indent=2)}")
    except Exception as e:
        print(f"Get Failed: {e}")

if __name__ == "__main__":
    test_chat()
