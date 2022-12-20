const Router = require('express')
const router = new Router()
const generalTypeController = require('../controllers/generalTypeController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('ADMIN'), generalTypeController.create)
router.get('/', generalTypeController.getAll)
router.put('/:id', checkRole('ADMIN'), generalTypeController.update)
router.delete('/:id', checkRole('ADMIN'), generalTypeController.delete)

module.exports = router