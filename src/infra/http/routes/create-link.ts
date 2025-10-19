import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { createLink } from '@/app/functions/create-link'
import { isRight } from '@/infra/shared/either'

const shortUrlRegex = /^[a-z0-9-_]{3,30}$/

export const createLinkRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/link',
    {
      schema: {
        summary: 'Create a link',
        tags: ['links'],
        querystring: z.object({
          originalUrl: z.string().url({ message: 'Informe uma url válida.' }),
          shortUrl: z
            .string()
            .min(3, {
              message: 'Informe no mínimo 3 caracteres',
            })
            .max(30, {
              message: 'Informe no máximo 30 caracteres',
            })
            .regex(shortUrlRegex, {
              message:
                'Informe uma url minúscula e sem espaço/caracter especial.',
            }),
        }),
        response: {
          201: z.null().describe('Link created'),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { originalUrl, shortUrl } = request.query

      const result = await createLink({
        originalUrl: originalUrl,
        shortUrl: shortUrl,
      })

      if (isRight(result)) {
        return reply.status(201).send()
      }

      return reply
        .status(400)
        .send({ message: 'Não foi possível efetuar a criação do link.' })
    }
  )
}
