import express from 'express'
import{
    getAllUser,
    getUserById,
    addUser,
    UpdateUser,
    DelateUser
}
from '../controller/user_controller.js'

import { authenticate,authorize } from '../controller/auth_controller.js';
import { IsAdmin, IsMember } from '../middleware/role_validation.js';

const app= express()
app.use(express.json())

app.get('/',getAllUser)
app.get('/:id',getUserById)
app.post('/', addUser)
app.get('/:id', UpdateUser)
app.delete('/:id', DelateUser)

app.post('/login', authenticate)

export default app