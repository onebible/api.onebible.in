'use strict';

const _ = require('lodash');
const semver = require('semver');
const express = require('express');

var pmx = require('pmx').init({
  http: true, // HTTP routes logging (default: true)
  ignore_routes: [/socket\.io/, /notFound/], // Ignore http routes with this pattern (Default: [])
  errors: true, // Exceptions logging (default: true)
  custom_probes: true, // Auto expose JS Loop Latency and HTTP req/s as custom metrics
  network: true, // Network monitoring at the application level
  ports: true  // Shows which ports your app is listening on (default: false)
});

const app = express();

const LIVE_VERSION = '1.3.0';
const PORT = require('./config')();

app.get('/', (req, res) => {
  let appVersion = req.query.app_version;
  if (_.isUndefined(appVersion)) {
    return res.status(200).send({
      is_update_available: false,
      current_version: LIVE_VERSION
    });
  }

  let parsedAppVersion = appVersion;
  if (_.includes(appVersion, '-')) {
    parsedAppVersion = appVersion.split('-')[0];
  }

  if (semver.gt(LIVE_VERSION, parsedAppVersion)) {
    return res.status(200).send({
      is_update_available: true
    });
  } else {
    return res.status(200).send({
      is_update_available: false
    });
  }

});

let http = require('http');
let server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is up at ${PORT}`);
}).on('error', (err) => {
  console.log(`Failed! to start the server`, err);
});
