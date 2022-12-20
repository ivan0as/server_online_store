const Router = require('express')
const router = new Router()
const salesController = require('../controllers/salesController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', authMiddleware, salesController.create)
router.get('/all', checkRole('ADMIN'), salesController.getAll)
router.get('/user', authMiddleware, salesController.getAllUser)
router.get('/user/:id', authMiddleware, salesController.getOneUser)
router.put('/admin/:id', checkRole('ADMIN'), salesController.updateAdmin)

module.exports = router