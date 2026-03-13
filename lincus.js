const leftCanvas = document.getElementById('dot-canvas-left');
const leftCtx = leftCanvas.getContext('2d');

const rightCanvas = document.getElementById('dot-canvas-right');
const rightCtx = rightCanvas.getContext('2d');


const leftLayers = [
  { radius: 40, count: 4, speed: -0.00003, size: 14 },
  { radius: 90, count: 7, speed: 0.00002, size: 12 },
  { radius: 140, count: 9, speed: -0.00004, size: 10 },
  { radius: 190, count: 11, speed: 0.00003, size: 8 },
  { radius: 240, count: 13, speed: -0.00002, size: 7 },
];

const rightLayers = [
  { radius: 50, count: 4, speed: -0.000005, size: 20 },
  { radius: 110, count: 7, speed: 0.0000075, size: 17 },
  { radius: 170, count: 9, speed: -0.0000025, size: 13 },
  { radius: 230, count: 11, speed: 0.0000035, size: 10 },
  { radius: 290, count: 13, speed: -0.000008, size: 7 },
];


const colors = [
  'rgba(0, 14, 47, 0.2)',
];

let circleFrame = null;

function resize(canvas, ctx) {
  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  ctx.globalAlpha = 0.80;

  if(circleFrame) {
    cancelAnimationFrame(circleFrame);
    circleFrame = null;
    render()
  }

  return { cx: (canvas === leftCanvas ? 70 : width - 70), cy: (canvas === leftCanvas ? height / 2.55 : height / 2.5) };
}

function draw(ctx, cx, cy, deltaTime, layers) {
  if (!ctx) return;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  layers.forEach(layer => {
    layer.angle = (layer.angle || 0) + layer.speed * deltaTime;
    for (let i = 0; i < layer.count; i++) {
      const a = (i / layer.count) * Math.PI * 2 + layer.angle;
      const x = cx + layer.radius * Math.cos(a);
      const y = cy + layer.radius * Math.sin(a);
      ctx.beginPath();
      ctx.arc(x, y, layer.size, 0, Math.PI * 2);
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
    }
  });
}


function render() {
  const left = resize(leftCanvas, leftCtx);
  const right = resize(rightCanvas, rightCtx);

  let lastTime = performance.now();

  function loop(now) {
    const deltaTime = now - lastTime;
    lastTime = now;

    draw(leftCtx, left.cx, left.cy, deltaTime, leftLayers);
    draw(rightCtx, right.cx, right.cy, deltaTime, rightLayers);
    circleFrame = requestAnimationFrame(loop);
  }

  circleFrame = requestAnimationFrame(loop);
}


window.addEventListener('resize', () => {
  resize(leftCanvas, leftCtx);
  resize(rightCanvas, rightCtx);
});
render();


