const darkCodeTheme = require('prism-react-renderer/themes/vsDark');

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

  plugins: [
    '@docusaurus/plugin-content-pages', [
      '@docusaurus/plugin-sitemap',
      {
        changefreq: 'weekly',
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      announcementBar: {
        id: 'announcement',
        content:
          '<a style="text-decoration: none; color: white" href="https://savelife.in.ua/">Support Ukraine <img width="14px" src="https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Ukraine.svg" /></a>',
        backgroundColor: 'black',
        textColor: 'white',
        isCloseable: true,
      },
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: true,
        respectPrefersColorScheme: false,
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
            href: '/changelog',
            label: 'Changelog',
            position: 'right',
          },
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
              {
                label: 'Core Library',
                to: '/docs/stack',
              },
            ],
          },
          {
            title: 'Cloud',
            items: [
              {
                label: 'Status',
                to: 'https://status.dstack.dev',
              },
              {
                label: 'Working with Relay',
                to: '/docs/relay',
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
              {
                label: 'Twitter',
                href: 'https://twitter.com/dstackjs',
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
                label: 'Changelog',
                to: '/changelog',
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
        theme: darkCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};
