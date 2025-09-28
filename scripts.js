// Données des événements
        const eventsData = {
    event1: {
        title: "Coffre-fort",
        date: "Octobre 2025",
        description: "Permet de conserver mots de passe et fichiers en toute sécurité dans un coffre numérique."
    },
    event2: {
        title: "Issues Maker",
        date: "Octobre 2025",
        description: "Simplifie la création et la gestion d’issues avec une intégration directe à GitHub."
    },
    event3: {
        title: "Parole",
        date: "Octobre 2025",
        description: "Ajoute des capacités vocales : synthèse et reconnaissance vocale pour interagir à la voix."
    },
    event4: {
        title: "Veille Informatique",
        date: "Octobre 2025",
        description: "Plugin dédié à l’organisation, l’agrégation et le suivi de la veille technologique."
    },
    event5: {
        title: "RAG",
        date: "Octobre 2025",
        description: "Assistant combinant récupération d’informations et génération automatisée de réponses."
    },
    event6: {
        title: "Mémoire",
        date: "Novembre 2025",
        description: "Fournit une mémoire à long terme pour conserver et retrouver des informations persistantes."
    },
    event7: {
        title: "Trieur d’images",
        date: "Décembre 2025",
        description: "Trie automatiquement les images en dossiers grâce à un modèle d’apprentissage entraîné."
    },
    event8: {
        title: "Painture",
        date: "Janvier 2026",
        description: "Module de dessin pour créer formes, croquis et éléments graphiques simples."
    }
};

        // Remplacement des fonctions openModal / closeModal pour utilisation cohérente de .show et aria-hidden
        function openModal(eventId) {
            const modal = document.getElementById('eventModal');
            const modalBody = document.getElementById('modal-body');
            const evtData = eventsData[eventId] || {};
            // Priorité : image définie dans eventsData, sinon image présente dans la timeline, sinon fallback
            let imgSrc = evtData.image || 'img/jeux.png';
            try {
              const el = document.querySelector(`.timeline .event[data-event-id="${eventId}"] img.event-bubble`);
              if (el && el.getAttribute('src')) imgSrc = el.getAttribute('src');
            } catch (e) { /* ignore */ }

            modalBody.innerHTML = `
                <div class="modal-grid" role="document">
                  <div class="modal-main">
                    <h2 class="modal-title">${evtData.title || 'Événement'}</h2>
                    <p class="modal-date">${evtData.date || ''}</p>
                    <p class="modal-description">${evtData.description || ''}</p>
                  </div>
                  <aside class="modal-side" aria-hidden="false">
                    <img id="codebase" src="${imgSrc}" alt="${evtData.title || 'codebase'}">
                  </aside>
                </div>
            `;

            modal.classList.add('show');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            const modal = document.getElementById('eventModal');
            const modalBody = document.getElementById('modal-body');
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
            if (modalBody) modalBody.innerHTML = '';
            document.body.style.overflow = 'auto';
        }

        // Fermer la modal en cliquant à l'extérieur
        window.onclick = function(event) {
            const modal = document.getElementById('eventModal');
            if (event.target === modal) {
                closeModal();
            }
        }

        // Fermer avec la touche Échap
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        });

        // Animation des bulles au survol et couleurs
        document.addEventListener('DOMContentLoaded', function() {
            const bubbles = document.querySelectorAll('.event-bubble');
            
            bubbles.forEach((bubble) => {
                // animation via transform — rotation option conservée
                bubble.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.18) rotate(0deg)';
                });
                
                bubble.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1) rotate(0deg)';
                });
            });
        });

        document.addEventListener('DOMContentLoaded', () => {
            // Alternance : une sur deux => top / bottom
            const timelineEvents = document.querySelectorAll('.timeline .event');
            timelineEvents.forEach((ev, i) => {
                ev.classList.remove('top', 'bottom');
                // i pair -> top, i impair -> bottom (changez la logique si vous préférez commencer par bottom)
                if (i % 2 === 0) ev.classList.add('top');
                else ev.classList.add('bottom');
            });

            // Optionnel : si vous voulez que le titre soit extrait du nom de fichier de l'image
            document.querySelectorAll('.event').forEach(wrapper => {
                const img = wrapper.querySelector('img.event-bubble');
                if (!img) return;
                let src = img.getAttribute('src') || '';
                let filename = src.split('/').pop().split('?')[0] || '';
                filename = filename.replace(/\.[^/.]+$/, '');
                try { filename = decodeURIComponent(filename); } catch (e) {}
                filename = filename.replace(/[_\-]+/g, ' ').replace(/\s+/g, ' ').trim();
                if (!filename) filename = (img.getAttribute('alt') || '').trim();
                const title = filename.split(' ').map(w => w ? (w.charAt(0).toUpperCase() + w.slice(1)) : '').join(' ').trim();
                let titleEl = wrapper.querySelector('.event-title');
                if (!titleEl) {
                    titleEl = document.createElement('div');
                    titleEl.className = 'event-title';
                    wrapper.querySelector('.event-content')?.appendChild(titleEl);
                }
                titleEl.textContent = title;
            });
        });

        document.addEventListener('DOMContentLoaded', function () {
          const timeline = document.querySelector('.timeline');
          const eventNodes = timeline ? timeline.querySelectorAll('.event') : [];
          const indicator = document.querySelector('.scroll-indicator');
          const modal = document.getElementById('eventModal');
          const modalBody = document.getElementById('modal-body');

          // Si plus de 6 événements, activer le défilement horizontal
          if (eventNodes.length > 6 && timeline) {
            timeline.classList.add('horizontal');
            if (indicator) indicator.style.display = 'block';
          } else {
            if (indicator) indicator.style.display = 'none';
          }

          // Support clavier (Enter / Espace) pour les éléments cliquables
          document.querySelectorAll('.event-bubble, .event-content').forEach(el => {
            el.addEventListener('keydown', function (e) {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                el.click();
              }
            });
          });

          // Fermeture de la modal si on clique à l'extérieur du contenu
          if (modal) {
            modal.addEventListener('click', function (e) {
              if (e.target === modal) closeModal();
            });
          }

          // Exposer pour les onclick existants dans le HTML
          window.openModal = function (id) {
            if (!modal) return;
            const evtData = eventsData[id] || {};
            let imgSrc = evtData.image || 'img/jeux.png';
            try {
              const el = document.querySelector(`.timeline .event[data-event-id="${id}"] img.event-bubble`);
              if (el && el.getAttribute('src')) imgSrc = el.getAttribute('src');
            } catch (e) { /* ignore */ }

            modalBody.innerHTML = `
              <div class="modal-grid" role="document">
                <div class="modal-main">
                  <h2 class="modal-title">${evtData.title || 'Événement'}</h2>
                  <p class="modal-date">${evtData.date || ''}</p>
                  <p class="modal-description">${evtData.description || ''}</p>
                </div>
                <aside class="modal-side" aria-hidden="false">
                  <img id="codebase" src="${imgSrc}" alt="${evtData.title || 'codebase'}">
                </aside>
              </div>
            `;
            modal.classList.add('show');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
          };

          window.closeModal = function () {
            if (!modal) return;
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
            modalBody.innerHTML = '';
            document.body.style.overflow = 'auto';
          };

          // Ajout : attacher les handlers click sur chaque .event (image + contenu) pour ouvrir la modal
          document.querySelectorAll('.timeline .event').forEach(ev => {
             const id = ev.dataset.eventId;
             if (!id) return;
             const bubble = ev.querySelector('.event-bubble');
             const content = ev.querySelector('.event-content');
             const handler = (e) => {
               // éviter propagation ou comportement indésirable
               e && e.preventDefault && e.preventDefault();
               window.openModal(id);
             };
             if (bubble) bubble.addEventListener('click', handler);
             if (content) content.addEventListener('click', handler);
           });

          // Attacher le bouton de fermeture
          const closeBtn = document.querySelector('.modal .close');
          if (closeBtn) {
            closeBtn.addEventListener('click', function (e) {
              e && e.preventDefault && e.preventDefault();
              window.closeModal();
            });
          }

          // Définit ici l'événement courant (modifiable uniquement dans ce fichier).
          // Mettre à null ou '' si aucun événement ne doit être marqué.
          const CURRENT_EVENT_ID = 'event1';

          // Appliquer l'indicateur courant et marquer en "past" tous les éléments qui le précèdent
          function applyCurrentIndicator(id) {
            const all = timeline ? Array.from(timeline.querySelectorAll('.event')) : [];
            // retirer états précédents
            all.forEach(el => {
              el.classList.remove('current', 'past');
              el.removeAttribute('aria-current');
            });
            if (!id || all.length === 0) return;

            const idx = all.findIndex(el => el.dataset.eventId === id);
            if (idx === -1) return;

            // marquer les précédents comme "past"
            for (let i = 0; i < idx; i++) {
              all[i].classList.add('past');
            }

            // marquer l'actuel (mais ne pas le désactiver : on veut pouvoir ouvrir la modal)
            all[idx].classList.add('current');
            all[idx].setAttribute('aria-current', 'step');
          }

          // Expose une fonction pour modifier le courant depuis d'autres scripts si besoin
          window.setCurrentEvent = function (id) {
            applyCurrentIndicator(id);
          };

          // Appliquer la valeur par défaut définie plus haut
          applyCurrentIndicator(CURRENT_EVENT_ID);

        });