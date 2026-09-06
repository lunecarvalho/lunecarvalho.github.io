const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');
const projectCards = document.querySelectorAll('.project-card');
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
    projectTag1: 'IA para consulta de status de pedidos.',
    projectTag2: 'Tradução e resumo de textos com IA.',
    projectTag3: 'Remoção de fundo de imagens com IA.',
    projectTag4: 'Busca de reviews similares por tema usando NLP.',
    projectTag5: 'Extensão de análise inteligente de atendimentos.',
    projectTag6: 'FAQ automatizado com IA.'
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
    projectTag1: 'AI for order tracking',
    projectTag2: 'AI translation and summarization',
    projectTag3: 'AI background removal',
    projectTag4: 'NLP review similarity search',
    projectTag5: 'Smart support conversation analysis',
    projectTag6: 'AI-powered automated FAQ'
  }
};

const projectTranslations = {
  pt: {
    chatbot: {
      title: 'Check Orders Chatbot',
      desc: 'Chatbot para consulta automatizada de status de pedidos, desenvolvido em Python com interface web interativa utilizando Gradio.'
    },
    translate: {
      title: 'Translate Summarizer App',
      desc: 'Aplicação desenvolvida em Python que integra tradução automática e sumarização de textos utilizando modelos de IA da Hugging Face Transformers. O projeto também conta com interface interativa em Gradio, permitindo processar textos de forma simples, rápida e intuitiva.'
    },
    background: {
      title: 'Background Remover App',
      desc: 'Aplicação web para remoção automática de fundo de imagens utilizando Inteligência Artificial, desenvolvida em Python com interface Gradio e deploy no Hugging Face Spaces.'
    },
    review: {
      title: 'Review Similarities',
      desc: 'Aplicação interativa desenvolvida com Python e Gradio para identificar reviews mais similares a um tema específico, utilizando técnicas de Processamento de Linguagem Natural (NLP) e embeddings semânticos.'
    },
    insignia: {
      title: 'InsignIA',
      desc: 'Plataforma que combina uma extensão para navegador com um backend em FastAPI para analisar conversas de atendimento, classificando categorias e sentimento, gerando resumos e persistindo resultados em planilha.'
    },
    faq: {
      title: 'Frequently Asked Questions App',
      desc: 'Aplicação de FAQ interativo desenvolvida em Python que utiliza modelos de NLP para responder automaticamente perguntas frequentes com base em contextos pré-definidos, com interface em Gradio.'
    }
  },
  en: {
    chatbot: {
      title: 'Check Orders Chatbot',
      desc: 'Chatbot for automated order status tracking, built with Python and an interactive web interface using Gradio.'
    },
    translate: {
      title: 'Translate Summarizer App',
      desc: 'Python application that combines automatic translation and text summarization using Hugging Face Transformers AI models, with an interactive Gradio interface for simple and fast text processing.'
    },
    background: {
      title: 'Background Remover App',
      desc: 'Web app for automatic image background removal using Artificial Intelligence, built with Python, a Gradio interface, and deployed on Hugging Face Spaces.'
    },
    review: {
      title: 'Review Similarities',
      desc: 'Interactive application built with Python and Gradio to identify reviews most similar to a specific topic, using Natural Language Processing (NLP) techniques and semantic embeddings.'
    },
    insignia: {
      title: 'InsignIA',
      desc: 'Platform combining a browser extension with a FastAPI backend to analyze support conversations, classifying categories and sentiment, generating summaries, and storing results in a spreadsheet.'
    },
    faq: {
      title: 'Frequently Asked Questions App',
      desc: 'Interactive FAQ application built in Python that uses NLP models to automatically answer frequently asked questions based on predefined contexts, with a Gradio interface.'
    }
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
  const projects = projectTranslations[language];

  if (!copy || !projects) {
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
  setText('projects-subtitle', copy.projectsSubtitle);
  setText('project-1-tag', copy.projectTag1);
  setText('project-2-tag', copy.projectTag2);
  setText('project-3-tag', copy.projectTag3);
  setText('project-4-tag', copy.projectTag4);
  setText('project-5-tag', copy.projectTag5);
  setText('project-6-tag', copy.projectTag6);
  setText('footer-title', copy.footerTitle);
  setText('nav-about', copy.navAbout);
  setText('nav-skills', copy.navSkills);
  setText('nav-projects', copy.navProjects);
  setText('nav-contact', copy.navContact);
  setText('modal-repo-btn', copy.modalRepoText);

  projectCards.forEach(card => {
    const project = projects[card.dataset.key];
    if (!project) {
      return;
    }

    card.dataset.title = project.title;
    card.dataset.desc = project.desc;
  });

  if (activeCard && modal.classList.contains('show')) {
    modalTitle.textContent = activeCard.dataset.title;
    modalDescription.textContent = activeCard.dataset.desc;
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

projectCards.forEach(card => {
  card.addEventListener('click', () => {
    activeCard = card;
    modalTitle.textContent = card.dataset.title;
    modalDescription.textContent = card.dataset.desc;
    modalRepoBtn.href = card.dataset.repo;
    modal.classList.add('show');
  });
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


