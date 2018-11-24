#!/usr/bin/env bash

uri="mongodb://localhost/linguo_dev"
# uri="mongodb://szar_hf:4hqgyN6mYcvu0jRH@learning-shard-00-00-ni0dr.mongodb.net:27017,learning-shard-00-01-ni0dr.mongodb.net:27017,learning-shard-00-02-ni0dr.mongodb.net:27017/staging?ssl=true&replicaSet=learning-shard-0&authSource=admin&retryWrites=true"
collections=("users" "levels" "words" "lessons" "games" "questions" "answers")

for c in "${collections[@]}"
do
  echo mongoimport --drop --uri $uri -c $c --file seeds/$c.json --jsonArray
  mongoimport --drop --uri $uri -c $c --file seeds/$c.json --jsonArray
done
