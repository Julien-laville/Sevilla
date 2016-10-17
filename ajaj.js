function getAll(cb) {
    var req = new XMLHttpRequest()

    req.open('GET', "https://nanokv.herokuapp.com/", true);
    req.onreadystatechange = function (aEvt) {
        if (req.readyState == 4) {
            if(req.status == 200) {
                cb(null,JSON.parse(req.response))
            } else {
                cb("An error occurred")
            }

        }
    };
    req.send(null);
}

function get(k,cb) {
    var req = new XMLHttpRequest()

    req.open('GET', "https://nanokv.herokuapp.com/?id=" + k, true);
    req.onreadystatechange = function (aEvt) {
        if (req.readyState == 4) {
            if(req.status == 200) {
                cb(null,JSON.parse(req.response))
            } else {
                cb("An error occurred")
            }

        }
    };
    req.send(null);
}

function set(k,v,cb) {
    var req = new XMLHttpRequest();

    req.open('POST', "https://nanokv.herokuapp.com/", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    var params = "key=" + k + "&value=" + v;

    req.onreadystatechange = function (aEvt) {
        if (req.readyState == 4) {
            if(req.status == 200) {
                cb(null,JSON.parse(req))
            } else {
               cb("An error occurred")
            }

        }
    };
    req.send(params);
}