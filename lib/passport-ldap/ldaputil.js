'use strict'

var ldap = require('ldapjs')
  , Promise = require('bluebird')
  , util = require('util')

/**
* @constructor LdapUtilAuthError
* @param username
*/
function LdapUtilAuthError(username) {
  // super call
  Error.call(this, util.format('auth error for user "%s"', username))
  this.name = 'LdapUtilAuthError'
  this.username = username

  // except new LdapUtilAuthError().stack
  Error.captureStackTrace(this, LdapUtilAuthError)
}

/**
* inherits from Error
*/
util.inherits(LdapUtilAuthError, Error)

/**
* auth
* @param options
* @param username
* @param password
* @return promise
*/
function auth(options, username, password) {
  /**
  * connect to ldapserver
  * @return promise
  */
  function connect() {
    var resolver = Promise.defer()
      , client = ldap.createClient({
        url: options.url
        , timeout: options.timeout
        , maxConnections: 1
      })

    if(options.bind.dn) {
      // bind to ldapServer
      client.bind(options.bind.dn, options.bind.credentials, function (err) {
        if(err) {
          resolver.reject(err)
        } else {
          // return client
          resolver.resolve(client)
        }
      })
    } else {
      resolver.resolve(client)
    }

    return resolver.promise
  }

  /**
  * find from ldapserver
  * @param client
  * @return promise
  */
  function find(client) {
    var resolver = Promise.defer()
    , query = {
      scope: options.search.scope
    , filter: new ldap.AndFilter({
      filters: [
        new ldap.EqualityFilter({
          attribute: 'objectClass'
        , value: options.search.objectClass
        })
        , new ldap.EqualityFilter({
          attribute: options.search.field
        , value: username
        })
      ]
    })
    }

    client.search(options.search.dn, query, function (err, res) {
      if(err) {
        return resolver.reject(err)
      }

      function entryHandler(entry) {
        resolver.resolve(entry)
      }

      function endHandler() {
        resolver.reject(new LdapUtilAuthError(username))
      }

      function errorHandler(err) {
        resolver.reject(err)
      }

      // add event listeners
      res.on('searchEntry', entryHandler)
      res.on('end', endHandler)
      res.on('error', errorHandler)

      resolver.promise.finally(function() {
        res.removeListener('searchEntry', entryHandler)
        res.removeListener('end', endHandler)
        res.removeListener('error', errorHandler)
      })
    })

    return resolver.promise
  }

  /**
  * auth username, password for bind dn
  * @param client
  * @param entry
  * @return promise
  */
  function bind(client, entry) {
    return new Promise(function(resolve, reject) {
      client.bind(entry.object.dn, password, function(err) {
        if(err) {
          reject(new LdapUtilAuthError(username))
        } else {
          resolve(entry.object)
        }
      })
    })
  }

  // return promise chain
  return connect().then(function(client) {
    return find(client)
      .then(function(entry) {
        return bind(client, entry)
      })
      .finally(function() {
        client.unbind()
      })
  })

}

/**
* Module exports.
*/
module.exports = {
  'auth': auth,
  'LdapUtilAuthError': LdapUtilAuthError
}
