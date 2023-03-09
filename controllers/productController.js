const uuid = require('uuid')
const path = require('path')
const { Op } = require('sequelize')
const { Product, Country, Producer, Type } = require('../models/models')
const ApiError = require('../error/ApiError')
const status = require('../middleware/statusMiddleware')

class ProductController {
    async create(req, res, next) {
        try {
            const { name, description, price, producerId, countryId, typeId } = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))

            const product = await Product.create({ name, description, price, producerId, countryId, typeId, img: fileName })

            const response = status(product)
            return res.json(response)
        } catch(e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            let { producerId, countryId, typeId, typeName, searchName, limit, page } = req.query
            page = page || 1
            limit = limit || 9
            let offset = page * limit - limit

            const arrAdditionalVariables = {
                producerId: producerId,
                countryId: countryId,
                typeId: typeId,
                name: { [Op.iLike]: `%${searchName}%` },
            }

            if (!searchName) {
                delete arrAdditionalVariables.name
            }

            for (let key in arrAdditionalVariables) {
                if (!arrAdditionalVariables[key]) {
                    delete arrAdditionalVariables[key]
                }
            }

            let product

            if (arrAdditionalVariables.name) {
                product = await Product.findAndCountAll({
                    where:arrAdditionalVariables, limit, offset
                })
            } else {
                product = await Product.findAndCountAll({
                    include:[
                        {
                            model: Type,
                            where: {name: typeName}
                        },
                    ],
                    where:arrAdditionalVariables, limit, offset
                })
            }
    
            const response = status(product)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params
            const product = await Product.findOne({
                include: [
                    {
                        model: Country
                    },
                    {
                        model: Producer
                    }
                ],
                where: {id}
            })
            const response = status(product)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params
            const { name, description, price, producerId, countryId, typeId } = req.body
            await Product.update({name, description, price, producerId, countryId, typeId}, {where: { id: id }})
            const product = await Product.findOne({
                where: {id}
            })
            const response = status(product)
            return res.json(response)
        } catch(e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params
            const product = await Product.destroy({
                where: {id}
            })
            const response = status(product)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports =new ProductController()