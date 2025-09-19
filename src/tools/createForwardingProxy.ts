/**
 * Creates a proxy that forwards EVERYTHING to the current target.
 * The proxy has a stable identity, and you can update the target at runtime.
 */
export function createForwardingProxy<T extends object>(params: {
    accessBeforeSetErrorMessage?: string;
    isFunction: boolean;
}) {
    const {
        accessBeforeSetErrorMessage = "Assertion error: Forwarded proxy accessed too early",
        isFunction
    } = params;

    const checkSet = () => {
        if (target === undefined) {
            throw new Error(accessBeforeSetErrorMessage);
        }
    };

    let target: any = undefined;

    const handler: ProxyHandler<any> = {
        get(_t, prop, receiver) {
            checkSet();
            return Reflect.get(target, prop, receiver);
        },
        set(_t, prop, value, receiver) {
            checkSet();
            return Reflect.set(target, prop, value, receiver);
        },
        has(_t, prop) {
            checkSet();
            return Reflect.has(target, prop);
        },
        deleteProperty(_t, prop) {
            checkSet();
            return Reflect.deleteProperty(target, prop);
        },
        ownKeys(_t) {
            checkSet();
            return Reflect.ownKeys(target);
        },
        getOwnPropertyDescriptor(_t, prop) {
            checkSet();
            return Reflect.getOwnPropertyDescriptor(target, prop);
        },
        defineProperty(_t, prop, descriptor) {
            checkSet();
            return Reflect.defineProperty(target, prop, descriptor);
        },
        getPrototypeOf(_t) {
            checkSet();
            return Reflect.getPrototypeOf(target);
        },
        setPrototypeOf(_t, proto) {
            checkSet();
            return Reflect.setPrototypeOf(target, proto);
        },
        isExtensible(_t) {
            checkSet();
            return Reflect.isExtensible(target);
        },
        preventExtensions(_t) {
            checkSet();
            return Reflect.preventExtensions(target);
        },
        apply(_t, thisArg, args) {
            checkSet();
            return Reflect.apply(target, thisArg, args);
        },
        construct(_t, args, newTarget) {
            checkSet();
            return Reflect.construct(target, args, newTarget);
        }
    };

    // Use a dummy callable so proxy can stand in for both functions and objects
    const proxy = new Proxy(isFunction ? function () {} : {}, handler) as T;

    return {
        proxy,
        updateTarget(newTarget: T) {
            target = newTarget;
        }
    };
}
