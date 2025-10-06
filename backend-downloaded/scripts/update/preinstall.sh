#!/bin/bash

# Check if /tmp exists
if [ ! -e /home/maestro/duetto-analytics/tmp/ ]; then
  echo "Creating /tmp file..."
  touch /tmp
else
  echo "/tmp already exists, clearing its contents..."
  > /home/maestro/duetto-analytics/tmp  # Clear the contents of the file
fi