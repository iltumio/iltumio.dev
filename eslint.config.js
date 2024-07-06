module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "overrides": [
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
    },
    "ignores": [
        "**/*.log",
        "**/.DS_Store",
        "*.",
        ".vscode/settings.json",
        ".history",
        ".yarn",
        "bazel-*",
        "bazel-bin",
        "bazel-out",
        "bazel-qwik",
        "bazel-testlogs",
        "dist",
        "dist-dev",
        "lib",
        "lib-types",
        "etc",
        "external",
        "node_modules",
        "temp",
        "tsc-out",
        "tsdoc-metadata.json",
        "target",
        "output",
        "rollup.config.js",
        "build",
        ".cache",
        ".vscode",
        ".rollup.cache",
        "dist",
        "tsconfig.tsbuildinfo",
        "vite.config.ts",
        "*.spec.tsx",
        "*.spec.ts",
        ".netlify",
        "pnpm-lock.yaml",
        "package-lock.json",
        "yarn.lock",
        "server"
    ]
}
