# Shiso

A content layer for [Next.js](https://nextjs.org/).

[Learn more](https://shiso.umami.is)

## Usage

### 1. Install the package

```shell
npm install @umami/shiso
```

### 2. Create page

In your `app` folder, create a folder for the content section you wish to add. In this case we are creating a section for `docs`.

```text
src
├── app
│   └── docs
│       └── [[...slug]]
│           └── page.jsx
```

In the `page.jsx` file, add the following code:

```javascript
import { Shiso } from '@umami/shiso';
import { next } from '@umami/shiso/server';
import config from 'path/to/shiso.config.json';

const { generateMetadata, generateStaticParams, renderPage } = next('docs', config);

export { generateMetadata, generateStaticParams };

export default renderPage(props => <Shiso {...props} />);
```

### 3. Write content

In `shiso.config.json`, set `docsConfigPath` to your Mintlify-style `docs.json` file. Then add `.mdx` files under `contentDir/docs` and reference them in `docs.json` navigation.

## License

MIT
