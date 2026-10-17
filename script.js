const screen = document.getElementById("screen-content");
const startBtn = document.getElementById("start-btn");

document.getElementById('close-btn').addEventListener('click', ()=>{
  window.electronAPI.closeWindow();
});


const clickSound = new Audio("assets/sound/pop-sound.mp3");
clickSound.volume = 0.5;
clickSound.preload = "auto";

function playClickSound() {
  clickSound.currentTime = 0;
  clickSound.play();
}

function playCompletionSound() {
  const completionSound = new Audio(
    "assets/sound/session-complete.mp3"
  );

  completionSound.volume = 0.5;
  completionSound.play().catch(error => {
    console.log("Completion sound could not play:", error);
  });
}

function showCompletionScreen() {
  screen.innerHTML = `
    <div class="complete-screen">
      <img src="assets/fox-sleeping.gif" 
        alt="Sleeping fox" class="sleeping-fox">
      <h3 class="complete-title">SESSION<br>COMPLETE!</h3>
      <p class="rest-p">You did it.<br>Time to rest</p>
      <button class="home-button" id="home-btn">Go to home</button>
    </div>`;

  playCompletionSound();

  document.getElementById("home-btn").addEventListener("click", () => {
    playClickSound();
    location.reload();
  });
}

startBtn.addEventListener("click", () => {
  screen.innerHTML = `<img src="assets/hourglass.gif" 
    alt=" Hourglass" class="hourglass" id="hourglass-gif">
    <h1 class="timer-display" id="timer-display">25:00</h1>
    <div class="timer-controls">
      <button id="restart-btn">Restart</button>
      <button id="pause-btn">Pause</button>
    </div>`;

  playClickSound();

  const TEST_MODE = false;
  let timeLeft = TEST_MODE ? 10 : 25 * 60;
  let timerInterval;

  const timerDisplay = document.getElementById("timer-display");

  const pauseBtn = document.getElementById("pause-btn");
  const restartBtn = document.getElementById("restart-btn");

  function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60

    timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  updateDisplay();

  function startTimer() {
    if (timerInterval !== undefined) {
      return;
    }
    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      }
      else {
        clearInterval(timerInterval);
        timerInterval = undefined;
        showCompletionScreen();
      }
    }, 1000);
  }

  startTimer();

  const hourglassGif = document.getElementById("hourglass-gif");

  pauseBtn.addEventListener("click", () => {
    playClickSound();
    if (timerInterval !== undefined) {
      clearInterval(timerInterval);
      timerInterval = undefined;
      pauseBtn.textContent = "Resume";

      hourglassGif.src = "assets/hourglass-paused.png";
    }
    else {
      hourglassGif.src = "assets/hourglass.gif";
      startTimer();
      pauseBtn.textContent = "Pause";
    }
  });

  restartBtn.addEventListener("click", () => {
    playClickSound();
    clearInterval(timerInterval);
    timerInterval = undefined;

    timeLeft = 25 * 60;
    updateDisplay();

    pauseBtn.textContent = "Pause";
    hourglassGif.src = "assets/hourglass.gif";
    startTimer();
  });
});