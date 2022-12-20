const { Type } = require('../models/models')
const ApiError = require('../error/ApiError')
const status = require('../middleware/statusMiddleware')

class TypeController {
    async create(req, res, next) {
        try {
            const {name, generalTypeId} = req.body
            const type = await Type.create({name, generalTypeId})
            const response = status(type)
            return res.json(response)
        } catch(e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            const types = await Type.findAll()
            const response = status(types)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params
            const { name, generalTypeId } = req.body
            await Type.update({name, generalTypeId}, {where: { id: id }})
            const type = await Type.findOne({
                where: {id}
            })
            const response = status(type)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params
            const type = await Type.destroy({
                where: {id}
            })
            const response = status(type)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports =new TypeController()