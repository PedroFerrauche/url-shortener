import { and, asc, count, desc, eq, ilike } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeRight } from '@/infra/shared/either'

const getLinksInput = z.object({
  id: z.string().optional(),
  originalUrl: z.string().optional(),
  shortUrl: z.string().optional(),
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
}

export async function getLinks(
  input: GetLinksInput
): Promise<Either<never, GetLinksOutput>> {
  const { id, originalUrl, shortUrl } =
    getLinksInput.parse(input)

  const [links] = await Promise.all([
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
      .orderBy(desc(schema.links.createdAt)),
  ])

  return makeRight({ links })
}
