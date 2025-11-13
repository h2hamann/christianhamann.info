const ballBounce = (p) => {
    let x;
    let y;
    let ySpeed = 10000;
    let gravity = 0.75;
    let damping = 0.75;
    let canvas;
    let restTime = 0;
    let restDuration = 120; // Pause vor dem Versinken
    let sinkDuration = 60; // Dauer des Versinkens
    let isResting = false;
    let isSinking = false;
    let minBounceHeight = 8;
    let smallBounces = 0;
    let maxSmallBounces = 6;
    let isAnimating = false;
    let ballColor;
    
    p.setup = function() {
        let container = document.getElementById('bounce-container');
        canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
        canvas.parent('bounce-container');
        canvas.id('bounce-canvas');
        
        // CSS Custom Property auslesen
        updateBallColor();
        
        resetBall();
        p.noLoop();
    }
    
    function updateBallColor() {
        let container = document.getElementById('bounce-container');
        let styles = getComputedStyle(container);
        let cssColor = styles.getPropertyValue('--ball-color').trim();
        
        // Fallback falls CSS Variable nicht gesetzt
        ballColor = cssColor || '#FFFF33';
    }
    
    function resetBall() {
        x = p.width / 2;
        y = -250;
        ySpeed = 0;
        isResting = false;
        isSinking = false;
        restTime = 0;
        smallBounces = 0;
    }
    
    // Öffentliche Methoden für externe Steuerung
    p.startAnimation = function() {
        if (!isAnimating) {
            isAnimating = true;
            resetBall();
            p.loop();
        }
    }
    
    p.stopAnimation = function() {
        isAnimating = false;
        p.noLoop();
        p.background(255);
    }
    
    p.resetAnimation = function() {
        isAnimating = false;
        p.noLoop();
        resetBall();
        p.background(255);
    }
    
    p.draw = function() {
        if (!isAnimating) return;
        
        p.background(255); 
        
        if (isSinking) {
            // Ball versinkt langsam nach unten
            restTime++;
            y += 1.5; // Versink-Geschwindigkeit
            
            if (restTime >= sinkDuration || y > p.height + 50) {
                resetBall(); // Animation neu starten
            }
        } else if (isResting) {
            // Ball ruht am Boden
            restTime++;
            if (restTime >= restDuration) {
                isSinking = true;
                restTime = 0; // Timer für Versink-Phase zurücksetzen
            }
        } else {
            // Ball-Animation
            y += ySpeed;
            ySpeed += gravity;
            
            if (y > p.height - 25) {
                y = p.height - 25;
                
                if (Math.abs(ySpeed) < minBounceHeight) {
                    smallBounces++;
                    
                    if (smallBounces >= maxSmallBounces) {
                        ySpeed = 0;
                        isResting = true;
                        y = p.height - 25;
                    } else {
                        ySpeed *= -damping;
                    }
                } else {
                    ySpeed *= -damping;
                }
            }
        }
        
        p.fill(ballColor); 
        p.strokeWeight(0);
        p.ellipse(x, y, 50, 50);
    }
    
    p.windowResized = function() {
        let container = document.getElementById('bounce-container');
        p.resizeCanvas(container.offsetWidth, container.offsetHeight);
        updateBallColor();
        if (isAnimating) {
            resetBall();
        }
    }
};

// p5 Instanz erstellen und referenzieren
let ballInstance = new p5(ballBounce);

// Intersection Observer Setup
const observerOptions = {
    root: null,
    rootMargin: '200px',
    threshold: 0.75
};

const observerCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            ballInstance.startAnimation();
        } else {
            ballInstance.resetAnimation();
        }
    });
};

// Observer erstellen und aktivieren
const observer = new IntersectionObserver(observerCallback, observerOptions);
const container = document.getElementById('bounce-container');
observer.observe(container);