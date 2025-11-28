import { randomUUID } from 'node:crypto'
import { describe, expect, it, vi } from 'vitest'
import { createLink } from '@/app/functions/create-link'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isRight } from '@/infra/shared/either'
import { ZodError } from "zod";

describe('created link', () => {
  it('should be able to create when link does not exist', async () => {
    const originalUrl = 'http://google.com'
    const shortUrl = 'test-001'

    const either = await import('@/infra/shared/either')
    const getLinksModule = await import('@/app/functions/get-links')

    vi.spyOn(getLinksModule, 'getLinks').mockResolvedValue(
      either.makeRight({ links: [], total: 0 })
    )

    const valuesMock = vi.fn().mockResolvedValue(undefined)

    const insertMock = vi
      .spyOn(db, 'insert')
      .mockImplementation(() => ({ values: valuesMock } as any))

    const sut = await createLink({ originalUrl, shortUrl })

    expect(isRight(sut)).toBe(true)
    expect(insertMock).toHaveBeenCalledWith(schema.links)
    expect(valuesMock).toHaveBeenCalledWith({ originalUrl, shortUrl })
    
    vi.restoreAllMocks()
  })

  it('should not be able to create when link already exists', async () => {
    const originalUrl = 'http://google.com'
    const shortUrl = 'test-001'

    const either = await import('@/infra/shared/either')
    const getLinksModule = await import('@/app/functions/get-links')

    const link = {
      id: randomUUID(),
      originalUrl: originalUrl,
      shortUrl: shortUrl,
      clicks: 0,
      createdAt: new Date()
    }

    vi.spyOn(getLinksModule, 'getLinks').mockResolvedValue(
      either.makeRight({ links: [link], total: 1 })
    )

    const insertSpy = vi.spyOn(db, 'insert')

    const sut = await createLink({ originalUrl, shortUrl })

    expect(isRight(sut)).toBe(false)
    expect(insertSpy).not.toHaveBeenCalled()

    vi.restoreAllMocks()
  })

  it('should not be able to create when short url is invalid', async () => {
    const originalUrl = 'http://google.com'
    const shortUrl = 't'

    try {
      await createLink({ originalUrl, shortUrl });
    }catch(error) {
      expect(error).toBeInstanceOf(ZodError);
    }
  })

  it('should not be able to create when original url is invalid', async () => {
    const originalUrl = 'google'
    const shortUrl = 'test-001'

    try {
      await createLink({ originalUrl, shortUrl });
    }catch(error) {
      expect(error).toBeInstanceOf(ZodError);
    }
  })
})
