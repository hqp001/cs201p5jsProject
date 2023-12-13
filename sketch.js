let planets = []
let numPlanets = 100
let G = 6.67 * Math.pow(10,0)
let timeLastFrame
let resetButton
let label
let numPlanetsInput
let gLabel
let gSlider

function gravityFormula(m1, m2, r) {
  print(G)
  return (G * m1 * m2) / (r * r)
}

function createStartButton() {
  resetButton = createButton('Start')
  resetButton.position(getPixelW(1), getPixelH(3))
  resetButton.mousePressed(restartSimulation)
}

function createLabelAndInput() {
  label = createElement('label', 'Number of Small Planets:')
  label.style('color', "yellow")
  label.position(getPixelW(1), getPixelH(7))

  numPlanetsInput = createInput(10)
  numPlanetsInput.position(getPixelW(1),getPixelH(11))
  numPlanetsInput.size(50)

  gLabel = createElement('label', 'Gravitational Constant (G):')
  gLabel.position(getPixelW(1), getPixelH(15))
  gLabel.style('color', 'yellow')

  // Slider for gravitational constant G
  gSlider = createSlider(-11, 11, 0, 1)
  gSlider.position(getPixelW(1), getPixelH(19))
}

function getIntInput(intInput) {
  let inputVal = parseInt(intInput.value())
  return isNaN(inputVal) ? 0 : inputVal
}

// Get pixel from percent of screen width
function getPixelW(percent) {
  return windowWidth * (percent / 100);
}

// Get pixel from percent of screen width
function getPixelH(percent) {
  return windowHeight * (percent / 100);
}

function planetInitialSetup() {
  planets = []

  planets.push(new Planet(1000, getPixelW(50), getPixelH(50), 0, 0, color(255, 1, 1, 255)))
  planets.push(new Planet(100, getPixelW(30), getPixelH(30), 10, 1, color(255, 1, 1, 255)))
  planets.push(new Planet(100, getPixelW(80), getPixelH(70), -20, 2, color(255, 1, 1, 255)))


  for (let i = 0; i < numPlanets; i++) {
    let mass = random(10, 10)
    let x = random(getPixelW(20), getPixelW(80))
    let y = random(getPixelH(20), getPixelH(80));
    let vx = random(0, 100);
    let vy = random(0, 100);
    let cl = color(random(200, 255), random(1,155), random(200, 210), 255)
    planets.push(new Planet(mass, x, y, vx, vy, cl))
  }
}

function restartSimulation() {

  // Rename button to restart
  resetButton.html("Restart")

  numPlanets = getIntInput(numPlanetsInput)

  G = 6.67 * Math.pow(10, gSlider.value());

  planetInitialSetup()

  // Start time
  timeLastFrame = millis()

}

function setup() {
  createCanvas(windowWidth, windowHeight)

  createStartButton()

  createLabelAndInput();
}

function draw() {
  background(50, 50, 50)

  let currentTime = millis()
  let dt = (currentTime - timeLastFrame) / 10000;
  timeLastFrame = currentTime
  dt = min(dt, 0.1)

  for (let i = 0; i < planets.length; i++) {

    // Calculate force that planet i interact to 
    for (let j = 0; j < planets.length; j++) {
      if (i != j) {
        let force = planets[i].calculateForce(planets[j])
        planets[j].updateAccel(force)
      }
    }
  }

  for (let planet of planets) {
    planet.update(dt)
    planet.display()
  }

  fill(255); // Set text color to white
  textSize(16); // Set text size
  text('Gravitational Constant G: ' + G, getPixelW(1), getPixelH(25));
}

class Planet {
  constructor(mass, x, y, vx, vy, cl) {
    this.mass = mass
    this.pos = createVector(x, y)
    this.vel = createVector(vx, vy)
    this.acc = createVector(0, 0)
    this.color = cl
    this.radius = Math.sqrt(mass) * 2;
  }

  update(dt) {
    this.vel.add(p5.Vector.mult(this.acc, dt))
    this.pos.add(p5.Vector.mult(this.vel, dt))
    this.acc.mult(0)
  }

  updateAccel(force) {
    let f = p5.Vector.div(force, this.mass)
    this.acc.add(f)
  }

  display() {
    fill(this.color)
    noStroke()
    ellipse(this.pos.x, this.pos.y, this.radius, this.radius)
  }

  calculateForce(other) {
    let distance = p5.Vector.dist(this.pos, other.pos)
    let force = p5.Vector.sub(this.pos, other.pos)
    let strength = gravityFormula(this.mass, other.mass, distance);
    force.setMag(strength)
    return force
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
