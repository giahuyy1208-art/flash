window.flashcardAppLoaded = true;

const defaultWords = [
    {english: "Hello", IPA: "/həˈloʊ/", pos: "interjection", meaning: "xin chào"},
    {english: "Book", IPA: "/bʊk/", pos: "noun", meaning: "sách"},
    {english: "Eat", IPA: "/iːt/", pos: "verb", meaning: "ăn"},
    {english: "Drink", IPA: "/drɪŋk/", pos: "verb", meaning: "uống"},
    {english: "Apple", IPA: "/ˈæpəl/", pos: "noun", meaning: "táo"},
    {english: "Dog", IPA: "/dɔg/", pos: "noun", meaning: "chó"},
    {english: "Run", IPA: "/rʌn/", pos: "verb", meaning: "chạy"},
    {english: "Teacher", IPA: "/ˈtiːtʃər/", pos: "noun", meaning: "giáo viên"}
];

let savedWords = JSON.parse(localStorage.getItem("flashcards"));
let deletedWords = JSON.parse(localStorage.getItem("deletedFlashcards")) || [];
let words = [];

if (!savedWords) {
    words = [...defaultWords];
} else {
    let newWordsFromCode = defaultWords.filter(defWord => {
        let isAlreadySaved = savedWords.some(saved => saved.english.toLowerCase() === defWord.english.toLowerCase());
        let isDeleted = deletedWords.includes(defWord.english.toLowerCase());
        return !isAlreadySaved && !isDeleted;
    });
    words = [...savedWords, ...newWordsFromCode];
}

const grid = document.getElementById("grid");
const searchInputDom = document.getElementById("searchInput");

function saveData(){
    localStorage.setItem("flashcards", JSON.stringify(words));
    localStorage.setItem("deletedFlashcards", JSON.stringify(deletedWords));
}

function getFilteredWords(searchTerm) {
    if (!searchTerm) return words;
    const val = searchTerm.toLowerCase();
    return words.filter(w =>
        w.english.toLowerCase().includes(val) ||
        w.IPA.toLowerCase().includes(val) ||
        w.meaning.toLowerCase().includes(val)
    );
}

function createCard(data){
    const container = document.createElement("div");
    container.className = "flashcard-container";

    const card = document.createElement("div");
    card.className = "card";
    card.onclick = () => card.classList.toggle("flipped");

    const front = document.createElement("div");
    front.className = "card-face";
    const englishDiv = document.createElement("div");
    englishDiv.className = "english-word";
    englishDiv.textContent = data.english;
    front.appendChild(englishDiv);

    const speakBtn = document.createElement("button");
    speakBtn.className = "speak";
    speakBtn.textContent = "🔊";
    speakBtn.title = "Phát âm";
    speakBtn.onclick = (e) => {
        e.stopPropagation(); 
        speak(data.english);
    };
    front.appendChild(speakBtn);

    const back = document.createElement("div");
    back.className = "card-face card-back";

    const deleteBtn = document.createElement("div");
    deleteBtn.className = "delete-x";
    deleteBtn.title = "Xóa thẻ này";
    deleteBtn.textContent = "✕";
    back.appendChild(deleteBtn);

    const ipaDiv = document.createElement("div");
    ipaDiv.className = "IPA";
    ipaDiv.textContent = data.IPA;
    back.appendChild(ipaDiv);

    const posDiv = document.createElement("div");
    posDiv.className = "pos";
    posDiv.textContent = data.pos;
    back.appendChild(posDiv);

    const meaningDiv = document.createElement("div");
    meaningDiv.className = "meaning";
    meaningDiv.textContent = data.meaning;
    back.appendChild(meaningDiv);

    deleteBtn.onclick = (e) => {
        e.stopPropagation(); 
        if (!confirm(`Bạn có chắc muốn xóa từ "${data.english}" không?`)) return;
        if (!deletedWords.includes(data.english.toLowerCase())) {
            deletedWords.push(data.english.toLowerCase());
        }
        words = words.filter(w => w.english.toLowerCase() !== data.english.toLowerCase());
        saveData();
        render(getFilteredWords(searchInputDom.value));
    };

    card.appendChild(front);
    card.appendChild(back);
    container.appendChild(card);
    return container;
}


function render(list){
    grid.innerHTML = "";
    if (list.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: var(--text-sub);">Không tìm thấy từ vựng nào.</div>`;
        return;
    }
    list.forEach(w => grid.appendChild(createCard(w)));
}

window.addWord = function(){
    const word = document.getElementById("newWord").value.trim();
    const ipa = document.getElementById("newIPA").value.trim();
    const pos = document.getElementById("newPOS").value.trim();
    const meaning = document.getElementById("newMeaning").value.trim();

    if(!word || !meaning) { alert("Vui lòng nhập ít nhất Từ tiếng Anh và Nghĩa!"); return; }
    if (words.some(w => w.english.toLowerCase() === word.toLowerCase())) { alert("Từ vựng này đã có!"); return; }

    words.unshift({english: word, IPA: ipa, pos: pos, meaning: meaning});
    deletedWords = deletedWords.filter(dw => dw !== word.toLowerCase());
    saveData();
    searchInputDom.value = "";
    render(words);

    document.getElementById("newWord").value = "";
    document.getElementById("newIPA").value = "";
    document.getElementById("newPOS").value = "";
    document.getElementById("newMeaning").value = "";
}

searchInputDom.addEventListener("input", e => {
    render(getFilteredWords(e.target.value));
});

window.exportData = function() {
    const dataStr = JSON.stringify(words, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "flashcards_backup.json";
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

window.importData = function(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedWords = JSON.parse(e.target.result);
            if (Array.isArray(importedWords)) {
                if(confirm("Ghi đè danh sách hiện tại?")) {
                    words = importedWords;
                    deletedWords = defaultWords.map(dw => dw.english.toLowerCase()).filter(defEng => !words.some(w => w.english.toLowerCase() === defEng));
                    saveData(); searchInputDom.value = ""; render(words); alert("Đã nhập thành công!");
                }
            } else { alert("File không đúng định dạng JSON!"); }
        } catch (err) { alert("Lỗi đọc file: " + err.message); }
    };
    reader.readAsText(file);
    event.target.value = '';
}

let voices = [];
function loadVoices(){
    voices = speechSynthesis.getVoices();
    const select = document.getElementById("voiceSelect");
    const currentSelectedURI = select.options[select.selectedIndex]?.dataset?.uri;
    select.innerHTML = "";
    let englishVoiceIndex = 0;
    voices.forEach((v, i) => {
        const opt = document.createElement("option");
        opt.value = i; opt.dataset.uri = v.voiceURI; opt.text = v.name + " (" + v.lang + ")";
        select.appendChild(opt);
        if (v.lang.includes('en-US') || v.lang.includes('en-GB')) {
            if(!currentSelectedURI || v.voiceURI === currentSelectedURI) englishVoiceIndex = i;
        }
    });
    if(voices.length > 0) select.selectedIndex = englishVoiceIndex;
}
speechSynthesis.onvoiceschanged = loadVoices;
setTimeout(loadVoices, 100);

function speak(text){
    speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const voiceIndex = document.getElementById("voiceSelect").value;
    if(voices[voiceIndex]) utter.voice = voices[voiceIndex];
    speechSynthesis.speak(utter);
}

render(words);
