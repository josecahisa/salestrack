var path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
var ExtractText = require('extract-text-webpack-plugin');

module.exports = {
    watch: true,
    entry:  {
        index: path.join(__dirname, 'static/js/components/index'),
        menu: path.join(__dirname, 'static/js/components/menu'),
        alerts: path.join(__dirname, 'static/js/components/AlertsReport/AlertsReport')
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
                loader: 'babel-loader',
                exclude: /node_modules/,
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
            components: path.resolve(__dirname, '/Users/jcahisa/code/django/maquinas/static/js/components/')
        }
    },
    devtool: 'source-map'
}