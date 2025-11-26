// ========================================================
// script.js — Versão Final Sênior + Correção Horário
// ========================================================

document.addEventListener("DOMContentLoaded", () => {

    // ========================================================
    // 🟡 1. ELEMENTOS HTML
    // ========================================================

    const statusWidget = document.getElementById("openingStatusWidget");
    const statusIndicator = document.getElementById("statusIndicator");

    const openBtn = document.getElementById("openVideoBtn");
    const container = document.getElementById("videoContainer");
    const closeBtn = document.getElementById("closeVideoBtn");
    const video = document.getElementById("myVideo");
    const playPauseBtn = document.getElementById("playPauseBtn");
    const volumeControl = document.getElementById("volumeControl");

    const videoElementsPresent = [
        openBtn, container, closeBtn, video, playPauseBtn, volumeControl
    ].every(Boolean);

    if (!videoElementsPresent) {
        console.warn("script.js: Elementos do vídeo ausentes. Sistema de vídeo desativado.");
    }

    // ========================================================
    // 🎬 2. FUNÇÕES DO VÍDEO
    // ========================================================

    if (videoElementsPresent) {

        function showOverlay() {
            container.classList.add("show");
            playVideo();
            updatePlayButton();
            openBtn.blur();
        }

        function hideOverlay() {
            resetVideo();
            container.classList.remove("show");
            openBtn.focus();
        }

        function playVideo() {
            const attempt = video.play();
            attempt?.catch(err => {
                console.error("Autoplay bloqueado. Requer interação:", err);
            });
        }

        function resetVideo() {
            video.pause();
            video.currentTime = 0;
        }

        function updatePlayButton() {
            const isPaused = video.paused;
            playPauseBtn.textContent = isPaused ? "▶️ Reproduzir" : "⏸ Pausar";
            playPauseBtn.setAttribute(
                "aria-label",
                isPaused ? "Reproduzir vídeo" : "Pausar vídeo"
            );
        }

        function updateVolume() {
            let vol = parseFloat(volumeControl.value);
            if (isNaN(vol)) vol = 1;
            vol = Math.max(0, Math.min(1, vol));
            video.volume = vol;
            video.muted = vol === 0;
        }

        // ========================================================
        // 🖱️ 3. EVENTOS DO VÍDEO
        // ========================================================

        openBtn.addEventListener("click", (e) => {
            e.preventDefault();
            showOverlay();
        });

        closeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            hideOverlay();
        });

        container.addEventListener("click", (e) => {
            if (e.target === container) hideOverlay();
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && container.classList.contains("show")) {
                hideOverlay();
            }
        });

        playPauseBtn.addEventListener("click", () => {
            video.paused ? playVideo() : video.pause();
        });

        video.addEventListener("play", updatePlayButton);
        video.addEventListener("pause", updatePlayButton);
        video.addEventListener("ended", updatePlayButton);

        updateVolume();
        volumeControl.addEventListener("input", updateVolume);

        if (container.classList.contains("show")) updatePlayButton();
    }

    // ========================================================
    // ⏰ 4. SISTEMA DE HORÁRIO DE FUNCIONAMENTO
    // ========================================================

    const schedule = [
        { day: 1, open: 800, close: 1700 },
        { day: 2, open: 800, close: 1700 },
        { day: 3, open: 800, close: 1700 },
        { day: 4, open: 800, close: 1700 },
        { day: 5, open: 800, close: 1700 },
        { day: 6, open: 800, close: 1300 }
    ];

    const daysOfWeek = [
        'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
        'Quinta-feira', 'Sexta-feira', 'Sábado'
    ];

    if (statusWidget && statusIndicator) {

        function formatTime(intTime) {
            const h = Math.floor(intTime / 100);
            const m = intTime % 100;
            return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        }

        function findNextOpen(currentDay) {
            for (let i = 1; i <= 7; i++) {
                const nextDayIndex = (currentDay + i) % 7;
                const nextDay = schedule.find(s => s.day === nextDayIndex);

                if (nextDay) {
                    return {
                        dayName: daysOfWeek[nextDayIndex],
                        time: formatTime(nextDay.open)
                    };
                }
            }
            return null;
        }

        function checkOpeningStatus() {
            const now = new Date();
            const currentDay = now.getDay();
            const currentTime = now.getHours() * 100 + now.getMinutes();
            const todaySchedule = schedule.find(s => s.day === currentDay);

            let isOpen = false;
            let status = "FECHADO";

            if (todaySchedule) {
                const { open, close } = todaySchedule;

                // ✅ Correção aplicada: inclui o minuto exato de fechamento
                if (currentTime >= open && currentTime <= close) {
                    isOpen = true;
                    status = "ABERTO AGORA";

                } else if (currentTime < open) {
                    status = `FECHADO (Abre às ${formatTime(open)})`;

                } else {
                    const next = findNextOpen(currentDay);
                    status = next
                        ? `FECHADO (Abre ${next.dayName} às ${next.time})`
                        : "FECHADO (Verifique horários)";
                }

            } else {
                const next = findNextOpen(currentDay);
                status = next
                    ? `FECHADO (Abre ${next.dayName} às ${next.time})`
                    : "FECHADO";
            }

            statusIndicator.textContent = status;
            statusWidget.classList.toggle("is-open", isOpen);
        }

        checkOpeningStatus();
        setInterval(checkOpeningStatus, 60000);
    }

});

