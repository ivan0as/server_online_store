const { Producer } = require('../models/models')
const ApiError = require('../error/ApiError')
const status = require('../middleware/statusMiddleware')

class ProducerController {
    async create(req, res, next) {
        try {
            const {name} = req.body
            const producer = await Producer.create({name})
            const response = status(producer)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            const producer = await Producer.findAll()
            const response = status(producer)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params
            const producer = await Producer.findOne({
                where: {id}
            })
            const response = status(producer)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params
            const { name } = req.body
            await Producer.update({name}, {where: { id: id }})
            const producer = await Producer.findOne({
                where: {id}
            })
            const response = status(producer)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params
            const producer = await Producer.destroy({
                where: {id}
            })
            const response = status(producer)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports =new ProducerController()