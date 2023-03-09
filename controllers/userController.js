const { User } = require('../models/models')
const ApiError = require('../error/ApiError')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const validator = require('email-validator')
const parsePhoneNumber = require('libphonenumber-js')
const status = require('../middleware/statusMiddleware')

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role}, 
        process.env.SECRET_KEY,
        {expiresIn:'24h'}
    )
}

const checkingRolesCorrectness = (role) => {
    if (role == "USER" || role == "ADMIN") {
        return true
    } else {
        return false
    }
}

const tokenUser = (token, user) => {
    return response = {
        token: token,
        user: user
    }
}

class UserController {
    async registration(req, res, next) {
        try {
            const {email, password, phoneNumber, name} = req.body
            if (!email || !password) {
                return next(ApiError.badRequest('Некорректный email или password'))
            }
            if (!validator.validate(email)) {
                return next(ApiError.badRequest('Некорректный email'))
            }
            const candidate = await User.findOne({where: {email}})
            if (candidate) {
                return next(ApiError.badRequest('Пользователь с таким email уже существует'))
            }
            const phoneNumberValidated = parsePhoneNumber(phoneNumber, 'RU')
            if (!phoneNumberValidated.isValid()) {
                return next(ApiError.badRequest('Некорректный номер телефона'))
            }
            const hashPassword = await bcrypt.hash(password, 5)
            const user = await User.create({email, password: hashPassword, phoneNumber: phoneNumberValidated.number, name})
            const token = generateJwt(user.id, user.email, user.role, user.phoneNumber, user.name)
            const userData = tokenUser(token, user)
            const response = status(userData)
            return res.json(response)
        } catch(e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body
            const user = await User.findOne({where: {email}})
            if (!user) {
                return next(ApiError.internal('Пользователь не найден'))
            }
            let comparePassword = bcrypt.compareSync(password, user.password)
            if (!comparePassword) {
                return next(ApiError.internal('Указанный пароль не верен'))
            }
            const token = generateJwt(user.id, user.email, user.role, user.phoneNumber, user.name)
            const userData = tokenUser(token, user)
            const response = status(userData)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async check(req, res, next) {
        try {
            const token = generateJwt(req.user.id, req.user.email, req.user.role, req.user.phoneNumber, req.user.name)
            const user = await User.findOne({
                where: {id: req.user.id}
            })
            const userData = tokenUser(token, user)
            const response = status(userData)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {  
            const user = await User.findAll()
            const response = status(user)
            return res.json(response)
        } catch(e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params
            const user = await User.findOne({
                where: {id}
            })
            const response = status(user)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async updateUser(req, res, next) {
        try {
            const token = generateJwt(req.user.id, req.user.email, req.user.role, req.user.phoneNumber, req.user.name)
            let user = await User.findOne({
                where: {id: req.user.id}
            })
            const { email, password, phoneNumber, name } = req.body

            let phoneNumberSend = phoneNumber
            if (email) {
                if (!validator.validate(email)) {
                    return next(ApiError.badRequest('Некорректный email'))
                }
                const candidate = await User.findOne({where: {email}})
                if (candidate) {
                    return next(ApiError.badRequest('Пользователь с таким email уже существует'))
                }
            }
            if (phoneNumber) {
                const phoneNumberValidated = parsePhoneNumber(phoneNumber, 'RU')
                if (!phoneNumberValidated.isValid()) {
                    return next(ApiError.badRequest('Некорректный номер телефона'))
                }
                phoneNumberSend = phoneNumberValidated.number
            }
            await User.update({email, password, phoneNumber: phoneNumberSend, name}, {where: { id: req.user.id }})
            user = await User.findOne({
                where: {id: req.user.id}
            })
            const response = status(user)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params
            const { email, password, role, phoneNumber, name } = req.body
            let phoneNumberSend = phoneNumber
            if (!validator.validate(email) && email) {
                return next(ApiError.badRequest('Некорректный email'))
            }
            if (!checkingRolesCorrectness(role) && role) {
                return next(ApiError.badRequest('Некорректна указана роль'))
            }
            if (phoneNumber) {
                const phoneNumberValidated = parsePhoneNumber(phoneNumber, 'RU')
                if (!phoneNumberValidated.isValid()) {
                    return next(ApiError.badRequest('Некорректный номер телефона'))
                }
                phoneNumberSend = phoneNumberValidated.number
            }
            await User.update({email, password, role, phoneNumber: phoneNumberSend, name}, {where: { id: id }})
            const user = await User.findOne({
                where: {id}
            })
            const response = status(user)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params
            const user = await User.destroy({
                where: {id}
            })
            const response = status(user)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getUser(req, res, next) {
        try {
            const token = generateJwt(req.user.id, req.user.email, req.user.role, req.user.phoneNumber, req.user.name)
            const user = await User.findOne({
                where: {id: req.user.id}
            })
            const response = status(user)
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports =new UserController()