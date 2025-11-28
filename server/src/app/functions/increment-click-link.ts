import { eq } from 'drizzle-orm'
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

const incrementClickLinkInput = z.object({
  id: z.string(),
})

type IncrementClickLinkInput = z.input<typeof incrementClickLinkInput>

export async function incrementClickLink(
  input: IncrementClickLinkInput
): Promise<Either<{ message: string }, { message: string, clicks: number }>> {
  const { id } = incrementClickLinkInput.parse(input)

  const getLinksInput = {
    id: id,
  }

  const existingLink = await getLinks(getLinksInput)

  if (unwrapEither(existingLink).links.length === 0) {
    return makeLeft({ message: 'Link not found.' })
  }

  const result = unwrapEither(existingLink)
  const clicks = result.links[0].clicks + 1

  await db
    .update(schema.links)
    .set({ clicks: clicks })
    .where(eq(schema.links.id, id))

  return makeRight({ 
    message: 'Link click incremented successfully.', 
    clicks: clicks 
  })
}
