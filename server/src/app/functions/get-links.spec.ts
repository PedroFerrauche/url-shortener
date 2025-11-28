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
        ]

        vi.spyOn(db, 'select').mockImplementation(() => {
            const chain: any = {
                from: vi.fn().mockReturnThis(),
                where: vi.fn().mockReturnThis(),
                orderBy: vi.fn().mockReturnThis(),
                execute: vi.fn().mockResolvedValue(links),
            }
            return chain
        })

        const result = await getLinks({} as any)
        const payload = unwrapEither(result)
console.log(payload)
        expect(isRight(result)).toBe(true)
        expect(payload.links).toEqual(links)

        vi.restoreAllMocks()
    })
})