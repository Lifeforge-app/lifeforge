/**
 * Theme color properties have been migrated to CSS variable arbitrary architecture.
 * Color props (bg, color, borderColor) are now resolved at runtime via
 * resolveColorProp() and rendered as CSS custom properties (--lf-bg, --lf-color, etc.)
 * with corresponding utility classes generated in colors/color-props.css.ts.
 *
 * The tokenizedThemeColorProperties sprinkles definition has been removed.
 */
