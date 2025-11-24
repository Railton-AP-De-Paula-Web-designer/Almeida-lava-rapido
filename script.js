// script.js — versão final, organizada e refatorada por sênior JS
document.addEventListener("DOMContentLoaded", () => {

    // ========================================================
    // 🟡 1. ELEMENTOS HTML (SEMPRE DECLARADOS PRIMEIRO)
    // ========================================================

    // Widget de horário
    const statusWidget = document.getElementById("openingStatusWidget");
    const statusIndicator = document.getElementById("statusIndicator");

    // Elementos do sistema de vídeo
    const openBtn = document.getElementById("openVideoBtn");
    const container = document.getElementById("videoContainer");
    const closeBtn = document.getElementById("closeVideoBtn");
    const video = document.getElementById("myVideo");
    const playPauseBtn = document.getElementById("playPauseBtn");
    const volumeControl = document.getElementById("volumeControl");

    // Verificação de segurança: garante que TODOS os elementos do vídeo existem
    const videoElementsPresent = [
        openBtn, container, closeBtn, video, playPauseBtn, volumeControl
    ].every(Boolean);

    if (!videoElementsPresent) {
        console.warn("script.js: alguns elementos do vídeo não foram encontrados. Verifique os IDs.");
        // ⚠️ Não usamos 'return' para não quebrar o sistema de horário
    }


    // ========================================================
    // 🎬 2. FUNÇÕES DO VÍDEO
    // ========================================================

    function showOverlay() {
        container.classList.add("show");
        playVideo();
        updatePlayButton();
    }

    function hideOverlay() {
        resetVideo();
        container.classList.remove("show");
        updatePlayButton();
    }

    function playVideo() {
        const attempt = video.play();
        attempt?.catch(() => {}); // Evita erro de autoplay
    }

    function resetVideo() {
        video.pause();
        video.currentTime = 0;
    }

    function updatePlayButton() {
        playPauseBtn.textContent = video.paused ? "▶️ Reproduzir" : "⏸ Pausar";
    }

    function updateVolume() {
        const v = parseFloat(volumeControl.value || "1");
        video.muted = v === 0;
        video.volume = v;
    }


    // ========================================================
    // 🖱️ 3. EVENTOS DO VÍDEO
    // ========================================================

    if (videoElementsPresent) {

        openBtn.addEventListener("click", (e) => {
            e.preventDefault();
            showOverlay();
        });

        closeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            hideOverlay();
        });

        // Clique fora da caixa fecha o modal
        container.addEventListener("click", (e) => {
            if (e.target === container) hideOverlay();
        });

        // Pressionar ESC fecha o modal
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && container.classList.contains("show")) {
                hideOverlay();
            }
        });

        // Play / Pause no botão
        playPauseBtn.addEventListener("click", () => {
            video.paused ? playVideo() : video.pause();
            updatePlayButton();
        });

        // Eventos nativos do vídeo
        video.addEventListener("play", updatePlayButton);
        video.addEventListener("pause", updatePlayButton);
        video.addEventListener("ended", updatePlayButton);

        // Volume
        updateVolume();
        volumeControl.addEventListener("input", updateVolume);

        // Caso o modal abra já visível
        if (container.classList.contains("show")) {
            updatePlayButton();
        }
    }


    // ========================================================
    // ⏰ 4. SISTEMA AUTOMÁTICO DE HORÁRIO DE FUNCIONAMENTO
    // ========================================================

    const schedule = [
        { day: 1, open: 900, close: 1800 }, // Segunda
        { day: 2, open: 900, close: 1800 }, // Terça
        { day: 3, open: 900, close: 1800 }, // Quarta
        { day: 4, open: 900, close: 1800 }, // Quinta
        { day: 5, open: 900, close: 1800 }, // Sexta
        { day: 6, open: 900, close: 1300 }  // Sábado
    ];

    if (statusWidget && statusIndicator) {

        function formatTime(timeInt) {
            const hours = Math.floor(timeInt / 100);
            const minutes = timeInt % 100;
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        }

        function checkOpeningStatus() {
            const now = new Date();
            const currentDay = now.getDay();
            const currentTime = now.getHours() * 100 + now.getMinutes();

            const today = schedule.find(s => s.day === currentDay);

            let isOpen = false;
            let statusText = "FECHADO";

            if (today) {
                const { open, close } = today;

                if (currentTime >= open && currentTime < close) {
                    isOpen = true;
                    statusText = "ABERTO AGORA";

                } else if (currentTime < open) {
                    statusText = `FECHADO (Abre às ${formatTime(open)})`;

                } else {
                    statusText = `FECHADO (Fechou às ${formatTime(close)})`;
                }

            } else {
                statusText = "FECHADO (Fim de Semana)";
            }

            statusIndicator.textContent = statusText;
            statusWidget.classList.toggle("is-open", isOpen);
        }

        // Executa ao carregar
        checkOpeningStatus();

        // Atualiza a cada minuto
        setInterval(checkOpeningStatus, 60000);
    }

});
