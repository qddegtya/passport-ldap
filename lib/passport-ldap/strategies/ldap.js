'use strict'

/**
* Module dependencies.
*/
var ldapAuth = require('../ldaputil')
  , passport = require('passport')
  , util = require('util')

/**
* LdapStrategy
* Usage:
* passport.use({
*   "ldap": {}
* })
*
* @constructor LdapStrategy
* @param {Object} options
* @returns ldap strategy instance
*/
function LdapStrategy(options) {
  passport.Strategy.call(this)

  this.name = 'ldapstrategy'

  // check ldap option
  if(options.ldap) {
    this._ldapOptions = options.ldap
  } else {
    throw new Error('Need ldap option')
  }

  this._userNameField = options.uf || 'username'
  this._userPasswordField = options.pf || 'password'

  var self = this

  this._verify = function(username, password, done) {
    ldapAuth.auth(self._ldapOptions, username, password)
    .then(function(user) {
      done(null, user)
    })
    .catch(ldapAuth.LdapUtilAuthError, function(err) {
      done(null, false, {
        message: util.format('Ldap authentication error for user %s', err.username)
      })
    })
    .catch(function(err) {
      done(err)
    })
  }
}

/**
* inherits from `passport.Strategy`.
*/
util.inherits(LdapStrategy, passport.Strategy)


/**
* @protected Authenticate request
* @param {Object} request
* @param {Object} options
*/
LdapStrategy.prototype.authenticate = function (req, options) {
  // accept METHOD GET & POST
  var user = req.body[this._userNameField] || req.query[this._userNameField]
    , password = req.body[this._userPasswordField] || req.query[this._userPasswordField]
    , self = this

  if(!user || !password) {
    return this.fail({ message: options.badRequestMessage || 'Missing credentials' }, 400)
  }

  // done function
  function done(err, user, info) {
    if(err) { return self.error(err) }
    if(!user) { return self.fail(info) }
    self.success(user, info)
  }

  try {
    this._verify(user, password, done)
  } catch (err) {
    return self.error(err)
  }
}


/**
* Exports Module.
*/
module.exports = LdapStrategy
