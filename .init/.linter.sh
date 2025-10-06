#!/bin/bash
cd /home/kavia/workspace/code-generation/daily-word-guess-833-843/word_game_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

