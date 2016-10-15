function getAll() {
    var req = new XMLHttpRequest()

    req.open('GET', "2a01:cb1d:2f5:bd00:416b:68d2:681d:10a2", true);
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