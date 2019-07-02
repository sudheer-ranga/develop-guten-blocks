const defaultConfig = require('./node_modules/@wordpress/scripts/config/webpack.config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const devMode = process.env.NODE_ENV !== 'production';
const autoprefixer = require('autoprefixer');

let folders = process.cwd().split('/');
let pluginFolderName = folders[folders.length - 1];

// Extract save.css for both editor and frontend styles.
const blocksCSSPlugin = new MiniCssExtractPlugin({
  // Options similar to the same options in webpackOptions.output
  // both options are optional
  filename: '[name].css'
});

defaultConfig.output['publicPath'] = devMode
  ? `http://localhost:8000/`
  : `/wp-content/plugins/${pluginFolderName}/build/`;

module.exports = {
  ...defaultConfig,
  devServer: {
    port: '8000',
    overlay: true,
    disableHostCheck: true,
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' }
  },
  module: {
    ...defaultConfig.module,
    rules: [
      ...defaultConfig.module.rules,
      {
        test: /\.svg$/,
        use: ['@svgr/webpack', 'url-loader']
      },
      {
        test: /\.s?css$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: devMode
            }
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                autoprefixer({
                  flexbox: 'no-2009'
                })
              ]
            }
          },
          {
            loader: 'sass-loader',
            options: {
              // Add common CSS file for variables and mixins.
              data: '@import "./src/common.scss";\n',
              outputStyle: 'nested'
            }
          }
        ]
      }
    ]
  },
  plugins: [...defaultConfig.plugins, blocksCSSPlugin]
};
