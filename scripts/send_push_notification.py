#!/usr/bin/env python3
"""
Expo Push Notification Sender - Python Script
Sends push notifications using the Expo Push API
"""

import requests
import json
import sys
from typing import List, Dict, Optional

class ExpoPushClient:
    def __init__(self):
        self.push_url = "https://exp.host/--/api/v2/push/send"
        self.receipts_url = "https://exp.host/--/api/v2/push/getReceipts"
    
    def is_expo_push_token(self, token: str) -> bool:
        """Check if a token is a valid Expo push token format"""
        return token.startswith("ExponentPushToken[") or token.startswith("ExpoPushToken[")
    
    def send_notification(
        self, 
        push_token: str, 
        title: str, 
        body: str, 
        data: Optional[Dict] = None,
        sound: str = "default"
    ) -> Dict:
        """Send a single push notification"""
        
        if not self.is_expo_push_token(push_token):
            return {"error": f"Invalid push token format: {push_token}"}
        
        message = {
            "to": push_token,
            "title": title,
            "body": body,
            "sound": sound,
            "data": data or {}
        }
        
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        
        try:
            response = requests.post(self.push_url, json=message, headers=headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"error": f"Request failed: {str(e)}"}
    
    def send_batch_notifications(self, messages: List[Dict]) -> Dict:
        """Send multiple push notifications"""
        
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        
        try:
            response = requests.post(self.push_url, json=messages, headers=headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"error": f"Request failed: {str(e)}"}
    
    def get_receipts(self, receipt_ids: List[str]) -> Dict:
        """Get push notification receipts"""
        
        payload = {"ids": receipt_ids}
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        
        try:
            response = requests.post(self.receipts_url, json=payload, headers=headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"error": f"Request failed: {str(e)}"}

def main():
    """Main function to demonstrate usage"""
    
    # Example push token (replace with your actual token)
    PUSH_TOKEN = "ExponentPushToken[YOUR_TOKEN_HERE]"
    
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python send_push_notification.py <push_token> [title] [body]")
        print("")
        print("Examples:")
        print('  python send_push_notification.py "ExponentPushToken[abc123]" "Hello" "World"')
        print('  python send_push_notification.py "ExponentPushToken[abc123]"')
        return
    
    push_token = sys.argv[1]
    title = sys.argv[2] if len(sys.argv) > 2 else "Test Notification"
    body = sys.argv[3] if len(sys.argv) > 3 else "This is a test notification from Python!"
    
    client = ExpoPushClient()
    
    print(f"📱 Sending notification to: {push_token[:20]}...")
    print(f"📧 Title: {title}")
    print(f"💬 Body: {body}")
    print()
    
    # Send notification
    result = client.send_notification(
        push_token=push_token,
        title=title,
        body=body,
        data={"source": "python_script", "timestamp": str(int(__import__('time').time()))}
    )
    
    if "error" in result:
        print(f"❌ Error: {result['error']}")
        return
    
    print("✅ Notification sent successfully!")
    print(f"🎫 Response: {json.dumps(result, indent=2)}")
    
    # Extract receipt IDs if available
    if isinstance(result, dict) and "data" in result:
        receipt_id = result.get("data", {}).get("id")
        if receipt_id:
            print(f"\n📋 Receipt ID: {receipt_id}")
            
            # Check receipt after a short delay
            print("⏳ Waiting 2 seconds to check receipt...")
            __import__('time').sleep(2)
            
            receipt_result = client.get_receipts([receipt_id])
            print(f"📋 Receipt: {json.dumps(receipt_result, indent=2)}")

def test_batch_notifications():
    """Example of sending batch notifications"""
    
    client = ExpoPushClient()
    
    messages = [
        {
            "to": "ExponentPushToken[TOKEN_1]",
            "title": "Batch Notification 1",
            "body": "First message in batch",
            "data": {"index": 1}
        },
        {
            "to": "ExponentPushToken[TOKEN_2]",
            "title": "Batch Notification 2", 
            "body": "Second message in batch",
            "data": {"index": 2}
        }
    ]
    
    result = client.send_batch_notifications(messages)
    print(f"Batch result: {json.dumps(result, indent=2)}")

if __name__ == "__main__":
    main()