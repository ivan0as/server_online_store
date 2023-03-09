const Router = require('express')
const router = new Router()
const sliderController = require('../controllers/sliderController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('ADMIN'), sliderController.create)
router.get('/', sliderController.getAll)
router.get('/:id', sliderController.getOne)
router.put('/:id', checkRole('ADMIN'), sliderController.update)
router.delete('/:id', checkRole('ADMIN'), sliderController.delete)

module.exports = router