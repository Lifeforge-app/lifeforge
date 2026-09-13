export const getPromptGenerationPrompt = (type: 'income' | 'expenses') => `
You will be given a list of ${type} transaction particulars from a personal finance system.
Your task:
- Carefully analyze these examples and summarize the naming convention used for ${type} particulars.
- Write a clear, detailed prompt for a language model (LLM), instructing it to generate new ${type} particulars in exactly this style and format, based on new receipt or ${type} details.
- The prompt must specify:
    - The naming convention, format, and structure.
    - How to select types/categories and optional details.
    - Any specific rules observed in the samples.
    - Provide at least three input-output examples based on the convention.
- The output should be a ready-to-use, English-language LLM prompt.
Your output should ONLY be the prompt for LLM to generate ${type} particulars matching the convention above.
`
