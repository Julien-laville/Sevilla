var http = require('http')
var sqlite3 = require('sqlite3')

var url = require('url');


var nanoServ = http.createServer(function (req, res) {
    var reqUrl = url.parse(req.url, true)

    res.setHeader('Access-Control-Allow-Headers', 'julien-laville.github.io');

    if(reqUrl.path === '/') {
        showAll(res)
    } else if(reqUrl.query.id) {
        show(res,reqUrl.query.id)
    } else if(reqUrl.path === '/delete') {
        cleanAll(res)
    } else {
        res.writeHead(404);
        res.end('<h1><center>404</center></h1>')
    }

})


function showAll(res) {
    var allValues = [];
    var dbkv = new sqlite3.Database('nano-host/kvs.db');
        dbkv.all("SELECT * from key_values", function (error, rows) {
            if(error) {
                res.writeHead('500');
                res.end('<h1><center>500</center></h1>' + error.toString())
            } else {
                allValues = rows.map(function(r){return {k : r.key, v : r.value}})
                res.end(JSON.stringify(allValues))
            }
            dbkv.close()
        })





}

function cleanAll(res) {
    
}

function show(res, id) {
    
}


nanoServ.listen(8083)