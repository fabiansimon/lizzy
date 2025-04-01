#!/bin/bash

# Test the license check endpoint
curl -X GET "http://localhost:5001/api/v1/license/validity?wallet=0x123&deviceId=device123"