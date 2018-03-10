const path = require('path');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const PATHS = {
    src: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'build'),
};

const phaserModule = path.join(__dirname, '/node_modules/phaser/'),
    phaser = path.join(phaserModule, 'build/custom/phaser-split.js'),
    pixi = path.join(phaserModule, 'build/custom/pixi.js'),
    p2 = path.join(phaserModule, 'build/custom/p2.js');

module.exports = function(env) {
    let plugins = [
        new HtmlwebpackPlugin({
            title: 'game',
            template: 'src/client/index.html'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
        }),
    ];
    let module = {
        rules: [
            {
                test: /\.js$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: /src/,
                options: {
                    emitWarning: true,
                },
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: /src/,
                options: {
                    presets: ['latest'],
                },
            },
            {
                test: /\.(png|jpg|gif|svg)$/i,
                loader: 'file-loader',
                include: /src/,
                options: {
                    name: 'imgs/[name]-[hash:5].[ext]',
                },
            },
            {
                test: /\.mp3$/i,
                loader: 'file-loader',
                include: /src/,
                options: {
                    name: 'sounds/[name]-[hash:5].[ext]',
                },
            },
        ],
    };
    if(env && env.production) {
        plugins.push(new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            comments: false,
            mangle: {
                keep_fnames: true,
            },
        }));
        plugins.push(new ExtractTextPlugin({
            filename: '[name].css',
            ignoreOrder: true,
        }));
        module.rules.push({
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [
                    {
                        loader: 'css-loader',
                        //options: { modules: true },
                    },
                    'sass-loader',
                ],
            }),
        });
    } else {
        module.rules.push({
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'sass-loader'],
        });
    }
    return {
        entry: {
            app: PATHS.src + '/app.js',
            vendor: 'babel-polyfill',
        },
        output: {
            path: PATHS.build,
            filename: '[name].js',
        },
        devServer: {
            overlay: {
                errors: true,
                warnings: true,
            },
            //hotOnly: true,
        },
        plugins: plugins,
        module: module,
        resolve: {
            alias: {
                'phaser': phaser,
                'pixi.js': pixi,
                'p2': p2,
            }
        },
        //devtool: 'source-map',
    };
};
