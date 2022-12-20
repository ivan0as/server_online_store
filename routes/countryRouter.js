const Router = require('express')
const router = new Router()
const countryController = require('../controllers/countryController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('ADMIN'), countryController.create)
router.get('/', countryController.getAll)
router.put('/:id', checkRole('ADMIN'), countryController.update)
router.delete('/:id', checkRole('ADMIN'), countryController.delete)

module.exports = router