#!/bin/bash

TARGET=$1
JALANGI_PATH=$(npm explore jalangi2 -- pwd 2>/dev/null)

SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"
ROOT_PATH=$SCRIPT_PATH

node $JALANGI_PATH/src/js/commands/jalangi.js \
    --inlineSource --inlineIID \
    --analysis $ROOT_PATH/utils/sMemory/sMemory.js \
    --analysis $ROOT_PATH/utils/functionsExecutionStack.js \
    --analysis $ROOT_PATH/utils/sMemoryInterface.js \
    --analysis $ROOT_PATH/analysis/analysis.js \
    $TARGET | tee output.json