
const linkIcon = `<svg class="item-title-link-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.21325 18.7865C2.76209 17.3353 2.76209 14.9825 4.21325 13.5314L8.2742 9.47043C9.76587 7.97876 12.1843 7.97876 13.676 9.47043L14.207 10.0014L12.7928 11.4156L12.2618 10.8846C11.5512 10.174 10.399 10.174 9.68841 10.8846L5.62747 14.9456C4.95735 15.6157 4.95735 16.7022 5.62747 17.3723C6.29758 18.0424 7.38405 18.0424 8.05416 17.3723L9.68267 15.7438L11.0969 17.158L9.46838 18.7865C8.01722 20.2377 5.66442 20.2377 4.21325 18.7865Z" fill="currentColor"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M20.121 5.21326C21.5721 6.66442 21.5721 9.01722 20.121 10.4684L16.06 14.5293C14.5684 16.021 12.1499 16.021 10.6582 14.5293L9.6019 13.473L11.0161 12.0588L12.0724 13.1151C12.783 13.8257 13.9352 13.8257 14.6458 13.1151L18.7068 9.05417C19.3769 8.38405 19.3769 7.29759 18.7068 6.62747C18.0366 5.95736 16.9502 5.95736 16.2801 6.62747L14.6516 8.25598L13.2373 6.84176L14.8659 5.21326C16.317 3.7621 18.6698 3.7621 20.121 5.21326Z" fill="currentColor"/>
</svg>`;


async function getContent() {
    const response = await fetch('./content.json');
    const content = await response.json();
    return content;
}


async function loadContent(content) {
    try {
        
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
            
            //title
            const sectionTitle = document.createElement('h2');
            sectionTitle.textContent = section.title;
            titleContainer.appendChild(sectionTitle);
            
            //arrow
            const sectionArrow = document.createElement('h2');
            sectionArrow.className = 'section-title-arrow';
            sectionArrow.textContent = '→';
            titleContainer.appendChild(sectionArrow);
            
            //section container for content
            const sectionContainer = document.createElement('div');
            sectionContainer.className = 'section-container';
            sectionElement.appendChild(sectionContainer);


            section.content.forEach(item => {
                //item container
                const itemContainer = document.createElement('div');
                itemContainer.className = 'item-container';
                sectionContainer.appendChild(itemContainer);
                

                //item image container
                const itemImageContainer = document.createElement('a');
                itemImageContainer.className = 'item-image-container';
                itemImageContainer.href = item.link;
                itemImageContainer.target = '_blank';
                itemContainer.appendChild(itemImageContainer);

                //item image
                const itemImage = document.createElement('img');
                itemImage.src = item.image;
                itemImage.alt = item.title;
                itemImage.className = 'item-image';
                itemImageContainer.appendChild(itemImage);
        
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

                if (item.link === "") {
                    itemTitle.classList.add('item-title-inactive');
                    itemTitleLink.classList.add('item-title-link-inactive');
                    itemImageContainer.classList.remove('item-image-container');
                    itemImageContainer.classList.add('item-image-container-inactive');
                }else{
                    const iconElement = document.createRange().createContextualFragment(linkIcon);
                    itemTitleLink.appendChild(iconElement);
                }
        
                //item description
                const itemDescription = document.createElement('p');
                itemDescription.textContent = item.description;
                itemDescription.className = 'item-description';
                itemDescription.classList.add('selectable-text');
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
    const sectionHeight = sectionContainer.scrollHeight;
    sectionContainer.style.setProperty('--section-height', `${sectionHeight}px`);
    requestAnimationFrame(() => {
        sectionContainer.classList.remove('collapsed');    
        sectionContainer.classList.add('expanded');
        titleContainer.classList.remove('collapsed');
        titleContainer.classList.add('expanded');
        arrow.classList.remove('collapsed');
        arrow.classList.add('expanded');
    });
    titleContainer.onclick = () => collapseSection(sectionId);
}

function collapseSection(sectionId) { 
    const section = document.querySelector(`#${sectionId}`);
    const sectionContainer = section.querySelector('.section-container');
    const titleContainer = section.querySelector('.section-title-container');
    const arrow = document.querySelector(`#${sectionId} .section-title-arrow`);
    requestAnimationFrame(() => {
        sectionContainer.classList.remove('expanded');
        sectionContainer.classList.add('collapsed');
        titleContainer.classList.remove('expanded');
        titleContainer.classList.add('collapsed');
        arrow.classList.remove('expanded');
        arrow.classList.add('collapsed');
    });
    titleContainer.onclick = () => expandSection(sectionId);
}

const reExpandSections = () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionContainer = section.querySelector('.section-container');
        if (sectionContainer.classList.contains('expanded')) {
            sectionContainer.style.transition = 'none';
            collapseSection(section.id);
            setTimeout(() => {
                sectionContainer.style.transition = '';
                expandSection(section.id);
            }, 300);
        }
    });
}

const collapseAllSections = () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        collapseSection(section.id);
    });
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
    getContent().then(content => {
        loadContent(content);
    });
    let breakPoint = 768;
    let lastWidth = window.innerWidth;

    document.querySelector('h1').addEventListener('click', () => {
        collapseAllSections();
    });
    window.addEventListener('resize', () => {
        const currentWidth = window.innerWidth
        const breakpointCrossed = lastWidth < breakPoint && currentWidth >= breakPoint || lastWidth >= breakPoint && currentWidth < breakPoint;
        if (breakpointCrossed) {
            reExpandSections();
        }
        lastWidth = currentWidth;
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
