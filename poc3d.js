var scene, camera, renderer;
var geometry, material, mesh;

init();


var bricks = [
    {
        default : 'default',
        material : new MeshStandardMaterial({ color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading })
    }   
]

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

    geometry = new THREE.BoxGeometry( 200, 200, 200 );
    material = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } );

    loadMap()
    
    var light = new THREE.AmbientLight( 0x404040 ); // soft white light
   // scene.add( light );
    
    var light2 = new THREE.PointLight( 0xff0000, 1, 1000 );
    light2.position.set( 500, 500, 500 );
    scene.add( light2 );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.getElementById("screen").appendChild( renderer.domElement );

    animate();
}

function loadMap(scene) {
    var cubeGeometry = new THREE.BoxGeometry( 200, 200, 200 );
    get('map1', function(level) {
        level = JSON.parse(level.value)
        level.bricks.forEach(function(brick) {
            scene.add(new THREE.Mesh( cubeGeometry, brick.material ))
        })
    })
}

function animate() {
    requestAnimationFrame( animate );
    
    draw()
    
    renderer.render( scene, camera );
}


function draw(scene) {
    
}




function loadMap(cb) {
    get('test', function(map) {
        
    })
}