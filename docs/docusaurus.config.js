const lightCodeTheme = require('prism-react-renderer/themes/vsLight');
const darkCodeTheme = require('prism-react-renderer/themes/vsDark');

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'DStack',
  tagline:
    'Technology stack as a library for developing semi-decentralized web applications',
  url: 'https://dstack.dev',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: '0x77dev',
  projectName: 'dstack',

  plugins: [
    [
      'docusaurus-plugin-typedoc',
      {
        id: 'lib',
        entryPoints: ['..'],
        entryPointStrategy: 'packages',
        sidebar: {
          fullNames: true,
        },
      },
    ],
  ],

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/dstack-js/dstack/edit/main/docs/',
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/dstack-js/dstack/edit/main/docs/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // algolia: {
      //   apiKey: '6407ba8e951f3066d9d6761b7959174e',
      //   indexName: 'dstack',
      //   appId: 'C0HURB3Q6E',
      //   contextualSearch: true,
      // },
      gtag: {
        trackingID: '3222457047',
        anonymizeIP: true,
      },
      googleAnalytics: {
        trackingID: 'UA-141789564-1',
        anonymizeIP: true,
      },
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: true,
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'DStack',
        logo: {
          alt: 'DStack Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Documentation',
          },
          { to: '/blog', label: 'Blog', position: 'left' },
          {
            href: 'https://github.com/dstack-js/dstack',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'NPM',
                href: 'https://www.npmjs.com/org/dstack-js',
              },
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/dstack',
              },
              {
                label: 'Discord',
                href: 'https://discord.link/dstack',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/dstack-js/dstack',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} <a href="https://github.com/dstack-js/dstack/graphs/contributors">DStack Contributors</a>`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};
