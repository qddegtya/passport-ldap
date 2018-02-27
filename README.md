[![NPM](https://nodei.co/npm/a-passport-ldap.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/a-passport-ldap/)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fqddegtya%2Fpassport-ldap.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fqddegtya%2Fpassport-ldap?ref=badge_shield)

# passport-ldap

LDAP authentication strategy for Passport and Node.js

## Usage

### Install

```
npm install a-passport-ldap
```

### Configure Strategy

```
passport.use(new LdapStrategy({
  'ldap': {
    url: 'your ldap server',
    timeout: 1000,
    bind: { dn: 'your username', credentials: 'your password' },
    search:
    {
      dn: 'DC=your dc,DC=com',
      scope: 'sub',
      objectClass: 'user',
      field: 'which field'
    }
  }
}));
```

### init

```
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// add
app.use(passport.initialize());
```

### Express

```
router.post('/ldap'
, function(req, res, next) {
  passport.authenticate('ldapstrategy', {session: false}, function(err, user, info) {
    if(!user || err) {
      res.status(401);
      return res.json({
        'code': 401,
        'message': 'Invalid authentication.'
      });
    }
    // mount
    req.user = user;
    next();
  })(req, res, next)
}
, function(req, res, next) {
  return res.json({
    'mail': req.user.mail,
    'name': req.user.name,
    'lastLogon': req.user.lastLogon
  });
})
```

## License

[The MIT License](http://opensource.org/licenses/MIT)


[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fqddegtya%2Fpassport-ldap.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fqddegtya%2Fpassport-ldap?ref=badge_large)