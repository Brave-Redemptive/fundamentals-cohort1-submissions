echo "WAVECOM NOTIFICATION SERVICE"
echo "============================="

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

API="http://localhost:5001/api/notifications"

send() {
  response=$(curl -s -w "%{http_code}" -X POST $API \
    -H "Content-Type: application/json" \
    -d "$1")

  http_code=${response: -3}
  body=${response%???}

  if [[ $http_code -eq 201 ]] && echo "$body" | grep -q "success"; then
    echo -e "${GREEN}QUEUED${NC}"
  else
    echo -e "${RED}FAILED (HTTP $http_code)${NC}"
    echo "Response: $body"
  fi
}

echo -e "${YELLOW}Sending 5 real enterprise notifications...${NC}\n"

echo "1. Salary Credit Alert (SMS)"
send '{
  "type": "sms",
  "to": "+2348034567890",
  "payload": {"message": "₦1,250,000.00 credited - Salary March 2025"}
}'

echo "2. Card Transaction Alert (SMS)"
send '{
  "type": "sms",
  "to": "+2347012345678",
  "payload": {"message": "₦85,000 spent at Shoprite Lagos"}
}'

echo "3. Login OTP (Email)"
send '{
  "type": "email",
  "to": "john@customer.com",
  "payload": {
    "subject": "Your Secure Login Code",
    "message": "Your OTP is <strong>729104</strong>"
  }
}'

echo "4. Delivery Update (Push)"
send '{
  "type": "push",
  "to": "fcm-xyz123",
  "payload": {
    "title": "Out for Delivery",
    "body": "Order #ORD-98765 arriving today 2-5PM"
  }
}'

echo "5. Fraud Alert (SMS)"
send '{
  "type": "sms",
  "to": "+2348034567890",
  "payload": {"message": "SECURITY ALERT: Unusual login detected"}
}'

echo -e "\n${YELLOW}All 5 notifications processed!${NC}"
echo "→ Worker logs: docker-compose logs -f worker"
echo "→ All jobs: http://localhost:5001/api/notifications"
echo "→ Failed jobs in DLQ: http://localhost:15672/#/queues/%2F/dlq"