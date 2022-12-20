const { Basket, Product } = require('../models/models')
const ApiError = require('../error/ApiError')
const checkUserId = require('../middleware/checkUserIdMiddleware')
const giveUserId = require('../middleware/giveUserIdMiddleware')
const status = require('../middleware/statusMiddleware')

const dataBasketProduct = (basket, product) => {
    return basketProduct = {
        basket,
        product: product
    }
}

class BasketController {
    async create(req, res, next) {
        try {
            const { amount, productId } = req.body

            const userId = giveUserId(req)

            if (!userId) {
                return next(ApiError.badRequest('Пользователь не авторизован'))
            }

            const basket = await Basket.create({amount, userId, productId})

            const {id} = basket

            const basketResult = await Basket.findOne({
                include: Product,
                where:{id}
            })

            const response = status(basketResult)
            return res.json(response)
        } catch(e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getBasketUser(req, res, next) {
        try {
            const userId = giveUserId(req)

            if (!userId) {
                return next(ApiError.badRequest('Пользователь не авторизован'))
            }

            const basketUser = await Basket.findAll({
                include: Product,
                where:{userId}
            })

            const response = status(basketUser)
            return res.json(response)
        } catch(e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params
            const { amount } = req.body
            let basketUser = await Basket.findOne({
                where: {id}
            })
            if (checkUserId(basketUser.userId, req)) {
                await Basket.update({amount}, {where: { id: id }})
                basketUser = await Basket.findOne({
                    where: {id}
                })
                const response = status(basketUser)
                return res.json(response)
            } else {
                return next(ApiError.forbidden('У пользователя нет прав на содержимое'))
            }
        } catch(e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params
            let basketUser = await Basket.findOne({
                where: {id}
            })
            if (checkUserId(basketUser.userId, req)) {
                basketUser = await Basket.destroy({
                    where: {id}
                })
                const response = status(basketUser)
                return res.json(response)
            } else {
                return next(ApiError.forbidden('У пользователя нет прав на содержимое'))
            }
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteBasketUser (req, res, next) {
        try {
            const userId = giveUserId(req)
    
            if (!userId) {
                return next(ApiError.badRequest('Пользователь не авторизован'))
            }

            const basketUser = await Basket.destroy({
                where: {userId}
            })
            const response = status(basketUser)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports =new BasketController()