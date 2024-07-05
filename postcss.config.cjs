module.exports = (ctx) => ({
    parser: ctx.parser ? 'sugarss' : false,
    map: ctx.env === 'development' ? ctx.map : false,
    plugins: {
        'postcss-import': {},
        'postcss-nesting': {},
        'postcss-font-magician': {},
         cssnano: ctx.env === 'production' ? {} : false
    }
})