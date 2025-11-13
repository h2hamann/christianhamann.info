document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.ani-typed');
    
    elements.forEach(element => {
        let text = element.dataset.text || element.textContent;
        text = text.replace(/\\n/g, '\n').replace(/\r?\n/g, '\n');
        element.innerHTML = '';
        typeText(element, text, 0);
    });
});

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
                // Verschmelze mit vorherigem TextNode falls vorhanden
                const prev = highlighted.previousSibling;
                if (prev && prev.nodeType === 3) { // TextNode
                    prev.textContent += highlighted.textContent;
                    highlighted.remove();
                } else {
                    const textNode = document.createTextNode(highlighted.textContent);
                    highlighted.parentNode.replaceChild(textNode, highlighted);
                }
            }
            typeText(element, text, index + 1);
        }, 75);
    } else {
        element.classList.add('completed');
        // Optional: Alle TextNodes zusammenfügen
        element.normalize();
    }
}


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

