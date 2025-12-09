const blickSketch = (p) => {
  let x = -25;
  let speedX = 3;
  let y = -50;
  let ySpeed = 0;
  let gravity = 0.75;
  let isSquashing = false;
  let pauseStart = null;
  let isPaused = false;
  let isBlinking = false;
  let blinkProgress = 0;
  let canvas;
  let ballColor;

  // Counter für Durchgänge
  let cycleCount = 0;
  let maxCycles = 2;
  let isRolling = false;
  let finalRoll = false;
  
  // Versink-Animation
  let isResting = false;
  let isSinking = false;
  let isLookingUp = false;
  let restTime = 0;
  let restDuration = 120;
  let sinkDuration = 60;
  let lookUpDuration = 60;

  // Globale Variablen für sanfte Augenbewegungen
  let leftX_init = 0;
  let leftY_init = 0;
  let rightX_init = 0;
  let rightY_init = 0;
  let leftAngle = 0;
  let rightAngle = 0;
  let leftOffset = 12.5;
  let rightOffset = 12.5;

  p.setup = function() {
    let container = document.getElementById('canvas-container');
    canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
    canvas.parent('canvas-container');
    canvas.id('blick-canvas');
    
    p.colorMode(p.HSB);
    p.angleMode(p.DEGREES);
    
    // CSS Custom Property auslesen
    updateBallColor();
    
    // Augenpositionen berechnen
    calculateEyePositions();
    
    // Initialer Blick zur Startposition des Balls (oben links)
    let ballStartX = -25;
    let ballStartY = -50;
    leftAngle = p.atan2(ballStartY - leftY_init, ballStartX - leftX_init);
    rightAngle = p.atan2(ballStartY - rightY_init, ballStartX - rightX_init);
    
    p.noLoop();
  }
  
  function updateBallColor() {
    let container = document.getElementById('canvas-container');
    let styles = getComputedStyle(container);
    let cssColor = styles.getPropertyValue('--ball-color').trim();
    
    // Fallback falls CSS Variable nicht gesetzt
    ballColor = cssColor || 'hsl(60, 80%, 100%)';
  }
  
  function calculateEyePositions() {
    leftX_init = p.width / 2 - 50;
    leftY_init = p.height / 2;
    rightX_init = p.width / 2 + 50;
    rightY_init = p.height / 2;
  }

  p.draw = function() {
    p.clear();
    
    let leftX = p.width / 2 - 50;
    let leftY = p.height / 2;
    let rightX = p.width / 2 + 50;
    let rightY = p.height / 2;
    
    // Phase: Augen schauen zum Button hoch
    if (isLookingUp) {
      restTime++;
      
      // Augen schauen zum Button (nach oben links zur Startposition)
      let buttonX = -25;
      let buttonY = -50;
      let targetLeftAngle = p.atan2(buttonY - leftY, buttonX - leftX);
      let targetRightAngle = p.atan2(buttonY - rightY, buttonX - rightX);
      leftAngle = lerpAngle(leftAngle, targetLeftAngle, 0.1);
      rightAngle = lerpAngle(rightAngle, targetRightAngle, 0.1);
      leftOffset = p.lerp(leftOffset, 12.5, 0.1);
      rightOffset = p.lerp(rightOffset, 12.5, 0.1);
      
      // Augen zeichnen
      drawEye(leftX, leftY, leftAngle, leftOffset);
      drawEye(rightX, rightY, rightAngle, rightOffset);
      
      // Bodenlinie
      p.stroke(150);
      p.strokeWeight(1);
      p.line(0, p.height - 1, p.width, p.height - 1);
      
      // Nach lookUpDuration: Animation beenden
      if (restTime >= lookUpDuration) {
        document.getElementById('btn-start').disabled = false;
        p.noLoop();
      }
      
      return;
    }
    
    // Versink-Animation
    if (isSinking) {
      restTime++;
      y += 1.5; // Versink-Geschwindigkeit
      
      // Ball ist versunken - wechsle zur LookUp-Phase
      if (restTime >= sinkDuration || y > p.height + 50) {
        isLookingUp = true;
        restTime = 0;
        
        // Augen schauen dem Ball nach unten (letzter Frame)
        let targetLeftAngle = p.atan2(y - leftY, x - leftX);
        let targetRightAngle = p.atan2(y - rightY, x - rightX);
        leftAngle = targetLeftAngle;
        rightAngle = targetRightAngle;
        
        // Augen zeichnen
        drawEye(leftX, leftY, leftAngle, leftOffset);
        drawEye(rightX, rightY, rightAngle, rightOffset);
        
        // Bodenlinie
        p.stroke(150);
        p.strokeWeight(1);
        p.line(0, p.height - 1, p.width, p.height - 1);
        
        return;
      }
      
      // Augen schauen dem Ball nach unten
      let targetLeftAngle = p.atan2(y - leftY, x - leftX);
      let targetRightAngle = p.atan2(y - rightY, x - rightX);
      leftAngle = lerpAngle(leftAngle, targetLeftAngle, 0.1);
      rightAngle = lerpAngle(rightAngle, targetRightAngle, 0.1);
      leftOffset = p.lerp(leftOffset, 12.5, 0.1);
      rightOffset = p.lerp(rightOffset, 12.5, 0.1);
      
      // Augen zeichnen
      drawEye(leftX, leftY, leftAngle, leftOffset);
      drawEye(rightX, rightY, rightAngle, rightOffset);
      
      // Bodenlinie
      p.stroke(150);
      p.strokeWeight(1);
      p.line(0, p.height - 1, p.width, p.height - 1);
      
      // Ball zeichnen
      p.stroke(24, 100, 100);
      p.strokeWeight(0);
      p.fill(ballColor);
      p.ellipse(x, y, 50, 50);
      
      return;
    }
    
    // Ruhephase vor dem Versinken
    if (isResting) {
      restTime++;
      if (restTime >= restDuration) {
        isSinking = true;
        restTime = 0;
      }
      
      // Augen schauen zum ruhenden Ball
      let targetLeftAngle = p.atan2(y - leftY, x - leftX);
      let targetRightAngle = p.atan2(y - rightY, x - rightX);
      leftAngle = lerpAngle(leftAngle, targetLeftAngle, 0.1);
      rightAngle = lerpAngle(rightAngle, targetRightAngle, 0.1);
      leftOffset = p.lerp(leftOffset, 12.5, 0.1);
      rightOffset = p.lerp(rightOffset, 12.5, 0.1);
      
      // Augen zeichnen
      drawEye(leftX, leftY, leftAngle, leftOffset);
      drawEye(rightX, rightY, rightAngle, rightOffset);
      
      // Bodenlinie
      p.stroke(150);
      p.strokeWeight(1);
      p.line(0, p.height - 1, p.width, p.height - 1);
      
      // Ball zeichnen
      p.stroke(24, 100, 100);
      p.strokeWeight(0);
      p.fill(ballColor);
      p.ellipse(x, y, 50, 50);
      
      return;
    }
    
    // Ball hat aufgehört zu kullern - beginne Ruhephase
    if (isRolling && speedX == 0) {
      isResting = true;
      restTime = 0;
    }
    
    // Ballbewegung
    if (!isRolling) {
      y += ySpeed;
      ySpeed += gravity;
      
      // Bodenkontakt
      if (y > p.height - 25) {
        y = p.height - 25;
        
        // Nach maxCycles Durchgängen: Energieverlust und finaler Durchgang
        if (cycleCount >= maxCycles) {
          ySpeed *= -0.3;
          finalRoll = true;
          isSquashing = false;
          
          // Wenn der Ball kaum noch springt, beginnt das Kullern
          if (p.abs(ySpeed) < 2) {
            isRolling = true;
            ySpeed = 0;
            speedX = 2;
          }
        } else {
          ySpeed *= -0.9;
          isSquashing = true;
        }
      } else {
        if (!finalRoll) {
          isSquashing = false;
        }
      }
    } else {
      // Kullern mit Reibung
      y = p.height - 25;
      speedX *= 0.98;
      
      // Ball stoppt komplett
      if (speedX < 0.1) {
        speedX = 0;
      }
    }
    
    // Horizontale Bewegung
    if (!isPaused) {
      x += speedX;
      if (x > p.width + 25) {
        isPaused = true;
        pauseStart = p.millis();
        speedX = 0;
      }
    } else {
      let elapsed = p.millis() - pauseStart;
      if (elapsed >= 5000) {
        isPaused = false;
        cycleCount++;
        x = -25;
        
        // Geschwindigkeit für nächsten Durchgang setzen
        if (cycleCount < maxCycles) {
          speedX = 3;
          ySpeed = 0;
          isRolling = false;
          finalRoll = false;
        } else if (cycleCount == maxCycles) {
          speedX = 5;
          y = -500;
          ySpeed = 0;
          isRolling = false;
          finalRoll = false;
        } else {
          speedX = 4;
          y = -30;
          ySpeed = 0;
          isRolling = false;
        }
      }
    }
    
    // Bodenlinie
    p.stroke(150);
    p.strokeWeight(1);
    p.line(0, p.height - 1, p.width, p.height - 1);
    
    // Zielwinkel und -offsets berechnen
    let targetLeftAngle = 0;
    let targetRightAngle = 0;
    let targetLeftOffset = 0;
    let targetRightOffset = 0;
    
    if (!isPaused) {
      // Ball verfolgen
      targetLeftAngle = p.atan2(y - leftY, x - leftX);
      targetRightAngle = p.atan2(y - rightY, x - rightX);
      targetLeftOffset = 12.5;
      targetRightOffset = 12.5;
    } else {
      let elapsed = p.millis() - pauseStart;
      if (elapsed <= 2000) {
        // 2 Sek. dem Ball nachschauen
        targetLeftAngle = p.atan2(y - leftY, x - leftX);
        targetRightAngle = p.atan2(y - rightY, x - rightX);
        targetLeftOffset = 12.5;
        targetRightOffset = 12.5;
      } else if (elapsed <= 4750) {
        // 2.75 Sek. neutrale Position
        targetLeftAngle = 0;
        targetRightAngle = 0;
        targetLeftOffset = 0;
        targetRightOffset = 0;
        
        // Blinzeln zwischen 3000ms und 3300ms
        if (elapsed >= 3000 && elapsed <= 3300) {
          isBlinking = true;
          let blinkTime = elapsed - 3000;
          if (blinkTime <= 100) {
            blinkProgress = p.map(blinkTime, 0, 100, 0, 1);
          } else {
            blinkProgress = p.map(blinkTime, 100, 300, 1, 0);
          }
        } else {
          isBlinking = false;
          blinkProgress = 0;
        }
      } else {
        // 0.25 Sek. antizipieren - paralleler Blick nach links
        if (!(isRolling && speedX == 0)) {
          targetLeftAngle = 180;
          targetRightAngle = 180;
          targetLeftOffset = -12.5;
          targetRightOffset = -12.5;
        } else {
          targetLeftAngle = p.atan2(y - leftY, x - leftX);
          targetRightAngle = p.atan2(y - rightY, x - rightX);
          targetLeftOffset = 12.5;
          targetRightOffset = 12.5;
        }
      }
    }
    
    // Sanfte Interpolation zu den Zielwerten
    if (isPaused && p.millis() - pauseStart > 4750 && !(isRolling && speedX == 0)) {
      leftAngle = -45;
      rightAngle = -45;
      leftOffset = p.lerp(leftOffset, targetLeftOffset, 0.2);
      rightOffset = p.lerp(rightOffset, targetRightOffset, 0.2);
      
      if (p.abs(leftOffset) < 4) {
        leftOffset = targetLeftOffset;
        rightOffset = targetRightOffset;
      }
    } else {
      leftAngle = lerpAngle(leftAngle, targetLeftAngle, 0.1);
      rightAngle = lerpAngle(rightAngle, targetRightAngle, 0.1);
      leftOffset = p.lerp(leftOffset, targetLeftOffset, 0.1);
      rightOffset = p.lerp(rightOffset, targetRightOffset, 0.1);
    }
    
    drawEye(leftX, leftY, leftAngle, leftOffset);
    drawEye(rightX, rightY, rightAngle, rightOffset);
    
    // Ball zeichnen mit CSS Custom Property
    p.stroke(24, 100, 100);
    p.strokeWeight(0);
    p.fill(ballColor);
    p.push();
    p.translate(x, y);
    
    if (isSquashing && !finalRoll) {
      p.scale(1.2, 0.8);
    }
    
    p.ellipse(0, 0, 50, 50);
    p.pop();
  }

  function drawEye(cx, cy, angle, offset) {
    p.push();
    p.translate(cx, cy);
    p.stroke(0);
    p.strokeWeight(2);
    p.fill(255);
    p.ellipse(0, 0, 50, 50);
    
    p.rotate(angle);
    p.noStroke();
    p.fill(0);
    
    if (isBlinking && blinkProgress > 0) {
      let pupilHeight = 25 * (1 - blinkProgress * 0.9);
      p.ellipse(offset, 0, 25, pupilHeight);
    } else {
      p.ellipse(offset, 0, 25, 25);
    }
    
    p.pop();
  }

  function lerpAngle(a, b, t) {
    let diff = (b - a + 180 + 360) % 360 - 180;
    return a + diff * t;
  }

  // Öffentliche Funktion zum Starten/Neustarten der Animation
  p.startAnimation = function() {
    // Alle Variablen zurücksetzen
    x = -25;
    speedX = 3;
    y = -50;
    ySpeed = 0;
    cycleCount = 0;
    isRolling = false;
    finalRoll = false;
    isPaused = false;
    isSquashing = false;
    isBlinking = false;
    blinkProgress = 0;
    isResting = false;
    isSinking = false;
    isLookingUp = false;
    restTime = 0;
    
    // Augen zurücksetzen
    let ballStartX = -25;
    let ballStartY = -50;
    leftAngle = p.atan2(ballStartY - leftY_init, ballStartX - leftX_init);
    rightAngle = p.atan2(ballStartY - rightY_init, ballStartX - rightX_init);
    leftOffset = 12.5;
    rightOffset = 12.5;
    
    // Button deaktivieren
    document.getElementById('btn-start').disabled = true;
    
    // Animation starten
    p.loop();
  }
  
  p.windowResized = function() {
    let container = document.getElementById('canvas-container');
    p.resizeCanvas(container.offsetWidth, container.offsetHeight);
    updateBallColor();
    calculateEyePositions();
    
    // Augenwinkel neu berechnen falls Animation läuft
    if (!isPaused) {
      let ballStartX = -25;
      let ballStartY = -50;
      leftAngle = p.atan2(ballStartY - leftY_init, ballStartX - leftX_init);
      rightAngle = p.atan2(ballStartY - rightY_init, ballStartX - rightX_init);
    }
  }
};

// Instanz erstellen
const sketch = new p5(blickSketch);

// Button Event-Listener
document.getElementById('btn-start').addEventListener('click', function() {
  sketch.startAnimation();
});