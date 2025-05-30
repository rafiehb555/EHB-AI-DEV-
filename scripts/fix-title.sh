#!/bin/bash
FILE="frontend/pages/_document.js"
if [ -f "$FILE" ]; then
  echo "🔍 Fixing <title> error in $FILE"
  sed -i "s/<title>\[.*\]<\/title>/<title>EHB AI System<\/title>/g" "$FILE"
  echo "✅ Fixed!"
else
  echo "❌ File not found: $FILE"
fi
