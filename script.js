const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');
const projectCards = document.querySelectorAll('.project-card');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalRepoBtn = document.getElementById('modal-repo-btn');
const closeModal = document.getElementById('close-modal');
const contactButtons = document.querySelectorAll('#action-contact, #open-contact');

function setActiveTab(target) {
  tabs.forEach(tab => tab.classList.toggle('active', tab === target));
  panels.forEach(panel => panel.classList.toggle('active', panel.dataset.skill === target.dataset.skill));
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => setActiveTab(tab));
});

projectCards.forEach(card => {
  card.addEventListener('click', () => {
    modalTitle.textContent = card.dataset.title;
    modalDescription.textContent = card.dataset.desc;
    modalRepoBtn.href = card.dataset.repo;
    modal.classList.add('show');
  });
});

closeModal.addEventListener('click', () => {
  modal.classList.remove('show');
});

modal.addEventListener('click', event => {
  if (event.target === modal) {
    modal.classList.remove('show');
  }
});

const footer = document.querySelector('.footer');

contactButtons.forEach(button => {
  button.addEventListener('click', () => {
    footer.scrollIntoView({ behavior: 'smooth' });
  });
});
