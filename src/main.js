import './style.css';

const projects = [
  { n: '01', type: 'SPEECH / DEEP LEARNING', title: 'Hybrid Transformer-CNN ASR model', copy: 'Designed a hybrid Transformer–CNN speech recognizer with a 2.58% word error rate on LJ Speech, trained for 100 epochs on an MFCC pipeline.', tags: ['Python', 'PyTorch', 'Transformers', 'MFCC'], image: '/projects/asr.jpg', featured: true },
  { n: '02', type: '3D MACHINE LEARNING', title: 'Latent learning for 3D point clouds', copy: 'Built a latent embedding pipeline for 3D classification and segmentation, lifting benchmark accuracy by 8% and cutting compute overhead by 30%.', tags: ['PointNet++', 'GNNs', 'PyTorch'], image: '/projects/point-cloud.jpg' }
];
const expertise = [
  { title:'AI & MACHINE LEARNING', text:'Training and adapting models where accuracy, memory, and inference time are measured, not assumed.', tech:'Python · PyTorch · LoRA · QLoRA · Model optimization' },
  { title:'LLMS & NLP', text:'Parameter-efficient fine-tuning and NLP pipelines for classification, summarization, and information extraction.', tech:'LoRA · QLoRA · Transformers · NLP pipelines' },
  { title:'COMPUTER VISION', text:'YOLO detection for real-time edge and GPU inference, including inspection workflows that replace manual scanning.', tech:'YOLO · Object detection · Visual inspection' },
  { title:'SPEECH & 3D LEARNING', text:'Hybrid speech models and geometric representation learning for audio and point-cloud data.', tech:'ASR · MFCC · CNNs · PointNet · PointNet++ · GNNs' }
];
const faqs = [
  ['What projects has Jaden built?', 'A Hybrid Transformer–CNN ASR model with 2.58% WER on LJ Speech, and a latent embedding pipeline for 3D point-cloud classification and segmentation that improved benchmark accuracy by 8%.', 'RESUME / PROJECTS'],
  ['What does he do at Scoriant?', 'As an AI Engineer he fine-tunes LLMs with LoRA and QLoRA, builds NLP pipelines, and trains YOLO models for real-time detection, reaching 90% accuracy and cutting manual scanning effort by 40%.', 'RESUME / EXPERIENCE'],
  ['Has he worked with LLM fine-tuning?', 'Yes. At Scoriant AI he fine-tuned large language models with LoRA and QLoRA, reducing memory use by 35% and training time by 40% compared with full fine-tuning.', 'RESUME / EXPERIENCE'],
  ['What is his experience with computer vision?', 'At Scoriant he trained YOLO models for real-time object detection on edge and GPU platforms at 90% accuracy, and used them to automate visual inspection. His project work also covers 3D point clouds with PointNet, PointNet++, and graph neural networks.', 'RESUME / EXPERIENCE'],
  ['What are his academic results?', 'B.E. in Electronics and Communication from KLE Technological University, CGPA 9.24/10. Gold medalist and 1st rank in the department. He has two research publications, including one on transformer–CNN speech recognition, and completed ISRO space science training in 2023.', 'RESUME / EDUCATION']
];
const articleSources = import.meta.glob('../articles/*/index.md', { query: '?raw', import: 'default', eager: true });
const articleAssetUrls = import.meta.glob('../articles/*/*.{jpg,jpeg,png,webp,gif,svg}', { query: '?url', import: 'default', eager: true });
const projectGrid = document.querySelector('#project-grid'); const tpl = document.querySelector('#project-template');
projects.forEach(p => {
  const el = tpl.content.cloneNode(true);
  const article = el.querySelector('.project');
  if (p.featured) article.classList.add('featured');
  el.querySelector('.project-number').textContent = p.n;
  el.querySelector('.project-type').textContent = p.type;
  el.querySelector('h3').textContent = p.title;
  el.querySelector('p').textContent = p.copy;
  el.querySelector('ul').innerHTML = p.tags.map(x => `<li>${x}</li>`).join('');
  const visual = el.querySelector('.project-visual');
  const img = visual.querySelector('img');
  img.alt = `${p.title} preview`;
  if (p.image) {
    img.src = p.image;
    img.hidden = false;
    visual.classList.add('has-image');
  }
  projectGrid.append(el);
});
const expertiseList = document.querySelector('#expertise-list'); expertise.forEach((item, idx) => { const id=`expertise-${idx}`; expertiseList.insertAdjacentHTML('beforeend', `<article class="expertise-item"><button aria-expanded="false" aria-controls="${id}"><span>${String(idx+1).padStart(2,'0')}</span><strong>${item.title}</strong><i>+</i></button><div class="expertise-detail" id="${id}"><p>${item.text}</p><small>${item.tech}</small><div class="mini-pixel"></div></div></article>`); });
document.querySelectorAll('.expertise-item button').forEach(button=>button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')==='true'; document.querySelectorAll('.expertise-item button').forEach(b=>{b.setAttribute('aria-expanded','false'); b.parentElement.classList.remove('open')}); if(!open){button.setAttribute('aria-expanded','true');button.parentElement.classList.add('open')}}));
const chatPrompts = document.querySelector('#chat-prompts');
faqs.forEach(([question, answer, source]) => chatPrompts.insertAdjacentHTML('beforeend', `<button class="chat-prompt" type="button" data-answer="${encodeURIComponent(answer)}" data-source="${encodeURIComponent(source)}">${question}<span>→</span></button>`));
function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}
function loadArticles() {
  return Object.entries(articleSources).map(([path, raw]) => {
    const slug = path.split('/').at(-2);
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    const meta = {};
    if (match) {
      match[1].split('\n').forEach(line => {
        const splitAt = line.indexOf(':');
        if (splitAt > 0) meta[line.slice(0, splitAt).trim()] = line.slice(splitAt + 1).trim();
      });
    }
    const images = {};
    Object.entries(articleAssetUrls).forEach(([assetPath, url]) => {
      if (assetPath.includes(`/articles/${slug}/`)) images[assetPath.split('/').pop()] = url;
    });
    return { slug, title: meta.title || slug, date: meta.date || '', category: meta.category || 'NOTE', summary: meta.summary || '', cover: images[meta.cover] || '', body: (match ? match[2] : raw).trim(), images };
  }).sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0));
}
function inlineMarkdown(value) {
  return escapeHtml(value).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}
