module.exports = {
    devServer: {
        proxy: {
            "/api": {
                target: "http://chst.vip:1901",
                changeOrigin: true,
                pathRewrite: {
                    "^/api": ""
                }
            }
        }
    }
}