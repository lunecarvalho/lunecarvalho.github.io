const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');
const projectGrid = document.querySelector('.project-grid');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalRepoBtn = document.getElementById('modal-repo-btn');
const closeModal = document.getElementById('close-modal');
const heroDescription = document.querySelector('.hero-description');
const languagePtButton = document.getElementById('lang-pt');
const languageEnButton = document.getElementById('lang-en');
const themeToggle = document.getElementById('theme-toggle');
const htmlRoot = document.documentElement;
const THEME_STORAGE_KEY = 'portfolio-theme';

let activeCard = null;
let currentLanguage = 'pt';
let projectsState = 'loading';

function applyTheme(theme) {
  const isLight = theme === 'light';

  document.body.classList.toggle('light-mode', isLight);

  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(isLight));
    themeToggle.setAttribute('aria-label', isLight ? 'Ativar modo escuro' : 'Ativar modo claro');
    themeToggle.title = isLight ? 'Modo claro ativo' : 'Modo escuro ativo';
  }
}

const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
applyTheme(savedTheme === 'light' ? 'light' : 'dark');

const translations = {
  pt: {
    pageTitle: 'Lune Carvalho — Data Scientist.',
    languageAriaPt: 'Idioma atual: Português',
    languageAriaEn: 'Switch language to English',
    heroEyebrow: 'Non binary · 26 years old · Sao Paulo, Brazil',
    heroDescription: 'Data Science and AI.',
    aboutKicker: '// SOBRE MIM',
    aboutTitle: 'Quem sou <span>eu</span>',
    aboutParagraph1:
      'Formanda de <b>Ciência de Dados</b> e <b>Tecnologia da Informação</b> na <b>Universidade Virtual do Estado de São Paulo (UNIVESP)</b>, com estudos focados em Inteligência Artificial, Machine Learning e Processamento de Linguagem Natural.',
    aboutParagraph2:
      'Dedicada atualmente no desenvolvimento de projetos práticos utilizando Python, desde o processamento de dados até aplicações interativas de IA.',
    locationLabel: '📍 Localização',
    locationValue: 'Alumínio, SP',
    companyLabel: '🏢 Empresa Atual',
    companyValue: 'iFood | Anota AI',
    languagesLabel: '🌐 Idiomas',
    languagesValue: 'Português: Nativo • Inglês: Intermediário B1',
    educationLabel: '🎓 Formação',
    educationValue: 'Ciência de Dados • Tecnologia da Informação',
    impactLabel: '💡 Impacto Social',
    impactValue: 'Voluntária • WoMakersCode',
    skillsTitle: 'Stacks',
    skillsSubtitle: 'Use os botões abaixo para explorar as categorias.',
    tabFrontend: 'Frontend',
    tabBackend: 'Data Science',
    tabNlp: 'NLP',
    tabTools: 'Ferramentas',
    projectsTitle: 'Projetos',
    projectsSubtitle: 'Clique em cada projeto para ver mais detalhes.',
    footerTitle: 'Quer saber mais? Vamos conversar:',
    navAbout: 'Sobre mim',
    navSkills: 'Stacks',
    navProjects: 'Projetos',
    navContact: 'Contato',
    modalDefaultTitle: 'Detalhes do projeto',
    modalRepoText: 'Ver no GitHub →',
    projectsLoading: 'Carregando projetos...',
    projectsEmpty: 'Nenhum projeto disponível no momento.',
    projectsError: 'Não foi possível carregar os projetos. Tente recarregar a página.',
    projectNoDescription: 'Descrição não informada.'
  },
  en: {
    pageTitle: 'Lune Carvalho — Data Scientist.',
    languageAriaPt: 'Mudar idioma para Português',
    languageAriaEn: 'Current language: English',
    heroEyebrow: 'Non binary · 26 years old · Sao Paulo, Brazil',
    heroDescription: 'Data Science and AI.',
    aboutKicker: '// ABOUT ME',
    aboutTitle: 'Who am <span>I</span>',
    aboutParagraph1:
      'Data Science and Information Technology student at the <b>Virtual University of the State of Sao Paulo (UNIVESP)</b>, focused on Artificial Intelligence, Machine Learning, and Natural Language Processing.',
    aboutParagraph2:
      'Currently dedicated to building practical projects with Python, from data processing to interactive AI applications.',
    locationLabel: '📍 Location',
    locationValue: 'Aluminio, Sao Paulo, BR',
    companyLabel: '🏢 Current Company',
    companyValue: 'iFood | Anota AI',
    languagesLabel: '🌐 Languages',
    languagesValue: 'Portuguese: Native • English: Intermediate B1',
    educationLabel: '🎓 Education',
    educationValue: 'Data Science • Information Technology',
    impactLabel: '💡 Social Impact',
    impactValue: 'Volunteer • WoMakersCode',
    skillsTitle: 'Stacks',
    skillsSubtitle: 'Use the buttons below to explore the categories.',
    tabFrontend: 'Frontend',
    tabBackend: 'Data Science',
    tabNlp: 'NLP',
    tabTools: 'Tools',
    projectsTitle: 'Projects',
    projectsSubtitle: 'Click each project to see more details.',
    footerTitle: 'Want to know more? Let us talk:',
    navAbout: 'About me',
    navSkills: 'Stacks',
    navProjects: 'Projects',
    navContact: 'Contact',
    modalDefaultTitle: 'Project details',
    modalRepoText: 'View on GitHub →',
    projectsLoading: 'Loading projects...',
    projectsEmpty: 'No projects available at the moment.',
    projectsError: 'Unable to load projects. Please reload the page to try again.',
    projectNoDescription: 'No description provided.'
  }
};

