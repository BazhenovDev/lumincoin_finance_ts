const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/app.ts',
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 9003,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
        }),
        new CopyPlugin({
            patterns: [
                {from: "./src/templates", to: "templates"},
                {from: "./src/static", to: "static"},
                {from: "./node_modules/bootstrap/dist/css/bootstrap.min.css", to: "styles"},
                {from: "./src/bootstrap-5.2.3-examples/bootstrap-5.2.3-examples/sidebars/sidebars.css", to: "styles"},
                {from: "./node_modules/bootstrap/dist/js/bootstrap.min.js", to: "scripts"},
                {from: "./node_modules/bootstrap/dist/js/bootstrap.bundle.js", to: "scripts"},
                {from: "./src/bootstrap-5.2.3-examples/bootstrap-5.2.3-examples/sidebars/sidebars.js", to: "scripts"},
                {from: "./node_modules/chart.js", to: "scripts/chart"},
            ],
        })
    ],
};