window.addEventListener('DOMContentLoaded', () => {
  const overview = document.querySelector('.overview');

  const contributions = document.querySelector('.contributions');
  const gitLogo = contributions.querySelector('.icon')
  const gitCircles = Array.from(gitLogo.querySelectorAll('circle'));

  const faculty = document.querySelector('.faculty');
  const facultyLogo = faculty.querySelector('.icon');
  const facultyIcons = Array.from(facultyLogo.querySelectorAll('g'));

  const grants = document.querySelector('.grants');
  const fileIcon = grants.querySelector('.icon');
  const fileSmileL = fileIcon.querySelector('#smile-left');
  const fileSmileR = fileIcon.querySelector('#smile-right');
  const fileEyeL = fileIcon.querySelector('#eye-left');
  const fileEyeR = fileIcon.querySelector('#eye-right');
  const fileStar = fileIcon.querySelector('#badge-star');
  const leftLength = fileSmileL.getTotalLength();
  const rightLength = fileSmileR.getTotalLength();
  const fileLines = Array.from(fileIcon.querySelectorAll('#file-lines path'));

  const createOdometer = (el, value) => {
    const odometer = new Odometer({
        el: el,
        value: 0,
    });
    odometer.update(value);
  };

  const setLineStrokes = () => {
    fileLines.forEach(line => {
      length = line.getTotalLength();
      line.style.strokeDasharray = `${length}`;
      line.style.strokeDashoffset = `${length}`;
    })
  }
  setLineStrokes()

  const setSmileStroke = () => {
    fileSmileL.style.strokeDasharray = `${leftLength}`;
    fileSmileR.style.strokeDasharray = `${rightLength}`;

    fileSmileL.style.strokeDashoffset = `${-leftLength}`;
    fileSmileR.style.strokeDashoffset = `${-rightLength}`
  }
  setSmileStroke();

  const aniGitCircles = () => {
    gitCircles.forEach(circle => {
      circle.style.transitionDelay = `${Math.random() * (250 + 750) + 250}ms`;
      circle.style.opacity = '1';
    })
  }

  const aniFacultyIcons = () => {
    facultyIcons.forEach(icon => icon.classList.add('shown'));
  }

  const aniFileIcon = () => {
    fileEyeL.style.transition = 'transform .2s ease';
    fileEyeR.style.transition = 'transform .2s ease';
    fileEyeL.style.transitionDelay = '1.15s';
    fileEyeR.style.transitionDelay = '1.15s';
    fileEyeL.offsetWidth;
    fileEyeR.offsetWidth;
    fileEyeL.style.transform = 'scale(1)';
    fileEyeR.style.transform = 'scale(1)';


    fileSmileL.style.transition = 'stroke-dashoffset .3s ease';
    fileSmileL.style.transitionDelay = '1.5s';
    fileSmileR.style.transition = 'stroke-dashoffset .3s ease';
    fileSmileR.style.transitionDelay = '1.5s';
    fileSmileL.offsetWidth;
    fileSmileR.offsetWidth;
    fileSmileL.style.strokeDashoffset = `0`;
    fileSmileR.style.strokeDashoffset = `0`;

    let lineDelay = .35;
    fileLines.forEach(line => {
      line.style.transition = 'stroke-dashoffset .3s ease-in';
      line.style.transitionDelay = `${lineDelay}s`;
      line.offsetWidth;
      line.style.strokeDashoffset = '0';
      lineDelay += .1
    })
  }


  contributions.parentElement.addEventListener('transitionend', () => {
    aniGitCircles();
    const contributionOdometer = contributions.querySelector('.contribution-odometer');
    createOdometer(contributionOdometer, 121351);
  });

  faculty.parentElement.addEventListener('transitionend', () => {
    aniFacultyIcons();
    const profileOdometer = faculty.querySelector('.faculty-odometer');
    createOdometer(profileOdometer, 2913);
  });

  grants.parentElement.addEventListener('transitionend', () => {
    aniFileIcon();
    const grantOdometer = grants.querySelector('.grants-odometer');
    createOdometer(grantOdometer, 21909);
  }, { once: true });

  const svgEl = document.getElementById('circles-svg');
  const vb = svgEl.viewBox.baseVal
  const width = vb.width;
  const height = vb.height;

  const svg = d3.select('#circles-svg');
  const nodeGroups = svg.selectAll('g[id^="circle-text-"]');

  svg.style('visibility', 'hidden');

  const nodes = nodeGroups.nodes().map((gEl) => {
    const g = d3.select(gEl);
    const circle = g.select('circle');

    const id = +g.attr('id').split('-').pop();

    const x0 = +circle.attr('cx');
    const y0 = +circle.attr('cy');

    const cx = width / 2;
    const cy = height / 2;
    const startSpread = 750;


    const r = +circle.attr('r');

    return {
      id,
      gEl,
      circleEl: circle.node(),
      r,
      x: cx + (Math.random() - 0.25) * startSpread,
      y: cy + (Math.random() - 0.5) * startSpread,
      x0,
      y0
    }
  })


  const nodeById = new Map(nodes.map(n => [n.id, n]));

  const linkPaths = svg.selectAll('path[data-rel-circles]');
  const links = linkPaths.nodes().map((pEl) => {
    const p = d3.select(pEl);
    const [a, b] = p.attr('data-rel-circles').split('-').map(Number);
    return {
      source: nodeById.get(a),
      target: nodeById.get(b),
      pEl
    }
  })

    function drag(simulation) {
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.2).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }
      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
  return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
}




  nodeGroups.data(nodes);
  function clampNodes() {
    const pad = 8;
    for (const d of nodes) {
      const minX = d.r + pad;
      const maxX = width - d.r - pad;
      const minY = d.r + pad;
      const maxY = height - d.r - pad;

      if (d.x < minX) { d.x = minX; d.vx = 0; }
      else if (d.x > maxX) { d.x = maxX; d.vx = 0; }

      if (d.y < minY) { d.y = minY; d.vy = 0; }
      else if (d.y > maxY) { d.y = maxY; d.vy = 0; }
    }
  }


  function resetToStartSpread() {
    const cx = width / 2;
    const cy = height / 2;
    const startSpread = 750;

    for (const d of nodes) {
      d.x = cx + (Math.random() - 0.25) * startSpread;
      d.y = cy + (Math.random() - 0.25) * startSpread;
      d.vx = 0;
      d.vy = 0;
      d.fx = null;
      d.fy = null;
    }

    simulation.force('link').links(links);
  }

  const simulation = d3.forceSimulation(nodes)
    .velocityDecay(0.65)
    .alphaDecay(0.02)
    .force("x", d3.forceX(d => d.x0).strength(0.12))
    .force("y", d3.forceY(d => d.y0).strength(0.12))
    .force('link', d3.forceLink(links).id(d => d.id).distance(220).strength(0.08))
    .force("charge", d3.forceManyBody().strength(-400))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(d => d.r + 18).iterations(2))
    .on("tick", render)
    .stop();

  const circlesRow = document.querySelector('.circles-row');
  circlesRow.addEventListener('transitionstart', () => {
    svg.style('visibility', 'visible');
    requestAnimationFrame(() => {
      simulation.alpha(1).alphaTarget(0).restart();
    });
  }, { once: true });

