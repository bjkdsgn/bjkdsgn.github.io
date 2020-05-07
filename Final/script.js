const LOADER = document.getElementById('js-loader');

const TRAY = document.getElementById('js-tray-slide');
const DRAG_NOTICE = document.getElementById('js-drag-notice');

var theModel;

const MODEL_PATH = "human3.glb";

var activeOption = 'Jacket';
var loaded = false;

const colors = [


{
  color: '922B21' },

{
  color: 'B03A2E' },

{
  color: '76448A' },

{
  color: '6C3483' },


{
  color: '1E8449' },

{
  color: '6D7696' },

{
  color: '59484F' },

{
  color: 'F1C40F' },

{
  color: '4A572C' },

{
  color: 'E34819' },

{
  color: 'A04000' },

{
  color: '616A6B' },

{
  color: '283747' },

{
  color: '212F3D' },

{
  color: '1E1E1E' },

{
  color: '389389' },

{
  color: '85BEAE' },

{
  color: 'F2DABA' },

{
  color: 'F2A97F' },

{
  color: 'D85F52' },

{
  color: 'D92E37' },

{
  color: 'B2E3E8' },

{
  color: '803018' },

{
  color: 'E8E4E1' },

{
  color: 'CCA772' },

{
  color: '996B42' },

  {
    color: '803018' },
  
  {
    color: 'E8E4E1' },
  
  {
    color: 'CCA772' },
  
  {
    color: '996B42' },

    {
      color: 'F5F5F5' },

];




const BACKGROUND_COLOR = 0xffffff;
// Init the scene
const scene = new THREE.Scene();
// Set background
scene.background = new THREE.Color(BACKGROUND_COLOR);

const canvas = document.querySelector('#c');

// Init the renderer
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);

var cameraFar = 3.5;

document.body.appendChild(renderer.domElement);

// Add a camerra
var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = cameraFar;
camera.position.x = 0;

// Initial material
const INITIAL_MTL = new THREE.MeshPhongMaterial({ color: 0xf1f1f1, shininess: 10 });

const INITIAL_MAP = [
{ childID: "Body", mtl: INITIAL_MTL },
{ childID: "Eye", mtl: INITIAL_MTL },
{ childID: "Eye_Brow", mtl: INITIAL_MTL },
{ childID: "Hair", mtl: INITIAL_MTL },
{ childID: "Jacket", mtl: INITIAL_MTL },
{ childID: "Short_sleeve_Shirt", mtl: INITIAL_MTL },
{ childID: "Glove", mtl: INITIAL_MTL },
{ childID: "Long_Pant", mtl: INITIAL_MTL },
{ childID: "Belt", mtl: INITIAL_MTL },
{ childID: "Shoes", mtl: INITIAL_MTL }];


// Init the object loader
var loader = new THREE.GLTFLoader();

loader.load(MODEL_PATH, function (gltf) {
  theModel = gltf.scene;

  theModel.traverse(o => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });

  // Set the models initial scale   
  theModel.scale.set(0.5, 0.5, 0.5);
  theModel.rotation.y = Math.PI;

  // Offset the y position a bit
  theModel.position.y = -1.2;

  // Set initial textures
  for (let object of INITIAL_MAP) {
    initColor(theModel, object.childID, object.mtl);
  }

  // Add the model to the scene
  scene.add(theModel);

  // Remove the loader
  LOADER.remove();

}, undefined, function (error) {
  console.error(error);
});

// Function - Add the textures to the models
function initColor(parent, type, mtl) {
  parent.traverse(o => {
    if (o.isMesh) {
      if (o.name.includes(type)) {
        o.material = mtl;
        o.nameID = type; // Set a new property to identify this object
      }
    }
  });
}

// Add lights
var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
hemiLight.position.set(0, 0, 0);
// Add hemisphere light to scene   
scene.add(hemiLight);

// Add directional Light to scene  
var dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.position.set(-8, 12, 8);
dirLight.castShadow = true;
scene.add(dirLight);

// Floor
var floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
var floorMaterial = new THREE.MeshPhongMaterial({
  color: 0xeeeeee,
  shininess: 0 });


// var floor = new THREE.Mesh(floorGeometry, floorMaterial);
// floor.rotation.x = -0.5 * Math.PI;
// floor.receiveShadow = true;
// floor.position.y = -1;
// scene.add(floor);

// Add controls
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI / 2;
controls.minPolarAngle = Math.PI / 5;
controls.enableDamping = true;
controls.enablePan = false;
controls.dampingFactor = 0.1;
controls.autoRotate = false; 
controls.autoRotateSpeed = 0.2; 

