#!/bin/bash

#populate
api="http://localhost:8080/api/users/"

curl -X POST --header "Content-Type: application/json" --header "Accept: application/json" -d "{\"facebookId\":\"10155119117759728\",\"displayName\":\"Marina Andrade\"}" "$api"


#curl -X DELETE --header "Content-Type: application/json" --header "Accept: application/json" "$api/570518dd908773010068c6f5"
