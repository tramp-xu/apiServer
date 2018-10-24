// 构造器
import AdminModel from '../../models/admin/admin'
// crypto模块的目的是为了提供通用的加密和哈希算法
import crypto from 'crypto'
// 上传文件插件
// import formidable from 'formidable'
import moment from 'moment'
import jwt from 'jsonwebtoken'
import config from '../../config'
import uuid from 'node-uuid'

class Admin {
  constructor () {
    this.register = this.register.bind(this)
    this.login = this.login.bind(this)
  }
  async register (req, res, next) {
    const {userName, password, status = 1} = req.body
    console.log(req.body);
    // 查询是否被注册
    // try {
      const admin = await AdminModel.findOne({userName})
      if (admin) {
        res.send({
          status: 0,
          success: false,
          type: 'USER_HAS_EXIST',
          message: '该用户已经存在',
        })
      } else {
        const adminTip = status === 1 ? '普通用户' : '超级管理员'
        const newpassword = this.encryption(password);
        const adminId = uuid.v1()
        const newAdmin = {
          userName, 
          password: newpassword, 
          id: adminId,
          createTime: moment().format('YYYY-MM-DD'),
          adminTip: adminTip,
          status,
        }
        await AdminModel.create(newAdmin)
        res.send({
          code: 200,
          success: true,
          message: '注册管理员成功',
        })
      }
    // } catch (err) {
    //   res.send({
    //     status: 0,
    //     success: false,
    //     type: 'REGISTER_ADMIN_FAILED',
    //     message: '注册失败',
    //   })
    // }
  }

  async login (req, res, next) {
    const {userName, password} = req.body
    const newpassword = this.encryption(password);
    try {
      const admin = await AdminModel.findOne({userName})
      if (!admin) {
        res.send({
          status: 0,
          success: false,
          type: 'USER_NO_EXIST',
          message: '账号/密码错误',
        })
      } else if (newpassword.toString() != admin.password.toString()) {
        res.send({
          status: 0,
          type: 'ERROR_PASSWORD',
          message: '账号/密码错误',
          success: false
        })
      } else {
        let token = jwt.sign({adminId: admin.adminId}, config.session.secret, {
          expiresIn: 10 * 1
        })

        res.send({
          code: 200,
          data: {
            token: token,
            user: admin
          },
          success: true
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
    try {
      const allAdmin = await AdminModel.find({}, '-_id -password').sort({id: -1}).skip(Number(offset)).limit(Number(limit))
      const count = await AdminModel.count()
			res.send({
        success: true,
				status: 1,
				data: {
          list: allAdmin,
          count: count
        },
			})
		} catch (err) {
			res.send({
        status: 0,
        success: false,
				type: 'ERROR_GET_ADMIN_LIST',
				message: '获取管理员列表失败'
			})
		}
  }

  encryption (password) {
		const newpassword = this.Md5(this.Md5(password).substr(2, 7) + this.Md5(password));
		return newpassword
	}
	Md5 (password) {
		const md5 = crypto.createHash('md5');
		return md5.update(password).digest('base64');
	}
}

export default new Admin()