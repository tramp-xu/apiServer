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
  }
  async register (req, res, next) {
    const {user_name, password, status = 1} = req.body
    
    // 查询是否被注册
    try {
      const admin = await AdminModel.findOne({user_name})
      if (admin) {
        console.log('该用户已经存在');
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