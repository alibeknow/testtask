import {s, getConfig} from '@lib/shared/config'
import * as path from 'path'

const folder = path.resolve(process.cwd(), `./config/`)
const schema = s.object({
    auth: s.object({
        jwt: s.object({
            secret: s.string()
        }),
        database: s.object({
            path: s.string()
        }),
        tcp: s.object({
            enable: s.boolean(),
            port: s.int()
        }),
        http: s.object({
            enable: s.boolean(),
            port: s.int()
        }),
        siwe: s.object({
            host: s.string(),
            port: s.int()
        })
    })
})

export const config = getConfig(schema, {
    folder: folder,
    files: ['config.yml']
})
