AOS.init({});
let speech = new SpeechSynthesisUtterance(),
  voices = [],
  voiceSelect = document.querySelector(".voice-selection");
const textarea = document.querySelector("textarea"),
  convertBtn = document.querySelector(".convert-btn");

function checkTextarea() {
  if (textarea.value === "") {
    convertBtn.style.background = "#676767";
    convertBtn.style.cursor = "not-allowed";
  } else {
    convertBtn.style.background = "#ffffff";
    convertBtn.style.cursor = "pointer";
  }
}

function isElementInViewport(e) {
  var t = e.getBoundingClientRect();
  return (
    t.top >= 0 &&
    t.top <=
      1 * (window.innerHeight || document.documentElement.clientHeight) &&
    t.bottom >= 0
  );
}

function animateOnScroll() {
  document.querySelectorAll(".anim").forEach((e) => {
    if (isElementInViewport(e)) {
      console.log(e);
      e.classList.add("animate");
    }
  });
}

async function populateVoiceList() {
  voices = await new Promise((resolve) => {
    let id;
    const interval = setInterval(() => {
      let voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        clearInterval(interval);
        resolve(voices);
      }
    }, 100);
  });

  voiceSelect.innerHTML = ''; // Clear previous options
  voices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.textContent = `${voice.name} (${voice.lang})`;
    option.value = index;
    voiceSelect.appendChild(option);
  });

  if (voices.length > 0) {
    speech.voice = voices[0];
  }
}

window.speechSynthesis.onvoiceschanged = populateVoiceList;

voiceSelect.addEventListener("change", () => {
  speech.voice = voices[voiceSelect.value];
});

convertBtn.addEventListener("click", () => {
  if (textarea.value !== "") {
    speech.text = textarea.value;
    window.speechSynthesis.speak(speech);
  }
});

checkTextarea();
textarea.addEventListener("input", checkTextarea);
console.log(textarea);
animateOnScroll();
window.addEventListener("scroll", animateOnScroll);

// Ensure voices are populated on page load
populateVoiceList();
