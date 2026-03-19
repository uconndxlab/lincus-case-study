const leftCanvas = document.getElementById('dot-canvas-left');
const leftCtx = leftCanvas.getContext('2d');

const rightCanvas = document.getElementById('dot-canvas-right');
const rightCtx = rightCanvas.getContext('2d');

// Hero circle attributes
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

// Hero circle resize
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

// Draw hero circles
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

// Hero circles loop
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

  // Odometers
  const createOdometer = (el, value) => {
    const odometer = new Odometer({
        el: el,
        value: 0,
    });
    odometer.update(value);
  };

  // Set file icon strokes
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

  // Animate contributions icon
  const aniGitCircles = () => {
    gitCircles.forEach(circle => {
      circle.style.transitionDelay = `${Math.random() * (250 + 750) + 250}ms`;
      circle.style.opacity = '1';
    })
  }

  // Animate faculty icon
  const aniFacultyIcons = () => {
    facultyIcons.forEach(icon => icon.classList.add('shown'));
  }

  // Animate file icon
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
    createOdometer(grantOdometer, 8241);
  }, { once: true });


  // Physics circle animation (vert + horizontal)
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

  let currSim = null;




  const circlesRow = document.querySelector('.circles-row');
  
  circlesRow.addEventListener('transitionstart', () => {
      svg.style('visibility', 'visible');
      currSim = 'large';
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

if(window.innerWidth > 768) {
  resetToStartSpread();
  render();
  nodeGroups.call(drag(simulation))
  svg.style("visibility", "visible");

} 


  // Grow words in random order
  const bubble = document.querySelector('.word-bubble');
  const bubbleWords = Array.from(bubble.querySelectorAll('path'));

  let wordInterval = null;

  const bubbleObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        wordInterval = setInterval(() => {
          if(bubbleWords.length === 0) {
            clearInterval(wordInterval);
             wordInterval = null;
             return;
          }
          const rand = Math.floor(Math.random() * (bubbleWords.length - 1));
          const word = bubbleWords.splice(rand, 1)[0];
          word.classList.add('grown');

        }, 75)
        bubbleObserver.unobserve(bubble)
      }
    })
  }, { threshold: .9 })

  bubbleObserver.observe(bubble)

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


  const screenRef = document.querySelector('.screen-ref');

  // Clip part of svg overlapping img screen
  const setSVGClip = (svg) => {
    const screenRect = screenRef.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    svg.style.clipPath = `inset(0 ${svgRect.right - screenRect.left + 1}px 0 0)`
};

  const visionImg = document.querySelector('.vision-img');

  const visionCards = Array.from(document.querySelectorAll('.vision-card-wrap'));
  const visionSvgs = Array.from(document.querySelectorAll('.vision-dash'));
  visionSvgs.forEach((svg, idx) => {
    setSVGClip(svg)

    const cover = svg.querySelector('path.cover');
    cover.style.strokeDasharray = cover.getTotalLength();
    cover.style.strokeDashoffset = '0';
    cover.offsetWidth;

    cover.style.transition = 'stroke-dashoffset .75s ease-in';
    cover.style.transitionDelay = `${idx * .4}s`
    visionCards[idx].addEventListener('transitionend', () => {
       cover.style.strokeDashoffset = `-${cover.getTotalLength()}`
    }, {once:true})
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
    name: 'Micah Heumann',
    title: 'Director of the Office of Undergraduate Research'
  },
  {
    quote: '“I am so proud to be the biggest, baddest blue dot in the UConn museum multiverse. I\'ve been on Lincus since 2013 or so and this overhaul makes it much more intuitive, useful and updateable.”',
    name: 'Clarissa Ceglio, Ph.D.',
    title:'Associate Professor of Digital Humanities, Associate Director of Collaborative Research, UCHI'
  },
  {
    quote: '“Without Lincus, I would have to manually search individual department websites and faculty pages to piece together expertise areas, a time‑consuming and far less efficient process. Lincus streamlines all of that into one reliable tool.”',
    name: 'Kaylei Arcangel',
    title: 'Limited Submission Coordinator,OVPR'
  }
  ,
  {
    quote: '“The profile view is fantastic, I can get at a glance the areas of research and contributions and connections to other researchers that I would not have found otherwise.”',
    name: 'Greg Colati',
    title: 'Special Projects Librarian'
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

  const title = document.createElement('span');
  title.className = 'testimony-title lust-light fs-8';
  title.textContent = testimony.title || '';
  

  text.appendChild(quote);
  text.appendChild(name);
  text.appendChild(title);


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
  let neededCards = Math.ceil((containerWidth + window.innerWidth) / step) + 1;
  if(window.innerWidth < 450) {
    neededCards = 4
  }
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
  const firstCard = cardDivs1[0];
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

let paused = false;


function pausePlayTestimonies() {
  if (!paused) {
    updateTestimonies = false;
    paused = true;
    controlBtn.classList.add('paused');
    controlBtn.setAttribute('aria-label', 'Play testimonials carousel');
    controlBtn.setAttribute('aria-pressed', 'true');
    // Change icon to play
    controlBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 5V19L19 12L8 5Z" fill="currentColor"/></svg>';

  } else {
      updateTestimonies = true
      paused = false
      if (!testimonyAnimating) animateTestimonies();
      controlBtn.classList.remove('paused');
      controlBtn.setAttribute('aria-label', 'Pause testimonials carousel');
      controlBtn.setAttribute('aria-pressed', 'false');
      // Change icon to pause
      controlBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 4H10V20H6V4ZM14 4H18V20H14V4Z" fill="currentColor"/></svg>';

  }
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
    pausePlayTestimonies()
    // Keyboard support
    controlBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        controlBtn.click();
      }
    });
  })
    // Pause on hover
    const testimoniesRow = document.querySelector('.testimonies-row-1');
    if (testimoniesRow) {
      testimoniesRow.addEventListener('mouseenter', () => {
        pausePlayTestimonies();
      });

      testimoniesRow.addEventListener('mouseleave', () => {
        pausePlayTestimonies()
    });


      testimoniesRow.addEventListener('pointerdown', (downEvent) => {
        let startX = downEvent.clientX;
        let dragFrame = null;
        let endX = null;
        const drag = (moveEvent) => {
          if (dragFrame) {
            cancelAnimationFrame(dragFrame);
          }
          dragFrame = requestAnimationFrame(() => {
            const currX = moveEvent.clientX;
            const dx = currX - startX;
            startX = currX;
            offset1 += dx

            if (seamlessWidth && offset1 <= -seamlessWidth) {
              offset1 += seamlessWidth;
            } else if (seamlessWidth && offset1 >= 0) {
              offset1 -= seamlessWidth;
            }

            positionTestimonyCards()
          })
        }
        testimoniesRow.addEventListener('pointermove', drag);
        window.addEventListener('pointerup', () => {
          testimoniesRow.removeEventListener('pointermove', drag);
        }, {once: true})
      })


    }
}

