# use-immutable-instance

[![npm version](https://img.shields.io/npm/v/use-immutable-instance.svg)](https://www.npmjs.com/package/use-immutable-instance)
[![npm monthly downloads](https://img.shields.io/npm/dm/use-immutable-instance.svg)](https://www.npmjs.com/package/use-immutable-instance)
[![License: MIT](https://img.shields.io/npm/l/use-immutable-instance.svg)](https://www.npmjs.com/package/use-immutable-instance)

A React hook that makes **immutable class instances reactive** in React. It’s designed for front-end developers who want to separate domain logic from UI, following principles like Object Calisthenics.

Instead of manually bridging immutable objects with state, this hook lets you keep domain logic encapsulated while making the UI reactive.

## Installation

```bash
npm install use-immutable-instance
# or
pnpm add use-immutable-instance
# or
yarn add use-immutable-instance
```

## Usage

```ts
import { useImmutableInstance } from "use-immutable-instance";

class Cart {
  items = [];
  addItem(product) {
    return new Cart([...this.items, product]);
  }
  totalItems() {
    return this.items.length;
  }
  // ...other methods
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

## Benefits

- Keeps **domain logic** and UI separate.
- Automatically re-renders components when instances change.
- Minimal boilerplate, ideal for **immutable objects**.
- Perfect companion for applying **Object Calisthenics** principles.

## License

MIT
