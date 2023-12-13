const planets = []
const numPlanets = 100
const G = 6.67 * Math.pow(10,0);
let timeLastFrame

function gravityFormula(m1, m2, r) {
  return (G * m1 * m2) / (r * r);
}

function setup() {
  createCanvas(windowWidth, windowHeight)
  planets.push(new Planet(1000, 100, 500, 0, 0, color(255, 1, 1, 255)))
  planets.push(new Planet(100, 800, 500, 0, 0, color(255, 1, 1, 255)))
  planets.push(new Planet(100, 1000, 500, 0, 0, color(255, 1, 1, 255)))


  for (let i = 0; i < numPlanets; i++) {
    let mass = random(10, 10)
    let x = random(800, 1000)
    let y = 100;
    let vx = 0;
    let vy = 0;
    let cl = color(random(200, 255), random(1,155), random(200, 210), 255)
    planets.push(new Planet(mass, x, y, vx, vy, cl))
  }

  // Start time
  timeLastFrame = millis();
}

function draw() {
  background(50, 50, 50)

  let currentTime = millis()
  let dt = (currentTime - timeLastFrame) / 10000;
  timeLastFrame = currentTime

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
