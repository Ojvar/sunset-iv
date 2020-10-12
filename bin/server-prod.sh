#!/usr/bin/env bash

echo "Sunset server starting"

echo "Sunset server:: Generating Routes manifest file"
ENV_FILE=.prod.env npm run routes-manifest 

echo "Sunset server:: Generating JS/CSS/... files"
npm run prod

echo "Sunset server:: Run server in production mode"
npm run server-start
