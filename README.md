# passport-ldap

LDAP authentication strategy for Passport and Node.js

## Usage

### Install

```
npm install passport-ldap
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
