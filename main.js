import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Scene setup
const scene = new THREE.Scene();
// scene.background = new THREE.Color( 'white' );
// Ambient light setup
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
//#region  Camera Setup
// Camera setup
const camera = new THREE.OrthographicCamera(
  window.innerWidth / -2,
  window.innerWidth / 2,
  window.innerHeight / 2,
  window.innerHeight / -2,
  1,
  1200
);
camera.lookAt(0, 0, 0);
const axesHelper = new THREE.AxesHelper(500);
// scene.add(axesHelper);

// const camera = new THREE.PerspectiveCamera(
//   495,
//   window.innerWidth / window.innerHeight,
//   1,
//   1000
// );
// camera.position.z = 400;
camera.position.set(0, 2, 700);

//#endregion
//#region SweetHandle
function handleBackPlate(
  widthBackPlate,
  heightBackPlate,
  holeRadius,
  backPlateDepth,
  keyHoleYPosition
) {
  const handleBackPlateShape = new THREE.Shape();
  const radius = widthBackPlate/2;
  handleBackPlateShape.moveTo(0,0);
  handleBackPlateShape.absarc(
    widthBackPlate / 2,
    radius,
    radius,
    Math.PI,
    0,
    false
  );
  handleBackPlateShape.lineTo(
    widthBackPlate ,
    heightBackPlate - radius
  );
  
  handleBackPlateShape.absarc(
    widthBackPlate / 2,
    heightBackPlate - radius,
    radius,
    0,
    Math.PI,
    false
  );
  handleBackPlateShape.lineTo(0, radius);

  const keyHole = new THREE.Path();
  keyHole.moveTo(widthBackPlate / 2, keyHoleYPosition - holeRadius);
  keyHole.absarc(
    widthBackPlate / 2,
    keyHoleYPosition,
    holeRadius,
    Math.PI + Math.PI / 3,
    0 - Math.PI / 3,
    true
  );
  keyHole.lineTo(widthBackPlate / 2 + holeRadius / 2, keyHoleYPosition - 15);
  keyHole.absarc(
    widthBackPlate / 2,
    keyHoleYPosition - 15,
    holeRadius / 2,
    0,
    Math.PI,
    true
  );
  keyHole.lineTo(
    widthBackPlate / 2 - holeRadius / 2,
    keyHoleYPosition - holeRadius
  );

  const boltHoleTop = new THREE.Path();
  boltHoleTop.absarc(widthBackPlate/2, heightBackPlate - widthBackPlate/2, widthBackPlate/2-widthBackPlate/3, 0, Math.PI * 2, false);

  const boltHoleBottom = new THREE.Path();
  boltHoleBottom.absarc(widthBackPlate/2, widthBackPlate/2, widthBackPlate/2-widthBackPlate/3, 0, Math.PI * 2, false);
  handleBackPlateShape.holes.push(boltHoleTop);
  handleBackPlateShape.holes.push(boltHoleBottom);

  handleBackPlateShape.holes.push(keyHole);

  const extrudeBackPlateSettings = {
    steps: 20,
    depth: backPlateDepth,
    bevelEnabled: false,
  };
  const extrudeHandleBackPlate = new THREE.ExtrudeGeometry(
    handleBackPlateShape,
    extrudeBackPlateSettings
  );
  const backPlateMaterial = new THREE.MeshBasicMaterial({ color: "red" });
  const backPlateMesh = new THREE.Mesh(
    extrudeHandleBackPlate,
    backPlateMaterial
  );
  return backPlateMesh;
}

function handleBarHolder(widthHandleBar,backPlateWidth){
  //handle Curve Connector 
  const handleCurveConnectorShape = new THREE.Shape();
  handleCurveConnectorShape.moveTo(0,0);
  handleCurveConnectorShape.lineTo(backPlateWidth/2,0);
  handleCurveConnectorShape.bezierCurveTo(backPlateWidth/2,0, backPlateWidth-widthHandleBar/2, widthHandleBar/2, backPlateWidth/2, widthHandleBar);
  handleCurveConnectorShape.lineTo(0,widthHandleBar);
  handleCurveConnectorShape.lineTo(0,0);

  const extrudeHandleBarSettings = {
    steps: 1,
    depth: 5,
    bevelEnabled: false,
  }
  const extrudeHandleCurveConnector = new THREE.ExtrudeGeometry(handleCurveConnectorShape, extrudeHandleBarSettings );
  const handleCurveMaterial = new THREE.MeshBasicMaterial({color: "green"});
  const handleCurveConnectorMesh = new THREE.Mesh(extrudeHandleCurveConnector, handleCurveMaterial);

  return handleCurveConnectorMesh;
}

function handleBar(widthHandleBar, heightHandleBar,backPlateWidth){
  const handleBarShape = new THREE.Shape();
  handleBarShape.moveTo(0,0);
  handleBarShape.absarc(widthHandleBar/2, widthHandleBar/2, widthHandleBar/2, Math.PI, 0, false);
  handleBarShape.lineTo(widthHandleBar, heightHandleBar - widthHandleBar/2);
  handleBarShape.absarc(widthHandleBar/2, heightHandleBar, widthHandleBar/2,  0, Math.PI, false);
  handleBarShape.lineTo(0,backPlateWidth-widthHandleBar/2);
  const extrudeHandleBarSettings = {
    steps: 1,
    depth: 5,
    bevelEnabled: false,
  }
  const extrudeHandleBar = new THREE.ExtrudeGeometry(handleBarShape, extrudeHandleBarSettings);
  const handleBarMaterial = new THREE.MeshBasicMaterial({color: "yellow"});
  const handleBarMesh = new THREE.Mesh(extrudeHandleBar, handleBarMaterial);
  
  return handleBarMesh;

}

