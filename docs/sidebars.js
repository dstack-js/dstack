/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

module.exports = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Tutorial',
      items: ['intro'],
    },
    {
      type: 'category',
      label: 'Relay',
      items: ['relay', 'deploy-relay'],
    },

    {
      type: 'category',
      label: 'Core Library',
      items: ['stack', 'pubsub', 'shard', 'store'],
    },
  ],
};
