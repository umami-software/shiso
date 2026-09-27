import { Button } from '@umami/shiso/components';
import { BlueprintBackground } from './components/BlueprintBackground';

export const frontmatter = {
  title: 'Shiso — open-source docs framework',
  description: 'Build beautiful documentation sites with Vite, React, and MDX.',
  search: false,
};

export default function Home() {
  return (
    <div className="bp-hero">
      <BlueprintBackground />

      <div className="mx-auto max-w-3xl pt-32 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-balance sm:text-6xl md:text-7xl">
          Documentation made easy
        </h1>

        <p className="my-12 text-lg text-muted-foreground text-balance sm:text-xl">
          Write in Markdown or MDX, configure everything in one file, and publish a fast, searchable
          documentation site anywhere.
        </p>

        <div className="flex justify-center">
          <Button href="/docs" size="lg" icon="rocket" className="h-11 px-6 text-base">
            Get started
          </Button>
        </div>
      </div>
    </div>
  );
}
