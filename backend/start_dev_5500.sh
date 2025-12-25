#!/bin/bash
# Development server on port 5500 for testing mock changes
# Does NOT push to GitHub - local only

cd "$(dirname "$0")"

echo ""
echo "========================================"
echo "  Lions Den Vape & Glass - DEV PORT 5500"
echo "  (Mock changes only - NOT committed)"
echo "========================================"
echo ""

# Set PORT environment variable
export PORT=5500

# Run Flask in development mode
python app.py

echo ""
echo "Server stopped."

backend/start_dev_5500.bat
