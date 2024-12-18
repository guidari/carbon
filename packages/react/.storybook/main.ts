/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';
import remarkGfm from 'remark-gfm';
import fs from 'fs';
import glob from 'fast-glob';
import path, { dirname, join } from 'path';
import react from '@vitejs/plugin-react';

// We can't use .mdx files in conjuction with `storyStoreV7`, which we are using to preload stories for CI purposes only.
// MDX files are fine to ignore in CI mode since they don't make a difference for VRT testing
const storyGlobs = [
  './Welcome/Welcome.mdx',
  '../src/**/*.stories.js',
  '../src/**/*.mdx',
  '../src/components/Tile/Tile.mdx',
  '../src/**/next/*.stories.js',
  '../src/**/next/**/*.stories.js',
  '../src/**/next/*.mdx',
  '../src/**/*-story.js',
];

const stories = glob
  .sync(storyGlobs, {
    ignore: ['../src/**/docs/*.mdx', '../src/**/next/docs/*.mdx'],
    cwd: __dirname,
  })
  // Filters the stories by finding the paths that have a story file that ends
  // in `-story.js` and checks to see if they also have a `.stories.js`,
  // if so then defer to the `.stories.js`
  .filter((match) => {
    const filepath = path.resolve(__dirname, match);
    const basename = path.basename(match, '.js');
    const denylist = new Set([
      'DataTable-basic-story',
      'DataTable-batch-actions-story',
      'DataTable-filtering-story',
      'DataTable-selection-story',
      'DataTable-sorting-story',
      'DataTable-toolbar-story',
      'DataTable-dynamic-content-story',
      'DataTable-expansion-story',
    ]);
    if (denylist.has(basename)) {
      return false;
    }
    if (basename.endsWith('-story')) {
      const component = basename.replace(/-story$/, '');
      const storyName = path.resolve(
        filepath,
        '..',
        'next',
        `${component}.stories.js`
      );
      if (fs.existsSync(storyName)) {
        return false;
      }
      return true;
    }
    return true;
  });

const config = {
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: {
        actions: true,
        backgrounds: false,
        controls: true,
        docs: true,
        toolbars: true,
        viewport: true,
      },
    },
    getAbsolutePath('@storybook/addon-storysource'),
    getAbsolutePath('storybook-addon-accessibility-checker'),
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
  ],

  features: {
    previewCsfV3: true,
    buildStoriesJson: true,
  },

  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },

  // core: {
  //   builder: {
  //     name: '@storybook/builder-vite',
  //     options: {
  //       viteConfigPath: '../vite.config.js',
  //     },
  //   },
  // },

  stories,

  typescript: {
    reactDocgen: 'react-docgen-typescript', // Favor docgen from prop-types instead of TS interfaces
  },

  async viteFinal(config) {
    // Merge custom configuration into the default config
    const { mergeConfig } = await import('vite');

    return mergeConfig(config, {
      // Add dependencies to pre-optimization
      define: {
        __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
      },
      esbuild: {
        include: /\.[jt]sx?$/,
        exclude: [],
        loader: 'tsx',
      },
      optimizeDeps: {
        esbuildOptions: {
          loader: {
            '.js': 'jsx',
          },
        },
      },
      plugins: [
        // react({
        //   babel: {
        //     presets: ['babel-preset-carbon'],
        //     // This instructs Vite to use Babel for the necessary transforms,
        //     babelrc: true,
        //     configFile: true,
        //   },
        // }),
        {
          name: 'test-server-error',
          configureServer(server) {
            server.middlewares.use((req, resp, next) => {
              const end = resp.end.bind(resp);
              resp.end = (...args: any[]) => {
                if (resp.statusCode >= 400) {
                  console.log(
                    'request did not succeed',
                    resp.statusCode,
                    req.url,
                    resp.getHeaders()
                  );
                }
                return end(...args);
              };
              next();
            });
          },
        },
      ],
      resolve: {
        preserveSymlinks: true,
      },
      server: {
        hmr: {
          overlay: false, // Disables the error overlay
        },
      },
    });
  },

  docs: {
    autodocs: true,
    defaultName: 'Overview',
  },

  logLevel: 'debug',
};

export default config;

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, 'package.json')));
}
