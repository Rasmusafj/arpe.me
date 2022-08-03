module.exports = {
    entry: './assets/js/main.js',
    output: {
        path: __dirname + '/assets/js',
        filename: 'main.min.js'
    },
    module: {
        rules: [{
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }]
    }
}