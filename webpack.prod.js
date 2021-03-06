var UglifyJsPlugin = require('webpack-uglify-js-plugin');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common');
var path = require('path');

module.exports = webpackMerge(commonConfig, {
    mode: 'production',
    plugins: [
        /**
         * Minimize bundled output.
         */
        new UglifyJsPlugin({
            cacheFolder: path.resolve(__dirname, 'build_cache', 'cached_uglify'),
            debug: false,
            minimize: true,
            sourceMap: true,
            output: {
                comments: false
            },
            compressor: {
                warnings: false
            }
        })
    ],
    devtool: 'source-map'
});