module.exports = function (app) {

    app.get('/*', function (req, res) {
        res.sendFile('build/index.html', { root: __dirname })
    })

};