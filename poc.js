var LEVEL_WIDTH = 20;
var LEVEL_HEIGHT = 20;
window.onload = function() {
    showSaves()
    
    init(LEVEL_WIDTH,LEVEL_HEIGHT, "level");
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



var triggers = []
var isFirst = true;
var lastPathLenth = 0;
var gameState = gameStates.start;


var level = {
    boxes : {}
}

function combine() {
    
}

var bricks = {
    "preview" : {
        type : 'preview',
        text : ".",
        style : "background:#222426;"
    },
    "default" : {
        type : 'default',
        text : function(x,y) {return x+" "+y},
        style : "background:#ef974d;"
    },
    "trap" : {
        type : 'trap',
        text : function(x,y) {return x+" "+y},
        style : "background:#a3e1bc;"
    },
    "void" : {
        type : 'void',
        text : function(x,y) {return ''},
        style : "background:#fff;border:none;"
    },
    "water" : {
        type : 'water',
        text : function(x,y) {return ''},
        style : "background:#8acda2;"
    },
    "path" : {
        type : 'path',
        text : function(x,y) {return x+" "+y},
        style : "background:#8acda2;"
    },
    "door" : {
        type : 'door',
        text : function(x,y) {return "D"},
        style : "background:#8acda2;"
    },
    "trigger" : {
        type : 'trigger',
        text : function(x,y) {return "T"},
        style : "background:#8acd2a;"
    },
    "link" : {
        type : 'link',
        text : function(x,y) {return "."},
        style : "background:#8acda2;"
    },
    "start" : {
        type : 'start',
        text : function(x,y) {return "S"},
        style : "background:yellowgreen"
    },
    "end" : {
        type : 'end',
        text : function(x,y) {return "F"},
        style : "background:pink"
    },
    "forbidden" : {
        type : 'forbidden',
        text : function(x,y) {return "X"},
        style : "background:pink"
    }
}

function setGameState(gm) {
    if(gameState == gameStates.trigger && gm === 'trigger') {
        gameState = gameStates.door
    } else if(gameState == gameStates.door && gm === 'trigger') {
        gameState = gameStates.link 
    } else if(gm === 'trigger') {
        gameState = gameStates.trigger 
    } else {
        gameState = gameStates[gm]
    }
    document.getElementById('editor_status').innerHTML = gameState  
}

function showSaves() {
    var savesS = []
    for(var lc in localStorage){
        var llc = localStorage[lc]
        if(lc.indexOf('bob_') != -1) {
            savesS.push('<span onclick="loadG(\''+lc+'\')">'+lc+'</span>')
        }
    }
    document.getElementById('saves').innerHTML = savesS.join("<br>")
}

function loadG(name) {
    level = JSON.parse(localStorage.getItem(name))
    draw()
}

function saveG() {
    var levelName = prompt("Level name (a-zA-Z0-9)");
    localStorage.setItem("bob_"+levelName, JSON.stringify(level))
}


function init(w,h) {
    /* level */
    var table = "<table id='level'>"
    for(var i = 0; i < w; i ++){
        var line = []
        for(var j = 0; j < h; j ++) {
            level.boxes["td_"+i+"_"+j] = bricks.default
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
    if(!isFirst) var pathLenth = lastPathLenth;
        
    previewPath = makePath(brick, pathLenth)    
    
    var okPath = isCorrect(previewPath);
    var style = okPath ? bricks.preview.style : bricks.forbidden.style
    previewPath.forEach(function(preview) {
        document.getElementById(preview).style = style
    })
    
}


function makePath(brick, length) {
    var path = [];
    var startX = parseInt(level.start.split('_')[1])
    var startY = parseInt(level.start.split('_')[2])
    var x = parseInt(brick.id.split('_')[1])
    var y = parseInt(brick.id.split('_')[2])
    var lg = length || Math.max(Math.abs(x-startX),Math.abs(y-startY))
        
    var card = getDir(level.start, brick.id)
    if(card) {
        path = buildPath(card,lg,level.start)    
    }
    return path
}

function buildPath(cardinal, lenth, start) {
    var paths = []
    
    for(var i = 0; i <= lenth; i += 1) {
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
            var brickId = 'td_'+(startX - stance)+'_'+startY
            break;
        case "S":
            var brickId = 'td_'+(startX + stance)+'_'+startY
            break;
        case "E":
            var brickId = 'td_'+(startX)+'_'+(startY + stance)
            break;
        case "W":
            var brickId = 'td_'+(startX)+'_'+(startY-stance)
            break;
    }
     return brickId

}

function save() {
    draw();
}



function click_level(brick) {
    if(gameState === gameStates.start) {
        if(level.boxes[level.start]) {
            level.boxes[level.start] = bricks.default
        }
        level.boxes[brick.id] = bricks.start;
        level.start = brick.id;
    } 
    if(gameState === gameStates.end) 
        level.boxes[brick.id] = bricks.end,level.end = brick;
    if(gameState === gameStates.trap) 
        level.boxes[brick.id] = bricks.trap
    if(gameState === gameStates.water) 
        level.boxes[brick.id] = bricks.water;
    if(gameState === gameStates.door) 
        level.boxes[brick.id] = bricks.door, addDoor(brick)
    if(gameState === gameStates.trigger) 
        level.boxes[brick.id] = bricks.trigger,triggers.push({isOpen:false,trigger : brick.id, doors : [], links : []}), setGameState('door')
    if(gameState === gameStates.link) 
        level.boxes[brick.id] = bricks.link, addLink(brick)
    
    if(gameState === gameStates.play) 
        play(brick)
    
    draw();
}

function addDoor(brick) {
    var trigger = triggers[triggers.length - 1]
    trigger.doors.push({door : brick, isOpen : false})
}

function addLink(brick) {
    var trigger = triggers[triggers.length - 1]
    trigger.links.push({link : brick, isOpen : false})
}

function isCorrect(paths) {
    var isCorrect = true
    
    paths.forEach(function(path,i) {
        var box = level[path]

        var px = parseInt(path.split('_')[1])
        var py = parseInt(path.split('_')[2])

        if(px > LEVEL_WIDTH || py > LEVEL_HEIGHT || px < 0 || py < 0) {
            isCorrect = false
        }

        if(box === bricks.trap) {
            isCorrect = false;
        }
        
        if(box === bricks.water && i == paths.length - 1) {
            isCorrect = false;
        }

    })
    
    return isCorrect;
}


function play(brick) {
    if(isFirst) {
        var path = makePath(brick)
        lastPathLenth = path.length-1;
    } else {
        console.log(lastPathLenth)
        var path = makePath(brick, lastPathLenth)
    }
    
    if(isCorrect(path)) {
        level.start = path[path.length - 1]
    }
    if(isCorrect) {
         path.forEach(function(box, i) {
            
             level.boxes[box].isPath = true
                    
             // trigger
             if(i == level.boxes.length - 1) {
                 triggers.forEach(function(trigger) {
                     if(trigger.trigger === box) {
                         openTrigger(trigger)
                     } 
                 })
             }
            
        })
    }
    
   
    
    draw();    
    isFirst = !isFirst;
}

function openTrigger(trigger) {
    trigger.isOpen = true;
    trigger.doors.forEach(function(door) {
        door.isOpen = true
    })
    
    trigger.links.forEach(function(link) {
        link.isOpen = true
    })
}

function draw() {
    for(var brickK in level.boxes) {
        if(brickK.indexOf('td_') == 0) {        
            var brick = level.boxes[brickK]
            if(brick.type === 'door' || brick.type === 'link' || brick.type === 'trigger')
            document.getElementById(brickK).style = brick.style
            document.getElementById(brickK).class = 'path'
            document.getElementById(brickK).innerHTML = brick.text(brickK.split("_")[1], brickK.split("_")[2])
        }
    }
    
    triggers.forEach(function(trigger) {
        trigger.doors.forEach(function(door) {
            document.getElementById(door).style = brick.style
            document.getElementById(door).innerHTML = brick.text(brickK.split("_")[1], brickK.split("_")[2])
        }) 
        
        trigger.links.forEach(function(link) {
            document.getElementById(link).style = brick.style
            document.getElementById(link).innerHTML = brick.text(brickK.split("_")[1], brickK.split("_")[2])
        }) 
        document.getElementById(trigger).style = brick.style
        document.getElementById(trigger).innerHTML = brick.text(brickK.split("_")[1], brickK.split("_")[2])s
    })
}



