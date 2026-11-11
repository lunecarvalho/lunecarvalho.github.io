const projectGrid = document.querySelector('.project-grid');
const projectStatus = document.getElementById('projects-subtitle');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.getElementById('main-nav');
const PROJECTS_CACHE_KEY = 'portfolio-github-projects';
const PROJECTS_CACHE_TTL = 10 * 60 * 1000;
const LANGUAGE_KEY = 'portfolio-language';

const translations = {
  pt: {
    title: 'Lune Carvalho — Data Scientist',
    menu: 'menu',
    navAbout: 'sobre',
    navProjects: 'projetos',
    navSkills: 'skills',
    navContact: 'contato',
    role: 'Cientista de Dados <span>|</span> Machine Learning <span>|</span> Inteligência Artificial',
    heroLead: 'Desenvolvo aplicações e tecnologias que transformam dados em conhecimento, unindo ciência de dados, inteligência artificial e desenvolvimento de software.',
    viewProjects: 'Ver projetos',
    terminalAria: 'Terminal de navegação',
    terminalAbout: 'about',
    terminalAboutDesc: '— minha trajetória',
    terminalProjects: 'projects',
    terminalProjectsDesc: '— projetos desenvolvidos',
    terminalSkills: 'skills',
    terminalSkillsDesc: '— tecnologias e ferramentas',
    terminalContact: 'contact',
    terminalContactDesc: '— vamos conversar',
    aboutTitle: 'Construindo com propósito.',
    aboutText1: 'Sou graduanda em <strong>Ciência de Dados e Tecnologia da Informação pela UNIVESP</strong>, com estudos focados em Inteligência Artificial, Machine Learning e Processamento de Linguagem Natural.',
    aboutText2: 'Dedicada atualmente no desenvolvimento de projetos práticos utilizando Python, desde o processamento de dados até aplicações interativas de IA.',
    projectsTitle: 'Principais projetos.',
    allProjects: 'ver todos no GitHub',
    skillsTitle: 'Tecnologias e ferramentas.',
    dataScience: 'Data Science',
    machineLearning: 'Machine Learning',
    development: 'Desenvolvimento',
    tools: 'Ferramentas',
    contactLead: 'Aberto à oportunidades e colaborações em Ciência de Dados, Machine Learning,<br>Processamento de Linguagem Natural e Inteligência Artificial,<br>e boas conversas sobre dados e tecnologia.',
    langPtAria: 'Idioma atual: Português',
    langEnAria: 'Mudar idioma para Inglês',
    loading: 'Carregando projetos...',
    ready: 'Acesse o repositório de cada projeto para ver mais detalhes.',
    empty: 'Nenhum projeto com o tópico portfolio foi encontrado.',
    error: 'Não foi possível carregar os projetos agora. Tente recarregar a página.',
    cached: 'Limite temporário da API do GitHub. Exibindo os projetos salvos recentemente.',
    projectLink: 'acessar repositório ↗',
    missingDescription: 'Descrição não informada.'
  },
  en: {
    title: 'Lune Carvalho — Data Scientist',
    menu: 'menu',
    navAbout: 'about',
    navProjects: 'projects',
    navSkills: 'skills',
    navContact: 'contact',
    role: 'Data Scientist <span>|</span> Machine Learning <span>|</span> Artificial Intelligence',
    heroLead: 'I build applications and technologies that turn data into knowledge, combining data science, artificial intelligence, and software development.',
    viewProjects: 'View projects',
    terminalAria: 'Navigation terminal',
    terminalAbout: 'about',
    terminalAboutDesc: '— my journey',
    terminalProjects: 'projects',
    terminalProjectsDesc: '— projects developed',
    terminalSkills: 'skills',
    terminalSkillsDesc: '— technologies and tools',
    terminalContact: 'contact',
    terminalContactDesc: '— let’s talk',
    aboutTitle: 'Building with purpose.',
    aboutText1: 'I am pursuing a degree in <strong>Data Science and Information Technology at UNIVESP</strong>, focusing my studies on Artificial Intelligence, Machine Learning, and Natural Language Processing.',
    aboutText2: 'I am currently dedicated to practical projects using Python, from data processing to interactive AI applications.',
    projectsTitle: 'Featured projects.',
    allProjects: 'see all on GitHub',
    skillsTitle: 'Technologies and tools.',
    dataScience: 'Data Science',
    machineLearning: 'Machine Learning',
    development: 'Development',
    tools: 'Tools',
    contactLead: 'Open to opportunities and collaborations in Data Science, Machine Learning,<br>Natural Language Processing, and Artificial Intelligence,<br>and good conversations about data and technology.',
    langPtAria: 'Switch language to Portuguese',
    langEnAria: 'Current language: English',
    loading: 'Loading projects...',
    ready: 'Click each project to see more details.',
    empty: 'No project with the portfolio topic was found.',
    error: 'Projects could not be loaded. Please reload the page.',
    cached: 'Temporary GitHub API limit. Showing recently cached projects.',
    projectLink: 'access repository ↗',
    missingDescription: 'Description not provided.'
  }
};

