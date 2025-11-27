import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { createLink } from '@/app/functions/create-link'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isRight } from '@/infra/shared/either'

describe('created link', () => {
  it('should be able to create a link', async () => {
    const randomValue = randomUUID()
    const originalUrl = `http://original-url-${randomValue}.com`
    const shortUrl = `short-url-${randomValue}`

    const sut = await createLink({
      originalUrl: originalUrl,
      shortUrl: shortUrl,
    })

    expect(isRight(sut)).toBe(true)

    const result = await db
      .select()
      .from(schema.links)
      .where(eq(schema.links.shortUrl, shortUrl))

    expect(result).toHaveLength(1)
  })
})
