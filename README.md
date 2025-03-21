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
import { getContent, getContentIds } from '@@umami/shiso/server';
import config from 'path/to/shiso.config.json';

export async function generateStaticParams() {
  const ids = await getContentIds('./src/content/docs');

  return ids.map((id: string) => ({
    id: id.split('/')
  }));
}

export default async function Page({ params }: { params: Promise<{ id: string[] }> }) {
  const content = await getContent(await params, './src/content/docs');

  return <Shiso type="docs" content={content} config={config} />;
}
```

### 3. Write content

In the folder you specified, start adding `.mdx` files.

## License

MIT
