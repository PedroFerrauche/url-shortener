import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getLinkByShortUrl } from '@/app/functions/get-link-by-short-url'
import { isRight, unwrapEither } from '@/infra/shared/either'

export const getOriginalUrlLinkRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/link/original-url',
    {
      schema: {
        summary: 'Get original url from link by shorted url.',
        tags: ['links'],
        querystring: z.object({
          shortUrl: z.string(),
        }),
        response: {
          200: z.object({ originalUrl: z.string() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { shortUrl } = request.query

      const result = await getLinkByShortUrl({
        shortUrl: shortUrl,
      })

      if (isRight(result)) {
        return reply
          .status(200)
          .send({ originalUrl: unwrapEither(result).originalUrl })
      }

      return reply.status(404).send({ message: unwrapEither(result).message })
    }
  )
}
