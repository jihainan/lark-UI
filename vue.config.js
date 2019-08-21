const path = require('path')
const webpack = require('webpack')

function resolve (dir) {
  return path.join(__dirname, dir)
}

// vue.config.js
module.exports = {
  /*
    Vue-cli3:
    Crashed when using Webpack `import()` #2463
    https://github.com/vuejs/vue-cli/issues/2463

   */
  /*
  pages: {
    index: {
      entry: 'src/main.js',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },
  */
  configureWebpack: {
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
  },

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))
      .set('@api', resolve('src/api'))
      .set('@assets', resolve('src/assets'))
      .set('@comp', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@layout', resolve('src/layout'))
      .set('@static', resolve('src/static'))

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })
    /* svgRule.oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })
    */
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          /* less 变量覆盖，用于自定义 ant design 主题 */
          // 'link-color': '#FFFFFF'
          'padding-lg': '16px',
          'padding-md': '8px',
          'padding-sm': '4px',
          'padding-xs': '0px',
          'card-head-padding': '4px',
          'card-inner-head-padding': '4px',
          'card-padding-base': '4px',
          'card-padding-wider': '8px',
          'layout-sider-background': '#0246aa',
          'menu-dark-submenu-bg': '#0544a3',
          'menu-dark-bg': '#0246aa',
          'menu-item-height': '48px',
          'menu-inline-toplevel-item-height': '48px',
          'form-item-margin-bottom': '16px'
        },
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    proxy: {

      '/api': {
        // target: 'https://www.easy-mock.com/mock/5cd3d62bd0717344110ebfb4/lark',
        // target: 'http://10.11.24.30:8765',
        target: 'http://localhost:8765',
        // target: 'http://localhost:8765',
        ws: false,
        changeOrigin: true
      },
      '/gateway': {
        target: ' http://10.12.97.30:8765',
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/gateway': '/api'
        }
      }
    }
  },

  lintOnSave: undefined,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}
