// Enable logging for debugging - set to false to disable
const ENABLE_LOGGING = true;

function log(message, data = null) {
  if (ENABLE_LOGGING) {
    if (data) {
      console.log(`[Freedom Baseball] ${message}`, data);
    } else {
      console.log(`[Freedom Baseball] ${message}`);
    }
  }
}

// Load header and footer
async function loadHeader() {
  try {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (!headerPlaceholder) {
      log('Header placeholder not found');
      return;
    }

    // Check if we're running from file:// protocol
    if (window.location.protocol === 'file:') {
      log('WARNING: Running from file:// protocol. Header/footer loading requires HTTP server.');
      log('Please use a local server (e.g., python -m http.server or live-server)');
      return;
    }

    const response = await fetch('header.html');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    headerPlaceholder.outerHTML = html;
    log('Header loaded successfully');
    // Reinitialize navigation toggle after header loads
    initNavigation();
  } catch (error) {
    log('ERROR: Failed to load header', error);
    log('Make sure you are running from a web server (not file://)');
  }
}

async function loadFooter() {
  try {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (!footerPlaceholder) {
      log('Footer placeholder not found');
      return;
    }

    // Check if we're running from file:// protocol
    if (window.location.protocol === 'file:') {
      log('WARNING: Running from file:// protocol. Header/footer loading requires HTTP server.');
      return;
    }

    const response = await fetch('footer.html');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    footerPlaceholder.outerHTML = html;
    log('Footer loaded successfully');
    // Update year after footer loads
    updateYear();
  } catch (error) {
    log('ERROR: Failed to load footer', error);
    log('Make sure you are running from a web server (not file://)');
  }
}

// Navigation toggle functionality
function initNavigation() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.menu');
  if(toggle && !toggle.hasAttribute('data-initialized')){
    toggle.setAttribute('data-initialized', 'true');
    toggle.addEventListener('click', ()=>{
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      log('Navigation menu toggled', { open });
    });
    log('Navigation initialized');
  }
}

// Year display
function updateYear() {
  const year = document.getElementById('year');
  if(year){ 
    year.textContent = new Date().getFullYear();
    log('Year updated', new Date().getFullYear());
  }
}

// Modal functionality
const modal = document.getElementById('lessonModal');
const modalOverlay = modal?.querySelector('.modal-overlay');
const modalClose = modal?.querySelector('.modal-close');
const viewDetailsButtons = document.querySelectorAll('.view-details-btn');

// Lesson data structure
const lessonData = {
  hitting: {
    image: 'assets/hitting.jpg',
    title: 'Hitting Lessons',
    price: '$50 / 1-hour lesson',
    subtitle: 'What Hitters Gain from Private Lessons',
    items: [
      'Refined Swing Mechanics – consistent, powerful contact.',
      'Improved Timing & Pitch Recognition – react to every pitch.',
      'Increased Confidence at the Plate – structured, success-driven reps.',
      'Disciplined Hitting Approach – situational awareness every at-bat.',
      'Stronger Mental Game – focus, composure, resilience under pressure.'
    ]
  },
  fielding: {
    image: 'assets/fielding.jpg',
    title: 'Fielding Lessons',
    price: '$50 / 1-hour lesson',
    subtitle: 'What Infielders Gain from Private Lessons',
    items: [
      'Precise Footwork – quick, efficient movements to the ball.',
      'Soft Hands & Clean Transfers – smooth fielding and throwing mechanics.',
      'Improved Range – better positioning and reaction time.',
      'Game-Situation Awareness – knowing when to charge, when to stay back.',
      'Confidence in Pressure Moments – making the play when it counts.'
    ]
  },
  outfield: {
    image: 'assets/outfield.jpg',
    title: 'Outfielder Lessons',
    price: '$50 / 1-hour lesson',
    subtitle: 'What Outfielders Gain from Private Lessons',
    items: [
      'Better Reads & Routes – tracking fly balls and line drives efficiently.',
      'Stronger Throwing Arm – mechanics and accuracy for cutoffs and bases.',
      'Improved Range – covering more ground with proper technique.',
      'Situational Awareness – knowing when to dive, when to play safe.',
      'Confidence in the Field – making game-changing plays with consistency.'
    ]
  },
  pitching: {
    image: 'assets/pitching.jpg',
    title: 'Pitching Lessons',
    price: '$50 / 1-hour lesson',
    subtitle: 'What Pitchers Gain from Private Lessons',
    items: [
      'Refined Delivery Mechanics – consistent, repeatable motion.',
      'Improved Command – hitting spots with multiple pitches.',
      'Arm Care & Health – proper warm-up, recovery, and injury prevention.',
      'Pitch Development – mastering fastball, breaking ball, and off-speed.',
      'Mental Toughness – composure and strategy on the mound.'
    ]
  },
  catching: {
    image: 'assets/catching.jpg',
    title: 'Catching Lessons',
    price: '$50 / 1-hour lesson',
    subtitle: 'What Catchers Gain from Private Lessons',
    items: [
      'Receiving Skills – framing pitches and presenting strikes.',
      'Blocking Technique – keeping balls in front and preventing passed balls.',
      'Throwing Mechanics – quick, accurate throws to bases.',
      'Game Calling – understanding situations and pitch selection.',
      'Leadership & Communication – directing the defense with confidence.'
    ]
  }
};

// Function to open modal with lesson data
function openModal(lessonType) {
  log('Opening modal', { lessonType });
  
  if (!modal) {
    log('ERROR: Modal element not found');
    return;
  }

  const data = lessonData[lessonType];
  if (!data) {
    log('ERROR: Lesson data not found', { lessonType });
    return;
  }

  // Populate modal content
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalPrice = document.getElementById('modalPrice');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const modalList = document.getElementById('modalList');

  if (modalImage) modalImage.src = data.image;
  if (modalImage) modalImage.alt = `${data.title} detail`;
  if (modalTitle) modalTitle.textContent = data.title;
  if (modalPrice) modalPrice.textContent = data.price;
  if (modalSubtitle) modalSubtitle.textContent = data.subtitle;
  
  if (modalList) {
    modalList.innerHTML = '';
    data.items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      modalList.appendChild(li);
    });
  }

  // Show modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  log('Modal opened successfully');
}

// Function to close modal
function closeModal() {
  log('Closing modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    log('Modal closed successfully');
  }
}

// Event listeners for opening modal
if (viewDetailsButtons.length > 0) {
  viewDetailsButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const lessonType = btn.getAttribute('data-lesson');
      log('View details button clicked', { lessonType });
      if (lessonType) {
        openModal(lessonType);
      }
    });
  });
  log('View details buttons initialized', { count: viewDetailsButtons.length });
}

// Event listeners for closing modal
if (modalClose) {
  modalClose.addEventListener('click', closeModal);
  log('Modal close button initialized');
}

if (modalOverlay) {
  modalOverlay.addEventListener('click', closeModal);
  log('Modal overlay click handler initialized');
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal?.classList.contains('active')) {
    closeModal();
    log('Modal closed via Escape key');
  }
});

// Wait for DOM to be ready before loading header and footer
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadFooter();
    log('Script initialized successfully');
  });
} else {
  // DOM is already ready
  loadHeader();
  loadFooter();
  log('Script initialized successfully');
}
