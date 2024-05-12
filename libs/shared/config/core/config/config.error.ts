export type Constructor<T, Arguments extends unknown[] = unknown[]> = new (
    ...arguments_: Arguments
) => T

export function createErrorClass<
    T extends Error,
    Args extends unknown[] = unknown[],
    BaseClass extends Constructor<T, Args> = Constructor<T, Args>
>(name: string, Base?: BaseClass | ErrorConstructor): ErrorConstructor {
    if (!Base) {
        //eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        return class extends Error {
            //@ts-ignore
            constructor(message?: string, options?: ErrorOptions) {
                //@ts-ignore
                super(message, options)
                this.name = name
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return class extends Base {
        //@ts-ignore
        constructor(message?: string, options?: ErrorOptions) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            super(message, options)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.name = name
        }
    }
}
export const ConfigError = createErrorClass('ConfigError')
