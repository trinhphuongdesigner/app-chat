import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import react from "eslint-plugin-react";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...fixupConfigRules(compat.extends(
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "airbnb",
    "plugin:import/recommended",
    "plugin:prettier/recommended",
    "prettier",
)), {
    plugins: {
        react: fixupPluginRules(react),
        "simple-import-sort": simpleImportSort,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.commonjs,
        },

        ecmaVersion: "latest",
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },

            project: ["./jsconfig.json"],
        },
    },

    rules: {
        "import/no-unresolved": 0,
        "import/extensions": 0,
        "react/jsx-filename-extension": 0,
        "react/jsx-props-no-spreading": 0,
        "no-underscore-dangle": 0,

        "prettier/prettier": ["error", {
            endOfLine: "auto",
        }],
    },
}, {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],

    rules: {
        "simple-import-sort/imports": ["error", {
            groups: [
                ["^react", "^@?\\w"],
                ["^\\u0000"],
                ["^(@/components)(/.*|$)"],
                ["^(@)(/.*|$)"],
                ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
                ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
                ["^.+\\.?(css)$"],
            ],
        }],
    },
}];