function syncHeroTypewriter() {
  if (!heroDescription) {
    return;
  }

  const text = heroDescription.textContent.trim();
  const charCount = [...text].length || 1;

  heroDescription.style.animation = 'none';
  heroDescription.style.width = 'max-content';

  const measuredWidth = Math.ceil(heroDescription.scrollWidth) || 1;

  heroDescription.style.width = '';
  heroDescription.style.setProperty('--hero-typed-width', `${measuredWidth}px`);
  heroDescription.style.animation = `typewriter 4s steps(${charCount}, end) infinite, blink 1s steps(1, end) infinite`;
}

syncHeroTypewriter();

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

function setHtml(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.innerHTML = value;
  }
}

function applyLanguage(language) {
  const copy = translations[language];

  if (!copy) {
    return;
  }

  currentLanguage = language;
  htmlRoot.lang = language === 'pt' ? 'pt-BR' : 'en';
  document.title = copy.pageTitle;

  if (languagePtButton && languageEnButton) {
    languagePtButton.classList.toggle('active', language === 'pt');
    languageEnButton.classList.toggle('active', language === 'en');
    languagePtButton.setAttribute('aria-label', copy.languageAriaPt);
    languageEnButton.setAttribute('aria-label', copy.languageAriaEn);
  }

  setText('hero-eyebrow', copy.heroEyebrow);
  setText('hero-description', copy.heroDescription);
  setText('about-kicker', copy.aboutKicker);
  setHtml('about-title', copy.aboutTitle);
  setHtml('about-paragraph-1', copy.aboutParagraph1);
  setHtml('about-paragraph-2', copy.aboutParagraph2);
  setText('location-label', copy.locationLabel);
  setText('location-value', copy.locationValue);
  setText('company-label', copy.companyLabel);
  setText('company-value', copy.companyValue);
  setText('languages-label', copy.languagesLabel);
  setText('languages-value', copy.languagesValue);
  setText('education-label', copy.educationLabel);
  setText('education-value', copy.educationValue);
  setText('impact-label', copy.impactLabel);
  setText('impact-value', copy.impactValue);
  setText('skills-title', copy.skillsTitle);
  setText('skills-subtitle', copy.skillsSubtitle);
  setText('tab-frontend', copy.tabFrontend);
  setText('tab-backend', copy.tabBackend);
  setText('tab-nlp', copy.tabNlp);
  setText('tab-tools', copy.tabTools);
  setText('projects-title', copy.projectsTitle);
  updateProjectsStatus();
  setText('footer-title', copy.footerTitle);
  setText('nav-about', copy.navAbout);
  setText('nav-skills', copy.navSkills);
  setText('nav-projects', copy.navProjects);
  setText('nav-contact', copy.navContact);
  setText('modal-repo-btn', copy.modalRepoText);

  projectGrid.querySelectorAll('.project-card').forEach(card => {
    card.querySelector('p').textContent = card.dataset.desc || copy.projectNoDescription;
  });

  if (activeCard && modal.classList.contains('show')) {
    modalTitle.textContent = activeCard.dataset.title;
    modalDescription.textContent = activeCard.dataset.desc || copy.projectNoDescription;
    modalRepoBtn.href = activeCard.dataset.repo;
  } else {
    modalTitle.textContent = copy.modalDefaultTitle;
    modalDescription.textContent = '';
  }

  syncHeroTypewriter();
}

applyLanguage(currentLanguage);

function setActiveTab(target) {
  tabs.forEach(tab => tab.classList.toggle('active', tab === target));
  panels.forEach(panel => panel.classList.toggle('active', panel.dataset.skill === target.dataset.skill));
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => setActiveTab(tab));
});

projectGrid.addEventListener('click', event => {
  const card = event.target.closest('.project-card');
  if (!card || !projectGrid.contains(card)) {
    return;
  }

  activeCard = card;
  modalTitle.textContent = card.dataset.title;
  modalDescription.textContent = card.dataset.desc || translations[currentLanguage].projectNoDescription;
  modalRepoBtn.href = card.dataset.repo;
  modal.classList.add('show');
});

