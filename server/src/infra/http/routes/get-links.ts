import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getLinks } from '@/app/functions/get-links'
import { unwrapEither } from '@/infra/shared/either'

export const getLinksRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/links',
    {
      schema: {
        summary: 'Get links',
        tags: ['links'],
        querystring: z.object({
          originalUrl: z.string().optional(),
          shortUrl: z.string().optional(),
        }),
        response: {
          200: z.object({
            links: z.array(
              z.object({
                id: z.string(),
                originalUrl: z.string(),
                shortUrl: z.string(),
                clicks: z.number(),
                createdAt: z.date(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const { originalUrl, shortUrl } =
        request.query

      const result = await getLinks({
        originalUrl: originalUrl,
        shortUrl: shortUrl
      })

      const { links } = unwrapEither(result)

      return reply.status(200).send({ links })
    }
  )
}
