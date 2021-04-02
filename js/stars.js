import { UnrealBloomPass } from 'https://threejs.org/examples/jsm/postprocessing/UnrealBloomPass.js';

window['anim'] = false;
const SCREEN_WIDTH = window.innerWidth,
	  SCREEN_HEIGHT = window.innerHeight;
let mouseY = 0,
	mouseX = 0,

	windowHalfY = SCREEN_HEIGHT / 2,
	windowHalfX = SCREEN_WIDTH / 2,

	camera, scene, geometry, material, star, renderer, composer;

init();
animate();

function init() {
	//Создание и позиционирование камеры
	camera = new THREE.PerspectiveCamera( 80, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 9000 );
	// camera.position.z = 0;
	// camera.position.x = 0;
	// camera.position.y = 0;

	//создание сцены и исчезновение сцены вдали, на это влияет последнее значение в конструкторе камеры в т.ч.
	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0x000000, 0.00015 );

	//материал для звёзд: размер, цвет и т.д.
	material = new THREE.PointsMaterial( { size: 5, blending: THREE.AdditiveBlending, depthTest: false, transparent: true, map: createCanvasMaterial('#daffff', 256), depthWrite: false } );

	geometry = createGeometry();
	star = new THREE.Points( geometry, material );
	scene.add( star );
	geometry.dispose();

	//определение объекта рендера
	const MyCanvas = document.querySelector('main>#stars');

	//создание обычного рендера
	renderer = new THREE.WebGLRenderer( { canvas: MyCanvas, antialias: true, alpha: true, logarithmicDepthBuffer: true} );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

	//Добавление копии сцены для последующего использования
	const renderScene = new THREE.RenderPass( scene, camera );

	//Создание эффекта сияния звёзд
	const bloomPass = new UnrealBloomPass( new THREE.Vector2( SCREEN_WIDTH, SCREEN_HEIGHT ), 1.5, 0.4, 0.85 );
	bloomPass.threshold = 0;
	bloomPass.strength = 3;
	bloomPass.radius = 1;

	//Создание рендера с эффектами
	composer = new THREE.EffectComposer( renderer);
	composer.addPass( renderScene );
	composer.addPass( bloomPass );

	//Адаптив
	window.addEventListener( 'resize', onWindowResize );
	document.body.style.touchAction = 'none';
}

//Создание канвас-материала для звёзд
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

//Создание геометрии звёзд (спавн, один на 20000).
function createGeometry(diff=0) {

	const geometry = new THREE.BufferGeometry();
	const vertices = [];

	const vertex = new THREE.Vector3();

	for ( let i = 0; i < 50000; i ++ ) {
		vertex.x = Math.random() * 20000 - 10000;
		vertex.y = Math.random() * 20000 - 10000;
		vertex.z = Math.random() * 20000 - 20000 + diff*20000;

		vertices.push( vertex.x, vertex.y, vertex.z );
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

//Анимация и рендер
function animate() {
	requestAnimationFrame( animate );
	render();
}

function render() {
	//Движение камеры вперёд
	if (anim==true) camera.position.z -= 10;

	//бесконечный спавн звёзд
	if (camera.position.z%20000 == -13000) {
		geometry = createGeometry(Math.trunc(camera.position.z/20000)-1);
		star = new THREE.Points( geometry, material );
		geometry.dispose();
		scene.add( star );
	}

	// renderer.render( scene, camera ); //старый рендер
	composer.render( scene, camera );
}
