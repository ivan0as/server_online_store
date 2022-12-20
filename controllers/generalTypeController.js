const { GeneralType } = require('../models/models')
const ApiError = require('../error/ApiError')
const status = require('../middleware/statusMiddleware')

class GeneralTypeController {
    async create(req, res, next) {
        try {
            const { name } = req.body
            const generalType = await GeneralType.create({name})
            const response = status(generalType)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            const generalType = await GeneralType.findAll()
            const response = status(generalType)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params
            const { name } = req.body
            await GeneralType.update({name}, {where: { id: id }})
            const generalType = await GeneralType.findOne({
                where: {id}
            })
            const response = status(generalType)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params
            const generalType = await GeneralType.destroy({
                where: {id}
            })
            const response = status(generalType)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports =new GeneralTypeController()