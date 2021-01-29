#!/bin/bash

set -e

echo "Importing data to database"
DB_URI="${DB_URI:-mongodb://localhost:27017/dubai-landmarks}"

if [ -z "${DB_URI}" ]; then
  echo "Missing DB_URI variable"
  exit 1
fi

FILE_TO_IMPORT="${1}"
if [ ! -f "${FILE_TO_IMPORT}" ]; then
  echo "FILE TO IMPORT ${FILE_TO_IMPORT} does not exist"
  exit 1
fi

COLLECTION_NAME="${2}"
if [ -z "${COLLECTION_NAME}" ]; then
  echo "Missing Collection name to import into"
  exit 1
fi

echo "Importing ${FILE_TO_IMPORT} to ${COLLECTION_NAME}..."
mongoimport -c "${COLLECTION_NAME}" "${DB_URI}" "${FILE_TO_IMPORT}"