function animate() {

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  if (theModel != null && loaded == false) {
    initialRotation();
    DRAG_NOTICE.classList.add('start');
  }
}

animate();

// Function - New resizing method
function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  var width = window.innerWidth;
  var height = window.innerHeight;
  var canvasPixelWidth = canvas.width / window.devicePixelRatio;
  var canvasPixelHeight = canvas.height / window.devicePixelRatio;

  const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
  if (needResize) {

    renderer.setSize(width, height, false);
  }
  return needResize;
}

// Function - Build Colors

function buildColors(colors) {
  for (let [i, color] of colors.entries()) {
    let swatch = document.createElement('div');
    swatch.classList.add('tray__swatch');

    if (color.texture)
    {
      swatch.style.backgroundImage = "url(" + color.texture + ")";
    } else
    {
      swatch.style.background = "#" + color.color;
    }

    swatch.setAttribute('data-key', i);
    TRAY.append(swatch);
  }
}

buildColors(colors);

// Select Option
const options = document.querySelectorAll(".option");

for (const option of options) {
  option.addEventListener('click', selectOption);
}

function selectOption(e) {
  let option = e.target;
  activeOption = e.target.dataset.option;
  for (const otherOption of options) {
    otherOption.classList.remove('--is-active');
  }
  option.classList.add('--is-active');
}

// Swatches
const swatches = document.querySelectorAll(".tray__swatch");

for (const swatch of swatches) {
  swatch.addEventListener('click', selectSwatch);
}

function selectSwatch(e) {
  let color = colors[parseInt(e.target.dataset.key)];
  let new_mtl;

  if (color.texture) {

    let txt = new THREE.TextureLoader().load(color.texture);

    txt.repeat.set(color.size[0], color.size[1], color.size[2]);
    txt.wrapS = THREE.RepeatWrapping;
    txt.wrapT = THREE.RepeatWrapping;

    new_mtl = new THREE.MeshPhongMaterial({
      map: txt,
      shininess: color.shininess ? color.shininess : 10 });

  } else

  {
    new_mtl = new THREE.MeshPhongMaterial({
      color: parseInt('0x' + color.color),
      shininess: color.shininess ? color.shininess : 10 });


  }

  setMaterial(theModel, activeOption, new_mtl);
}

function setMaterial(parent, type, mtl) {
  parent.traverse(o => {
    if (o.isMesh && o.nameID != null) {
      if (o.nameID == type) {
        o.material = mtl;
      }
    }
  });
}

// Function - Opening rotate
let initRotate = 0;

function initialRotation() {
  initRotate++;
  if (initRotate <= 160) {
    theModel.rotation.y += Math.PI / 60;
  } else {
    loaded = true;
  }
}


// Functions that toggles visibility of clothing items

var JacketVisible = true;

 function hideJacket (){
  theModel.traverse ( function (child) {
    if (child instanceof THREE.Mesh) {
      if (child.name.includes("Jacket")) {
                  child.visible = false;
              } 
    }
  }); 
};

function showJacket (){
  theModel.traverse ( function (child) {
    if (child instanceof THREE.Mesh) {
      if (child.name.includes("Jacket")) {
                  child.visible = true;
              } 
    }
  }); 
};

document.getElementById("toggleJacket").addEventListener("click", function() {
  if (JacketVisible) {
    hideJacket();  
    JacketVisible = false;
    toggleJacket.style.opacity = "0.2";
    toggleJacket.style.transition = "all .3s";
  } else {
    showJacket();
    JacketVisible = true;
    toggleJacket.style.opacity = ".8";
  }
} );

var ShortSleeveVisible = true;

 function hideShortSleeve(){
  theModel.traverse ( function (child) {
    if (child instanceof THREE.Mesh) {
      if (child.name.includes("Short_sleeve_Shirt")) {
                  child.visible = false;
              } 
    }
  });
};

function showShortSleeve(){
  theModel.traverse ( function (child) {
    if (child instanceof THREE.Mesh) {
      if (child.name.includes("Short_sleeve_Shirt")) {
                  child.visible = true;
              } 
    }
  }); 
};

document.getElementById("toggleShortSleeve").addEventListener("click", function() {
  if (ShortSleeveVisible) {
    hideShortSleeve();  
    ShortSleeveVisible = false;
    toggleShortSleeve.style.opacity = "0.2";
    toggleShortSleeve.style.transition = "all .3s";
  } else {
    showShortSleeve();
    ShortSleeveVisible = true;
    toggleShortSleeve.style.opacity = ".8";
  }
} );

