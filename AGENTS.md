# Strict Instructions for opencode

## Golden Rules

1. **Never do anything the user didn't explicitly tell you to do.** Do not add code, remove code, refactor, restructure, create files, delete files, install packages, or run commands unless the user explicitly instructs you to.
2. **Do not make assumptions about user intent.** If the user points at something or says "this", ask what they want done before acting.
3. **Do not infer broader tasks from specific requests.** If the user asks to refactor one file, do not refactor related files. If the user asks to fix one bug, do not fix similar bugs elsewhere.
4. **Do not proactively fix issues you notice** unless asked. No style improvements, no dead code removal, no performance optimizations - unless the user asks.
5. **Do not update AGENTS.md** unless the user explicitly tells you to.
6. **If a file you previously edited has changed but not by you, treat it as a deliberate edit by the user and comply with it.** Do not second-guess or revert it - work with the current state as-is.
7. **Always re-read the file before making any changes.** Make edits based on the latest version of the file, not a stale read.
8. **Never do or think anything outside the scope of the latest instruction given by the user, unless otherwise instructed.** Do not add, remove, refactor, restructure, create, delete, or investigate anything beyond what the user's most recent message explicitly asks for, unless otherwise instructed. Do not explore or think about future steps, related files, or broader context.
9. **When refactoring with breaking changes, do not update consumer files unless explicitly told to.** Only modify the files the user directly asks you to change. Consumer-side updates are a separate task.

## Package Manager

1. **pnpm is the only allowed package manager for this project.** All project commands (install, build, lint, typecheck, dev, etc.) must be executed via `pnpm`. Never use `npx`, `bun`, `yarn`, `npm`, or any other package manager.
2. **When vendoring a module, force-add its `package.json` and entire `locales/` tree because `.gitignore` excludes them.**

## Import Conventions

1. **The `@` alias always points to the `src` folder of the current module.** Prefer using the `@` alias when the relative path would be longer (e.g. `@/modals/...` instead of `../../../modals/...`). Use relative paths only when the import is short and co-located (e.g. `./components/ActionMenu` or `../hooks/useToggleWatched`).

## UI Library Usage

1. **Tailwind CSS plus shadcn-style primitives is the forward styling direction.** New modules use Tailwind CSS (with `@tailwindcss/vite`) and shadcn-style UI. Pre-existing modules keep the current `@lifeforge/ui` + vanilla-extract stack until migrated. Within a module, do not mix both stacks.

2. **When being asked to utilize a component in the UI library (`@lifeforge/ui` or `packages/ui`), always check its corresponding `.stories.tsx` file first for usage examples before implementing.** Do not guess the API from the component source alone.

3. **Before adding `useModuleTranslation` / `t()` for localization, check if the component already handles it internally.** Components like `Button`, `ModalHeader`, `ModuleHeader`, `ContextMenuItem` (with `label` prop), and form fields auto-resolve their text via i18n. Only use `t()` explicitly when the component does not support internal localization (e.g. `Tabs` item names, raw `Text` elements).

## Context Provider Pattern

1. **When replacing prop drilling with a context provider, move all state, effects, and derived functions into the provider itself.** The provider should own `useState`, `useEffect`, `useRef`, and any `update*` functions so that child components remain stateless and only consume values via `useContext`.

   **Bad** (leaves logic in parent):

   ```tsx
   function Parent() {
     const [collapsed, setCollapsed] = useState(true)
     function updateItem(updates) { ... }
     useEffect(() => { ... }, [collapsed])
     return (
       <Ctx.Provider value={{ collapsed, setCollapsed, updateItem }}>
         <Child />
       </Ctx.Provider>
     )
   }
   ```

   **Good** (moves logic into provider):

   ```tsx
   export function ItemProvider({ children }) {
     const [collapsed, setCollapsed] = useState(true)
     function updateItem(updates) { ... }
     useEffect(() => { ... }, [collapsed])
     return (
       <Ctx value={{ collapsed, setCollapsed, updateItem }}>
         {children}
       </Ctx>
     )
   }
   ```

2. **This project uses React 19, so use `<Context>` directly as the provider element instead of `<Context.Provider>`.** React 19 supports rendering a `createContext` object directly as a provider.

## Component Separation Rules

1. **When separating a component, move any variable, hook, state, function, etc. that is only used by that component into the component's own file.** Do not leave them in the parent.

   **Examples:**

   - If a variable/state/hook/function is only used inside the extracted component, put it there instead of in the parent.

     **Bad** (leaves logic in parent):

     ```tsx
     // Parent
     const defaultCenter = { lat: 0, lng: 0 }
     return <Map defaultCenter={defaultCenter} />
     ```

     **Good** (moves logic into component):

     ```tsx
     // Map.tsx
     function Map() {
       const defaultCenter = { lat: 0, lng: 0 }
       return <div>...</div>
     }
     ```

## Frontend conventions

- New modules: use Tailwind CSS and shadcn-style UI. Pre-existing modules: use `@lifeforge/ui` with vanilla-extract. Use `clsx` when composing conditional classes.
- Persist filters and selected task IDs in query parameters, using the existing `nuqs` dependency so tasks remain bookmarkable.
- Allow one simple inline JSX conditional or render-only `map`, but derive compound boolean conditions and multiple or nested ternaries before `return`.
- Keep code free of comments, allowing JSDoc only for generally used public APIs.
- Extract named types only when reused, move crowded type collections to their own file, and never prefix type names with `I`.
- Invalidate data by query key, preferably without waiting, await mutations before invalidating when sequencing is required, and never use artificial timers for invalidation.
- Export declarations at their declaration site instead of collecting exports in trailing blocks.
- Validate every frontend change with Playwright - an interactive walk with screenshot evidence - not only a build and a test run.

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
