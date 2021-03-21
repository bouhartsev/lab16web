import { UnrealBloomPass } from 'https://threejs.org/examples/jsm/postprocessing/UnrealBloomPass.js';

const SCREEN_WIDTH = window.innerWidth,
	  SCREEN_HEIGHT = window.innerHeight;
let mouseY = 0,
	mouseX = 0,

	anim = false,

	windowHalfY = SCREEN_HEIGHT / 2,
	windowHalfX = SCREEN_WIDTH / 2,

	camera, scene, renderer, composer;

init();
animate();

function init() {
	camera = new THREE.PerspectiveCamera( 80, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 9000 );
	camera.position.z = 10000;

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0x000000, 0.00015 );

	const geometry = createGeometry();

	const material = new THREE.PointsMaterial( { size: 5, blending: THREE.AdditiveBlending, depthTest: false, transparent: true, map: createCanvasMaterial('#daffff', 256), depthWrite: false } );

	const star = new THREE.Points( geometry, material );
	star.userData.originalScale = 1;
	star.rotation.y = Math.random() * 6;
	star.rotation.x = Math.random() * 6;
	star.rotation.z = Math.random() * 6;
	star.position.x = 0;
	star.position.y = 0;
	star.position.z = -2000;
	star.updateMatrix();
	scene.add( star );

	const MyCanvas = document.querySelector('main>#stars');

	renderer = new THREE.WebGLRenderer( { canvas: MyCanvas, antialias: true, alpha: true} );
	renderer.setClearColor( 0x000000, 0 );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

	const renderScene = new THREE.RenderPass( scene, camera );
	renderScene.clearAlpha = 0;

	const bloomPass = new UnrealBloomPass( new THREE.Vector2( SCREEN_WIDTH, SCREEN_HEIGHT ), 1.5, 0.4, 0.85 );
	bloomPass.threshold = 0;
	bloomPass.strength = 3;
	bloomPass.radius = 1;
	bloomPass.clearAlpha = 0;

	composer = new THREE.EffectComposer( renderer);
	composer.addPass( renderScene );
	composer.addPass( bloomPass );
	composer.renderToScreen = true;

//	document.body.style.touchAction = 'none';
	document.body.addEventListener( 'pointermove', onPointerMove );
	document.body.addEventListener( 'click', onClick );

	window.addEventListener( 'resize', onWindowResize );
}

function createCanvasMaterial(color, size) {
	var matCanvas = document.createElement('canvas');
	matCanvas.width = matCanvas.height = size;
	var matContext = matCanvas.getContext('2d');
	var texture = new THREE.Texture(matCanvas);
	var center = size / 2;
	matContext.beginPath();
	matContext.arc(center, center, size/2, 0, 2 * Math.PI, false);
	matContext.closePath();
	matContext.fillStyle = color;
	matContext.fill();
	texture.needsUpdate = true;
	return texture;
}

function createGeometry() {

	const geometry = new THREE.BufferGeometry();
	const vertices = [];

	const vertex = new THREE.Vector3();

	for ( let i = 0; i < 50000; i ++ ) {

		vertex.x = Math.random() * 20000 - 10000;
		vertex.y = Math.random() * 20000 - 10000;
		vertex.z = Math.random() * 20000 - 10000;
//					vertex.normalize();
//					vertex.multiplyScalar( r );

		vertices.push( vertex.x, vertex.y, vertex.z );

//					vertex.multiplyScalar( Math.random() * 0.09 + 1 );
//
//					vertices.push( vertex.x, vertex.y, vertex.z );

	}

	geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

	return geometry;

}

function onWindowResize() {

	windowHalfY = window.innerHeight / 2;
	windowHalfX = window.innerWidth / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
	composer.setSize( window.innerWidth, window.innerHeight );
}

function onPointerMove( event ) {

	if ( event.isPrimary === false ) return;

	mouseY = event.clientY - windowHalfY;
	mouseX = event.clientX - windowHalfX;

}

function onClick( event ) {
	anim = !anim;
}

function animate() {

	requestAnimationFrame( animate );

	render();

}

function render() {
	camera.position.y += ( - mouseY + 200 - camera.position.y ) * .05;
	camera.position.x += ( mouseX + 200 - camera.position.x ) * .05;
//	camera.position.y = 0;
//	camera.position.x = 0;
	if (anim==true) camera.position.z -= 10;
//	camera.lookAt( scene.position );

	// renderer.render( scene, camera );
	composer.render( scene, camera );//0.001
}
