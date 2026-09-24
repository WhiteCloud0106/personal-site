let cards = [...document.querySelectorAll('.project-card')];
const filters = [...document.querySelectorAll('.filter')];
const search = document.querySelector('#search');
const empty = document.querySelector('#empty-state');
let activeFilter = 'all';
const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const contentUrl = (type, id) => `content.html?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`;

function updateProjects() {
  const term = search.value.trim().toLowerCase(); let visible = 0;
  cards.forEach(card => { const show = (activeFilter === 'all' || card.dataset.category === activeFilter) && (!term || card.dataset.search.toLowerCase().includes(term) || card.innerText.toLowerCase().includes(term)); card.hidden = !show; if (show) visible += 1; });
  empty.hidden = visible !== 0;
}

function projectCard(item, number, category) {
  const label = category === 'novel' ? '連載小說' : category === 'mod' ? '遊戲模組' : category === 'game' ? '網頁遊戲' : '網頁工具';
  const visual = category === 'novel' ? 'visual-novel' : category === 'mod' ? 'visual-mod' : category === 'game' ? 'visual-game' : 'visual-tool';
  const destination = item.url || contentUrl(category === 'novel' ? 'novel' : category === 'game' ? 'webapp' : 'project', item.id);
  const art = category === 'novel' ? '<span class="moon"></span>' : category === 'mod' ? '<div class="cube">MOD</div>' : category === 'game' ? '<div class="pixel-character">▲</div>' : '<div class="bars"><i></i><i></i><i></i><i></i><i></i></div>';
  return `<article class="project-card reveal visible" data-category="${category === 'novel' ? 'novel' : category === 'mod' ? 'mod' : 'web'}" data-search="${escapeHtml(`${item.title} ${item.summary} ${label}`)}"><div class="card-visual ${visual}"><span class="card-number">${String(number).padStart(2,'0')}</span>${art}</div><div class="card-body"><div class="card-meta"><span>${label}</span><span>${escapeHtml(item.status || '')}</span></div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.summary)}</p><a href="${escapeHtml(destination)}">查看內容 <span>↗</span></a></div></article>`;
}

async function loadManagedContent() {
  try {
    const response = await fetch(`content/site.json?v=${Date.now()}`); if (!response.ok) throw new Error('Content unavailable'); const data = await response.json();
    const items = [...(data.novels || []).map(item => ({item,category:'novel'})), ...(data.projects || []).map(item => ({item,category:item.type === 'mod' ? 'mod' : 'tool'})), ...(data.webapps || []).map(item => ({item,category:'game'}))];
    if (items.length) { document.querySelector('#project-grid').innerHTML = items.map(({item,category}, index) => projectCard(item, index + 1, category)).join(''); cards = [...document.querySelectorAll('.project-card')]; }
    if ((data.devlogs || []).length) document.querySelector('#journal-list').innerHTML = data.devlogs.map(log => { const date = new Date(`${log.date}T00:00:00`); const stamp = new Intl.DateTimeFormat('en',{month:'short',year:'numeric'}).format(date).toUpperCase(); return `<a class="journal-entry reveal visible" href="${contentUrl('devlog',log.id)}"><time datetime="${escapeHtml(log.date)}"><b>${date.getDate()}</b>${escapeHtml(stamp)}</time><div><span>${escapeHtml(log.category)}</span><h3>${escapeHtml(log.title)}</h3></div><p>${escapeHtml(log.summary)}</p><i>↗</i></a>`; }).join('');
    if (data.settings?.owner) document.querySelector('#owner-name').textContent = data.settings.owner;
  } catch (error) { console.info('Using embedded fallback content.', error); }
}

filters.forEach(button => button.addEventListener('click', () => { filters.forEach(item => item.classList.remove('active')); button.classList.add('active'); activeFilter = button.dataset.filter; updateProjects(); }));
search.addEventListener('input', updateProjects);
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
document.querySelector('#year').textContent = new Date().getFullYear();
loadManagedContent();
