const uuid = require('uuid')
const path = require('path')
const { Slider } = require('../models/models')
const ApiError = require('../error/ApiError')
const status = require('../middleware/statusMiddleware')

class SliderController {
    async create(req, res, next) {
        try {
            const { url } = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))

            const slider = await Slider.create({ url, img: fileName })

            const {id} = slider

            const sliderResult = await Slider.findOne({where:{id}})

            const response = status(sliderResult)
            return res.json(response)
        } catch(e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            const slider = await Slider.findAll()
            const response = status(slider)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params
            const slider = await Slider.findOne({
                where: {id}
            })
            const response = status(slider)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params
            const { url } = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            await Slider.update({url, img: fileName}, {where: { id: id }})
            const slider = await Slider.findOne({where: {id}})
            const response = status(slider)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params
            const slider = await Slider.destroy({
                where: {id}
            })
            const response = status(slider)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports =new SliderController()