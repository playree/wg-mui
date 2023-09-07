- [WireGuard Managenent UI](#wireguard-managenent-ui)
- [develop](#develop)
  - [ESLint \& Prettier](#eslint--prettier)
    - [`.vscode/settings.json`](#vscodesettingsjson)
    - [`.editorconfig`](#editorconfig)
    - [`.eslintrc.json`](#eslintrcjson)
    - [`prettierrc`](#prettierrc)
  - [Prisma](#prisma)
    - [`package.json`](#packagejson)
  - [Upgrade](#upgrade)


# WireGuard Managenent UI

# develop

Create a Next.js project pre-configured with NextUI

```sh
yarn create next-app -e https://github.com/nextui-org/next-app-template
```

## ESLint & Prettier
```sh
yarn add -D eslint eslint-plugin-import eslint-config-prettier @typescript-eslint/eslint-plugin
yarn add -D prettier prettier-plugin-tailwindcss eslint-plugin-prettier @trivago/prettier-plugin-sort-imports
yarn add -D eslint-plugin-react eslint-plugin-react-hooks
```

### `.vscode/settings.json`
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "tailwindCSS.classAttributes": ["class", "className", "classNames", "ngClass", ".*Styles*", ".*Styles:.*"],
  "tailwindCSS.experimental.classRegex": [["tv\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]]
}
```

### `.editorconfig`
```ini
root = true

[*]
charset = utf-8
end_of_line = lf
indent_size = 2
indent_style = space
insert_final_newline = true
max_line_length = 120
trim_trailing_whitespace = true

[*.md]
max_line_length = 0
trim_trailing_whitespace = false
```

### `.eslintrc.json`
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "next/core-web-vitals",
    "prettier"
  ]
}
```

### `prettierrc`
```json
{
  "trailingComma": "all",
  "tabWidth": 2,
  "semi": false,
  "singleQuote": true,
  "jsxSingleQuote": true,
  "endOfLine": "lf",
  "printWidth": 120,
  "importOrder": ["<THIRD_PARTY_MODULES>", "^[./]"],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true,
  "plugins": ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
  "tailwindFunctions": ["clsx", "tv", "twMerge", "twJoin"]
}
```

## Prisma

```sh
yarn add -D prisma ts-node
yarn add @prisma/client
yarn prisma init --datasource-provider sqlite
```

### `package.json`

```json
{
  "scripts": {
    "migrate": "prisma migrate dev",
    "generate": "prisma generate",
    "seed": "prisma db seed",
    "studio": "prisma studio"
  },
  "prisma": {
    "seed": "ts-node --compilerOptions {\"isolatedModules\":false,\"module\":\"commonjs\"} ./prisma/seed.ts"
  },
  "exclude": [
    "./prisma/seed.ts"
  ]
}
```

## Upgrade

```sh
yarn upgrade --latest
```
