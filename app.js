// Simple Virtual DOM Example

// Step 1: Define the Virtual Node structure
class VNode {
    constructor(tagName, props = {}, children = []) {
        this.tagName = tagName;
        this.props = props;
        this.children = children;
    }
}

// Step 2: Create a function to generate Virtual Nodes
function createElement(tagName, props = {}, ...children) {
    return new VNode(tagName, props, children.flat());
}

// Step 3: Function to convert a virtual node to a real DOM element
function render(vnode) {
    // Handle text nodes
    if (typeof vnode === 'string' || typeof vnode === 'number') {
        return document.createTextNode(vnode);
    }
    
    // Create the element
    const element = document.createElement(vnode.tagName);
    
    // Set properties
    Object.entries(vnode.props).forEach(([name, value]) => {
        if (name.startsWith('on') && typeof value === 'function') {
            // Event listeners
            const eventName = name.slice(2).toLowerCase();
            element.addEventListener(eventName, value);
        } else {
            // Attributes
            element.setAttribute(name, value);
        }
    });
    
    // Add children
    vnode.children.forEach(child => {
        element.appendChild(render(child));
    });
    
    return element;
}

// Step 4: Mount the virtual DOM to a real DOM container
function mount(vnode, container) {
    container.appendChild(render(vnode));
}

// Example usage
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    
    // Create a simple greeting element when button is clicked
    const button = document.createElement('button');
    button.textContent = 'Create Element with Virtual DOM';
    button.className = 'action-button';
    
    button.addEventListener('click', () => {
        const app = document.getElementById('app') || createAppContainer();
        
        // Create a virtual DOM tree
        const virtualTree = createElement('div', { class: 'greeting-card' }, [
            createElement('h3', {}, 'Hello from Virtual DOM!'),
            createElement('p', {}, 'This element was created using a simple virtual DOM implementation.'),
            createElement('small', { class: 'timestamp' }, `Created at: ${new Date().toLocaleTimeString()}`)
        ]);
        
        // Clear previous content
        app.innerHTML = '';
        
        // Render and mount the virtual DOM
        mount(virtualTree, app);
    });
    
    document.querySelector('main').prepend(button);
});

// Helper function to create app container if it doesn't exist
function createAppContainer() {
    const app = document.createElement('div');
    app.id = 'app';
    document.querySelector('section').appendChild(app);
    return app;
}
