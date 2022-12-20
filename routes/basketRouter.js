const Router = require('express')
const router = new Router()
const basketController = require('../controllers/basketController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, basketController.create)
router.get('/', authMiddleware, basketController.getBasketUser)
router.put('/:id', authMiddleware, basketController.update)
router.delete('/:id', authMiddleware, basketController.delete)
router.delete('', authMiddleware, basketController.deleteBasketUser)

module.exports = router