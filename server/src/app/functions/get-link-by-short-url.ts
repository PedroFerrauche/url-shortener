import { and, asc, count, desc, eq, ilike } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'

const getLinkByShortUrlInput = z.object({
  shortUrl: z.string(),
})

type GetLinkByShortUrlInput = z.input<typeof getLinkByShortUrlInput>

type GetLinkByShortUrlOutput = {
  id: string
  originalUrl: string
  shortUrl: string
  clicks: number
  createdAt: Date
}

export async function getLinkByShortUrl(
  input: GetLinkByShortUrlInput
): Promise<Either<{ message: string }, GetLinkByShortUrlOutput>> {
  const { shortUrl } = getLinkByShortUrlInput.parse(input)

  const link = await db.query.links.findFirst({
    where: eq(schema.links.shortUrl, shortUrl),
  })

  if (link === undefined) {
    return makeLeft({ message: 'O Link não foi encontrado.' })
  }

  return makeRight(link)
}
