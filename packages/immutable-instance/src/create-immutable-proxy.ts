/**
 * Creates a proxy that intercepts method calls and triggers a callback
 * when the method returns a new instance of the same class.
 */
export function createImmutableProxy<T extends object>(
  target: T,
  onInstanceChange: (newInstance: T) => void
): T {
  return new Proxy(target, {
    get(current, prop, receiver) {
      const value = Reflect.get(current, prop, receiver);

      if (typeof value === "function") {
        return (...args: unknown[]) => {
          const method = value as (...args: unknown[]) => unknown;
          const result = method.apply(current, args);

          // If method returns new instance of same class → trigger callback
          if (result instanceof current.constructor) {
            const newInstance = result as T;
            onInstanceChange(newInstance);
            return createImmutableProxy(newInstance, onInstanceChange);
          }

          return result;
        };
      }

      return value;
    },
  });
}
