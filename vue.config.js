module.exports = {
  outputDir: '../src/main/resources/frontend/',
  indexPath: 'index.html',

  devServer: {
    proxy: {
      '^/api': {
        target: 'http://172.16.13.225:30310',
        // target: 'http://192.168.38.72:8081',
        // target: 'http://172.16.13.225:30300',
        // target: 'http://localhost:3010',
      },
      '^/attachment': {
        target: 'http://172.16.13.225:30310',
        // target: 'http://192.168.38.72:8081',
        // target: 'http://172.16.13.225:30300',
        // target: 'http://localhost:3010',
      },
    },
    overlay: {
      warnings: true,
      errors: true
    },
    watchOptions: {
      poll: 1000,
    },
  },
  pluginOptions: {
    lintStyleOnBuild: false,
    stylelint: {}
  },
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "@/assets/style/style.scss";
        `,
      },
    },
  }
}