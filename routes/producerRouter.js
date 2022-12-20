const Router = require('express')
const router = new Router()
const producerController = require('../controllers/producerController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('ADMIN'), producerController.create)
router.get('/', producerController.getAll)
router.put('/:id', checkRole('ADMIN'), producerController.update)
router.delete('/:id', checkRole('ADMIN'), producerController.delete)

module.exports = router