function render() {
  clampNodes();

  nodes.forEach(d => {
    const dx = d.x - d.x0;
    const dy = d.y - d.y0;
    d3.select(d.gEl).attr('transform', `translate(${dx}, ${dy})`);
  });

  links.forEach(l => {
    const x1 = l.source.x, y1 = l.source.y;
    const x2 = l.target.x, y2 = l.target.y;
    d3.select(l.pEl).attr('d', `M${x1} ${y1} L${x2} ${y2}`);
  });
}


resetToStartSpread();
render();
nodeGroups.call(drag(simulation))
svg.style("visibility", "visible");



  const processCards = Array.from(document.querySelectorAll('.process-card'));
  processCards.forEach(card => {
    // Handle mouse/touch interactions
    card.addEventListener('pointerdown', () => toggleCard(card));

    // Handle keyboard interactions (Enter and Space)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCard(card);
      }
    });
  });

  function toggleCard(card) {
    const isFlipped = card.classList.toggle('flipped');
    card.setAttribute('aria-pressed', isFlipped);
  }


  const dashObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.style.strokeDashoffset = `-${entry.target.getTotalLength()}`
        dashObserver.unobserve(entry.target)
      }
    })
  }, { threshold: .75 })


  const positionPath = (svg, idx) => {
    const cardRect = visionCards[idx].getBoundingClientRect();
    console.log(cardRect)
    const path = svg.querySelector('path.dash');
    const pathRect = path.getBoundingClientRect();
    const cardCenter = cardRect.left + (cardRect.width / 2);
    let tx = Math.round(pathRect.left - cardCenter);
    let ty = Math.round(pathRect.top - cardRect.bottom -10)

    tx = tx > 0 ? -tx : Math.abs(tx)
    ty = ty < 0 ? ty : -ty;

    svg.style.transform = `translateX(${tx}px) translateY(${ty}px)`;

  }

  const visionCards = Array.from(document.querySelectorAll('.vision-card'));
  const visionSvgs = Array.from(document.querySelectorAll('.vision-dash'));
  visionSvgs.forEach((svg, idx) => {
    const cover = svg.querySelector('path.cover');

    cover.style.strokeDasharray = cover.getTotalLength();
    cover.style.strokeDashoffset = '0';

    cover.offsetWidth;

    cover.style.transition = 'stroke-dashoffset .75s ease-in';
    cover.style.transitionDelay = `${idx * .4}s`

    dashObserver.observe(cover);

  })




  const macEditor = document.querySelector('.mac-editor');
  const editorLines = Array.from(document.querySelectorAll('.editor-line'));
  const lineMap = [];

  editorLines.forEach(line => {
    // ensure every piece of text (not already in a span) is wrapped so it participates in animation
    Array.from(line.childNodes).forEach(node => {
      if(node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
        const wrapper = document.createElement('span');
        wrapper.textContent = node.textContent;
        node.parentNode.replaceChild(wrapper, node);
      }
    });

    const spans = Array.from(line.querySelectorAll('span'));
    if(!spans || !spans.length) {
      lineMap.push({
        hasSpans: false,
        line: line,
        text: line.textContent
      })
    } else {
      const spansMap = []
      spans.forEach(span => spansMap.push({ span: span, text: span.textContent}))
      lineMap.push({
        hasSpans: true,
        line: line,
        spans: spansMap
      })
    }
  })
  console.log(lineMap)

  lineMap.forEach(obj => {
    if(obj.hasSpans) {
      obj.spans.forEach(span => {
        const rect = span.span.getBoundingClientRect();
        span.span.style.height = `${rect.height}px`;
        span.span.textContent = ''
      })
    } else {
      obj.line.textContent = ''
    }
  })

  async function animateAllLines() {
    for(let i = 0; i < lineMap.length; i++) {
      await animateLine(lineMap[i]).then(() => {
        if(i !== lineMap.length - 1) lineMap[i].line.classList.remove('typing')})
    }
  }

  const codeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        animateAllLines().then(() => { lineMap[lineMap.length - 1].line.classList.add('blink')})
        codeObserver.unobserve(macEditor);
      }
    })
  }, { threshold: .75})




  codeObserver.observe(macEditor)






