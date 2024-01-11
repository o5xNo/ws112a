const users = [];
let currentUser = null;
let diaries = [];
let diaryContent = "";
let diaryDate = "";

function register() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!users.find(user => user.username === username)) {
        users.push({ username, password });
        switchForm("signup-form", "login-form");
    } else {
        alert("使用者名稱已存在，請選擇另一個。");
    }
}

function login() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        currentUser = user;
        switchForm("login-form", "diary");
        document.getElementById("logout-btn").style.display = "block";
        document.getElementById("logout-btn-diary").style.display = "block";
    } else {
        alert("無效的使用者名稱或密碼。");
    }
}

function newDiary() {
    diaryContent = "";
    diaryDate = "";
    document.getElementById("diary-content").value = "";
    document.getElementById("diary-date").value = "";
}

function saveDiary() {
    diaryContent = document.getElementById("diary-content").value;
    diaryDate = document.getElementById("diary-date").value;

    if (!diaryContent || !diaryDate) {
        alert("請填寫日記內容和日期。");
        return;
    }

    diaries.push({ date: diaryDate, content: diaryContent });

    document.getElementById("diary-content").value = "";
    document.getElementById("diary-date").value = "";

    alert("日記已保存！");
}

function showHistory() {
    localStorage.setItem("diaries", JSON.stringify(diaries));
    window.location.href = "history.html";
}

function switchForm(hideId, showId) {
    document.getElementById(hideId).style.display = "none";
    document.getElementById(showId).style.display = "block";
}

function openRegistrationPage() {
    switchForm("login-form", "signup-form");
}

function logout() {
    currentUser = null;
    switchForm("diary", "login-form");
    document.getElementById("logout-btn").style.display = "none";
    document.getElementById("logout-btn-diary").style.display = "none";
}

function getAllDiariesSortedByDate() {
    return diaries;
}
