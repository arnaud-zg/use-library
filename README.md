# use-library

This repository is a workspace where I maintain **all my React hooks as reusable tools**.

It serves as a central place to:

- Develop and organize React hooks
- Display available hooks with links to their source code and npm packages

## Structure

```
.
├─ packages/
│  └─ immutable-instance/   # Example React hook
└─ .changeset/                  # Changesets for versioning and publishing
```

## Workflow

Install dependencies:

```bash
pnpm install
```

Build all packages:

```bash
pnpm -w build
```

Create and apply version updates with Changesets:

```bash
pnpm changeset
pnpm changeset version
```

Publish packages to npm:

```bash
pnpm changeset publish
```

## Available Hooks

- [immutable-instance](./packages/immutable-instance) - Makes immutable class instances reactive for front-end application

More hooks will be added over time.

## License

MIT
