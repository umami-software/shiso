# Shiso

A content layer for [Next.js](https://nextjs.org/).

[Learn more](https://shiso.umami.is)

## Usage

## 1. Install the package

```shell
npm install @umami/shiso
```

## 2. Create page

In your `app` folder, create a folder for the content section you wish to add. In this case we are creating a section for `docs`.

```text
src
├── app
│   └── docs
│       └── [[...slug]]
│           └── page.jsx
```

In the `page.jsx` file, add the following code:

```js
import { Shiso, Docs } from '@umami/shiso';
import { next } from '@umami/shiso/server';
import config from 'path/to/shiso.config.json';

const { generateMetadata, generateStaticParams, renderPage } = next(config);

export { generateMetadata, generateStaticParams };

export default renderPage(props => {
  return <Shiso {...props} component={<Docs />} />;
});
```

## 3. Write content

In the folder you specified, start adding `.mdx` files.

## License

MIT
