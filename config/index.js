module.exports = {
  port: 27017,
  database: 'mongodb://localhost/apiServer',
  session: {
    name: 'Loverca',
    secret: 'Loverca',
    cookie: {
      maxAge: 1000 * 60 * 24
    }
  },
  thirdParty: {
    client_id: 'c33b77a006664f707c5f',
    client_secret: '466391b30d1354ad2fa13d2757d0bdcc05d8c1ee',
    scope: ['user']
  }
}