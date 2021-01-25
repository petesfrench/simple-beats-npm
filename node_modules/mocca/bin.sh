#!/usr/bin/env bash

default_args() {
    local opts=""
    if [ -f .mocha.opts ]; then
        opts="${opts} --opts .mocha.opts"
    fi
    if [ -f .moccarc ]; then
        opts="${opts} --opts .moccarc"
    fi

    local reporter=""
    if [ -n "$CI" ]; then
        rm -rf ./test-results.xml
        reporter="--reporter mocha-junit-reporter"
    fi

    echo "--bail \
        --check-leaks \
        --compilers js:mocca/babel \
        --recursive \
        --require mocca/bootstrap \
        --require mocha-clean \
        --throw-deprecation \
        --trace-deprecation \
        ${reporter} \
        ${opts}"
}

mocha() {
    local npm2="./node_modules/mocca/node_modules/.bin/mocha"
    local npm3="./node_modules/.bin/mocha"

    #  in: "arg1 --arg2 -- arg3 --arg4"
    # out: "arg1 --arg2"
    local args="$(echo "$@")"
    args=${args%-- *}
    args=${args% }

    #  in: "arg1 --arg2 -- arg3 --arg4"
    # out: "arg3 --arg4"
    local pattern="$(echo "$@")"
    if [[ "$pattern" == *"-- "* ]]; then
        pattern=${pattern#*-- }
        pattern=${pattern# }

        # convert "a b" to "a,b"
        pattern=${pattern// /,}
        # convert "a,b" to "{a,b}" but "a" keeps as "a"
        if [[ "$pattern" == *","* ]]; then
            pattern="{$pattern}"
        fi
    else
        # ensure default: src
        pattern="src"
    fi

    # create full matching pattern
    pattern="./${pattern}/**/__tests__/*-test.js"

    # combine args
    local user_args="$pattern"
    if [ "" != "$args" ]; then
        user_args="$args $user_args"
    fi

    echo mocca $(default_args) "$user_args"
    if [ -x $npm2 ]; then
        $npm2 $(default_args) "$user_args"
    elif [ -x $npm3 ]; then
        $npm3 $(default_args) "$user_args"
    else
        echo "ERROR: Unable to locate mocha" >&2
        exit 1
    fi
}

mocha "$@"
