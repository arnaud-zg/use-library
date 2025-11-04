# immutable-instance

[![npm version](https://img.shields.io/npm/v/immutable-instance.svg)](https://www.npmjs.com/package/immutable-instance)
[![npm monthly downloads](https://img.shields.io/npm/dm/immutable-instance.svg)](https://www.npmjs.com/package/immutable-instance)
[![License: MIT](https://img.shields.io/npm/l/immutable-instance.svg)](https://www.npmjs.com/package/immutable-instance)

A small utility that makes **immutable class instances reactive**.  
It provides:

- `useImmutableInstance` → React hook
- `createImmutableProxy` → Framework-agnostic helper (Vue, Svelte, Solid, plain JS)

Designed for developers who want to keep domain logic separate from UI, following principles like **Object Calisthenics**.

---

## Installation

```bash
npm install immutable-instance
# or
pnpm add immutable-instance
# or
yarn add immutable-instance
```

## Usage

### React with `useImmutableInstance`

```ts
import { useImmutableInstance } from "immutable-instance";

class Cart {
  items = [];
  addItem(product) {
    return new Cart([...this.items, product]);
  }
  totalItems() {
    return this.items.length;
  }
}

export const CartComponent = ({ product }) => {
  const cart = useImmutableInstance(new Cart());

  const handleAdd = () => cart.addItem(product);

  return (
    <div>
      <button onClick={handleAdd}>Add Product</button>
      <p>Total items: {cart.totalItems()}</p>
    </div>
  );
};
```

### VueJS with `createImmutableProxy`

```ts
import { ref } from "vue";
import { createImmutableProxy } from "immutable-instance";

class Cart {
  constructor(public items: any[] = []) {}
  addItem(product) {
    return new Cart([...this.items, product]);
  }
  totalItems() {
    return this.items.length;
  }
}

const cart = ref(
  createImmutableProxy(new Cart(), (newInstance) => {
    cart.value = newInstance;
  })
);

const handleAdd = (product) => cart.value.addItem(product);
```

```html
<template>
  <div>
    <button @click="handleAdd('Product')">Add Product</button>
    <p>Total items: {{ cart.value.totalItems() }}</p>
  </div>
</template>
```

## Benefits

- Keeps **domain logic** and UI separate.
- Automatically re-renders components when instances change.
- Minimal boilerplate, ideal for **immutable objects**.
- Works in React (hook) or any framework via `createImmutableProxy`.

## Resources

<a href="https://open.substack.com/pub/arnaudzg/p/applying-object-calisthenics-principles?r=iih51&utm_campaign=post&utm_medium=web&showWelcomeOnShare=true">
  <img src="https://raw.githubusercontent.com/arnaud-zg/use-library/refs/heads/main/packages/immutable-instance/assets/article.jpg" alt="Applying Object Calisthenics Principles" width="300"/>
</a>

## License

MIT
