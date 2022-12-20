const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)
router.get('/user', authMiddleware, userController.getUser)
router.get('/', checkRole('ADMIN'), userController.getAll)
router.get('/:id', checkRole('ADMIN'), userController.getOne)
router.put('/', authMiddleware, userController.updateUser)
router.put('/:id', checkRole('ADMIN'), userController.update)
router.delete('/:id', checkRole('ADMIN'), userController.delete)




module.exports = router