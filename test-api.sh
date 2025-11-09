#!/bin/bash

# ATC Next Gen API Testing Script
echo "🧪 ATC Next Gen API Testing Script"
echo "======================================"

BASE_URL="http://localhost:3001"
TOKEN=""

echo ""
echo "📡 1. Testing Status Endpoint..."
echo "-------------------------------"
curl -s "$BASE_URL/api/status" | jq . || curl -s "$BASE_URL/api/status"

echo ""
echo ""
echo "👤 2. Testing User Registration..."
echo "--------------------------------"
curl -s -X POST "$BASE_URL/api/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "test123", 
    "role": "user"
  }' | jq . || curl -s -X POST "$BASE_URL/api/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "test123",
    "role": "user"
  }'

echo ""
echo ""
echo "🔐 3. Testing Login (Default Admin)..."
echo "------------------------------------"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }')

echo "$LOGIN_RESPONSE" | jq . || echo "$LOGIN_RESPONSE"

# Extract token for subsequent requests
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token' 2>/dev/null || echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
    echo ""
    echo "✅ Token received: ${TOKEN:0:50}..."
    
    echo ""
    echo "📦 4. Testing Product Creation..."
    echo "-------------------------------"
    curl -s -X POST "$BASE_URL/api/products" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d '{
        "name": "Test Product",
        "price": 999,
        "stock": 25,
        "description": "Test product for API demo",
        "category": "Test"
      }' | jq . || curl -s -X POST "$BASE_URL/api/products" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d '{
        "name": "Test Product",
        "price": 999,
        "stock": 25,
        "description": "Test product for API demo",
        "category": "Test"
      }'

    echo ""
    echo ""
    echo "📋 5. Testing Get All Products..."
    echo "-------------------------------"
    curl -s -X GET "$BASE_URL/api/products" \
      -H "Authorization: Bearer $TOKEN" | jq . || curl -s -X GET "$BASE_URL/api/products" \
      -H "Authorization: Bearer $TOKEN"

    echo ""
    echo ""
    echo "⚠️  6. Testing Low Stock Products..."
    echo "-----------------------------------"
    curl -s -X GET "$BASE_URL/api/products/low-stock" \
      -H "Authorization: Bearer $TOKEN" | jq . || curl -s -X GET "$BASE_URL/api/products/low-stock" \
      -H "Authorization: Bearer $TOKEN"

    echo ""
    echo ""
    echo "💰 7. Testing Total Value Calculation..."
    echo "--------------------------------------"
    curl -s -X GET "$BASE_URL/api/products/total-value" \
      -H "Authorization: Bearer $TOKEN" | jq . || curl -s -X GET "$BASE_URL/api/products/total-value" \
      -H "Authorization: Bearer $TOKEN"

else
    echo ""
    echo "❌ Login failed - Cannot test protected endpoints"
fi

echo ""
echo ""
echo "✅ API Testing Complete!"
echo "======================="