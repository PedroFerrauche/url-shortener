import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { deleteLink } from '@/app/functions/delete-link'
import { isRight, unwrapEither } from '@/infra/shared/either'

export const deleteLinkRoute: FastifyPluginAsyncZod = async server => {
  server.delete(
    '/link/:id',
    {
      schema: {
        summary: 'Delete a link',
        tags: ['links'],
        params: z.object({
          id: z.string(),
        }),
        response: {
          201: z.null().describe('Link deleted'),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      const result = await deleteLink({
        id: id,
      })

      if (isRight(result)) {
        return reply.status(201).send()
      }

      return reply.status(400).send({
        message:
          unwrapEither(result).message ??
          'Não foi possível efetuar a exclusão do link.',
      })
    }
  )
}
