const { Country } = require('../models/models')
const ApiError = require('../error/ApiError')
const status = require('../middleware/statusMiddleware')

class CountryController {
    async create(req, res, next) {
        try {
            const {name} = req.body
            const country = await Country.create({name})
            const response = status(country)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            const country = await Country.findAll()
            const response = status(country)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params
            const country = await Country.findOne({
                where: {id}
            })
            const response = status(country)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params
            const { name } = req.body
            await Country.update({name}, {where: { id: id }})
            const country = await Country.findOne({
                where: {id}
            })
            const response = status(country)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params
            const country = await Country.destroy({
                where: {id}
            })
            const response = status(country)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports =new CountryController()