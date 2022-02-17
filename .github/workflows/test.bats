setup() {
    load 'test_helper/bats-support/load'
    load 'test_helper/bats-assert/load'
    url="${BATS_URL:-http://localhost}"
}
get_csrf_token() {
    http --session=batsSession -j -b --pretty=format GET ${url}/info | grep csrf | sed 's/^.*"csrfToken": "\([^"]*\)".*$/\1/'
}
@test "fetch index" {
    run http GET ${url}/
    assert_output --partial '<title>Password Manager<'
    assert_output --partial '.js'
}
@test "fetch info" {
    run http GET ${url}/info
    assert_output --partial 'csrfToken'
}
@test "perform registration" {
    csrfToken=$(get_csrf_token)
    perform_test() {
        echo '{"username":"tester5","password":"{\"iv\":\"AAAAAAAAAAAAAAAA\",\"ciphertext\":\"YrwGKXPvoVvDpAgYq2UaevvwipM0E4f9Xct2o+a7jlz5ltb1apGM8WOPxdsz7sGvt6xEmPLiefRINaGRWu7uwSCJ8Ds0U00ETU2YCfcYSo9JE/Ilj2WQdyGrbQYOa4J1S24KQ+Lj+IW90mjwgTN23GCvaAL3tE+ACGngA8O974skcXwPwLhaEfdbZnkTQV7f\"}","email":"test@te.st"}' \
 | http --session=batsSession -j -b --pretty=format \
        PUT ${url}/user \
        Content-Type:application/json \
        X-CSRF-TOKEN:${csrfToken} \
        Accept:\*/\*

    }
    run perform_test
    assert_output --partial 'successfully'
}
@test "login" {
    csrfToken=$(get_csrf_token)
    perform_test() {
        echo '{"username":"tester5","password":"{\"iv\":\"AAAAAAAAAAAAAAAA\",\"ciphertext\":\"YrwGKXPvoVvDpAgYq2UaevvwipM0E4f9Xct2o+a7jlz5ltb1apGM8WOPxdsz7sGvt6xEmPLiefRINaGRWu7uwSCJ8Ds0U00ETU2YCfcYSo9JE/Ilj2WQdyGrbQYOa4J1S24KQ+Lj+IW90mjwgTN23GCvaAL3tE+ACGngA8O974skcXwPwLhaEfdbZnkTQV7f\"}"}' \
 | http --session=batsSession -j -b --pretty=format \
        POST ${url}/user/login \
        Content-Type:application/json \
        X-CSRF-TOKEN:${csrfToken} \
        Accept:\*/\*

    }
    run perform_test
    assert_output --partial 'logged in as tester5'
}
@test "get data" {
    perform_test() {
        http --session=batsSession -j --print=hb --pretty=format \
        GET ${url}/accounts \
        X-CSRF-TOKEN:${csrfToken} \
        Accept:\*/\*

    }
    run perform_test
    assert_output --partial '[]'
    assert_output --partial 'X-Openapi-Message: successful operation'
}
@test "logout" {
    perform_test() {
        http --session-read-only=batsSession -j --print=hb --pretty=format \
        GET ${url}/user/logout \
        X-CSRF-TOKEN:${csrfToken} \
        Accept:\*/\*

    }
    run perform_test

    assert_output --partial '"message": "logged out",'
    assert_output --partial '"success": true'
    assert_output --partial 'Set-Cookie: PHPSESSID=deleted;'
}
@test "check logout was successful" {
    perform_test() {
        http --session=batsSession -j --print=hb --pretty=format \
        GET ${url}/accounts \
        X-CSRF-TOKEN:${csrfToken} \
        Accept:\*/\*

    }
    run perform_test
    refute_output --partial 'X-Openapi-Message: successful operation'
}
