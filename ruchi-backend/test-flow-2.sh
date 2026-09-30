#!/bin/bash
cd /home/claude/ruchi-backend

node server.js > /tmp/backend2.log 2>&1 &
SERVER_PID=$!
sleep 2

section() { printf "\n=== %s ===\n" "$1"; }

LOGIN1=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"soumy@kiit.ac.in","password":"testpass123"}')
TOKEN1=$(echo "$LOGIN1" | node -e "process.stdin.on('data',d=>console.log(JSON.parse(d).token))")

section "GET GROUPS (should show 11 seeded groups for KIIT)"
GROUPS=$(curl -s http://localhost:5000/api/groups -H "Authorization: Bearer $TOKEN1")
echo "$GROUPS" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const j=JSON.parse(d);console.log('count:',j.groups.length);console.log(j.groups[0]);})"

ANIME_GROUP_ID=$(echo "$GROUPS" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const j=JSON.parse(d);const g=j.groups.find(g=>g.category==='Anime & Manga');console.log(g.id);})")
echo "Anime group id: $ANIME_GROUP_ID"

section "JOIN GROUP"
curl -s -X POST "http://localhost:5000/api/groups/$ANIME_GROUP_ID/join" -H "Authorization: Bearer $TOKEN1"

section "GET GROUP DETAILS (is_member should be true)"
curl -s "http://localhost:5000/api/groups/$ANIME_GROUP_ID" -H "Authorization: Bearer $TOKEN1"

section "POST GROUP MESSAGE"
POST_RESULT=$(curl -s -X POST "http://localhost:5000/api/groups/$ANIME_GROUP_ID/messages" \
  -H "Authorization: Bearer $TOKEN1" -H "Content-Type: application/json" \
  -d '{"content": "What did you think of the latest chapter?"}')
echo "$POST_RESULT"

section "GET GROUP MESSAGES"
curl -s "http://localhost:5000/api/groups/$ANIME_GROUP_ID/messages" -H "Authorization: Bearer $TOKEN1"

MSG_ID=$(echo "$POST_RESULT" | node -e "process.stdin.on('data',d=>console.log(JSON.parse(d).message.id))")

section "REPORT CONTENT (moderation)"
curl -s -X POST http://localhost:5000/api/moderator/report \
  -H "Authorization: Bearer $TOKEN1" -H "Content-Type: application/json" \
  -d "{\"content_type\": \"group_message\", \"content_id\": \"$MSG_ID\", \"reason\": \"test_report\", \"description\": \"testing the report flow\"}"

section "GET REPORTS AS NON-MODERATOR (should 403)"
curl -s -w "\nHTTP %{http_code}\n" http://localhost:5000/api/moderator/reports -H "Authorization: Bearer $TOKEN1"

section "SOCKET.IO CONNECTION TEST"
node -e "
const { io } = require('socket.io-client');
const socket = io('http://localhost:5000', { auth: { token: '$TOKEN1' } });
socket.on('connect', () => { console.log('socket connected:', socket.id); socket.disconnect(); process.exit(0); });
socket.on('connect_error', (err) => { console.log('socket connect_error:', err.message); process.exit(1); });
setTimeout(() => { console.log('socket connection timed out'); process.exit(1); }, 4000);
"

kill $SERVER_PID 2>/dev/null
wait $SERVER_PID 2>/dev/null
echo -e "\nDone."
