# CashLenX i18n Design Roadmap

This note captures the current i18n gaps found during the Flutter design-port review. The goal is to help design and implementation converge before i18n is treated as ready.

## Immediate Gaps

### 1. Missing Translation Keys

Some `t(...)` calls reference keys that are not currently present in `src/app/i18n/en.xml`. These will render as raw key names in the UI.

- `add_transaction_income`
- `add_transaction_expense`
- `transactions_income`
- `transactions_expense`
- `category_management_expense`
- `category_management_income`
- `category_management_cancel_button`
- `setup_welcome_title`
- `setup_welcome_subtitle`

Action: add these keys to every language XML file and verify the key sets match exactly.

### 2. Remaining Hardcoded User-Facing Text

Several user-facing strings are still embedded directly in components instead of translation files.

Examples:

- Toast and validation messages in `Login.tsx` and `SignUp.tsx`
- Bottom navigation labels in `BottomNav.tsx`
- Relative date labels such as `Today` and `Yesterday`
- Weekday/month formatting in transaction grouping
- Currency names in `CurrencySetup.tsx`
- Accessibility and screen-reader labels in shared UI primitives, such as `Close`, `More`, `Previous`, and `Next`

Action: audit screen and shared component code for visible English strings, then move them into translation resources.

### 3. No Interpolation Support

Some strings already imply variables, for example:

```xml
<string name="category_management_no_categories">No {type} categories yet. Create one below!</string>
```

Current usage is plain `t(key)`, so placeholders such as `{type}` cannot be replaced safely.

Action: update the translation helper to support named interpolation, for example `t('key', { type: 'expense' })`.

### 4. Split Sentence Fragments

Some confirmation messages are assembled from multiple fragments, especially category deletion copy. This is fragile because sentence order differs between English, Simplified Chinese, and Traditional Chinese.

Action: prefer complete sentence templates with variables instead of concatenated fragments.

Example target shape:

```xml
<string name="category_delete_with_children">This will delete "{name}" and all {count} subcategories, including {records} transaction records. This action cannot be undone.</string>
```

### 5. Missing Pluralization Rules

The current design handles plural content through concatenation or separate strings, for example:

- `1 transaction`
- `{count} transactions`
- `{count} subcategories`

Action: define a pluralization strategy before adding more count-based UI. At minimum, provide helper APIs or explicit language-specific keys for singular/plural forms.

### 6. Locale-Aware Formatting Is Not Covered

The current i18n layer translates text but does not fully cover locale formatting.

Missing areas:

- Currency formatting
- Number separators
- Date formatting
- Month and weekday names
- Percent display

Action: introduce locale-aware formatters and connect them to the selected language and currency.

### 7. Language Switching Is Incomplete

The language selector changes text, but the broader app environment is not fully localized.

Missing areas:

- Updating document `lang`
- Applying selected locale to date and number formatters
- Ensuring validation and toast messages use translations
- Reporting or detecting missing keys during development

Action: treat language selection as app-level locale state, not only a text lookup setting.

### 8. Missing i18n Audit Tooling

There is no automated check that translation resources and code usage stay aligned.

Action: add a script or test that checks:

- Every `t('key')` exists in every XML file
- Every language XML file has the same key set
- Unused keys are reported
- Known screen directories have no obvious hardcoded user-facing English

## Recommended Priority

1. Fix missing keys and synchronize all XML files.
2. Add interpolation support.
3. Replace split sentence fragments with complete templates.
4. Add pluralization and locale-aware formatting.
5. Finish hardcoded string audit.
6. Add automated i18n checks to prevent regressions.

## Readiness Criteria

i18n should not be considered design-ready until:

- Switching languages does not expose raw translation keys.
- Core flows have no visible hardcoded English outside brand names.
- Count, date, currency, and confirmation text render naturally in each supported language.
- A CI or local audit can verify key consistency across all language files.