const testimonies = [
  {
    quote: '“Lincus serves as a critical first step by making UConn’s research ecosystem visible and accessible, allowing students to explore ongoing projects across disciplines.”',
    name: 'Micah Heumann'
  },
  {
    quote: '“I am so proud to be the biggest, baddest blue dot in the UConn museum multiverse. I\'ve been on Lincus since 2013 or so and this overhaul makes it much more intuitive, useful and updateable.”',
    name: 'Clarissa Ceglio, Ph.D.'
  },
  {
    quote: '“Without Lincus, I would have to manually search individual department websites and faculty pages to piece together expertise areas, a time‑consuming and far less efficient process. Lincus streamlines all of that into one reliable tool.”',
    name: 'Kaylei Arcangel'
  }
];

// single testimony lane (we'll duplicate the list for seamless looping)
const row1Tests = testimonies.slice();

// row container
const testimoniesRow1 = document.querySelector('.testimonies-row-1');

// animation settings
let speed = 0.5;
let offset1 = 0;
let testGap = 15;

let testimonyAnimating = false;
let updateTestimonies = true;

let cardDivs1 = [];
// total width of one full pass (recomputed on resize)
let seamlessWidth = 0;

function createTestimonyCard(testimony) {
  const wrap = document.createElement('div');
  wrap.className = 'testimony-card-abs';

  const card = document.createElement('div');
  card.className = 'testimony-card d-flex p-3 gap-4 bg-white radius align-items-center';


  const text = document.createElement('div');
  text.className = 'testimony-text d-flex flex-column text-start';

  const quote = document.createElement('p');
  quote.className = 'testimony-quote inter-reg fs-7 mb-1';
  quote.textContent = testimony.quote;

  const name = document.createElement('span');
  name.className = 'testimony-name lust-light fs-8';
  name.textContent = testimony.name;

  text.appendChild(quote);
  text.appendChild(name);

  card.appendChild(text);
  wrap.appendChild(card);

  return wrap;
}

