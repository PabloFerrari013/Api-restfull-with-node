import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { v4 as uuid } from 'uuid'

export async function transactionsRoutes(app: FastifyInstance) {
  app.post('/', async (req, res) => {
    const createTransactionBySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit'])
    })

    const { amount, type, title } = createTransactionBySchema.parse(req.body)

    await knex('transaction').insert({
      id: uuid(),
      title,
      amount: type === 'credit' ? amount : amount * -1
    })

    return res.status(201).send()
  })
}
