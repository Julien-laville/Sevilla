function getAll() {
    var req = new XMLHttpRequest()

    req.open('GET', "http://90.116.73.55:8083", true);
    req.onreadystatechange = function (aEvt) {
        if (req.readyState == 4) {
            if(req.status == 200)
                dump(req.responseText);
            else
                dump("Erreur pendant le chargement de la page.\n");
        }
    };
    req.send(null);
}