function buildTestimonies() {
  // start fresh
  testimoniesRow1.innerHTML = '';
  cardDivs1 = [];
  if (row1Tests.length === 0) return;

  // first pass: add one copy of each testimony
  for (let i = 0; i < row1Tests.length; i++) {
    const card = createTestimonyCard(row1Tests[i]);
    testimoniesRow1.appendChild(card);
    cardDivs1.push(card);
  }

  // measure card width and determine how many cards we need to cover the
  // container plus some extra so the animation never runs out of items.
  const cardWidth = getTestimonyCardWidth();
  if (!cardWidth) return;
  const step = cardWidth + testGap;

  const containerWidth = testimoniesRow1.offsetWidth || window.innerWidth;
  const neededCards = Math.ceil((containerWidth + window.innerWidth) / step) + 1;
  const passesNeeded = Math.ceil(neededCards / row1Tests.length);

  // add additional passes as required
  for (let pass = 1; pass < passesNeeded; pass++) {
    for (let i = 0; i < row1Tests.length; i++) {
      const card = createTestimonyCard(row1Tests[i]);
      testimoniesRow1.appendChild(card);
      cardDivs1.push(card);
    }
  }

  // width of a single cycle (one copy of each card)
  seamlessWidth = row1Tests.length * step;
}

function getTestimonyCardWidth() {
  const firstCard = cardDivs1[0] || cardDivs2[0];
  return firstCard ? firstCard.offsetWidth : 0;
}

function positionTestimonyCards() {
  const testimonyCardWidth = getTestimonyCardWidth();
  if (!testimonyCardWidth) return;

  const step = testimonyCardWidth + testGap;

  for (let i = 0; i < cardDivs1.length; i++) {
    cardDivs1[i].style.transform = `translateX(${(i * step) + offset1}px)`;
  }
}

function animateTestimonies() {
  if (!updateTestimonies) {
    testimonyAnimating = false;
    return;
  }

  testimonyAnimating = true;

  const testimonyCardWidth = getTestimonyCardWidth();
  if (!testimonyCardWidth) {
    requestAnimationFrame(animateTestimonies);
    return;
  }

  // adjust offset and wrap when past one cycle
  offset1 -= speed;
  if (seamlessWidth && offset1 <= -seamlessWidth) {
    offset1 += seamlessWidth;
  }

  positionTestimonyCards();
  requestAnimationFrame(animateTestimonies);
}

function playTestimonies() {
  if (!updateTestimonies) {
    updateTestimonies = true;
    if (!testimonyAnimating) animateTestimonies();
  }
}

function pauseTestimonies() {
  updateTestimonies = false;
}

buildTestimonies();
requestAnimationFrame(() => {
  positionTestimonyCards();
  animateTestimonies();
});

// Pause/Play button functionality
const controlBtn = document.getElementById('testimonials-control-btn');
if (controlBtn) {
  controlBtn.addEventListener('click', () => {
    if (updateTestimonies) {
      pauseTestimonies();
      controlBtn.classList.add('paused');
      controlBtn.setAttribute('aria-label', 'Play testimonials carousel');
      controlBtn.setAttribute('aria-pressed', 'true');
      // Change icon to play
      controlBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 5V19L19 12L8 5Z" fill="currentColor"/></svg>';
    } else {
      playTestimonies();
      controlBtn.classList.remove('paused');
      controlBtn.setAttribute('aria-label', 'Pause testimonials carousel');
      controlBtn.setAttribute('aria-pressed', 'false');
      // Change icon to pause
      controlBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 4H10V20H6V4ZM14 4H18V20H14V4Z" fill="currentColor"/></svg>';
    }
  });

  // Keyboard support
  controlBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      controlBtn.click();
    }
  });

  // Pause on hover
  const testimoniesRow = document.querySelector('.testimonies-row-1');
  if (testimoniesRow) {
    testimoniesRow.addEventListener('mouseenter', () => {
      if (updateTestimonies) {
        pauseTestimonies();
        controlBtn.classList.add('paused');
        controlBtn.setAttribute('aria-label', 'Play testimonials carousel');
        controlBtn.setAttribute('aria-pressed', 'true');
        controlBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 5V19L19 12L8 5Z" fill="currentColor"/></svg>';
      }
    });

    testimoniesRow.addEventListener('mouseleave', () => {
      if (!updateTestimonies) {
        playTestimonies();
        controlBtn.classList.remove('paused');
        controlBtn.setAttribute('aria-label', 'Pause testimonials carousel');
        controlBtn.setAttribute('aria-pressed', 'false');
        controlBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 4H10V20H6V4ZM14 4H18V20H14V4Z" fill="currentColor"/></svg>';
      }
    });
  }
}

