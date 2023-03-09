const { Pharmacy } = require('../models/models')
const ApiError = require('../error/ApiError')
const status = require('../middleware/statusMiddleware')

class PharmacyController {
    async create(req, res, next) {
        try {
            const { address } = req.body
            const pharmacy = await Pharmacy.create({address})
            const response = status(pharmacy)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            const pharmacy = await Pharmacy.findAll()
            const response = status(pharmacy)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params
            const pharmacy = await Pharmacy.findOne({
                where: {id}
            })
            const response = status(pharmacy)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params
            const { address } = req.body
            await Pharmacy.update({address}, {where: { id: id }})
            const pharmacy = await Pharmacy.findOne({
                where: {id}
            })
            const response = status(pharmacy)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params
            const pharmacy = await Pharmacy.destroy({
                where: {id}
            })
            const response = status(pharmacy)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports =new PharmacyController()