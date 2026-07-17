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

## Import Conventions

1. **The `@` alias always points to the `src` folder of the current module.** Prefer using the `@` alias when the relative path would be longer (e.g. `@/modals/...` instead of `../../../modals/...`). Use relative paths only when the import is short and co-located (e.g. `./components/ActionMenu` or `../hooks/useToggleWatched`).

## UI Library Usage

1. **TAILWIND CSS IS STRICTLY PROHIBITED.** No Tailwind utility classes, no `@apply`, no `@reference`, no `@layer`, no `theme()` - in any file type (`.tsx`, `.css`, `.css.ts`, etc.). Every style must use UI primitives (`Box`, `Flex`, `Text`, etc.) and their props, or plain CSS custom properties. Third-party component APIs (`classNames`, `className`) that accept raw strings as a styling mechanism must use plain CSS class names or inline `style` objects - never Tailwind classes.

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
