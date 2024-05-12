import {ZodType} from 'zod'

declare module 'zod' {
    interface ZodType {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        metadata(): Record<string, any>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        associateMetadata(meta: Record<string, any>): this
    }
}

ZodType.prototype.metadata = function () {
    return this._def.meta
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
ZodType.prototype.associateMetadata = function (meta: Record<string, any>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const This = (this as any).constructor

    return new This({
        ...this._def,
        meta
    })
}
