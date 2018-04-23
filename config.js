'use strict';

let environment = process.env.NODE_ENV;

function getPort() {
    if (environment === 'local') {
        return 3000;
    }
    return 6000;
}

module.exports = getPort;