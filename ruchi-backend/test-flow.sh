#!/bin/bash
set -e
cd /home/claude/ruchi-backend

node server.js > /tmp/backend.log 2>&1 &
SERVER_PID=$!
sleep 2

section() { printf "\n=== %s ===\n" "$1"; }

section "SIGNUP USER 1 (Soumy)"
curl -s -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"soumy@kiit.ac.in","password":"testpass123"}'

section "SIGNUP USER 2 (Friend)"
curl -s -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"friend@kiit.ac.in","password":"testpass123"}'

section "LOGIN USER 1"
LOGIN1=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"soumy@kiit.ac.in","password":"testpass123"}')
echo "$LOGIN1"
TOKEN1=$(echo "$LOGIN1" | node -e "process.stdin.on('data',d=>console.log(JSON.parse(d).token))")
USER1_ID=$(echo "$LOGIN1" | node -e "process.stdin.on('data',d=>console.log(JSON.parse(d).user.id))")

section "LOGIN USER 2"
LOGIN2=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"friend@kiit.ac.in","password":"testpass123"}')
echo "$LOGIN2"
TOKEN2=$(echo "$LOGIN2" | node -e "process.stdin.on('data',d=>console.log(JSON.parse(d).token))")
USER2_ID=$(echo "$LOGIN2" | node -e "process.stdin.on('data',d=>console.log(JSON.parse(d).user.id))")

section "GET PROFILE (user 1)"
curl -s http://localhost:5000/api/users/me -H "Authorization: Bearer $TOKEN1"

section "GET INTEREST CATEGORIES"
curl -s http://localhost:5000/api/interests/categories -H "Authorization: Bearer $TOKEN1"

section "USER1: START PROFILING (Anime, category_id=1)"
curl -s -X POST http://localhost:5000/api/interests/start-profiling \
  -H "Authorization: Bearer $TOKEN1" -H "Content-Type: application/json" \
  -d '{"category_id": 1}'

section "USER1: SUBMIT ANSWERS (Anime, 3 questions)"
curl -s -X POST http://localhost:5000/api/interests/submit-answer \
  -H "Authorization: Bearer $TOKEN1" -H "Content-Type: application/json" \
  -d '{"category_id": 1, "question_id": 1, "answer_value": "action"}'
echo ""
curl -s -X POST http://localhost:5000/api/interests/submit-answer \
  -H "Authorization: Bearer $TOKEN1" -H "Content-Type: application/json" \
  -d '{"category_id": 1, "question_id": 2, "answer_value": "one_piece"}'
echo ""
curl -s -X POST http://localhost:5000/api/interests/submit-answer \
  -H "Authorization: Bearer $TOKEN1" -H "Content-Type: application/json" \
  -d '{"category_id": 1, "question_id": 3, "answer_value": "subbed"}'

section "USER1: COMPLETE PROFILING (Anime)"
curl -s -X POST http://localhost:5000/api/interests/complete \
  -H "Authorization: Bearer $TOKEN1" -H "Content-Type: application/json" \
  -d '{"category_id": 1}'

section "USER2: SUBMIT + COMPLETE ANIME PROFILE (for matching)"
curl -s -X POST http://localhost:5000/api/interests/submit-answer \
  -H "Authorization: Bearer $TOKEN2" -H "Content-Type: application/json" \
  -d '{"category_id": 1, "question_id": 1, "answer_value": "action"}' > /dev/null
curl -s -X POST http://localhost:5000/api/interests/submit-answer \
  -H "Authorization: Bearer $TOKEN2" -H "Content-Type: application/json" \
  -d '{"category_id": 1, "question_id": 2, "answer_value": "one_piece"}' > /dev/null
curl -s -X POST http://localhost:5000/api/interests/submit-answer \
  -H "Authorization: Bearer $TOKEN2" -H "Content-Type: application/json" \
  -d '{"category_id": 1, "question_id": 3, "answer_value": "dubbed"}' > /dev/null
curl -s -X POST http://localhost:5000/api/interests/complete \
  -H "Authorization: Bearer $TOKEN2" -H "Content-Type: application/json" \
  -d '{"category_id": 1}'

section "USER1: GET MATCH RECOMMENDATIONS"
curl -s http://localhost:5000/api/matches/recommendations -H "Authorization: Bearer $TOKEN1"

section "USER1 -> USER2: SEND MESSAGE"
curl -s -X POST http://localhost:5000/api/chat/messages \
  -H "Authorization: Bearer $TOKEN1" -H "Content-Type: application/json" \
  -d "{\"receiver_id\": \"$USER2_ID\", \"content\": \"Hey, saw we both like One Piece!\"}"

section "USER1: GET CONVERSATIONS"
curl -s http://localhost:5000/api/chat/conversations -H "Authorization: Bearer $TOKEN1"

section "USER1: GET GROUPS (should be empty - none seeded yet)"
curl -s http://localhost:5000/api/groups -H "Authorization: Bearer $TOKEN1"

kill $SERVER_PID 2>/dev/null
wait $SERVER_PID 2>/dev/null
echo -e "\n\nDone."