window.addEventListener('resize', () => {
  // rebuild cards (could need more) and reset offset to avoid drifting
  const prevOffset = offset1;
  buildTestimonies();
  // try to keep scroll position roughly the same
  offset1 = prevOffset % seamlessWidth;
  positionTestimonyCards();
  setExampleText()
  placeSSItems()
  visionSvgs.forEach(svg => setSVGClip(svg))

  setAOS()

  if(window.innerWidth > 768) {
    if(currSim === 'small') {
      currSim = 'large';

      resetToStartSpread();
      render();
      nodeGroups.call(drag(simulation))
      svg.style("visibility", "visible");

      requestAnimationFrame(() => {
        simulation.alpha(1).restart();
      });
    }
  } else {
    if(currSim === 'large') {
      currSim = 'small';
        requestAnimationFrame(() => {
        simulation.stop()
      });
    }
  }



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
  const searchBox = document.querySelector('.screenshot-item.search:not(.sm)');
  const connectBox = document.querySelector('.screenshot-item.connect:not(.sm)');
  const filterBox = document.querySelector('.screenshot-item.filter:not(.sm)')

  const placeSSItems = () => {
    if(window.innerWidth > 1400) {
      const SSRect = screenshotImg.getBoundingClientRect();
      const searchRect = searchBox.getBoundingClientRect();
      const searchPath = searchBox.querySelector('.item-path');
      const searchMove = Math.round((SSRect.top + (SSRect.height * .15)) - (searchRect.top + (searchRect.height / 2)))
      searchBox.style.marginTop = `${searchMove}px`

      const connectPath = connectBox.querySelector('.item-path');
      if(connectPath) {
        connectPath.style.left = `${-(connectPath.getBoundingClientRect().width - 4)}px`
      }

      const filterPath = filterBox.querySelector('.item-path');
      if(filterPath) {
        const fPathRect = filterPath.getBoundingClientRect();
        filterBox.style.marginTop = `${Math.round(Math.abs((fPathRect.top + (fPathRect.height * .3)) - (SSRect.top + (SSRect.height * .35))))}px`;
      }

    }

  }
  placeSSItems()

  const summarizeBox = document.querySelector('.summarize')
  function setAOS() {
    if(window.innerWidth < 1400) {
      filterBox.setAttribute('data-aos', 'fade-down');
      searchBox.setAttribute('data-aos', 'fade-down');
    } else {
      filterBox.setAttribute('data-aos', 'fade-right');
      searchBox.setAttribute('data-aos', 'fade-left')
    }

    if(window.innerWidth < 1200) {
      visionImg.setAttribute('data-aos', 'fade-up')
      visionImg.setAttribute('data-aos-delay', '0')
    } else {
      visionImg.setAttribute('data-aos', 'fade-left')
      visionImg.setAttribute('data-aos-delay', '450')
    }

    if(window.innerWidth < 996) {
      summarizeBox.setAttribute('data-aos', 'fade-up');
    } else {
      summarizeBox.setAttribute('data-aos', 'fade-right')
    }
  }

  setAOS()

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






