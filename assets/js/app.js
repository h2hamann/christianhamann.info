document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.ani-typed');
    
    elements.forEach(element => {
        let text = element.dataset.text || element.textContent;
        text = text.replace(/\\n/g, '\n').replace(/\r?\n/g, '\n');
        element.innerHTML = '';
        typeText(element, text, 0);
    });
});



const isAppleEmoji = /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent);
if (isAppleEmoji) document.body.classList.add('apple-emoji');



function typeText(element, text, index) {
    if (index < text.length) {
        const char = text.charAt(index);
        
        if (char === '\n') {
            element.appendChild(document.createElement('br'));
        } else {
            const span = document.createElement('span');
            span.textContent = char;
            span.className = 'highlight';
            element.appendChild(span);
        }
        
        setTimeout(() => {
            const highlighted = element.querySelector('.highlight');
            if (highlighted) {
                highlighted.classList.remove('highlight');
                const prev = highlighted.previousSibling;
                if (prev && prev.nodeType === 3) { 
                    prev.textContent += highlighted.textContent;
                    highlighted.remove();
                } else {
                    const textNode = document.createTextNode(highlighted.textContent);
                    highlighted.parentNode.replaceChild(textNode, highlighted);
                }
            }
            typeText(element, text, index + 1);
        }, 50); // speed
    } else {
        element.classList.add('completed');
        element.normalize();
    }
}




document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById('testimonial-btn');
    if (!btn) return;

    const parts = document.querySelectorAll('#testimonial-block .testimonial-part');
    let currentPhase = 1;
    let isTyping = false;

    function waitForEngine(element) {
        return new Promise((resolve) => {
            const observer = new MutationObserver((mutations, obs) => {
                if (element.classList.contains('completed')) {
                    obs.disconnect();
                    resolve();
                }
            });
            observer.observe(element, { attributes: true, attributeFilter: ['class'] });
        });
    }

    btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (isTyping) return;

        if (currentPhase === 1) {
            isTyping = true;
            btn.textContent = "➳";

            const target = parts[0];
            
            target.classList.add('ani-typed'); 
            
            typeText(target, target.getAttribute('data-append'), 0);

            await waitForEngine(target);

            isTyping = false;
            currentPhase = 2;

        } else if (currentPhase === 2) {
            isTyping = true;
            btn.textContent = "";
            btn.classList.add('is-final');
            btn.setAttribute('disabled', 'true');

            const target = parts[1];
            target.classList.add('ani-typed');

            typeText(target, target.getAttribute('data-append'), 0);

            await waitForEngine(target);
            isTyping = false;
            currentPhase = 3;

            const thanksEl = document.getElementById('thanks');
            if (thanksEl) {
                thanksEl.classList.add('fade-in');
            }
        }
    });
});


document.querySelectorAll(".clickable").forEach(function(box) {
  box.addEventListener("click", function(e) {
    const link = this.querySelector("a");
    if (link) {
      window.open(link.getAttribute("href"), "_blank");
    }
    e.preventDefault();
    return false;
  });
});



function StackSlider(container) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.slides = Array.prototype.slice.call(this.container.children);
    this.currentIndex = 0;
    this.init();
    }

    StackSlider.prototype.init = function() {
    var self = this;

    this.slides.forEach(function(slide, index) {
        slide.addEventListener('click', function() {
            self.next();
        });
    });

    this.updatePositions();
    };

    StackSlider.prototype.updatePositions = function() {
    var self = this;

    this.slides.forEach(function(slide, index) {
        slide.classList.remove('active', 'next', 'next-next', 'hidden');
        
        var position = (index - self.currentIndex + self.slides.length) % self.slides.length;
        
        if (position === 0) {
            slide.classList.add('active');
        } else if (position === 1) {
            slide.classList.add('next');
        } else if (position === 2) {
            slide.classList.add('next-next');
        } else {
            slide.classList.add('hidden');
        }
    });
    };

    StackSlider.prototype.next = function() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updatePositions();
    };

    var slider = new StackSlider('#stack');



