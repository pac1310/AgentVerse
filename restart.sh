#!/bin/bash

echo "Killing all Vite processes..."
# Find and kill all node processes running Vite
pkill -f "node.*vite"

# Wait a moment to ensure processes are terminated
sleep 2

# Check if any Vite processes are still running
if pgrep -f "node.*vite" > /dev/null; then
  echo "Some Vite processes are still running. Forcing termination..."
  pkill -9 -f "node.*vite"
  sleep 1
fi

echo "All Vite processes killed."

# Clean up any potential port locks, extended range for all ports being tried
echo "Cleaning up ports 5173-5200..."
for port in $(seq 5173 5200); do
  if lsof -i :$port -sTCP:LISTEN >/dev/null; then
    echo "Freeing port $port..."
    lsof -i :$port -sTCP:LISTEN -t | xargs -r kill -9
  fi
done

echo "Cleaning up any Node.js processes that might be holding ports..."
ps aux | grep node | grep -v grep | awk '{print $2}' | xargs -r kill -9

echo "Starting development server..."
npm run dev

echo "Development server started." 