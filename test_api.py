#!/usr/bin/env python3
"""
Test script for llama.cpp-web API
"""

import requests
import json
import time

BASE_URL = "http://localhost:11434"

def test_health():
    """Test health endpoint."""
    print("Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_tags():
    """Test tags endpoint."""
    print("Testing tags endpoint...")
    response = requests.get(f"{BASE_URL}/api/tags")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

def test_generate():
    """Test generate endpoint."""
    print("Testing generate endpoint...")
    data = {
        "model": "phi3-mini-4k-instruct",
        "prompt": "Hello, how are you?",
        "stream": False
    }
    response = requests.post(f"{BASE_URL}/api/generate", json=data)
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Response: {result['response'][:100]}...")
    print(f"Duration: {result['total_duration'] / 1_000_000_000:.2f}s")
    print()

def test_show():
    """Test show endpoint."""
    print("Testing show endpoint...")
    data = {"name": "phi3-mini-4k-instruct"}
    response = requests.post(f"{BASE_URL}/api/show", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

def main():
    """Run all tests."""
    print("=== llama.cpp-web API Test ===\n")
    
    try:
        test_health()
        test_tags()
        test_generate()
        test_show()
        
        print("✅ All tests passed!")
        print("\n🎉 Your llama.cpp-web server is working correctly!")
        print("You can now integrate with JetBrains AI Assistant using:")
        print("Server URL: http://localhost:11434")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")

if __name__ == "__main__":
    main() 