const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
    entry: "./src/client/js/main.js",
    mode: "development",
    watch:true,
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/styles.css",
        }),
    ],
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "assets", "js"),
        clean:true,
    },
    module: {
        rules: [
        {
            test: /\.js$/,
            use: {
            loader: "babel-loader",
            options: {
                presets: [["@babel/preset-env", { targets: "defaults" }]],
            },
            },
        },
        {
            test:/\.scss$/,
            use:[MiniCssExtractPlugin.loader, "css-loader", "sass-loader"] //순서 중요(webpack이 뒤에서부터 실행하기 때문에 순서 역순으로 지켜줘야함)
        }
        ],
    },
};