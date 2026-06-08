# Strict Instructions for opencode

## Golden Rules

1. **Never do anything the user didn't explicitly tell you to do.** Do not add code, remove code, refactor, restructure, create files, delete files, install packages, or run commands unless the user explicitly instructs you to.
2. **Do not make assumptions about user intent.** If the user points at something or says "this", ask what they want done before acting.
3. **Do not infer broader tasks from specific requests.** If the user asks to refactor one file, do not refactor related files. If the user asks to fix one bug, do not fix similar bugs elsewhere.
4. **Do not proactively fix issues you notice** unless asked. No style improvements, no dead code removal, no performance optimizations — unless the user asks.
5. **Do not update AGENTS.md** unless the user explicitly tells you to.
