const ballBounce = (p) => {
    // Konstanten
    const BALL_RADIUS = 25;
    const BALL_DIAMETER = 50;
    const INITIAL_Y = -250;
    const INITIAL_Y_SPEED = 0;
    const GRAVITY = 0.75;
    const DAMPING = 0.75;
    const MIN_BOUNCE_HEIGHT = 8;
    const MAX_SMALL_BOUNCES = 6;
    const REST_DURATION = 120; // Pause vor dem Versinken
    const SINK_DURATION = 60; // Dauer des Versinkens
    const SINK_SPEED = 1.5;
    
    // Zustandsvariablen
    let x;
    let y;
    let ySpeed;
    let canvas;
    let animationState = 'bouncing'; // 'bouncing', 'resting', 'sinking'
    let stateTimer = 0;
    let smallBounces = 0;
    let isAnimating = false;
    let ballColor;
    
    p.setup = function() {
        let container = document.getElementById('bounce-container');
        // Canvas mit transparentem Hintergrund erstellen
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
        y = INITIAL_Y;
        ySpeed = INITIAL_Y_SPEED;
        animationState = 'bouncing';
        stateTimer = 0;
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
        p.clear(); // Transparent statt schwarzem Hintergrund
    }
    
    p.resetAnimation = function() {
        isAnimating = false;
        p.noLoop();
        resetBall();
        p.clear(); // Transparent statt schwarzem Hintergrund
    }
    
    function updateBallPhysics() {
        y += ySpeed;
        ySpeed += GRAVITY;
        
        if (y > p.height - BALL_RADIUS) {
            y = p.height - BALL_RADIUS;
            
            if (Math.abs(ySpeed) < MIN_BOUNCE_HEIGHT) {
                smallBounces++;
                
                if (smallBounces >= MAX_SMALL_BOUNCES) {
                    ySpeed = 0;
                    animationState = 'resting';
                    y = p.height - BALL_RADIUS;
                } else {
                    ySpeed *= -DAMPING;
                }
            } else {
                ySpeed *= -DAMPING;
            }
        }
    }
    
    p.draw = function() {
        if (!isAnimating) return;
        
        p.clear(); // Transparent statt p.background(0)
        
        if (animationState === 'sinking') {
            // Ball versinkt langsam nach unten
            stateTimer++;
            y += SINK_SPEED;
            
            if (stateTimer >= SINK_DURATION || y > p.height + 50) {
                resetBall(); // Animation neu starten
            }
        } else if (animationState === 'resting') {
            // Ball ruht am Boden
            stateTimer++;
            if (stateTimer >= REST_DURATION) {
                animationState = 'sinking';
                stateTimer = 0;
            }
        } else { // 'bouncing'
            updateBallPhysics();
        }
        
        p.fill(ballColor); 
        p.strokeWeight(0);
        p.ellipse(x, y, BALL_DIAMETER, BALL_DIAMETER);
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