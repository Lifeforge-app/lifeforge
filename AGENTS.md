# Strict Instructions for opencode

## Golden Rules

1. **Never do anything the user didn't explicitly tell you to do.** Do not add code, remove code, refactor, restructure, create files, delete files, install packages, or run commands unless the user explicitly instructs you to.
2. **Do not make assumptions about user intent.** If the user points at something or says "this", ask what they want done before acting.
3. **Do not infer broader tasks from specific requests.** If the user asks to refactor one file, do not refactor related files. If the user asks to fix one bug, do not fix similar bugs elsewhere.
4. **Do not proactively fix issues you notice** unless asked. No style improvements, no dead code removal, no performance optimizations — unless the user asks.
5. **Do not update AGENTS.md** unless the user explicitly tells you to.
6. **If a file you previously edited has changed but not by you, treat it as a deliberate edit by the user and comply with it.** Do not second-guess or revert it — work with the current state as-is.
7. **Always re-read the file before making any changes.** Make edits based on the latest version of the file, not a stale read.

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
