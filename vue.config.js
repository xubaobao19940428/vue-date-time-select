// vue.config.js

module.exports = {
	devServer: {
		port: 8080,
		https: false,
		hot: false,
	},
	css: {
		extract: true,
		loaderOptions: {},
	},
	configureWebpack: {
		performance: {
			hints: false,
		},
		optimization: {
			splitChunks: {
				minSize: 200000,
				maxSize: 450000,
				minChunks: 2,
				chunks: 'async',
				cacheGroups: {
					node_vendors: {
						test: /[\\/]node_modules[\\/]/,
						chunks: 'all',
						priority: 1,
					},
				},
			},
		},
	},
	chainWebpack: (config) => {
		config.module
			.rule('js')
			.include.add(__dirname + 'packages') // 注意这里需要绝对路径，所以要拼接__dirname
			.end()
			.use('babel')
			.loader('babel-loader')
			.tap((options) => {
				// 修改它的选项...
				return options
			})
	},
	lintOnSave: false,
	productionSourceMap: false,
}
