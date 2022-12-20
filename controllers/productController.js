const uuid = require('uuid')
const path = require('path')
const { Product } = require('../models/models')
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
            let { producerId, countryId, typeId, limit, page } = req.query
            page = page || 1
            limit = limit || 9
            let offset = page * limit - limit
            let product;
            if (!producerId && !countryId && !typeId) {
                product = await Product.findAndCountAll({limit, offset})
            }
            if (!producerId && !countryId && typeId) {
                product = await Product.findAndCountAll({where:{typeId}, limit, offset})
            }
            if (!producerId && countryId && !typeId) {
                product = await Product.findAndCountAll({where:{countryId}, limit, offset})
            }
            if (producerId && !countryId && !typeId) {
                product = await Product.findAndCountAll({where:{producerId}, limit, offset})
            }
            if (!producerId && countryId && typeId) {
                product = await Product.findAndCountAll({where:{countryId, typeId}, limit, offset})
            }
            if (producerId && !countryId && typeId) {
                product = await Product.findAndCountAll({where:{producerId, typeId}, limit, offset})
            }
            if (producerId && countryId && !typeId) {
                product = await Product.findAndCountAll({where:{producerId, countryId}, limit, offset})
            }
            if (producerId && countryId && typeId) {
                product = await Product.findAndCountAll({where:{producerId, countryId, typeId}, limit, offset})
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