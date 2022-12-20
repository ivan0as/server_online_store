const Router = require('express')
const router = new Router()
const salesLineupsController = require('../controllers/salesLineupsController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

router.get('/user', authMiddleware, salesLineupsController.getSaleUser)
router.get('/admin', checkRole('ADMIN'), salesLineupsController.getAllSale)

module.exports = router