Generate TypeScript prop interface docstrings following this exact convention:

**FORMAT**: Use single-line JSDoc `/** Description. */` 

**PHRASING RULES**:
- Boolean props: "Whether the [component] is [state/condition]."
- Callback functions: "Callback function called when [event/condition]."
- String/value props: "The [description] [additional context]."
- CSS classes: "Additional CSS class names to apply to the [element]."
- Icons: "The icon to display [context]. Should be a valid icon name from Iconify."
- Required props: "Whether the [field] is required for form validation."
- Disabled props: "Whether the [element] is disabled and non-interactive."
- Labels: "The label text displayed [position] the [element] field."
- Values: "The current [type] value of the [element]."
- Callbacks with changes: "Callback function called when the [property] changes."

**SPECIAL PATTERNS**:
- For defaults: "The [description]. Defaults to '[value]'."
- For Tailwind CSS: "Additional CSS class names to apply to the [element]. Use `!` suffix for Tailwind CSS class overrides."
- For i18n namespace: "The i18n namespace for internationalization. See the [main documentation](https://docs.lifeforge.melvinchia.dev) for more details."
- For namespace props: "Additional properties for the translation function. Used for dynamic translations. See the [i18n documentation](https://docs.lifeforge.melvinchia.dev) for more details."
- For tProps props: "Additional properties for the translation function. Used for dynamic translations. See the [i18n documentation](https://docs.lifeforge.melvinchia.dev) for more details."

**REQUIREMENTS**:
- Start with capital letter, end with period
- Be concise but descriptive
- Use consistent terminology across similar props
- Include examples in parentheses when helpful (e.g., "#FF0000")

Generate docstrings for the selected interface.