function renderMarkdown(body, images) {
  const html = [];
  let listOpen = false;
  let inCode = false;
  const code = [];
  const closeList = () => { if (listOpen) { html.push('</ul>'); listOpen = false; } };
  body.split('\n').forEach(line => {
    if (line.startsWith('```')) {
      if (inCode) { html.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`); code.length = 0; inCode = false; }
      else { closeList(); inCode = true; }
      return;
    }
    if (inCode) { code.push(line); return; }
    const image = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) {
      closeList();
      const src = images[image[2]] || image[2];
      html.push(`<figure class="essay-figure"><img src="${src}" alt="${escapeHtml(image[1])}"><figcaption>${escapeHtml(image[1])}</figcaption></figure>`);
      return;
    }
    if (line.startsWith('### ')) { closeList(); html.push(`<h3>${inlineMarkdown(line.slice(4))}</h3>`); return; }
    if (line.startsWith('## ')) { closeList(); html.push(`<h2>${inlineMarkdown(line.slice(3))}</h2>`); return; }
    if (line.startsWith('# ')) { closeList(); html.push(`<h2>${inlineMarkdown(line.slice(2))}</h2>`); return; }
    if (line.startsWith('- ')) {
      if (!listOpen) { html.push('<ul>'); listOpen = true; }
      html.push(`<li>${inlineMarkdown(line.slice(2))}</li>`);
      return;
    }
    if (!line.trim()) { closeList(); return; }
    closeList();
    html.push(`<p>${inlineMarkdown(line)}</p>`);
  });
  closeList();
  return html.join('');
}
const publishedArticles = loadArticles();
const articleGrid = document.querySelector('#article-grid');
const articleView = document.querySelector('#article-view');
const articleBody = document.querySelector('#article-body');
publishedArticles.forEach((article, index) => {
  articleGrid.insertAdjacentHTML('beforeend', `<a class="article article-card" href="#article/${article.slug}"><img src="${article.cover}" alt=""><div><small>0${index + 1} // ${escapeHtml(article.category)}</small><h3>${escapeHtml(article.title)}</h3><p>${escapeHtml(article.summary)}</p></div></a>`);
});
function showArticle() {
  const match = location.hash.match(/^#article\/([^/?#]+)$/);
  const article = match && publishedArticles.find(item => item.slug === decodeURIComponent(match[1]));
  if (!article) {
    articleView.hidden = true;
    document.body.classList.remove('reading');
    return;
  }
  articleBody.innerHTML = `<p class="essay-kicker">${escapeHtml(article.category)} · ${escapeHtml(article.date)}</p><h1>${escapeHtml(article.title)}</h1>${renderMarkdown(article.body, article.images)}`;
  articleView.hidden = false;
  articleView.scrollTop = 0;
  document.body.classList.add('reading');
}
window.addEventListener('hashchange', showArticle);
showArticle();
const menuButton=document.querySelector('.menu-button'), menu=document.querySelector('.menu-overlay');
const chat=document.querySelector('#resume-chat'), chatButton=document.querySelector('.rag-shortcut'), chatClose=document.querySelector('.chat-close'), query=document.querySelector('#resume-query'), answer=document.querySelector('#resume-answer');
const pageMain=document.querySelector('#main');
const siteHeader=document.querySelector('.site-header');
const skipLink=document.querySelector('.skip-link');
const brandLink=document.querySelector('.brand');

function focusable(root){
  return [...root.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])')]
    .filter(el => !el.closest('[inert]') && el.getClientRects().length);
}

function trapFocus(event, getItems){
  if (event.key !== 'Tab') return;
  const items = getItems();
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function syncOverlays(){
  const menuOpen = document.body.classList.contains('menu-open');
  const chatOpen = document.body.classList.contains('chat-open');
  pageMain.inert = menuOpen || chatOpen;
  skipLink.inert = menuOpen || chatOpen;
  chatButton.inert = menuOpen || chatOpen;
  menu.inert = !menuOpen;
  chat.inert = !chatOpen;
  siteHeader.inert = chatOpen && !menuOpen;
  brandLink.tabIndex = menuOpen ? -1 : 0;
}

function toggleMenu(force, { restoreFocus = true } = {}){
  const wasOpen = document.body.classList.contains('menu-open');
  const isOpen = force ?? !wasOpen;
  if (isOpen === wasOpen) return;
  document.body.classList.toggle('menu-open', isOpen);
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menu.setAttribute('aria-hidden', String(!isOpen));
  syncOverlays();
  if (isOpen) {
    menu.querySelector('nav a, nav button')?.focus();
  } else if (restoreFocus) {
    menuButton.focus();
  }
}

function toggleChat(force, { restoreFocus = true } = {}){
  const wasOpen = document.body.classList.contains('chat-open');
  const open = force ?? !wasOpen;
  if (open === wasOpen) return;
  document.body.classList.toggle('chat-open', open);
  chatButton.setAttribute('aria-expanded', String(open));
  chat.setAttribute('aria-hidden', String(!open));
  chat.setAttribute('aria-modal', String(open));
  syncOverlays();
  if (open) setTimeout(() => query.focus(), 250);
  else if (restoreFocus) chatButton.focus();
}

syncOverlays();
menuButton.addEventListener('click', () => toggleMenu());
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
chatButton.addEventListener('click', () => toggleChat());
chatClose.addEventListener('click', () => toggleChat(false));
document.querySelector('.menu-chat-trigger').addEventListener('click', () => {
  toggleMenu(false, { restoreFocus: false });
  toggleChat(true);
});
function showAnswer(text, source){answer.innerHTML=`<strong>ANSWER</strong><p>${text}</p><small>SOURCE · ${source}</small>`;}
chatPrompts.querySelectorAll('.chat-prompt').forEach(button=>button.addEventListener('click',()=>{query.value=button.childNodes[0].textContent.trim();showAnswer(decodeURIComponent(button.dataset.answer),decodeURIComponent(button.dataset.source));}));
document.querySelector('#resume-form').addEventListener('submit',e=>{e.preventDefault(); const q=query.value.trim().toLowerCase(); if(!q){answer.textContent='Enter a question to search the portfolio knowledge base.';return} const match=faqs.find(([question])=>q.split(/\s+/).some(word=>word.length>4&&question.toLowerCase().includes(word))); if(match)showAnswer(match[1],match[2]);else answer.innerHTML=`<strong>NOT FOUND IN KNOWLEDGE BASE</strong><p>The current resume data does not confirm an answer to that question.</p>`; });
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (document.body.classList.contains('chat-open')) toggleChat(false);
    else if (document.body.classList.contains('menu-open')) toggleMenu(false);
    return;
  }
  if (document.body.classList.contains('chat-open')) trapFocus(e, () => focusable(chat));
  else if (document.body.classList.contains('menu-open')) trapFocus(e, () => [themeToggle, menuButton, ...focusable(menu)]);
});

const THEME_KEY = 'jaden-theme';
const themeToggle = document.querySelector('.theme-toggle');
const themeColor = document.querySelector('meta[name="theme-color"]');
function systemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
function applyTheme(theme, persist) {
  document.documentElement.dataset.theme = theme;
  if (persist) localStorage.setItem(THEME_KEY, theme);
  const dark = theme === 'dark';
  themeToggle.setAttribute('aria-pressed', String(dark));
  themeToggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  themeToggle.querySelector('.theme-toggle-label').textContent = dark ? 'LIGHT' : 'DARK';
  if (themeColor) themeColor.setAttribute('content', dark ? '#05070e' : '#143f99');
}
const storedTheme = localStorage.getItem(THEME_KEY);
applyTheme(storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : systemTheme(), false);
themeToggle.addEventListener('click', () => {
  applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark', true);
});
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
  if (!localStorage.getItem(THEME_KEY)) applyTheme(event.matches ? 'dark' : 'light', false);
});

const revealTargets = document.querySelectorAll('.grid-section h2, .hero-title, .hero-summary, .project, .article, .experience > div, .expertise-item');
revealTargets.forEach((element, index) => {
  element.classList.add('reveal');
  element.style.setProperty('--reveal-delay', `${Math.min(index % 5, 4) * 70}ms`);
});
const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
  }
}), { threshold: .12 });
revealTargets.forEach(element => revealObserver.observe(element));

const askBubble = document.querySelector('.ask-bubble');
const heroSection = document.querySelector('#home');
if (askBubble && heroSection) {
  let heroVisible = false;
  const showAskBubble = () => askBubble.classList.toggle('is-visible', heroVisible && !document.body.classList.contains('chat-open'));
  new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
    showAskBubble();
  }, { threshold: 0.45 }).observe(heroSection);
  new MutationObserver(showAskBubble).observe(document.body, { attributes: true, attributeFilter: ['class'] });
}
