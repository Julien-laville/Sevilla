window.onload = function() {
    showSaves()
    
    init(20,20, "level");
}

var gameStates = {
    "new" : "NEW",
    "start" : "START",
    "end" : "END",
    "trap" : "TRAP",
    "void" : "VOID",
    "trigger" : "TRIGGER",
    "door" : "DOOR",
    "link" : "LINK",
    "water" : "WATER",
    "play" : "PLAY"
}




var isFirst = false;
var lastPathLenth = 0;
var gameState = gameStates.start;


var level = {}

var bricks = {
    "preview" : {
        text : ".",
        style : "background:#222426;"
    },
    "default" : {
        text : function(x,y) {return x+" , "+y},
        style : "background:#ef974d;"
    },
    "trap" : {
        text : function(x,y) {return x+" , "+y},
        style : "background:#a3e1bc;"
    },
    "void" : {
        text : function(x,y) {return ''},
        style : "background:#fff;border:none;"
    },
    "water" : {
        text : function(x,y) {return ''},
        style : "background:#8acda2;"
    },
    "path" : {
        text : function(x,y) {return x+" , "+y},
        style : "background:#8acda2;"
    },
    "door" : {
        text : function(x,y) {return "D"},
        style : "background:#8acda2;"
    },
    "trigger" : {
        text : function(x,y) {return "T"},
        style : "background:#8acda2;"
    },
    "link" : {
        text : function(x,y) {return "."},
        style : "background:#8acda2;"
    },
    "start" : {
        text : function(x,y) {return "S"},
        style : "background:yellowgreen"
    },
    "end" : {
        text : function(x,y) {return "F"},
        style : "background:pink"
    }
}

function setGameState(gm) {
    gameState = gameStates[gm]
    document.getElementById('editor_status').innerHTML = gameState  
}

function showSaves() {
    var savesS = []
    for(var lc in localStorage){
        var llc = localStorage[lc]
        savesS.push(lc)
    }
    document.getElementById('saves').innerHTML = savesS.join("<br>")
}

function load(name) {
    level = JSON.parse(localStorage.getItem(name)).level
}

function save() {
    var levelName = prompt("Level name")
    
}


function init(w,h) {
    /* level */
    var table = "<table id='level'>"
    for(var i = 0; i < w; i ++){
        var line = []
        for(var j = 0; j < h; j ++) {
            level["td_"+i+"_"+j] = bricks.default
            line.push(`<td onmouseover="hover_level(this)" onclick="click_level(this)" id="td_${i}_${j}">${i} ${j}</td>`)
        }
        table += '<tr>'+line.join('\n')+'</tr>'
    }
    table += "</table>" 
    document.getElementById('level_container').innerHTML = table
    draw();
}

function hover_level(brick) {
    draw()
    if(gameState === gameStates.play) {
        showPreview(brick)
    }
    
}

function showPreview(brick) {
    
        previewPath = makePath(brick, length)    
        previewPath.forEach(function(preview) {
            document.getElementById(preview).style = bricks.preview.style
        })
    
}


function makePath(brick, length) {
    var path = [];
    var startX = parseInt(level.start.id.split('_')[1])
    var startY = parseInt(level.start.id.split('_')[2])
    var x = parseInt(brick.id.split('_')[1])
    var y = parseInt(brick.id.split('_')[2])
    var lg = length || Math.max(Math.abs(x-startX),Math.abs(y-startY))
        
    var card = getDir(level.start.id, brick.id)
    if(card) {
        path = buildPath(card,lg,level.start.id)    
    }
    return path
}

function buildPath(cardinal, lenth, start) {
    var paths = []
    
    for(var i = 0; i < lenth; i += 1) {
        var nextCase = getBrick(start, i, cardinal)
        paths.push(nextCase)
    }
    
    return paths;
}

function getDir(start, current) {
    var sX = parseInt(start.split("_")[1])
    var sY = parseInt(start.split("_")[2])
    var cX = parseInt(current.split("_")[1])
    var cY = parseInt(current.split("_")[2])
    
    var dX = sX - cX
    var dY = sY - cY
    
    var adX = Math.abs(sX - cX)
    var adY = Math.abs(sY - cY)
    
    var card = false
    
    if(adX > adY && dX <= 0)
        card = "S"
    if(adX > adY && dX >= 0)
        card = "N"
    if(adX < adY && dY >= 0)
        card = "W"
    if(adX < adY && dY <= 0)
        card = "E"
    
    return card
}

function getBrick(start, stance, cardinal) {
    var startX = parseInt(start.split("_")[1])
    var startY = parseInt(start.split("_")[2])
    switch(cardinal) {
        case "N":
            return 'td_'+(startX - stance)+'_'+startY
            break;
        case "S":
            return 'td_'+(startX + stance)+'_'+startY
            break;
        case "E":
            return 'td_'+(startX)+'_'+(startY + stance)
            break;
        case "W":
            return 'td_'+(startX)+'_'+(startY-stance)
            break;
    }
}

function save() {
    draw();
}

function click_level(brick) {
    if(gameState === gameStates.start) {
        level[brick.id] = bricks.start;
        level.start = brick;
    } 
    if(gameState === gameStates.end) 
        level[brick.id] = bricks.end;level.end = brick
    if(gameState === gameStates.trap) 
        level[brick.id] = bricks.trap
    if(gameState === gameStates.water) 
        level[brick.id] = bricks.water
    
    if(gameState === gameState.play) 
        play(brick)
    
    draw();
}


function isCorrect(path) {
    var isCorrect = true
    
    
    
    return isCorrect;
}


function play(brick) {
    if(isFirst) {
        var path = makePath(brick)
    } else {
        var path = makePath(brick, lastPathLenth)
    }
    
    if(isCorrect(path)) {
        level.start = brick
    }
        
    
    
    isFirst = !isFirst;
}


function draw() {
    for(var brickK in level) {
        var brick = level[brickK]
        document.getElementById(brickK).style = brick.style
    }
}



