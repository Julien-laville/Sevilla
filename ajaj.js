function getAll() {
    var req = new XMLHttpRequest()

    req.open('GET', "http://nanokv.herokuapp.com/", true);
    req.onreadystatechange = function (aEvt) {
        if (req.readyState == 4) {
            if(req.status == 200) {
                console.log(req)
            } else {
                console.error("An error occurred")
            }

        }
    };
    req.send(null);
}