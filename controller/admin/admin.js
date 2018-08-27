// 构造器
import AdminModel from '../../models/admin/admin'
// crypto模块的目的是为了提供通用的加密和哈希算法
import crypto from 'crypto'
// 上传文件插件
// import formidable from 'formidable'
import moment from 'moment'

class Admin {
  constructor () {
    this.register = this.register.bind(this)
    this.login = this.login.bind(this)
  }
  async register (req, res, next) {
    const {user_name, password, status = 1} = req.body
    
    // 查询是否被注册
    try {
      const admin = await AdminModel.findOne({user_name})
      if (admin) {
        res.send({
          status: 0,
          type: 'USER_HAS_EXIST',
          message: '该用户已经存在',
        })
      } else {
        const adminTip = status == 1 ? '管理员' : '超级管理员'
        const newpassword = this.encryption(password);
        const admin_id = +moment()
        const newAdmin = {
          user_name, 
          password: newpassword, 
          id: admin_id,
          create_time: moment().format('YYYY-MM-DD'),
          admin: adminTip,
          status,
        }
        await AdminModel.create(newAdmin)
        res.send({
          status: 1,
          message: '注册管理员成功',
        })
      }
    } catch (err) {
      res.send({
        status: 0,
        type: 'REGISTER_ADMIN_FAILED',
        message: '注册失败',
      })
    }
  }

  async login (req, res, next) {
    const {user_name, password} = req.body
    const newpassword = this.encryption(password);
    try {
      const admin = await AdminModel.findOne({user_name})
      if (!admin) {
        res.send({
          status: 0,
          type: 'USER_NO_EXIST',
          message: '账号/密码错误',
        })
      } else if (newpassword.toString() != admin.password.toString()) {
        res.send({
          status: 0,
          type: 'ERROR_PASSWORD',
          message: '账号/密码错误',
        })
      } else {
        res.send({
          success: '登录成功'
        })
      }
    } catch (err) {
      res.send({
        type: 'LOGIN_ADMIN_FAILED',
        message: '登录失败',
      })
    }
  }

  async search (req, res, next) {
    const {limit = 10, offset = 0} = req.query;
    try{
      const allAdmin = await AdminModel.find({}, '-_id -password').sort({id: -1}).skip(Number(offset)).limit(Number(limit))
      const count = await AdminModel.count()
			res.send({
				status: 1,
				data: {
          list: allAdmin,
          count: count
        },
			})
		}catch(err){
			console.log('获取超级管理列表失败', err);
			res.send({
				status: 0,
				type: 'ERROR_GET_ADMIN_LIST',
				message: '获取超级管理列表失败'
			})
		}
  }

  encryption(password){
		const newpassword = this.Md5(this.Md5(password).substr(2, 7) + this.Md5(password));
		return newpassword
	}
	Md5(password){
		const md5 = crypto.createHash('md5');
		return md5.update(password).digest('base64');
	}
}

export default new Admin()