var GloveVisible = true;

function hideGlove(){
  theModel.traverse ( function (child) {
    if (child instanceof THREE.Mesh) {
      if (child.name.includes("Glove")) {
                  child.visible = false;
              } 
    }
  });
};

function showGlove (){
  theModel.traverse ( function (child) {
    if (child instanceof THREE.Mesh) {
      if (child.name.includes("Glove")) {
                  child.visible = true;
              } 
    }
  }); 
};

document.getElementById("toggleGlove").addEventListener("click", function() {
  if (GloveVisible) {
    hideGlove();  
    GloveVisible = false;
    toggleGlove.style.opacity = "0.2";
    toggleGlove.style.transition = "all .3s";
  } else {
    showGlove();
    GloveVisible = true;
    toggleGlove.style.opacity = ".8";
  }
} );

var PantsVisible = true;

function hidePants (){
  theModel.traverse ( function (child) {
    if (child instanceof THREE.Mesh) {
      if (child.name.includes("Long_Pant")) {
                  child.visible = false;
              } 
    }
  });
};

function showPants (){
  theModel.traverse ( function (child) {
    if (child instanceof THREE.Mesh) {
      if (child.name.includes("Long_Pant")) {
                  child.visible = true;
              } 
    }
  }); 
};

document.getElementById("togglePants").addEventListener("click", function() {
  if (PantsVisible) {
    hidePants();  
    PantsVisible = false;
    togglePants.style.opacity = "0.2";
    togglePants.style.transition = "all .3s";
  } else {
    showPants();
    PantsVisible = true;
    togglePants.style.opacity = ".8";
  }
} );

var BeltVisible = true;

function hideBelt(){
  theModel.traverse ( function (child) {
    if (child instanceof THREE.Mesh) {
      if (child.name.includes("Belt")) {
                  child.visible = false;
              } 
    }
  });
};

function showBelt(){
  theModel.traverse ( function (child) {
    if (child instanceof THREE.Mesh) {
      if (child.name.includes("Belt")) {
                  child.visible = true;
              } 
    }
  }); 
};

document.getElementById("toggleBelt").addEventListener("click", function() {
  if (BeltVisible) {
    hideBelt();  
    BeltVisible = false;
    toggleBelt.style.opacity = "0.2";
    toggleBelt.style.transition = "all .3s";
  } else {
    showBelt();
    BeltVisible = true;
    toggleBelt.style.opacity = ".8";
  }
} );

var ShoesVisible = true;

function hideShoes(){
  theModel.traverse ( function (child) {
    if (child instanceof THREE.Mesh) {
      if (child.name.includes("Shoes")) {
                  child.visible = false;
              } 
    }
  });
};

function showShoes(){
  theModel.traverse ( function (child) {
    if (child instanceof THREE.Mesh) {
      if (child.name.includes("Shoes")) {
                  child.visible = true;
              } 
    }
  }); 
};

document.getElementById("toggleShoes").addEventListener("click", function() {
  if (ShoesVisible) {
    hideShoes();  
    ShoesVisible = false;
    toggleShoes.style.opacity = "0.2";
    toggleShoes.style.transition = "all .3s";
  } else {
    showShoes();
    ShoesVisible = true;
    toggleShoes.style.opacity = ".8";
  }
} );

//Change Background

var headerTitle = document.getElementById("title");

var PlainButton = document.getElementById('plain');
PlainButton.addEventListener('click', function(){
  scene.background = new THREE.Color(BACKGROUND_COLOR);
  headerTitle.className = "text-black";
});

var CityButton = document.getElementById('city');
CityButton.addEventListener('click', function(){
  scene.background = new THREE.TextureLoader().load('city.jpg');
  headerTitle.className = "text-white";
  
});

var ForestButton = document.getElementById('forest');
ForestButton.addEventListener('click', function(){
  scene.background = new THREE.TextureLoader().load('forest.jpg');
  headerTitle.classList.add("text-white");
});

var NightButton = document.getElementById('night');
NightButton.addEventListener('click', function(){
  scene.background = new THREE.TextureLoader().load('night.jpg');
  headerTitle.classList.add("text-white");
});


// Get the modal
var help = document.getElementById("helpMessage");

// Get the button that opens the modal
var helpBtn = document.getElementById("helpButton");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
helpBtn.onclick = function() {
  help.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  help.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == help) {
    help.style.display = "none";
  }
}

window.onload=function(){
  helpBtn.click();
};