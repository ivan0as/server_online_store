const Router = require('express')
const router = new Router()
const pharmacyController = require('../controllers/pharmacyController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('ADMIN'), pharmacyController.create)
router.get('/', pharmacyController.getAll)
router.get('/:id', pharmacyController.getOne)
router.put('/:id', checkRole('ADMIN'), pharmacyController.update)
router.delete('/:id', checkRole('ADMIN'), pharmacyController.delete)

module.exports = router