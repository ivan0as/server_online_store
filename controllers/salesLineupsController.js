const { SalesLineups, Basket, Sales, Product } = require('../models/models')
const ApiError = require('../error/ApiError')
const checkUserId = require('../middleware/checkUserIdMiddleware')
const giveUserId = require('../middleware/giveUserIdMiddleware')
const statusRequies = require('../middleware/statusMiddleware')

class SalesLineupsController {

    async getSaleUser(req, res, next) {
        try {
            const { saleId } = req.query
            const sales = await Sales.findOne({
                where:{id: saleId}
            })
            if (checkUserId(sales.userId, req)) {
                const salesLineups = await SalesLineups.findAll({
                    where:{saleId}
                })
                const response = statusRequies(salesLineups)
                return res.json(response)
            } else {
                return next(ApiError.forbidden('У пользователя нет прав на содержимое'))
            }
        } catch(e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAllSale(req, res, next) {
        try {
            const { saleId } = req.query
            const salesLineups = await SalesLineups.findAll({
                where:{saleId}
            })
            const response = statusRequies(salesLineups)
            return res.json(response)
        } catch(e) {
            next(ApiError.badRequest(e.message))
        }
    }

    // async delete(req, res) {
    //     const productId = 1
    //     await SalesLineups.destroy({
    //         where: {productId}
    //     })
    //     return res.json("OK")
    // }
}

module.exports =new SalesLineupsController()