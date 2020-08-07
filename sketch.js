var database;
var drawing = [];
var currentPath = [];
var isDrawing = false;
var initialInput;

function setup() {
  canvas = createCanvas(200, 200);

  canvas.mousePressed(startPath);
  canvas.parent('canvascontainer');
  canvas.mouseReleased(endPath);

  var clearButton = select('#clearButton');
  clearButton.mousePressed(clearDrawing);

  var saveButton = select('#saveButton');
  saveButton.mousePressed(saveDrawing);

  initialInput = createInput('Enter Name...');

  var firebaseConfig = {
    apiKey: "AIzaSyBHOXqhkqIil-f8HAEwqWwdwPPf_5P5SKk",
    authDomain: "universal-canvas-project-b5135.firebaseapp.com",
    databaseURL: "https://universal-canvas-project-b5135.firebaseio.com",
    projectId: "universal-canvas-project-b5135",
    storageBucket: "universal-canvas-project-b5135.appspot.com",
    messagingSenderId: "398429327981",
    appId: "1:398429327981:web:99eaf26c24ae3755456564"
  };
  firebase.initializeApp(firebaseConfig);
  database = firebase.database();

  var params = getURLParams();
  console.log(params);
  if (params.id) {
    console.log(params.id);
    showDrawing(params.id);
  }

  var ref = database.ref('drawings');
  ref.on('value', gotData, errData);
}

function startPath() {
  isDrawing = true;
  currentPath = [];
  drawing.push(currentPath);
}

function endPath() {
  isDrawing = false;
}

function draw() {
  background(0);

  if (isDrawing) {
    var point = {
      x: mouseX,
      y: mouseY
    };
    currentPath.push(point);
  }

  stroke(255);
  strokeWeight(4);
  noFill();
  for (var i = 0; i < drawing.length; i++) {
    var path = drawing[i];
    beginShape();
    for (var j = 0; j < path.length; j++) {
      vertex(path[j].x, path[j].y);
    }
    endShape();
  }
}

function saveDrawing() {
  var ref = database.ref('drawings');
  var data = {
    name: initialInput.value(),
    drawing: drawing
  };
  var result = ref.push(data, dataSent);
  console.log(result.key);

  function dataSent(err, status) {
    console.log(status);
  }
}

function gotData(data) {
  // clear the listing
  var elts = selectAll('.listing');
  for (var i = 0; i < elts.length; i++) {
    elts[i].remove();
  }

  var drawings = data.val();
  var keys = Object.keys(drawings);
  for (var i = 0; i < keys.length; i++) {
   var key = keys[i];
    console.log(key);
    var li = createElement('li', '');
    li.class('listing');
    var ahref = createA('#', key);
    ahref.mousePressed(showDrawing);
    ahref.parent(li);

    var perma = createA('?id=' + key, 'permalink');
    perma.parent(li);
    perma.style('padding', '4px');

    li.parent('drawinglist');
  }
}

function errData(err) {
  console.log(err);
}

function showDrawing(key) {
  //console.log(arguments);
  if (key instanceof MouseEvent) {
    key = this.html();
  }

  var ref = database.ref('drawings/' + key);
  ref.once('value', oneDrawing, errData);

  function oneDrawing(data) {
    var dbdrawing = data.val();
    drawing = dbdrawing.drawing;
    //console.log(drawing);
  }
}

function clearDrawing() { 
  drawing = []; 
}
