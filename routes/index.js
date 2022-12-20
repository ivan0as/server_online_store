const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const basketRouter = require('./basketRouter')
const salesRouter = require('./salesRouter')
const productRouter = require('./productRouter')
const typeRouter = require('./typeRouter')
const producerRouter = require('./producerRouter')
const countryRouter = require('./countryRouter')
const general_typeRouter = require('./generalTypeRouter')
const sliderRouter = require('./sliderRouter')
const salesLineupsRouter = require('./salesLineupsRouter')

router.use('/user', userRouter)
router.use('/basket', basketRouter)
router.use('/sales', salesRouter)
router.use('/product', productRouter)
router.use('/type', typeRouter)
router.use('/producer', producerRouter)
router.use('/country', countryRouter)
router.use('/generalType', general_typeRouter)
router.use('/slider', sliderRouter)
router.use('/salesLineups', salesLineupsRouter)

module.exports = router