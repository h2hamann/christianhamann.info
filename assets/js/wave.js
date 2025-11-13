const waveBand = (p) => {
            let offset = 0;
            let waveOffset = 0; 
            let message = "TO PROVIDE THE BEST EXPERIENCE, YOU MUST SURPRISE USERS: YOU CAN'T EXPECT DATA—OR EVEN PEOPLE THEMSELVES—TO TELL YOU HOW ★ ";
            let messageLength;
            let canvas;
            let isAnimating = false;
            let bandColor;
            let textColor;
            let letterSpacing = 5; 
            
            p.setup = function() {
                let container = document.getElementById('wave-container');
                canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
                canvas.parent('wave-container');
                canvas.id('meine-eindeutige-id');
                
                p.textSize(32);
                p.textFont('Courier New');
                p.textAlign(p.CENTER, p.CENTER);
                
                // CSS Custom Properties auslesen
                updateColors();
                
                // Bei Monospace: alle Zeichen haben gleiche Breite
                let charWidth = p.textWidth('M'); // Referenzbreite
                messageLength = message.length * (charWidth + letterSpacing);
                
                // Animation direkt starten
                isAnimating = true;
                p.loop();
            }
            
            function updateColors() {
                let container = document.getElementById('wave-container');
                let styles = getComputedStyle(container);
                let cssBandColor = styles.getPropertyValue('--band-color').trim();
                let cssTextColor = styles.getPropertyValue('--text-color').trim();
                
                bandColor = cssBandColor || '#FFFFFF';
                textColor = cssTextColor || '#FFFFFF';
            }
            
            function resetAnimation() {
                offset = 0;
                waveOffset = 0;
            }
            
            // Öffentliche Methoden für externe Steuerung
            p.startAnimation = function() {
                if (!isAnimating) {
                    isAnimating = true;
                    p.loop();
                }
            }
            
            p.stopAnimation = function() {
                isAnimating = false;
                p.noLoop();
                p.background(20);
            }
            
            p.resetAnimation = function() {
                isAnimating = false;
                p.noLoop();
                resetAnimation();
                p.background(20);
            }
            
            p.draw = function() {
                if (!isAnimating) return;
                
                p.background(20);
                
                // Zeichne Wellenband-Hintergrund
                p.noStroke();
                p.fill(bandColor);
                
                p.beginShape();
                p.vertex(0, p.height);
                for (let x = 0; x <= p.width; x += 5) {
                    let y = p.height / 2 + p.sin(x * 0.02 + offset * 0.05) * 30;
                    p.vertex(x, y + 40);
                }
                p.vertex(p.width, p.height);
                p.endShape(p.CLOSE);
                
                p.beginShape();
                for (let x = 0; x <= p.width; x += 5) {
                    let y = p.height / 2 + p.sin(x * 0.02 + offset * 0.05) * 30;
                    p.vertex(x, y - 40);
                }
                p.vertex(p.width, 0);
                p.vertex(0, 0);
                p.endShape(p.CLOSE);
                
                // Zeichne Text auf dem Wellenpfad
                p.fill(textColor);
                
                // Erstelle mehrere Kopien für nahtloses Scrollen
                let charWidth = p.textWidth('M');
                let numCopies = p.ceil(p.width / messageLength) + 3;
                
                for (let copy = 0; copy < numCopies; copy++) {
                    let xStart = offset + copy * messageLength;
                    let xPos = xStart;
                    
                    for (let i = 0; i < message.length; i++) {
                        let char = message.charAt(i);
                        
                        // Berechne Position auf der Welle
                        let yPos = p.height / 2 + p.sin(xPos * 0.02 + offset * 0.05) * 30;
                        
                        // Berechne Rotation basierend auf Wellenverlauf
                        let nextX = xPos + 2;
                        let nextY = p.height / 2 + p.sin(nextX * 0.02 + offset * 0.05) * 30;
                        let angle = p.atan2(nextY - yPos, 2);
                        
                        // Zeichne Buchstaben
                        p.push();
                        p.translate(xPos, yPos);
                        p.rotate(angle);
                        p.text(char, 0, 0);
                        p.pop();
                        
                        xPos += charWidth + letterSpacing;
                    }
                }
                
                // Bewege den Offset für Scrolling (kleinerer Wert = langsamer)
                offset -= 1.25;
                
                // Nahtloser Loop: wenn offset einen vollen Durchlauf erreicht hat
                while (offset <= -messageLength) {
                    offset += messageLength;
                }
            }
            
            p.windowResized = function() {
                let container = document.getElementById('wave-container');
                p.resizeCanvas(container.offsetWidth, container.offsetHeight);
                updateColors();
                if (isAnimating) {
                    resetAnimation();
                }
            }
        };
        
        // p5 Instanz erstellen und referenzieren
        let waveInstance = new p5(waveBand);