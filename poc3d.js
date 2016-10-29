var scene, camera, renderer;
var geometry, material, mesh;

init();

var demoBricks = [
    {type : 'default', x : 0, y : 0},
    {type : 'water', x : 0, y : 1},
    {type : 'water', x : 0, y : 2},
    {type : 'default', x : 1, y : 0},
    {type : 'water', x : 1, y : 1},
    {type : 'default', x : 1, y : 2},
    {type : 'default', x : 2, y : 0},
    {type : 'water', x : 2, y : 1},
    {type : 'default', x : 2, y : 2}
]

var CUBE_SIZE = 100;

var bricks = {
    
    default : {
        type : 'default',
        material : new THREE.MeshPhongMaterial({color: 0xdddddd})
        
    },
    water : {
        type : 'water',
        material : new THREE.MeshBasicMaterial({color: 0x00cccc})
    }
    
}

var level = {
    bricks : [],
    start : null,
    finish : null,
    triggers : [],
    
}

function init() {

    scene = new THREE.Scene();

    var width = window.innerWidth
    var height = window.innerHeight
    
    camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 10000 );
    camera.position.z = 1000;

  
    
    var light = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( light );
    
    var light2 = new THREE.PointLight( 0xff0000, 1, 1000 );
    light2.position.set( 0, 0, 500 );
    scene.add( light2 );
    
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.getElementById("screen").appendChild( renderer.domElement );

    loadMap(scene, animate)

    
    


}

function loadMap(scene, cb) {
    var cubeGeometry = new THREE.BoxGeometry( 100, 100, 100 );
    get('map1', function(error, level) {
        if(error) {
            console.error(error)
            console.log("demo map")


            demoBricks.forEach(function(brick,i) {
                var cubeGeometry = new THREE.BoxGeometry( 100, 100, 100 );


                var mesh = new THREE.Mesh(cubeGeometry, bricks[brick.type].material)
                mesh.position.set(brick.x*CUBE_SIZE,brick.y*100,0)
                scene.add(mesh)
            })
            cb();


        } else {
            level = JSON.parse(level.value)
            level.bricks.forEach(function(brick,i) {
                cubeGeometry.position = new THREE.Vector3(0,i*100,0)
                scene.add(new THREE.Mesh( cubeGeometry, brick.material ))
            })
            cb();
        }

    })
}

canvas.onmousemove = function(e) {

}

function animate() {
    requestAnimationFrame( animate );
    
    draw()
    
    renderer.render( scene, camera );
}


function draw(scene) {
    
}
