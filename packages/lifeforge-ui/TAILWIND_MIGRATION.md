# Tailwind → Vanilla-Extract Migration Progress

Components are considered **migrated** when they contain zero Tailwind utility classes in `className` props and use vanilla-extract (`.css.ts` / `style()` / `recipe()` / sprinkles) and/or primitive component props (`<Box>`, `<Flex>`, `<Grid>`, etc.) instead.

> Last updated: 2026-04-19

---

## Primitives

- [x] `Box`
- [x] `Container`
- [x] `Flex`
- [x] `Grid`
- [x] `Section`
- [x] `Slot`
- [x] `Text`

---

## Auth

- [ ] `OTPInputBox`
- [ ] `ResendOTPButton`
- [ ] `sso/SSOHeader`
- [ ] `sso/SSOAppMainView`
- [ ] `sso/UnauthorizedScreen`
- [ ] `WithMasterPassword/components/CreatePasswordScreen`
- [ ] `WithMasterPassword/components/LockedScreen`

---

## Data Display

- [x] `OptionsColumn`
- [x] `TagChip`
- [x] `TagsFilter`
- [x] `ViewModeSelector`
- [x] `VirtualGrid`
- [x] `Widget`
- [x] `Widget/components/TitleAndDesc`
- [x] `Widget/components/WidgetIcon`

---

## Feedback

- [x] `Alert`
- [x] `EmptyStateScreen`
- [x] `ErrorScreen`
- [x] `LoadingScreen`
- [x] `NotFoundScreen`

---

## Inputs

- [x] `Button`
- [x] `Button/components/ButtonIcon`
- [x] `Checkbox`
- [x] `ColorInput`
- [x] `ComboboxInput`
- [x] `CurrencyInput`
- [x] `DateInput`
- [x] `FAB`
- [x] `FileInput`
- [x] `IconInput`
- [ ] `Listbox`
- [x] `ListboxInput`
- [ ] `LocationInput`
- [x] `NumberInput`
- [x] `QRCodeScanner`
- [x] `RRuleInput`
- [x] `SearchInput`
- [x] `SliderInput`
- [x] `Switch`
- [ ] `TagsInput`
- [x] `TextAreaInput`
- [x] `TextInput`
- [x] `TextInput/components/TextInputBox`

---

## Layout

- [x] `Card`
- [x] `ContentWrapperWithSidebar`
- [x] `LayoutWithSidebar`
- [x] `ModuleHeader`
- [x] `ModuleWrapper`

---

## Navigation

- [x] `GoBackButton`
- [x] `Pagination`
- [ ] `sidebar/MainSidebarItem`
- [ ] `sidebar/SidebarDivider`
- [ ] `sidebar/SidebarItem`
- [ ] `sidebar/SidebarItem/components/SidebarItemWrapper`
- [ ] `sidebar/SidebarTitle`
- [ ] `sidebar/SidebarWrapper`
- [x] `Tabs`

---

## Overlays

- [x] `ContextMenu`
- [x] `ContextMenu/components/ContextMenuItem`
- [x] `ContextMenu/components/ContextMenuGroup`
- [x] `modals/core/ModalManager`
- [ ] `modals/core/components/ModalHeader`
- [ ] `modals/core/components/ModalWrapper`
- [ ] `modals/features/ConfirmationModal`
- [x] `modals/features/FormModal`
- [ ] `modals/features/ViewImageModal`

---

## Progress Summary

| Category       | Migrated | Total | % Done |
| -------------- | -------: | ----: | -----: |
| Primitives     |        7 |     7 |   100% |
| Auth           |        0 |     7 |     0% |
| Data Display   |        8 |     8 |   100% |
| Feedback       |        5 |     5 |   100% |
| Inputs         |       18 |    22 |    82% |
| Layout         |        5 |     5 |   100% |
| Navigation     |        3 |     9 |    33% |
| Overlays       |        5 |     9 |    56% |
| **Total**      |   **51** |**73** | **70%**|
