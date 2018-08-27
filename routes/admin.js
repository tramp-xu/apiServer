import express from 'express'
import Admin from '../controller/admin/admin'
const router = express.Router()

router.post('/register', Admin.register);
router.post('/login', Admin.login);
router.get('/search', Admin.search);

export default router