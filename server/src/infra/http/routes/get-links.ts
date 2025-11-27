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
          sortBy: z.enum(['createdAt']).optional(),
          sortDirection: z.enum(['asc', 'desc']).optional(),
          page: z.coerce.number().optional().default(1),
          pageSize: z.coerce.number().optional().default(20),
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
            total: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { originalUrl, shortUrl, sortBy, sortDirection, page, pageSize } =
        request.query

      const result = await getLinks({
        originalUrl: originalUrl,
        shortUrl: shortUrl,
        sortBy: sortBy,
        sortDirection: sortDirection,
        page: page,
        pageSize: pageSize,
      })

      const { links, total } = unwrapEither(result)

      return reply.status(200).send({ links, total })
    }
  )
}
