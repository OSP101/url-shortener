module.exports = {
    apps: [
      {
        name: 'URLShortener',
        port: '4000',
        exec_mode: 'cluster',
        instances: 'max',
        script: './.output/server/index.mjs'
      }
    ]
  }
  