let currentLanguage = localStorage.getItem(LANGUAGE_KEY) === 'en' ? 'en' : 'pt';
let projectsState = 'loading';
let loadedRepositories = [];

function t(key) {
  return translations[currentLanguage][key];
}

function updateProjectStatus() {
  projectStatus.textContent = t(projectsState);
  projectGrid.setAttribute('aria-busy', String(projectsState === 'loading'));
}

function applyTranslations() {
  const dictionary = translations[currentLanguage];
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const value = dictionary[element.dataset.i18n];
    if (value !== undefined) element.innerHTML = value;
  });
  document.querySelector('[data-i18n-aria="terminalAria"]').setAttribute('aria-label', dictionary.terminalAria);
  document.querySelectorAll('[data-i18n-aria]').forEach(element => {
    const key = element.dataset.i18nAria;
    if (dictionary[key]) element.setAttribute('aria-label', dictionary[key]);
  });
  const prompts = document.querySelectorAll('.section-heading .prompt');
  if (prompts.length >= 4) {
    prompts[0].textContent = '// about';
    prompts[1].textContent = '// projects';
    prompts[2].textContent = '// skills';
    prompts[3].textContent = '// contact';
  }
  document.querySelector('.code-comment').textContent = currentLanguage === 'en' ? '# a little about me' : '# um pouco sobre mim';
  const codeValues = document.querySelectorAll('.code-block .indent');
  if (codeValues.length >= 3) {
    codeValues[0].innerHTML = `<span>"education"</span>: "${currentLanguage === 'en' ? 'Data Science — UNIVESP' : 'Ciência de Dados — UNIVESP'}",`;
    codeValues[1].innerHTML = `<span>"focus"</span>: ["${currentLanguage === 'en' ? 'AI' : 'IA'}", "Machine Learning", "NLP", "LLMs"],`;
    codeValues[2].innerHTML = `<span>"mission"</span>: "${currentLanguage === 'en' ? 'turning data into knowledge' : 'transformar dados em conhecimento'}"`;
  }
  const skillHeadings = document.querySelectorAll('.skill-group h3');
  if (skillHeadings.length >= 4) {
    skillHeadings[0].firstChild.textContent = `${dictionary.dataScience} `;
    skillHeadings[1].firstChild.textContent = `${dictionary.machineLearning} `;
    skillHeadings[2].textContent = dictionary.development;
    skillHeadings[3].textContent = dictionary.tools;
  }
  document.querySelector('.footer-lead').innerHTML = dictionary.contactLead;
  document.documentElement.lang = currentLanguage === 'en' ? 'en' : 'pt-BR';
  document.title = dictionary.title;
  document.getElementById('lang-pt').classList.toggle('active', currentLanguage === 'pt');
  document.getElementById('lang-en').classList.toggle('active', currentLanguage === 'en');
  updateProjectStatus();
  if (loadedRepositories.length) renderProjects(loadedRepositories, projectsState);
}