function bolt(diameter) {
  const radius = diameter / 2;
 
  const extrudeBoltSettings = {
    steps: 1,
    depth: 5,
    bevelEnabled: false,
  };
 
  const boltFrontPlateShape = new THREE.Shape();
  boltFrontPlateShape.moveTo(0, 0);
  boltFrontPlateShape.absarc(radius, radius, radius, 0, Math.PI * 2, true);
 
  const boltHoles = new THREE.Path();
  boltHoles.moveTo(diameter / 12, radius - diameter / 8);
  boltHoles.lineTo(diameter / 12, radius + diameter / 8);
  boltHoles.lineTo(radius - diameter / 8, radius + diameter / 8);
  boltHoles.lineTo(radius - diameter / 8, diameter - diameter / 12);
  boltHoles.lineTo(radius + diameter / 8, diameter - diameter / 12);
  boltHoles.lineTo(radius + diameter / 8, radius + diameter / 8);
  boltHoles.lineTo(diameter - diameter / 12, radius + diameter / 8);
  boltHoles.lineTo(diameter - diameter / 12, radius - diameter / 8);
  boltHoles.lineTo(radius + diameter / 8, radius - diameter / 8);
  boltHoles.lineTo(radius + diameter / 8, diameter / 12);
  boltHoles.lineTo(radius - diameter / 8, diameter / 12);
  boltHoles.lineTo(radius - diameter / 8, radius - diameter / 8);
 
  boltFrontPlateShape.holes.push(boltHoles);
 
  const extrudeBoltFrontPlate = new THREE.ExtrudeGeometry(
    boltFrontPlateShape,
    extrudeBoltSettings
  );
  const BoltMaterial = new THREE.MeshBasicMaterial({
    color: "gray",
    side: THREE.DoubleSide,
  });
  const BoltFrontPlateMesh = new THREE.Mesh(
    extrudeBoltFrontPlate,
    BoltMaterial
  );

  // const edges = new THREE.EdgesGeometry(BoltFrontPlateMesh);
  // const lineMaterial = new THREE.LineBasicMaterial({color: "white"});
  // const lines = new THREE.LineSegments(edges, lineMaterial);
  // BoltFrontPlateMesh.add(lines);
 
  return BoltFrontPlateMesh;
}


function createSweetHandle(backPlateWidth ,backPlateHeight,
  holeRadius,
  backPlateDepth,
  keyHoleYPosition, diameter) {
  const parentObject = new THREE.Object3D();

  
  const sweetBackPlate1 = handleBackPlate(
    backPlateWidth ,backPlateHeight,
    holeRadius,
    backPlateDepth,
    keyHoleYPosition
  );
  const sweetBackPlate2 = handleBackPlate(
    backPlateWidth ,backPlateHeight,
    holeRadius,
    backPlateDepth,
    keyHoleYPosition
  );
  sweetBackPlate2.position.set(backPlateWidth + 10, 0, 0);
  
  const boltTop1 = bolt(diameter);
  boltTop1.position.set(backPlateWidth/3,backPlateHeight - backPlateWidth/2 - backPlateWidth/6 ,0);
  const boltTop2 = bolt(diameter);
  boltTop2.position.set(backPlateWidth/3,backPlateHeight - backPlateWidth/2 - backPlateWidth/6 ,0);

  const boltBottom1 = bolt(diameter);
  boltBottom1.position.set(backPlateWidth/3,backPlateWidth/3,0);
  const boltBottom2 = bolt(diameter);
  boltBottom2.position.set(backPlateWidth/3,backPlateWidth/3,0);
  
  

  const handleBar1 = handleBar(widthHandleBar, heightHandleBar, backPlateWidth, backPlateDepth);
  handleBar1.position.set(backPlateWidth - widthHandleBar/2,backPlateHeight/2 + backPlateHeight/10,backPlateDepth*2);
  handleBar1.rotation.z += Math.PI/2;


  const handleBar2 = handleBar(widthHandleBar, heightHandleBar, backPlateWidth, backPlateDepth); 
  handleBar2.position.set(widthHandleBar/2,backPlateHeight/2 + backPlateHeight/5,backPlateDepth);
  handleBar2.rotation.z -= Math.PI/2;
  
  sweetBackPlate1.add(handleBar1);
  sweetBackPlate1.add(boltTop1);
  sweetBackPlate1.add(boltBottom1);
  parentObject.add(sweetBackPlate1);
  sweetBackPlate2.add(boltBottom2);
  sweetBackPlate2.add(boltTop2);
  sweetBackPlate2.add(handleBar2);


  parentObject.add(sweetBackPlate2);


  scene.add(parentObject);
}

//handle Back plate dimenstions
const backPlateWidth = 20;
const backPlateHeight = 100;
const backPlateDepth = 4;
const holeRadius = backPlateWidth/4; // radius of the Key Hole
const keyHoleYPosition = backPlateWidth+backPlateHeight/6; // Position on y axis of Key hole


//handle bar dimensions
const widthHandleBar = backPlateWidth/2;
const heightHandleBar = backPlateHeight - backPlateHeight/3;

//bolt dimensions
const diameter = backPlateWidth/3;

createSweetHandle(backPlateWidth ,backPlateHeight,
  holeRadius,
  backPlateDepth,
  keyHoleYPosition, diameter);

  //#endregion



//#region  Renderer setup
const canvas = document.querySelector("canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.render(scene, camera);
//#endregion

//#region Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

controls.update();
//#endregion

//#region animation
function animate() {
  controls.update();

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
//#endregion
