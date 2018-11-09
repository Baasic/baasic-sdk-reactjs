var path = require('path');
var rootDir = path.resolve(__dirname);

function getRootPath() {
    var args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [rootDir].concat(args));
}

module.exports = {
    /**
     * Path from which all relative webpack paths will be resolved.
     */
    context: path.resolve(__dirname),
    /**
     * Entry point to the application, webpack will bundle all imported modules.
     */
    entry: {
        app: './src/index.ts'
    },
    /**
     * Rule for which files should be transpiled via typescript loader.
     */
    module: {
        rules: [{
            test: /\.ts$/,
            use: [{
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                    compilerOptions: {
                        "importHelpers": true,
                        "noEmitHelpers": true
                    }
                }
            }]
        }]
    },
    resolve: {
        /**
         * Resolve the following extensions when requiring/importing modules.
         */
        extensions: ['.ts', '.js'],
        /**
         * Resolve modules using following folders.
         */
        modules: [
            getRootPath('src'),
            getRootPath('node_modules')
        ]
    },
    /**
     * Specify output as an UMD library.
     */
    output: {
        path: path.resolve('build/dist'),
        filename: 'baasic-sdk-reactjs.js',
        library: 'baasicSdkReactJs',
        libraryTarget: 'umd'
    },
    externals: {
        'baasic-sdk-javascript': {
            root: ['baasicSdkJavaScript'],
            commonjs: 'baasic-sdk-javascript',
            commonjs2: 'baasic-sdk-javascript',
            amd: 'baasic-sdk-javascript'
        }
    }
};