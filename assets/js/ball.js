const ballSketch = (p) => {
  let x = -25;
  let speedX = 3;
  let y = -50;
  let ySpeed = 0;
  let gravity = 0.75;
  let canvas;
  let ballColor;

  p.setup = function() {
    let container = document.getElementById('ball-container');
    canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
    canvas.parent('ball-container');
    canvas.id('ball-canvas');
    p.loop();
    p.colorMode(p.HSB);
    
    // CSS Custom Property auslesen
    updateBallColor();
  }
  
  function updateBallColor() {
    let container = document.getElementById('ball-container');
    let styles = getComputedStyle(container);
    let cssColor = styles.getPropertyValue('--ball-color').trim();
    
    // Fallback falls CSS Variable nicht gesetzt
    ballColor = cssColor || 'hsl(60, 80%, 100%)';
  }

  p.draw = function() {
    p.background(255);
    
    // Ball-Animation (vereinfacht)
    y += ySpeed;
    ySpeed += gravity;
    
    if (y > p.height - 25) {
        y = p.height - 25;
        ySpeed *= -0.8;
    }
    
    x += speedX;
    if (x > p.width + 25) {
        x = -25;
        y = -50;
        ySpeed = 0;
    }
    
    // Ball zeichnen mit CSS Custom Property
    p.fill(ballColor);
    p.strokeWeight(0);
    p.ellipse(x, y, 50, 50);
  }
  
  p.windowResized = function() {
    let container = document.getElementById('ball-container');
    p.resizeCanvas(container.offsetWidth, container.offsetHeight);
    updateBallColor();
  }
};

// Instanz erstellen
new p5(ballSketch);