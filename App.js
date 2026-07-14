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
