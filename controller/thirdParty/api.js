import config from '../../config/index'

class ThirdParty {
  constructor () {
    this.login = this.login.bind(this)
  }

  async login (req, res, next) {
    let dataStr = (new Date()).valueOf()
    let { client_id, client_secret, scope } = config.thirdParty
    let path = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=${scope}&state=${dataStr}`
    // return res.redirect(302, '/register')
    // res.redirect(302, path)
    res.send({
      code: 200,
      success: true,
      message: '注册管理员成功',
      data: {
        url: path
      }
    })
  }

  async OAuthBack (req, res, next) {
    console.log(req);
    // const code = res.query.code
  }
}

export default new ThirdParty()