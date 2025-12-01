const ballSketch = (p) => {
  // Konstanten
  const BALL_RADIUS = 25;
  const BALL_DIAMETER = 50;
  const INITIAL_X = -25;
  const INITIAL_Y = -50;
  const SPEED_X = 3;
  const GRAVITY = 0.75;
  const DAMPING = 0.8;
  const DEFAULT_COLOR = 'hsl(60, 80%, 100%)';
  
  // Zustandsvariablen
  let x = INITIAL_X;
  let y = INITIAL_Y;
  let ySpeed = 0;
  let canvas;
  let ballColor;
  let container;
  
  p.setup = function() {
    container = document.getElementById('ball-container');
    canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
    canvas.parent('ball-container');
    canvas.id('ball-canvas');
    p.loop();
    
    // CSS Custom Property auslesen
    updateBallColor();
  }
  
  function updateBallColor() {
    let styles = getComputedStyle(container);
    let cssColor = styles.getPropertyValue('--ball-color').trim();
    
    // Fallback falls CSS Variable nicht gesetzt
    ballColor = cssColor || DEFAULT_COLOR;
  }
  
  function resetBall() {
    x = INITIAL_X;
    y = INITIAL_Y;
    ySpeed = 0;
  }
  
  p.draw = function() {
    p.clear();
    
    // Ball-Animation
    y += ySpeed;
    ySpeed += GRAVITY;
    
    // Boden-Collision
    const groundLevel = p.height - BALL_RADIUS;
    if (y > groundLevel) {
      y = groundLevel;
      ySpeed *= -DAMPING;
    }
    
    // Horizontale Bewegung mit Reset
    x += SPEED_X;
    if (x > p.width + BALL_RADIUS) {
      resetBall();
    }
    
    // Ball zeichnen
    p.fill(ballColor);
    p.strokeWeight(0);
    p.ellipse(x, y, BALL_DIAMETER, BALL_DIAMETER);
  }
  
  p.windowResized = function() {
    p.resizeCanvas(container.offsetWidth, container.offsetHeight);
    updateBallColor();
  }
};

// Instanz erstellen
new p5(ballSketch);