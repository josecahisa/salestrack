var path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
var ExtractText = require('extract-text-webpack-plugin');

module.exports = {
    watch: true,
    watchOptions: {
        poll: true,
        ignored: /node_modules/
    },    
    entry:  {
        react_app: path.join(__dirname, 'salestrack/static/js/components/App/App')
        // index: path.join(__dirname, 'salestrack/static/js/components/index.js'),
        // menu: path.join(__dirname, 'salestrack/static/js/components/menu'),
        // alerts: path.join(__dirname, 'salestrack/static/js/components/AlertsReport/AlertsReport'),
        // app: path.join(__dirname, 'salestrack/static/js/components/App/App')
    },
    output: {
        path: path.join(__dirname, 'static/dist'),
        filename: '[name]-[hash].js'
    },
    plugins: [
        new BundleTracker({
            path: __dirname,
            filename: 'webpack-stats.json'
        }),
        new ExtractText({
            filename: '[name]-[hash].css'
        }),    
    ],
    module: {
        rules: [{
                test: /\.(js|jsx)$/,
                include: path.resolve(__dirname, 'salestrack/static/js/components'),
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/react']
                    }
                }]
            },
            {
                test: /\.css$/,
                loader: ['style-loader', 'css-loader'],
            },
            {
                test: /\.scss$/,
                use: ExtractText.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
        ],
    },
    resolve: {
        alias: {
            components: path.join(__dirname, 'salestrack/static/js/components/')
        }
    },
    devtool: 'source-map'
}