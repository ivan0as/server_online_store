const { Sales, SalesLineups, Product, Basket, User } = require('../models/models')
const ApiError = require('../error/ApiError')
const checkUserId = require('../middleware/checkUserIdMiddleware')
const giveUserId = require('../middleware/giveUserIdMiddleware')
const statusRequies = require('../middleware/statusMiddleware')

const arrPaymentType = [
    "CASH",
    "TERMINAl",
]

const arrStatus = [
    "CREATED",
    "PROCESSED",
    "DELIVERY",
    "COMPLETED",
]

const checkPaymentType = (paymentType) => {
    for (let key in arrPaymentType) {
        if (arrPaymentType[key] == paymentType) {
            return true
        }
    }
    return false
}

const checkStatus = (status) => {
    for (let key in arrStatus) {
        if (arrStatus[key] == status) {
            return true
        }
    }
    return false
}

class SalesController {
    async create(req, res, next) {
        try {
            const { paymentType } = req.body
            let status = "CREATED"
            const userId = giveUserId(req)
            if (!userId) {
                return next(ApiError.badRequest('Пользователь не авторизован'))
            }
            if (!checkPaymentType(paymentType)) {
                return next(ApiError.badRequest('Не верно указан тип оплаты'))
            }
            let sales = await Sales.create({status, userId, paymentType})

            const { id } = sales
            const saleId = id

            const basketUser = await Basket.findAll({
                where: {userId}
            })

            await basketUser.map( async basket => {
                const { amount, productId } = basket
                const id = productId
                const product = await Product.findOne({
                    where: {id}
                })
                const { price } = product
                const priceOne = price
                const priceAll = priceOne * amount
                await SalesLineups.create({ amount, priceOne, priceAll, saleId, productId })
            })
            status = "PROCESSED"
            await Sales.update({status}, {where: { id: saleId }})

            sales = await Sales.findAll({
                include: [
                    {
                        model:SalesLineups,
                        include:[Product]
                    }
                ],
                where:{userId}
            })

            const response = statusRequies(sales)
            return res.json(response)
        } catch(e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            const sales = await Sales.findAll()
            const response = statusRequies(sales)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAllUser(req, res, next) {
        try {
            const userId = giveUserId(req)
    
            if (!userId) {
                return next(ApiError.badRequest('Пользователь не авторизован'))
            }
    
            const sales = await Sales.findAll({
                include: [
                    {
                        model:SalesLineups,
                        include:[Product]
                    }
                ],
                where:{userId}
            })
            const response = statusRequies(sales)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getOneUser(req, res, next) {
        try {
            const { id } = req.params

            const userId = giveUserId(req)
    
            if (!userId) {
                return next(ApiError.badRequest('Пользователь не авторизован'))
            }

            const sales = await Sales.findOne({
                include: [
                    {
                        model: User,
                        required: true
                    },
                    {
                        model:SalesLineups,
                        include:[Product],    
                    }
                ],
                where:{id}
            })
            const response = statusRequies(sales)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    // async updateUser(req, res, next) {
    //     try {
    //         const { id } = req.params
    //         const status = "PROCESSED"
    //         let sales = await Sales.findOne({
    //             where: {id}
    //         })
    //         if (sales.status == "CREATED") {
    //             if (checkUserId(sales.userId, req)) {
    //                 await Sales.update({status}, {where: { id: id }})
    //                 sales = await Sales.findOne({
    //                     where: {id}
    //                 })
    //                 return res.json(sales)
    //             } else {
    //                 return next(ApiError.forbidden('У пользователя нет прав на содержимое'))
    //             }
    //         } else {
    //             return next(ApiError.badRequest('Статус невозможно изменить'))
    //         }
    //     } catch(e) {
    //         next(ApiError.badRequest(e.message))
    //     }
    // }

    async updateAdmin(req, res, next) {
        try {
            const { id } = req.params
            const {status, paymentType} = req.body
            if (!checkStatus(status) && status) {
                return next(ApiError.badRequest('Не верно указан статус оплаты'))
            }
            if (!checkPaymentType(paymentType) && paymentType) {
                return next(ApiError.badRequest('Не верно указан тип оплаты'))
            }
            await Sales.update({status, paymentType}, {where: { id: id }})
            const sales = await Sales.findOne({
                where: {id}
            })
            const response = statusRequies(sales)
            return res.json(response)
        } catch(e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports =new SalesController()