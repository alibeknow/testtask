import {s, getConfig} from '@lib/shared/config'
import * as path from 'path'

const folder = path.resolve(process.cwd(), `./config/`)
const schema = s.object({
    gateway: s.object({
        auth: s.object({
            host: s.string(),
            port: s.int()
        }),
        http: s.object({
            port: s.int()
        }),
        siwe: s.object({
            host: s.string(),
            port: s.int()
        }),
        jwt: s.object({
            secret: s.string()
        })
    })
})

export const config = getConfig(schema, {
    folder: folder,
    files: ['config.yml']
})
