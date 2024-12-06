export default {
  docs: {
    tabs: [
      {
        id: 'docs',
        label: 'Documentation',
        url: '/docs',
      },
      {
        id: 'components',
        label: 'Components',
        url: '/docs/components',
      },
    ],
    navigation: {
      docs: [
        {
          group: 'Getting started',
          pages: [
            {
              label: 'Overview',
              url: '/docs',
            },
            {
              label: 'Installation',
              url: '/docs/install',
            },
          ],
        },
        {
          group: 'Basics',
          pages: [
            {
              label: 'Writing content',
              url: '/docs/writing-content',
            },
          ],
        },
      ],
      components: [
        {
          group: 'Components',
          pages: [
            {
              label: 'Overview',
              url: '/docs/components',
            },
          ],
        },
      ],
    },
  },
};
