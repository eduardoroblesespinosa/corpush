document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentContainer = document.getElementById('content-container');

    // --- Hermetic Map Interaction Logic ---
    // Moved into its own function to be called after content is loaded.
    function initializeMap() {
        const mapNodes = document.querySelectorAll('.map-node');
        const stageNameEl = document.getElementById('stage-name');
        const stageInfoEl = document.getElementById('stage-info');

        if (mapNodes.length === 0) return; // Don't run if map is not present

        function updateInfoPanel(node) {
            if (!node || !stageNameEl || !stageInfoEl) return;

            const name = node.dataset.name;
            const info = node.dataset.info;
            const isLocked = node.classList.contains('locked');

            stageNameEl.textContent = name;
            stageInfoEl.textContent = isLocked ? 'Desbloquea los niveles anteriores para acceder a esta Gnosis.' : info;
        }

        mapNodes.forEach(node => {
            node.addEventListener('click', () => {
                // Do not select locked nodes, but show their info
                if (!node.classList.contains('locked')) {
                    // Remove active class from all other nodes
                    mapNodes.forEach(n => n.classList.remove('active'));
                    // Add active class to the clicked node
                    node.classList.add('active');
                }
                updateInfoPanel(node);
            });
        });

        // Initial state
        const initialActiveNode = document.querySelector('.map-node.active');
        updateInfoPanel(initialActiveNode);
    }

    function initializeGnosisDiaria() {
        const quoteEl = document.getElementById('gnosis-quote');
        const contemplationEl = document.getElementById('gnosis-contemplation');
        const affirmationEl = document.getElementById('gnosis-affirmation');
        const visualizationEl = document.getElementById('gnosis-visualization');
        const newGnosisBtn = document.getElementById('new-gnosis-btn');

        if (!newGnosisBtn) return; // Don't run if the section isn't loaded

        const gnosisPool = [
            {
                quote: "Conócete a ti mismo y conocerás al universo y a los dioses. Porque no hay diferencia entre tu mente y la Mente Divina, salvo el velo de la ignorancia.",
                contemplation: "Reflexiona sobre los momentos en que has sentido una conexión profunda con algo más grande que tú. ¿Qué pensamientos o creencias te separan de esa sensación de unidad?",
                affirmation: "Yo soy una chispa de la Mente Divina. Mi conciencia se expande para abrazar al Todo.",
                visualization: "Cierra los ojos. Visualiza una luz dorada en el centro de tu pecho, tu sol interior. Siente cómo esta luz se expande con cada respiración, disolviendo cualquier sensación de separación, hasta que tu luz personal se fusiona con la luz infinita del cosmos."
            },
            {
                quote: "El universo es un instrumento musical, y el hombre es quien puede aprender a tocar su melodía. Cada pensamiento, palabra y acción es una nota en la sinfonía de tu existencia.",
                contemplation: "¿Qué \"melodía\" estás creando hoy con tus acciones? ¿Es armoniosa o disonante? ¿Cómo puedes afinar tus pensamientos para crear una realidad más bella?",
                affirmation: "Yo soy el compositor de mi realidad. Mis pensamientos y acciones crean una sinfonía de armonía y belleza.",
                visualization: "Imagina que tus pensamientos son hilos de luz de diferentes colores. Con cada pensamiento positivo y amoroso, tejes un tapiz vibrante y armonioso frente a ti. Siente la belleza de tu propia creación."
            },
            {
                quote: "No busques a Dios en el cielo, ni en la tierra. Él está más cerca de ti que tu propia respiración, más presente que tu propio pensamiento. Para encontrarlo, aquieta la mente y escucha.",
                contemplation: "¿En qué momentos del día sientes más \"ruido\" mental? ¿Qué actividad simple podrías hacer para encontrar un momento de silencio y escuchar tu voz interior?",
                affirmation: "La quietud es el portal a lo Divino. En el silencio, encuentro la verdad.",
                visualization: "Visualiza un lago sereno en tu mente. Cada pensamiento es una piedra que crea ondas. Observa las ondas hasta que el lago vuelva a estar en calma, reflejando perfectamente el cielo estrellado de tu conciencia superior."
            },
            {
                quote: "Lo que está abajo es como lo que está arriba, y lo que está arriba es como lo que está abajo, para obrar los milagros de una sola cosa.",
                contemplation: "Observa un objeto natural (una planta, una piedra). ¿Cómo refleja su micro-estructura las grandes leyes del cosmos (ciclos, crecimiento, estructura)? ¿Cómo tu propio cuerpo y vida reflejan estos mismos patrones universales?",
                affirmation: "Mi ser es un microcosmos que refleja la perfección del macrocosmos. Soy uno con el universo.",
                visualization: "Imagina el sistema solar girando en perfecto orden. Ahora, visualiza los electrones girando alrededor del núcleo de un átomo en tu mano. Siente la conexión rítmica entre lo inmenso y lo minúsculo, y reconócete como el puente consciente entre ambos mundos."
            }
        ];

        function generateNewGnosis() {
            const randomIndex = Math.floor(Math.random() * gnosisPool.length);
            const selectedGnosis = gnosisPool[randomIndex];

            quoteEl.textContent = selectedGnosis.quote;
            contemplationEl.textContent = selectedGnosis.contemplation;
            affirmationEl.textContent = selectedGnosis.affirmation;
            visualizationEl.textContent = selectedGnosis.visualization;
        }

        newGnosisBtn.addEventListener('click', generateNewGnosis);

        // Initial generation
        generateNewGnosis();
    }
    
    // Function to load content dynamically
    async function loadContent(targetId) {
        // Fallback to the first section if targetId is missing
        if (!targetId) {
            targetId = 'mapa-hermetico';
        }
        
        try {
            const response = await fetch(`${targetId}.html`);
            if (!response.ok) {
                throw new Error(`Could not load ${targetId}.html. Status: ${response.status}`);
            }
            const html = await response.text();
            contentContainer.innerHTML = html;

            // Initialize scripts for specific sections after loading
            if (targetId === 'mapa-hermetico') {
                initializeMap();
            }
            if (targetId === 'gnosis-diaria') {
                initializeGnosisDiaria();
            }
            // Add other initializers here if needed, e.g., initializeGnosisDiaria()
            
        } catch (error) {
            console.error('Error loading content:', error);
            contentContainer.innerHTML = `<div class="alert alert-danger" role="alert">Error al cargar el contenido. Por favor, inténtelo de nuevo más tarde.</div>`;
        }
    }

    // --- Navigation Handling ---
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            
            // Update active class on nav links
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');

            // Load content
            const targetId = link.getAttribute('data-target');
            loadContent(targetId);
        });
    });

    // --- Initial Page Load ---
    // Load the default section ('mapa-hermetico' is marked active in nav)
    loadContent('mapa-hermetico');
});
