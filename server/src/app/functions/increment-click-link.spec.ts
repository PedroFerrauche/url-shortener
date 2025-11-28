import { randomUUID } from 'node:crypto'
import { describe, expect, it, vi } from 'vitest'
import { incrementClickLink } from '@/app/functions/increment-click-link'
import { db } from '@/infra/db'
import { isRight, unwrapEither } from '@/infra/shared/either'
import { schema } from '@/infra/db/schemas'

describe('increment click link', () => {
    it('should be able to increment click', async () => {
        const id = randomUUID()
        const originalUrl = 'http://google.com'
        const shortUrl = 'test-001'

        const link = {
            id,
            originalUrl,
            shortUrl,
            clicks: 0,
            createdAt: new Date(),
        }

        const either = await import('@/infra/shared/either')
        const getLinksModule = await import('@/app/functions/get-links')

        vi
        .spyOn(getLinksModule, 'getLinks')
        .mockResolvedValue(either.makeRight({ links: [link] }) as any)

        const updatedLink = { ...link, clicks: link.clicks + 1 }
        const whereSpy = vi.fn().mockResolvedValue([updatedLink])
        const setSpy = vi.fn().mockReturnValue({ where: whereSpy })
        const updateSpy = vi.spyOn(db, 'update').mockImplementation(() => ({ set: setSpy } as any))

        const sut = await incrementClickLink({ id })
        
        expect(isRight(sut)).toBe(true)
        expect(unwrapEither(sut).clicks).toBe(1)
        expect(updateSpy).toHaveBeenCalledWith(schema.links)
        expect(setSpy).toHaveBeenCalledWith({ clicks: 1 })
        expect(whereSpy).toHaveBeenCalled()

        vi.restoreAllMocks()
    })
})