closeModal.addEventListener('click', () => {
  modal.classList.remove('show');
  activeCard = null;
});

modal.addEventListener('click', event => {
  if (event.target === modal) {
    modal.classList.remove('show');
    activeCard = null;
  }
});

if (languagePtButton && languageEnButton) {
  languagePtButton.addEventListener('click', () => {
    if (currentLanguage !== 'pt') {
      applyLanguage('pt');
    }
  });

  languageEnButton.addEventListener('click', () => {
    if (currentLanguage !== 'en') {
      applyLanguage('en');
    }
  });
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
    applyTheme(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  });
}

const sideNavLinks = document.querySelectorAll('.side-nav-link');
const navSections = Array.from(sideNavLinks)
  .map(link => document.getElementById(link.dataset.section))
  .filter(Boolean);

function setActiveNavLink(sectionId) {
  sideNavLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === sectionId);
  });
}

if (navSections.length) {
  const orderedSections = navSections
    .slice()
    .sort((a, b) => a.offsetTop - b.offsetTop);

  function updateActiveNavOnScroll() {
    const scrollPosition = window.scrollY + window.innerHeight * 0.35;
    let currentSection = orderedSections[0];

    orderedSections.forEach(section => {
      if (section.offsetTop <= scrollPosition) {
        currentSection = section;
      }
    });

    setActiveNavLink(currentSection.id);
  }

  let scrollTicking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          updateActiveNavOnScroll();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    },
    { passive: true }
  );

  window.addEventListener('resize', updateActiveNavOnScroll);
  updateActiveNavOnScroll();
}
function updateProjectsStatus() {
  const copy = translations[currentLanguage];
  const messages = {
    loading: copy.projectsLoading,
    empty: copy.projectsEmpty,
    error: copy.projectsError,
    ready: copy.projectsSubtitle
  };
  setText('projects-subtitle', messages[projectsState]);
  projectGrid.setAttribute('aria-busy', String(projectsState === 'loading'));
}

const projectDisplayNames = {
  'background-remover-app': 'Background Remover',
  'check-orders-chatbot': 'Check Orders Chatbot',
  'comment-rating-classification': 'Comment Rating Classification',
  'frequently-asked-questions-app': 'FAQ App',
  'media-management-system': 'MediaTrack',
  'model-exam-sklearn': 'Scikit-learn Model',
  'newslens-project': 'NewsLens',
  'regression_model': 'Regression Model',
  'translate-summarizer-app': 'Translate & Summarizer'
};

function getProjectDisplayName(repositoryName) {
  if (Object.prototype.hasOwnProperty.call(projectDisplayNames, repositoryName)) {
    return projectDisplayNames[repositoryName];
  }

  return repositoryName
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, character => character.toUpperCase());
}

async function loadProjects() {
  projectsState = 'loading';
  updateProjectsStatus();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const repositories = [];
    let page = 1;
    let batch;

    // Fetch every page before rendering so a later failure cannot show a partial list.
    do {
      const response = await fetch(
        `https://api.github.com/users/lunecarvalho/repos?type=owner&sort=full_name&direction=asc&per_page=100&page=${page}`,
        {
          headers: { Accept: 'application/vnd.github+json' },
          credentials: 'omit',
          cache: 'no-store',
          signal: controller.signal
        }
      );
      if (!response.ok) {
        throw new Error(`GitHub API: ${response.status}`);
      }
      batch = await response.json();
      if (!Array.isArray(batch)) {
        throw new Error('Invalid GitHub repositories response');
      }
      repositories.push(...batch);
      page += 1;
    } while (batch.length === 100);

    const fragment = document.createDocumentFragment();
    repositories
      .filter(repo => repo.private === false && repo.topics?.includes('portfolio'))
      .forEach(repo => {
        // Keep the existing card markup; API content is always inserted as text.
        const card = document.createElement('div');
        card.className = 'project-card';
        card.dataset.title = getProjectDisplayName(repo.name);
        card.dataset.desc = repo.description || '';
        const repoUrl = new URL(repo.html_url);
        if (repoUrl.origin !== 'https://github.com') {
          throw new Error('Invalid GitHub repository URL');
        }
        card.dataset.repo = repoUrl.href;

        const title = document.createElement('h3');
        title.textContent = card.dataset.title;
        const description = document.createElement('p');
        description.textContent = repo.description || translations[currentLanguage].projectNoDescription;
        card.append(title, description);
        fragment.append(card);
      });

    projectGrid.replaceChildren(fragment);
    projectsState = projectGrid.childElementCount ? 'ready' : 'empty';
  } catch (error) {
    projectGrid.replaceChildren();
    projectsState = 'error';
    console.warn('Unable to load portfolio projects:', error);
  } finally {
    clearTimeout(timeout);
    updateProjectsStatus();
  }
}

loadProjects();
