import { randomUUID } from 'node:crypto'
import { describe, expect, it, vi } from 'vitest'
import { getLinks } from '@/app/functions/get-links'
import { db } from '@/infra/db'
import { isRight, unwrapEither } from '@/infra/shared/either'

describe('get links', () => {
    it('should be able to get the links', async () => {
        const links = [
            {
                id: randomUUID(),
                originalUrl: 'http://google.com',
                shortUrl: 'ex-1',
                clicks: 0,
                createdAt: new Date(),
            },
            {
                id: randomUUID(),
                originalUrl: 'http://google.com',
                shortUrl: 'ex-2',
                clicks: 5,
                createdAt: new Date(),
            }
        ];

        const orderByMock = vi.fn().mockResolvedValue(links)
        const whereMock = vi.fn().mockReturnValue({ orderBy: orderByMock })
        const fromMock = vi.fn().mockReturnValue({ where: whereMock })
        const selectMock = vi.spyOn(db, 'select').mockReturnValue({ from: fromMock } as any)

        const sut = await getLinks({})
        
        expect(isRight(sut)).toBe(true)
        const payload = unwrapEither(sut)
        expect(payload.links).toEqual(links)
        expect(selectMock).toHaveBeenCalled()
        expect(fromMock).toHaveBeenCalled()
        expect(whereMock).toHaveBeenCalled()
        expect(orderByMock).toHaveBeenCalled()

        vi.restoreAllMocks()
    })
})