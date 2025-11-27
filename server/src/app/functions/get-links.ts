import { and, asc, count, desc, eq, ilike } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeRight } from '@/infra/shared/either'

const getLinksInput = z.object({
  id: z.string().optional(),
  originalUrl: z.string().optional(),
  shortUrl: z.string().optional(),
  sortBy: z.enum(['createdAt']).optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20),
})

type GetLinksInput = z.input<typeof getLinksInput>

type GetLinksOutput = {
  links: {
    id: string
    originalUrl: string
    shortUrl: string
    clicks: number
    createdAt: Date
  }[]
  total: number
}

export async function getLinks(
  input: GetLinksInput
): Promise<Either<never, GetLinksOutput>> {
  const { page, pageSize, id, originalUrl, shortUrl, sortBy, sortDirection } =
    getLinksInput.parse(input)

  const [links, [{ total }]] = await Promise.all([
    db
      .select({
        id: schema.links.id,
        originalUrl: schema.links.originalUrl,
        shortUrl: schema.links.shortUrl,
        clicks: schema.links.clicks,
        createdAt: schema.links.createdAt,
      })
      .from(schema.links)
      .where(
        and(
          id ? eq(schema.links.id, id) : undefined,
          originalUrl
            ? ilike(schema.links.originalUrl, `%${originalUrl}%`)
            : undefined,
          shortUrl ? ilike(schema.links.shortUrl, `%${shortUrl}%`) : undefined
        )
      )
      .orderBy(fields => {
        if (sortBy && sortDirection === 'asc') {
          return asc(fields[sortBy])
        }

        if (sortBy && sortDirection === 'desc') {
          return desc(fields[sortBy])
        }

        return desc(fields.id)
      })
      .offset((page - 1) * pageSize)
      .limit(pageSize),

    db
      .select({ total: count(schema.links.id) })
      .from(schema.links)
      .where(
        and(
          originalUrl
            ? ilike(schema.links.originalUrl, `%${originalUrl}%`)
            : undefined,
          shortUrl ? ilike(schema.links.shortUrl, `%${shortUrl}%`) : undefined
        )
      ),
  ])

  return makeRight({ links, total })
}
