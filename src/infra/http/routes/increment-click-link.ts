import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { incrementClickLink } from '@/app/functions/increment-click-link'
import { isRight, unwrapEither } from '@/infra/shared/either'

export const incrementClickLinkRoute: FastifyPluginAsyncZod = async server => {
  server.put(
    '/link/click/:id',
    {
      schema: {
        summary: 'Increment click of link',
        tags: ['links'],
        params: z.object({
          id: z.string(),
        }),
        response: {
          201: z.null().describe('Link click incremented'),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      const result = await incrementClickLink({
        id: id,
      })

      if (isRight(result)) {
        return reply.status(201).send()
      }

      return reply.status(400).send({
        message:
          unwrapEither(result).message ??
          'Não foi possível efetuar o incremento de clique no link.',
      })
    }
  )
}
