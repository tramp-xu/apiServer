import express from 'express'
import ThirdParty from '../controller/thirdParty/api'
import passport from 'passport'
// 第三方登录
import passportConfig from '../passport/passport'

const router = express.Router()

// router.post('/github', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getGithub);

// // auth
// router.post('/auth/github', passport.authenticate('github'));
// router.post('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (requestAnimationFrame, res) => {
//   res.redirect(req.session.returnTo || '/');
// });

router.get('/login', ThirdParty.login)


export default router