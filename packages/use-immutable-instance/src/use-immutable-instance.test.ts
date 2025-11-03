import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useImmutableInstance } from './use-immutable-instance';

class TodoList {
  constructor(public items: string[] = []) {}

  addItem(item: string): TodoList {
    return new TodoList([...this.items, item]);
  }

  removeItem(index: number): TodoList {
    return new TodoList(this.items.filter((_, i) => i !== index));
  }

  getCount(): number {
    return this.items.length;
  }
}

describe('useImmutableInstance', () => {
  it('should initialize with initial instance', () => {
    const todoList = new TodoList(['Item 1']);
    const { result } = renderHook(() => useImmutableInstance(todoList));

    expect(result.current.getCount()).toBe(1);
    expect(result.current.items).toEqual(['Item 1']);
  });

  it('should update state when method returns new instance', () => {
    const todoList = new TodoList([]);
    const { result } = renderHook(() => useImmutableInstance(todoList));

    act(() => {
      result.current.addItem('New Item');
    });

    expect(result.current.getCount()).toBe(1);
    expect(result.current.items).toEqual(['New Item']);
  });

  it('should support method chaining', () => {
    const todoList = new TodoList([]);
    const { result } = renderHook(() => useImmutableInstance(todoList));

    act(() => {
      result.current.addItem('Item 1').addItem('Item 2').addItem('Item 3');
    });

    expect(result.current.getCount()).toBe(3);
    expect(result.current.items).toEqual(['Item 1', 'Item 2', 'Item 3']);
  });

  it('should handle removal operations', () => {
    const todoList = new TodoList(['Item 1', 'Item 2', 'Item 3']);
    const { result } = renderHook(() => useImmutableInstance(todoList));

    act(() => {
      result.current.removeItem(1);
    });

    expect(result.current.getCount()).toBe(2);
    expect(result.current.items).toEqual(['Item 1', 'Item 3']);
  });

  it('should not trigger re-render for non-instance return values', () => {
    const todoList = new TodoList(['Item 1']);
    const { result, rerender } = renderHook(() => useImmutableInstance(todoList));

    const countBefore = result.current.getCount();
    rerender();
    const countAfter = result.current.getCount();

    expect(countBefore).toBe(countAfter);
  });

  it('should maintain proxy reference stability', () => {
    const todoList = new TodoList([]);
    const { result, rerender } = renderHook(() => useImmutableInstance(todoList));

    const proxyBefore = result.current;
    rerender();
    const proxyAfter = result.current;

    // Proxy should be the same reference when instance hasn't changed
    expect(proxyBefore).toBe(proxyAfter);
  });

  it('should create new proxy after instance change', () => {
    const todoList = new TodoList([]);
    const { result } = renderHook(() => useImmutableInstance(todoList));

    const proxyBefore = result.current;

    act(() => {
      result.current.addItem('Item 1');
    });

    const proxyAfter = result.current;

    // Proxy should be different after instance change
    expect(proxyBefore).not.toBe(proxyAfter);
  });
});
