import { useMemo, useState } from "react";
import { createImmutableProxy } from "./create-immutable-proxy";

/**
 * React hook for managing an immutable class instance.
 * Updates state on method calls and supports chaining.
 */
export function useImmutableInstance<T extends object>(initialInstance: T): T {
  const [instance, setInstance] = useState<T>(initialInstance);

  const proxy = useMemo(
    () => createImmutableProxy(instance, setInstance),
    [instance]
  );

  return proxy;
}
