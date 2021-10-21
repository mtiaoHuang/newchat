'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  IMG_URL: '"http://1.14.180.113:8092"',
  SOCKET_URL: '"http://1.14.180.113:8092"'
})
