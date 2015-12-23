'use strict'

var ldapAuth = require('../lib/passport-ldap/ldaputil')

ldapAuth.auth({
  url: 'ldap://server-dc01.hujiang.com:389',
  timeout: 1000,
  bind: { dn: 'hjqa@hujiang.com', credentials: 'Abc123' },
  search:
  {
    dn: 'DC=hujiang,DC=com',
    scope: 'sub',
    objectClass: 'user',
    field: 'mail'
  }
}, 'gongtianyu@hujiang.com', 'gty@456')
.then(function(user) {
  console.log(user)
})
.catch(ldapAuth.LdapUtilAuthError, function(err) {
  console.log(err)
})
.catch(function(err) {
  console.log(err)
})
