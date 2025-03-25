
async function getContent() {
    const response = await fetch('./content.json');
    const content = await response.json();
    return content;
}

// Simple Virtual DOM Example

async function loadContent() {
    try {
        const response = await fetch('./content.json');
        const content = await response.json();
        
        const main = document.querySelector('main');
        content.sections.forEach(section => {
            //section element
            const sectionElement = document.createElement('section');
            sectionElement.id = section.id;
            sectionElement.classList.add('fade-in');
            //title container
            const titleContainer = document.createElement('div');
            titleContainer.className = 'section-title-container';
            titleContainer.onclick = () => expandSection(section.id);
            sectionElement.appendChild(titleContainer);
            
            //arrow
            const sectionArrow = document.createElement('h2');
            sectionArrow.className = 'section-title-arrow';
            sectionArrow.textContent = '→';
            titleContainer.appendChild(sectionArrow);
            //title
            const sectionTitle = document.createElement('h2');
            sectionTitle.textContent = section.title;
            titleContainer.appendChild(sectionTitle);
            
            
            //section container for content
            const sectionContainer = document.createElement('div');
            sectionContainer.className = 'section-container';
            sectionElement.appendChild(sectionContainer);


            section.content.forEach(item => {
                //item container
                const itemContainer = document.createElement('div');
                itemContainer.className = 'item-container';
                sectionContainer.appendChild(itemContainer);
        
                //item image
                const itemImage = document.createElement('img');
                itemImage.src = item.image;
                itemImage.alt = item.title;
                itemImage.className = 'item-image';
                itemContainer.appendChild(itemImage);
        
                //item text container
                const itemTextContainer = document.createElement('div');
                itemTextContainer.className = 'item-text-container';
                itemContainer.appendChild(itemTextContainer);
        
                //item title
                const itemTitleLink = document.createElement('a');
                itemTitleLink.href = item.link;
                itemTitleLink.className = 'item-title-link';
                itemTitleLink.target = '_blank';
        
                const itemTitle = document.createElement('h3');
                itemTitle.className = 'item-title';
                itemTitle.textContent = item.title;
                itemTitleLink.appendChild(itemTitle);
                itemTextContainer.appendChild(itemTitleLink);
        
                //item description
                const itemDescription = document.createElement('p');
                itemDescription.textContent = item.description;
                itemDescription.className = 'item-description';
                itemTextContainer.appendChild(itemDescription);
        
                //item tech
                const itemTechContainer = document.createElement('div');
                itemTechContainer.className = 'item-tech-container';
                itemTextContainer.appendChild(itemTechContainer);
        
                item.technology.forEach(tech => {
                    const itemTech = document.createElement('a');
                    itemTech.href = tech.link;
                    itemTech.textContent = tech.name;
                    itemTech.className = 'item-tech';
                    itemTech.target = '_blank';
                    itemTechContainer.appendChild(itemTech);
                });
        
            });
            main.appendChild(sectionElement);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

async function expandSection(sectionId) {
    const section = document.querySelector(`#${sectionId}`);
    const sectionContainer = section.querySelector('.section-container');
    const titleContainer = section.querySelector('.section-title-container');
    const arrow = document.querySelector(`#${sectionId} .section-title-arrow`);
    sectionContainer.classList.add('expanded');
    sectionContainer.classList.remove('collapsed');
    const numberOfChildren = sectionContainer.children.length;
    const heightPerChild = 200; // Adjust this value based on your content height
    sectionContainer.style.setProperty('--dynamic-height', `${numberOfChildren * heightPerChild}px`);
    titleContainer.classList.add('expanded');
    titleContainer.classList.remove('collapsed');
    arrow.classList.add('expanded');
    arrow.classList.remove('collapsed');
    titleContainer.onclick = () => collapseSection(sectionId);
}

async function collapseSection(sectionId) { 
    const section = document.querySelector(`#${sectionId}`);
    const sectionContainer = section.querySelector('.section-container');
    const titleContainer = section.querySelector('.section-title-container');
    const arrow = document.querySelector(`#${sectionId} .section-title-arrow`);
    sectionContainer.classList.remove('expanded');
    sectionContainer.classList.add('collapsed');
    sectionContainer.style.setProperty('--dynamic-height', '0px');

    titleContainer.classList.remove('expanded');
    titleContainer.classList.add('collapsed');
    titleContainer.onclick = () => expandSection(sectionId);

    arrow.classList.remove('expanded');
    arrow.classList.add('collapsed');
}




// TODO implement virtual dom



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
    getContent().then(content => {
        loadContent(content);
    });
    
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
    
    // document.querySelector('main').prepend(button);
});

// Helper function to create app container if it doesn't exist
function createAppContainer() {
    const app = document.createElement('div');
    app.id = 'app';
    document.querySelector('section').appendChild(app);
    return app;
}
