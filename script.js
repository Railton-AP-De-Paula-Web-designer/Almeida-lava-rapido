// script.js - compatível com seu HTML atual
document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("openVideoBtn");
  const container = document.getElementById("videoContainer");
  const closeBtn = document.getElementById("closeVideoBtn");
  const video = document.getElementById("myVideo");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const volumeControl = document.getElementById("volumeControl");

  // Safety: se algum elemento não existir, não quebra o script
  if (!openBtn || !container || !closeBtn || !video || !playPauseBtn || !volumeControl) {
    console.warn("script.js: elementos de vídeo não encontrados. Verifique os IDs no HTML.");
    return;
  }

  // Função para mostrar overlay (usa classe 'show' para manter CSS separado)
  function showOverlay() {
    container.classList.add("show");
    // tenta reproduzir (clic do usuário autoriza reprodução)
    const playPromise = video.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise.catch(() => {
        // autoplay bloqueado — mantém sem erro
      });
    }
    updatePlayButton();
  }

  // Função para esconder overlay e resetar vídeo
  function hideOverlay() {
    video.pause();
    video.currentTime = 0;
    container.classList.remove("show");
    updatePlayButton();
  }

  // Atualiza texto do botão de play/pause conforme estado
  function updatePlayButton() {
    if (video.paused) {
      playPauseBtn.textContent = "▶️ Reproduzir";
    } else {
      playPauseBtn.textContent = "⏸ Pausar";
    }
  }

  // Abrir ao clicar
  openBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showOverlay();
  });

  // Fechar ao clicar no ×
  closeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    hideOverlay();
  });

  // Fechar ao clicar fora da video-box (clic no overlay)
  container.addEventListener("click", (e) => {
    // se clicou no próprio overlay (e não dentro da caixa do vídeo), fecha
    if (e.target === container) hideOverlay();
  });

  // Fechar com Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && container.classList.contains("show")) {
      hideOverlay();
    }
  });

  // Play / Pause
  playPauseBtn.addEventListener("click", () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
    updatePlayButton();
  });

  // Atualiza icone/texto quando o usuário usa controles nativos (por exemplo na mobile)
  video.addEventListener("play", updatePlayButton);
  video.addEventListener("pause", updatePlayButton);

  // Volume control (range 0 -> 1)
  // garante valor inicial coerente
  if (!volumeControl.value) volumeControl.value = "1";
  video.volume = parseFloat(volumeControl.value);

  volumeControl.addEventListener("input", () => {
    const v = parseFloat(volumeControl.value);
    // se 0, definimos muted = true; caso contrário muted = false
    video.muted = v === 0;
    video.volume = v;
  });

  // Se o vídeo terminar, atualiza o botão
  video.addEventListener("ended", () => {
    updatePlayButton();
  });

  // Proteção: se o container é exibido no carregamento, atualiza estado
  if (container.classList.contains("show")) {
    updatePlayButton();
  }
});
