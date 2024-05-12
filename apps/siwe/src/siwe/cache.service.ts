import {Inject, Injectable} from '@nestjs/common'
import {CACHE_MANAGER, Cache} from '@nestjs/cache-manager'
@Injectable()
export class CacheService {
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

    async add(nonce: string): Promise<void> {
        const findedNonce = await this.cacheManager.get<string>(nonce)
        if (findedNonce) {
            return
        }
        await this.cacheManager.set(nonce, nonce)
    }

    async isPersist(nonce): Promise<boolean> {
        const data = await this.cacheManager.get<string>(nonce)
        if (data) {
            return true
        }
        return false
    }

    delete(nonce): Promise<void> {
        return this.cacheManager.del(nonce)
    }
}
