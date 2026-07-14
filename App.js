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
