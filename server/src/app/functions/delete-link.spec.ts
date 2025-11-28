import { randomUUID } from 'node:crypto'
import { describe, expect, it, vi } from 'vitest'
import { deleteLink } from '@/app/functions/delete-link'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isLeft, isRight } from '@/infra/shared/either'
import { ZodError } from "zod";

describe('deleted link', () => {
  it('should be able to delete', async () => {
    const id = randomUUID()
    const originalUrl = 'http://google.com'
    const shortUrl = 'test-001'

    const either = await import('@/infra/shared/either')
    const getLinksModule = await import('@/app/functions/get-links')

    const link = {
      id: id,
      originalUrl: originalUrl,
      shortUrl: shortUrl,
      clicks: 0,
      createdAt: new Date()
    }

    vi.spyOn(getLinksModule, 'getLinks').mockResolvedValue(
      either.makeRight({ links: [link], total: 1 })
    )

    const deleteSpy = vi.spyOn(db, 'delete').mockImplementation(() => ({
      where: vi.fn().mockResolvedValue(true),
    } as any))

    const sut = await deleteLink({ id: id })

    expect(isRight(sut)).toBe(true)
    expect(deleteSpy).toHaveBeenCalledWith(schema.links)
    
    vi.restoreAllMocks()
  })

  it('should not be able to delete a non-existent id', async () => {
    const id = randomUUID()

    const either = await import('@/infra/shared/either')
    const getLinksModule = await import('@/app/functions/get-links')

    vi.spyOn(getLinksModule, 'getLinks').mockResolvedValue(
      either.makeRight({ links: [], total: 0 })
    )

    const whereSpyFn = vi.fn().mockResolvedValue([])
    const deleteSpy = vi.spyOn(db, 'delete').mockImplementation(() => ({
      where: whereSpyFn,
    } as any))

    const sut = await deleteLink({ id: id })

    expect(isLeft(sut)).toBe(true)
    expect(deleteSpy).not.toHaveBeenCalled()

    vi.restoreAllMocks()
  })

  it('should not be able to delete with empty id', async () => {
    const emptyId = ''

    try {
      await deleteLink({ id: emptyId })
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError)
    }
  })
})
