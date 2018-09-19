module.exports = {
  port: 27017,
  database: 'mongodb://localhost/apiServer',
  session: {
    name: 'Loverca',
    secret: 'Loverca',
    cookie: {
      maxAge: 1000
    }
  }
}