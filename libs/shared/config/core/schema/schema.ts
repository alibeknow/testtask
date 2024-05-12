import {EnumLike, z, ZodType, ZodTypeDef} from 'zod'
import {ZodTypeAny} from 'zod/lib/types'
import {NumberRegex} from './constants'

const array = <T extends ZodTypeAny>(schema: T) =>
    z.preprocess((v) => {
        if (typeof v === 'string') {
            try {
                const arr = JSON.parse(v)

                if (Array.isArray(arr)) {
                    return arr
                }
            } catch {
                // try split
            }

            if (v === '') {
                return []
            }

            return v.split(',')
        }

        return v
    }, z.array(schema))

const boolean = () =>
    z.preprocess((v) => {
        if (v === 'false') {
            return false
        }

        if (v === 'true') {
            return true
        }

        return v
    }, z.boolean())

const enm = <T extends EnumLike>(en: T) => {
    const isNumberLike = Object.values(en).some((v) => typeof v === 'number')

    if (isNumberLike) {
        return z.preprocess((v) => {
            return Number(v)
        }, z.nativeEnum(en))
    }

    return z.nativeEnum(en)
}

const host = () => z.string()

export const s = {
    string: z.string,
    array,
    /**
     * string which contains decimal number
     */
    bignumber: () => z.string().regex(NumberRegex),
    int: () => z.coerce.number().int(),
    /**
     * float in interval [0, 1]
     */
    fraction: () => z.coerce.number().gte(0).lte(1),
    /**
     * float in interval [0, 100]
     */
    percent: () => z.coerce.number().gte(0).lte(100),
    float: () => z.coerce.number(),
    bigint: () => z.coerce.bigint(),
    object: z.object,
    enum: enm,
    options: z.enum,
    url: () => z.string().url(),
    host,
    boolean,
    literal: z.literal,
    record: z.record
}
