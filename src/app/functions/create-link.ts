import { z } from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeRight } from '@/infra/shared/either'

const createLinkInput = z.object({
  originalUrl: z.string(),
  shortUrl: z.string(),
})

type CreateLinkInput = z.input<typeof createLinkInput>

export async function createLink(
  input: CreateLinkInput
): Promise<Either<never, { originalUrl: string; shortUrl: string }>> {
  const { originalUrl, shortUrl } = createLinkInput.parse(input)

  await db.insert(schema.links).values({
    originalUrl: originalUrl,
    shortUrl: shortUrl,
  })

  return makeRight({ originalUrl, shortUrl })
}