window.addEventListener('resize', () => {
  // rebuild cards (could need more) and reset offset to avoid drifting
  const prevOffset = offset1;
  buildTestimonies();
  // try to keep scroll position roughly the same
  offset1 = prevOffset % seamlessWidth;
  positionTestimonyCards();
  const exampleTextLG = document.querySelector('.result-text .large')
  setExampleText()

});

  let int = null
  function setExampleText() {
    const wrap = document.querySelector('.result-text');
    const largeText = wrap.querySelector('.large');
    const fullString = 'abcdefghijklmnopqrstuvwxyz'
    if(window.innerWidth > 1400) {
      largeText.textContent = 'abcdefgh';
    } else {
      largeText.textContent = 'abcdefghijklmnopqrstuvwxyz'
      let fits = false;
      let test = 0;
      if(int) clearInterval(int);
      int = null;
      int = setInterval(() => {
        const wrapRect = wrap.getBoundingClientRect();
        const textRect = largeText.getBoundingClientRect();
        const dif = wrapRect.width - textRect.width
        console.log(dif)
        if(dif < 10) {
          largeText.textContent = largeText.textContent.slice(0, -1)
        } else if(dif > 150) {
          largeText.textContent = fullString.slice(0, largeText.textContent.length + 1)
        } else {
          clearInterval(int);
          int = null;
        }

      }, 1)
    }
  }


  setExampleText()


  const screenshotImg = document.querySelector('.screenshot');
  const searchBox = document.querySelector('.screenshot-item.search');
  const connectBox = document.querySelector('.screenshot-item.connect');
  const filterBox = document.querySelector('.screenshot-item.filter')
  const summaryBox = document.querySelector('.screenshot-item.summarize');

  const placeSSItems = () => {
    if(window.innerWidth > 1400) {
      const SSRect = screenshotImg.getBoundingClientRect();
      const searchRect = searchBox.getBoundingClientRect();
      const searchPath = searchBox.querySelector('.item-path');
      const searchMove = Math.round((SSRect.top + (SSRect.height * .15)) - (searchRect.top + (searchRect.height / 2)))
      searchBox.style.marginTop = `${searchMove}px`
      searchPath.style.left = `${-(searchPath.getBoundingClientRect().width - 4)}px`

      const connectPath = connectBox.querySelector('.item-path');
      connectPath.style.left = `${-(connectPath.getBoundingClientRect().width - 4)}px`


      const filterPath = filterBox.querySelector('.item-path');
      const fPathRect = filterPath.getBoundingClientRect();
      const filterRect = filterBox.getBoundingClientRect();
      filterPath.style.top = `${-(fPathRect.height - 4)}px`;
      filterBox.style.marginTop = `${Math.round(Math.abs((fPathRect.top + (fPathRect.height * .3)) - (SSRect.top + (SSRect.height * .35))))}px`;
    }

  }
  placeSSItems()
})

const delayMin = 50;
const delayMax = 125;

const placeChar = (span, char) => {
  span.textContent = span.textContent + char;
}




async function animateLine(lineObj) {
  return new Promise((resolve) => {
    lineObj.line.classList.add('typing')
    if(!lineObj.hasSpans) {
      const span = lineObj.line;
      const text = lineObj.text;

      const delay = Math.random() * (delayMax - delayMin) + delayMin
      const interval = setInterval(() => {
        if(span.textContent !== text) {
          placeChar(span, text[span.textContent.length]);
        } else {
          clearInterval(interval);
          resolve()
        }
      }, delay)
    } else {
      const spans = lineObj.spans;
      // build a flat list of character positions across all spans in DOM order
      const charMap = [];
      spans.forEach(obj => {
        for(let j = 0; j < obj.text.length; j++) {
          charMap.push({span: obj.span, text: obj.text, index: j});
        }
      });

      let p = 0;
      let delay = Math.random() * (delayMax - delayMin) + delayMin;
      const interval = setInterval(() => {
        delay = Math.random() * (delayMax - delayMin) + delayMin;
        if(p < charMap.length) {
          const entry = charMap[p];
          // only append next char if span hasn't filled yet
          if(entry.span.textContent.length <= entry.index) {
            placeChar(entry.span, entry.text[entry.index]);
          }
          p++;
        } else {
          clearInterval(interval);
          resolve();
        }
      }, delay);
    }
  })

}






