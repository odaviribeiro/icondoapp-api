import * as dotenv from 'dotenv'
dotenv.config()

import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { auth } from '../modules/auth/routes'
import { condominium } from '../modules/condominium/routes'

const app = new Hono()

app.route('/auth', auth)
app.route('/condominium', condominium)

serve(app)

export default app
