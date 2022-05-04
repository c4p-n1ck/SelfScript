#!/bin/bash

if [ -f "SelfScript" ]; then
  rm -rf ./SelfScript;
fi

deno compile -A --unstable main.ts
./SelfScript
