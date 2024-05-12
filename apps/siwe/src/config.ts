import {s, getConfig} from '@lib/shared/config'
import * as path from 'path'

const folder = path.resolve(process.cwd(), `./config/`)
const schema = s.object({
    siwe: s.object({
        auth: s.object({
            host: s.string(),
            port: s.int()
        }),
        jwt: s.object({
            secret: s.string()
        }),
        http: s.object({
            enable: s.boolean(),
            port: s.int()
        }),
        tcp: s.object({
            enable: s.boolean(),
            port: s.int()
        }),
        cache: s.object({
            ttl: s.int(),
            max_counts: s.int()
        })
    })
})

export const config = getConfig(schema, {
    folder: folder,
    files: ['config.yml']
})
