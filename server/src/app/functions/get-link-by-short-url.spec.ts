import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getLinkByShortUrl } from './get-link-by-short-url'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isRight, isLeft, unwrapEither } from '@/infra/shared/either'

describe('get link by short url', () => {
  it('should be able to get link', async () => {
    const mockLink = {
      id: '1',
      originalUrl: 'http://google.com',
      shortUrl: 'abc123',
      clicks: 0,
      createdAt: new Date(),
    }

    // Mockar db.query.links.findFirst
    const findFirstSpy = vi
      .spyOn(db.query.links, 'findFirst')
      .mockResolvedValue(mockLink)

    const sut = await getLinkByShortUrl({ shortUrl: 'abc123' })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual(mockLink)
    expect(findFirstSpy).toHaveBeenCalledTimes(1)

    vi.restoreAllMocks()
  })

  it('should not be able to get link with a non-existent short url', async () => {
    vi.spyOn(db.query.links, 'findFirst').mockResolvedValue(undefined)

    const sut = await getLinkByShortUrl({ shortUrl: 'non-existent' })

    expect(isLeft(sut)).toBe(true)
  })
})
