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

const deleteLinkInput = z.object({
  id: z.string(),
})

type DeleteLinkInput = z.input<typeof deleteLinkInput>

export async function deleteLink(
  input: DeleteLinkInput
): Promise<Either<{ message: string }, { message: string }>> {
  const { id } = deleteLinkInput.parse(input)

  const getLinksInput = {
    id: id,
  }

  const existingLink = await getLinks(getLinksInput)

  if (unwrapEither(existingLink).total === 0) {
    return makeLeft({ message: 'Link not found.' })
  }

  await db.delete(schema.links).where(eq(schema.links.id, id))

  return makeRight({ message: 'Link deleted successfully.' })
}
