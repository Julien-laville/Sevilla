var http = require('http')
var sqlite3 = require('sqlite3')
var path = require('path')
var url = require('url');


var dbPath = parh.resolve(__dirname, "/kvs.db")

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
    var dbkv = new sqlite3.Database(dbPath);
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
    var dbkv = new sqlite3.Database(dbPath);

   dbkv.exec("DELETE from key_values", function(error) {
       if(error) {
            res.writeHead('500');
            res.end('<h1><center>500</center></h1>' + error.toString())
        } else {
            res.end(JSON.stringify({status : 'success'}))
        }
        dbkv.close()
   }) 
}

function get(res, id) {
    var dbkv = new sqlite3.Database(dbPath);
    dbkv.get("SELECT * from key_values WHERE key = ?",{1 : id}, function(error, row) {
        if(error) {
            res.writeHead('500');
            res.end('<h1><center>500</center></h1>' + error.toString())
        } else {
            res.end(JSON.stringify({value : row}))
        }
        dbkv.close()
    })
    
    

}

function put(res, key, value) {
    var dbkv = new sqlite3.Database(dbPath);
    
    dbkv.run("INSERT into key_values (key, value) VALUES(?,?)", {1:key, 2:value}, function(error) {
        if(error) {
            res.writeHead('500');
            res.end('<h1><center>500</center></h1>' + error.toString())
        } else {
            res.end(JSON.stringify({status : 'success'}))
        }
        dbkv.close()
    })
    
}

var port = process.env.PORT || 8080
nanoServ.listen(port)