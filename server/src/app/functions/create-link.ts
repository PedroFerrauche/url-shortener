import { z } from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import {
  type Either,
  makeLeft,
  makeRight,
  unwrapEither,
} from '@/infra/shared/either'
import { getLinks } from './get-links'

const createLinkInput = z.object({
  originalUrl: z.string().url(),
  shortUrl: z.string().regex(/^[a-z0-9-_]{3,30}$/),
})

type CreateLinkInput = z.input<typeof createLinkInput>

export async function createLink(
  input: CreateLinkInput
): Promise<
  Either<{ message: string }, { originalUrl: string; shortUrl: string }>
> {
  const { originalUrl, shortUrl } = createLinkInput.parse(input)

  const getLinksInput = {
    originalUrl: originalUrl,
    shortUrl: shortUrl,
  }

  const existingLink = await getLinks(getLinksInput)

  if (unwrapEither(existingLink).links.length > 0) {
    return makeLeft({ message: 'Link already exists.' })
  }

  await db.insert(schema.links).values({
    originalUrl: originalUrl,
    shortUrl: shortUrl,
  })

  return makeRight({ originalUrl, shortUrl })
}
