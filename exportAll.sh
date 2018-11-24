#!/usr/bin/env bash

uri="mongodb://localhost/linguo"
collections=("users" "levels" "words" "lessons" "games" "questions" "answers")

for c in "${collections[@]}"
do
  echo mongoexport --uri $uri -c $c -o seeds/$c.json --pretty --jsonArray
  mongoexport --uri $uri -c $c -o seeds/$c.json --pretty --jsonArray
done
