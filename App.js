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