function setLanguage(language) {
  currentLanguage = language;
  localStorage.setItem(LANGUAGE_KEY, language);
  applyTranslations();
}

function getProjectDisplayName(name) {
  return name.replace(/[-_]+/g, ' ').replace(/\b\w/g, character => character.toUpperCase());
}

function createProjectCard(repo) {
  const card = document.createElement('article');
  card.className = 'project-card';
  const icon = document.createElement('div');
  icon.className = 'project-icon';
  icon.textContent = '</>';
  icon.setAttribute('aria-hidden', 'true');
  const title = document.createElement('h3');
  title.textContent = getProjectDisplayName(repo.name);
  const description = document.createElement('p');
  description.textContent = repo.description || t('missingDescription');
  const meta = document.createElement('div');
  meta.className = 'project-meta';
  if (repo.language) {
    const language = document.createElement('span');
    language.textContent = repo.language;
    meta.append(language);
  }
  (repo.topics || []).filter(topic => topic !== 'portfolio').slice(0, 4).forEach(topic => {
    const tag = document.createElement('span');
    tag.textContent = topic;
    meta.append(tag);
  });
  const link = document.createElement('a');
  link.className = 'project-link';
  link.href = repo.html_url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = t('projectLink');
  card.append(icon, title, description, meta, link);
  return card;
}

function renderProjects(repositories, state = null) {
  const matchingRepositories = repositories
    .filter(repo => repo.private === false && Array.isArray(repo.topics) && repo.topics.includes('portfolio'))
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  loadedRepositories = repositories;
  const fragment = document.createDocumentFragment();
  matchingRepositories.forEach(repo => fragment.append(createProjectCard(repo)));
  projectGrid.replaceChildren(fragment);
  if (matchingRepositories.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = t('empty');
    projectGrid.append(empty);
  }
  projectsState = state || (matchingRepositories.length ? 'ready' : 'empty');
}

async function loadProjects() {
  projectsState = 'loading';
  updateProjectStatus();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch('https://api.github.com/search/repositories?q=user%3Alunecarvalho+topic%3Aportfolio&sort=updated&order=desc&per_page=100', {
      headers: { Accept: 'application/vnd.github+json' },
      credentials: 'omit',
      cache: 'no-store',
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`GitHub API: ${response.status}`);
    const result = await response.json();
    if (!result || !Array.isArray(result.items)) throw new Error('Invalid GitHub search response');
    const repositories = result.items;
    localStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), repositories }));
    renderProjects(repositories);
  } catch (error) {
    let restoredFromCache = false;
    try {
      const cached = JSON.parse(localStorage.getItem(PROJECTS_CACHE_KEY) || 'null');
      if (cached && Date.now() - cached.timestamp <= PROJECTS_CACHE_TTL && Array.isArray(cached.repositories)) {
        renderProjects(cached.repositories, error.message.includes('403') ? 'cached' : null);
        restoredFromCache = true;
      }
    } catch (cacheError) {
      console.warn('Unable to restore cached portfolio projects:', cacheError);
    }
    if (!restoredFromCache) {
      projectGrid.replaceChildren();
      const message = document.createElement('p');
      message.className = 'empty-state';
      message.textContent = t('error');
      projectGrid.append(message);
      projectsState = 'error';
    }
    console.warn('Unable to load portfolio projects:', error);
  } finally {
    clearTimeout(timeout);
    updateProjectStatus();
  }
}

menuToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));
document.getElementById('lang-pt').addEventListener('click', () => setLanguage('pt'));
document.getElementById('lang-en').addEventListener('click', () => setLanguage('en'));

applyTranslations();
loadProjects();
