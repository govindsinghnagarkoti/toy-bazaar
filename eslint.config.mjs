// eslint.config.js
export default [
  {
    ignores: ["node_modules/**", ".next/**"], // skip build + deps
    rules: {
      "no-unused-vars": "off",
      "no-undef": "off",
      "no-console": "off",
      "no-debugger": "off",
      "react/react-in-jsx-scope": "off",
      "react/no-unescaped-entities": "off",
      "react/display-name": "off",
      "import/no-anonymous-default-export": "off",

      // Next.js specific rules — all disabled
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-img-element": "off",
      "@next/next/no-page-custom-font": "off",
      "@next/next/no-typos": "off",
      "@next/next/no-duplicate-head": "off",
      "@next/next/no-sync-scripts": "off",
      "@next/next/no-title-in-document-head": "off",
      "@next/next/no-script-in-document": "off",
      "@next/next/no-document-import-in-page": "off",
      "@next/next/no-head-import-in-document": "off",
      "@next/next/google-font-display": "off",
      "@next/next/google-font-preconnect": "off",
      "@next/next/no-missing-suspense": "off",
    },
  },
];
