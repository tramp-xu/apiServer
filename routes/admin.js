import express from 'express'
import Admin from '../controller/admin/admin'
const router = express.Router()

router.post('/register', Admin.register);
router.post('/', Admin.register);

export default router