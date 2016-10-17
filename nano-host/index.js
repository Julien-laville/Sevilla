var http = require('http')
var sqlite3 = require('sqlite3')

var url = require('url');


var nanoServ = http.createServer(function (req, res) {
    var reqUrl = url.parse(req.url, true)

    res.setHeader('Access-Control-Allow-Headers', 'julien-laville.github.io');

    if(reqUrl.path === '/') {
        getAll(res)
    } else if(reqUrl.query.id) {
        get(res,reqUrl.query.id)
    } else if(reqUrl.path === '/delete') {
        cleanAll(res)
    } else {
        res.writeHead(404);
        res.end('<h1><center>404</center></h1>')
    }

})


function getAll(res) {
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
   dbkv.exec("DELETE from key_values", function(error) {
       if(error) {
            res.writeHead('500');
            res.end('<h1><center>500</center></h1>' + error.toString())
        } else {
            res.end(JSON.stringify({status : 'success'}))
        }
   }) 
}

function get(res, id) {
    
}

function put(res, key, value) {
    
}

var port = process.env.PORT || 8080
nanoServ.listen(port)