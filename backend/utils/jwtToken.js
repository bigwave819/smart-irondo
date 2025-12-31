import jwt from 'jsonwebtoken'
import { ENV } from '../config/env.js'


const jwtToken = (payload) => {
    jwt.sign({ payload }, ENV.JWT_SECRET, { expiresIn: '3d' })
}

export default jwtToken