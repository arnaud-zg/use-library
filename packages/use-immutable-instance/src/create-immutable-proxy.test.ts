import { describe, it, expect, vi } from "vitest";
import { createImmutableProxy } from "./create-immutable-proxy";

class Counter {
  constructor(public count: number = 0) {}

  increment(): Counter {
    return new Counter(this.count + 1);
  }

  decrement(): Counter {
    return new Counter(this.count - 1);
  }

  add(value: number): Counter {
    return new Counter(this.count + value);
  }

  getValue(): number {
    return this.count;
  }
}

describe("createImmutableProxy", () => {
  it("should call onInstanceChange when method returns new instance", () => {
    const counter = new Counter(0);
    const onChange = vi.fn();
    const proxy = createImmutableProxy(counter, onChange);

    proxy.increment();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(expect.any(Counter));
    expect(onChange.mock.calls[0][0].count).toBe(1);
  });

  it("should support method chaining", () => {
    const counter = new Counter(0);
    const onChange = vi.fn();
    const proxy = createImmutableProxy(counter, onChange);

    const result = proxy.increment().increment().add(5);

    expect(onChange).toHaveBeenCalledTimes(3);
    expect(result.getValue()).toBe(7);
  });

  it("should not call onInstanceChange for non-instance return values", () => {
    const counter = new Counter(5);
    const onChange = vi.fn();
    const proxy = createImmutableProxy(counter, onChange);

    const value = proxy.getValue();

    expect(onChange).not.toHaveBeenCalled();
    expect(value).toBe(5);
  });

  it("should handle multiple sequential operations", () => {
    const counter = new Counter(10);
    const onChange = vi.fn();
    const proxy = createImmutableProxy(counter, onChange);

    proxy.increment();
    proxy.decrement();
    proxy.add(3);

    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it("should preserve instance type through proxy", () => {
    const counter = new Counter(0);
    const onChange = vi.fn();
    const proxy = createImmutableProxy(counter, onChange);

    const result = proxy.increment();

    expect(result).toBeInstanceOf(Counter);
  });
});
