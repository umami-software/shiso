export default {
  "extends": "next/core-web-vitals",
  "rules": {
    "import/no-anonymous-default-export": "off",
    "react/display-name": "off",
    "import/order": [
      1,
      { "groups": ["external", "builtin", "internal", "sibling", "parent", "index"] }
    ]
  }
}
