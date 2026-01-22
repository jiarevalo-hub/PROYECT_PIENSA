// ==================== MATRIX RAIN EFFECT ====================
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
const matrixArray = matrix.split("");

const fontSize = 16;
const columns = canvas.width / fontSize;

const drops = [];
for (let x = 0; x < columns; x++) {
    drops[x] = 1;
}

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';
    
    for (let i = 0; i < drops.length; i++) {
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 35);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ==================== AUTENTICACIÓN ====================

window.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (isLoggedIn === 'true' && currentUser) {
        document.getElementById('landing-page').classList.remove('active');
        document.getElementById('auth-page').classList.remove('active');
        document.getElementById('main-header').style.display = 'flex';
        showPage('home');
    }
});

function showMessage(message, type) {
    const activeContainer = document.querySelector('.auth-container.active');
    if (!activeContainer) return;
    
    const existingMessage = activeContainer.querySelector('.auth-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'auth-message ' + type;
    messageDiv.innerHTML = '<span>' + (type === 'error' ? '❌' : '✅') + '</span><p>' + message + '</p>';
    
    activeContainer.insertBefore(messageDiv, activeContainer.firstChild);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function handleRegister(event) {
    event.preventDefault();
    
    const form = event.target;
    const firstName = form.querySelector('input[placeholder="John"]').value;
    const lastName = form.querySelector('input[placeholder="Doe"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const passwords = form.querySelectorAll('input[type="password"]');
    const password = passwords[0].value;
    const confirmPassword = passwords[1].value;
    
    if (password.length < 8) {
        showMessage('La contraseña debe tener al menos 8 caracteres', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('Las contraseñas no coinciden', 'error');
        return;
    }
    
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.find(u => u.email === email)) {
        showMessage('Este email ya está registrado', 'error');
        return;
    }
    
    const newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: btoa(password),
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    showMessage('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión', 'success');
    
    setTimeout(() => {
        switchAuth('login');
        form.reset();
    }, 2000);
}

function handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email);
    
    if (!user) {
        showMessage('Usuario no encontrado. Por favor regístrate', 'error');
        return;
    }
    
    if (atob(user.password) !== password) {
        showMessage('Contraseña incorrecta', 'error');
        return;
    }
    
    const currentUser = {
        email: user.email,
        name: user.firstName + ' ' + user.lastName
    };
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('isLoggedIn', 'true');
    
    showMessage('¡Bienvenido de nuevo, ' + user.firstName + '!', 'success');
    
    setTimeout(() => {
        document.getElementById('auth-page').style.display = 'none';
        document.getElementById('landing-page').style.display = 'none';
        document.getElementById('main-header').style.display = 'flex';
        showPage('home');
        form.reset();
    }, 1500);
}

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    
    document.getElementById('main-header').style.display = 'none';
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById('landing-page').style.display = 'flex';
    document.getElementById('landing-page').classList.add('active');
}

// ==================== NAVIGATION ====================
function showAuthPage(type) {
    document.getElementById('landing-page').classList.remove('active');
    document.getElementById('auth-page').classList.add('active');
    switchAuth(type);
}

function backToLanding() {
    document.getElementById('auth-page').classList.remove('active');
    document.getElementById('landing-page').classList.add('active');
}

function switchAuth(type) {
    if (type === 'login') {
        document.getElementById('login-form').classList.add('active');
        document.getElementById('register-form').classList.remove('active');
    } else {
        document.getElementById('register-form').classList.add('active');
        document.getElementById('login-form').classList.remove('active');
    }
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// ==================== QUIZ FUNCTIONALITY ====================

const questions = [
    {
        level: "Principiante",
        question: "¿Qué significa el acrónimo 'VPN'?",
        answers: ["Virtual Private Network", "Verified Protection Network", "Visual Programming Node", "Vulnerability Prevention Network"],
        correct: 0,
        explanation: "VPN significa Virtual Private Network (Red Privada Virtual), una tecnología que crea una conexión segura y cifrada sobre una red menos segura, como Internet."
    },
    {
        level: "Principiante",
        question: "¿Cuál de estos NO es un tipo de malware?",
        answers: ["Ransomware", "Trojan", "Firewall", "Spyware"],
        correct: 2,
        explanation: "Un Firewall es una herramienta de seguridad que protege sistemas, no es malware. Los otros son tipos de software malicioso."
    },
    {
        level: "Principiante",
        question: "¿Qué es el Phishing?",
        answers: ["Un virus informático", "Un ataque que busca robar información personal", "Un tipo de firewall", "Un lenguaje de programación"],
        correct: 1,
        explanation: "El Phishing es una técnica de ingeniería social donde atacantes se hacen pasar por entidades legítimas para robar información personal."
    },
    {
        level: "Intermedio",
        question: "¿Cuántos caracteres mínimo debe tener una contraseña segura según las mejores prácticas actuales?",
        answers: ["6 caracteres", "8 caracteres", "12 caracteres", "16 caracteres"],
        correct: 2,
        explanation: "Las mejores prácticas actuales recomiendan un mínimo de 12 caracteres para una contraseña segura."
    },
    {
        level: "Intermedio",
        question: "¿Qué significa 2FA?",
        answers: ["Two Factor Authentication", "Two File Access", "Technical Firewall Algorithm", "Transfer Files Automatically"],
        correct: 0,
        explanation: "2FA es Two Factor Authentication (Autenticación de Dos Factores), un método de seguridad que requiere dos formas de verificación."
    },
    {
        level: "Intermedio",
        question: "¿Cuál es el puerto predeterminado para HTTPS?",
        answers: ["80", "443", "8080", "3306"],
        correct: 1,
        explanation: "El puerto 443 es el puerto estándar para conexiones HTTPS que utiliza cifrado SSL/TLS."
    },
    {
        level: "Intermedio",
        question: "¿Qué es un ataque DDoS?",
        answers: ["Un virus que borra archivos", "Un ataque que sobrecarga un servidor con tráfico", "Un tipo de encriptación", "Un método de autenticación"],
        correct: 1,
        explanation: "DDoS es un ataque que busca hacer inaccesible un servicio sobrecargándolo con tráfico de múltiples fuentes."
    },
    {
        level: "Avanzado",
        question: "¿Qué capa del modelo OSI se encarga principalmente del cifrado?",
        answers: ["Capa de Aplicación (7)", "Capa de Transporte (4)", "Capa de Presentación (6)", "Capa Física (1)"],
        correct: 2,
        explanation: "La Capa de Presentación (capa 6) del modelo OSI es responsable del cifrado, compresión y formato de datos."
    },
    {
        level: "Avanzado",
        question: "¿Qué es una vulnerabilidad Zero-Day?",
        answers: ["Un día sin conexión a internet", "Una vulnerabilidad desconocida por el fabricante", "El día de lanzamiento de un software", "Un tipo de antivirus"],
        correct: 1,
        explanation: "Zero-Day es una vulnerabilidad desconocida por el fabricante para la cual no existe parche."
    },
    {
        level: "Avanzado",
        question: "En criptografía, ¿qué es un 'salt' en el contexto de hash de contraseñas?",
        answers: ["Un dato aleatorio agregado antes de hashear", "Una contraseña temporal", "Un tipo de algoritmo de cifrado", "Un protocolo de red"],
        correct: 0,
        explanation: "Un 'salt' es un dato aleatorio único que se agrega a cada contraseña antes de aplicar el hash."
    }
];

let currentQuestion = 0;
let score = 0;
let levelScores = { "Principiante": 0, "Intermedio": 0, "Avanzado": 0 };
let levelTotals = { "Principiante": 3, "Intermedio": 4, "Avanzado": 3 };

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    levelScores = { "Principiante": 0, "Intermedio": 0, "Avanzado": 0 };
    
    document.getElementById('start-screen').classList.remove('active');
    document.getElementById('quiz-questions').classList.add('active');
    
    showQuestion();
}

function showQuestion() {
    const q = questions[currentQuestion];
    
    document.getElementById('level-badge').textContent = 'Nivel: ' + q.level;
    document.getElementById('level-badge').style.borderColor = 
        q.level === "Principiante" ? "#00ff41" : 
        q.level === "Intermedio" ? "#ffeb3b" : "#ff0000";
    
    document.getElementById('current-question').textContent = currentQuestion + 1;
    document.getElementById('current-question-num').textContent = currentQuestion + 1;
    document.getElementById('progress-fill').style.width = ((currentQuestion + 1) / questions.length * 100) + '%';
    
    document.getElementById('question-text').textContent = q.question;
    
    const answersContainer = document.getElementById('answers-container');
    answersContainer.innerHTML = '';
    
    q.answers.forEach((answer, index) => {
        const btn = document.createElement('div');
        btn.className = 'answer-option';
        btn.textContent = answer;
        btn.onclick = () => selectAnswer(index);
        answersContainer.appendChild(btn);
    });
    
    document.getElementById('quiz-feedback').style.display = 'none';
}
function selectAnswer(index) {
    const q = questions[currentQuestion];
    const answers = document.querySelectorAll('.answer-option');
    const feedback = document.getElementById('quiz-feedback');
    
    answers.forEach(a => a.style.pointerEvents = 'none');
    
    if (index === q.correct) {
        answers[index].classList.add('correct');
        feedback.className = 'quiz-feedback correct';
        feedback.innerHTML = '<strong>✓ ¡Correcto!</strong><br><br>' + q.explanation;
        score++;
        levelScores[q.level]++;
    } else {
        answers[index].classList.add('incorrect');
        answers[q.correct].classList.add('correct');
        feedback.className = 'quiz-feedback incorrect';
        feedback.innerHTML = '<strong>✗ Incorrecto.</strong><br><br>' + q.explanation;
    }
    
    feedback.style.display = 'block';
    
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            showResults();
        }
    }, 3500);
}

function showResults() {
    document.getElementById('quiz-questions').classList.remove('active');
    document.getElementById('quiz-results').classList.add('active');
    
    document.getElementById('final-score').textContent = score;
    
    document.getElementById('beginner-score').textContent = levelScores["Principiante"] + '/' + levelTotals["Principiante"];
    document.getElementById('intermediate-score').textContent = levelScores["Intermedio"] + '/' + levelTotals["Intermedio"];
    document.getElementById('advanced-score').textContent = levelScores["Avanzado"] + '/' + levelTotals["Avanzado"];
    
    const percentage = (score / questions.length) * 100;
    let message = '';
    if (percentage === 100) message = '¡Perfecto! Eres un experto en ciberseguridad 🏆';
    else if (percentage >= 80) message = '¡Excelente! Dominas muy bien los conceptos 🌟';
    else if (percentage >= 60) message = '¡Bien hecho! Vas por buen camino 👍';
    else if (percentage >= 40) message = 'Puedes mejorar. Sigue estudiando 📚';
    else message = 'Necesitas repasar los conceptos básicos 💪';
    
    document.getElementById('score-message').textContent = message;
}

function restartQuiz() {
    document.getElementById('quiz-results').classList.remove('active');
    document.getElementById('start-screen').classList.add('active');
}

// ==================== PHISHING SIMULATOR ====================

const phishingEmails = [
    {
        from: "security@paypa1-verify.com",
        subject: "URGENTE: Verifica tu cuenta ahora",
        date: "Hoy 10:34 AM",
        body: "Estimado usuario,<br><br>Hemos detectado actividad sospechosa en tu cuenta.",
        isPhishing: true,
        explanation: "🚨 SEÑALES DE PHISHING: Dominio sospechoso, urgencia artificial, amenaza de suspensión."
    }
];

let currentPhishingIndex = 0;
let phishingCorrect = 0;
let phishingIncorrect = 0;

function initPhishing() {
    currentPhishingIndex = 0;
    phishingCorrect = 0;
    phishingIncorrect = 0;
    if (document.getElementById('phishing')) {
        updatePhishingStats();
        showPhishingEmail();
    }
}

function showPhishingEmail() {
    if (!document.getElementById('email-from')) return;
    
    if (currentPhishingIndex >= phishingEmails.length) {
        showPhishingResults();
        return;
    }
    
    const email = phishingEmails[currentPhishingIndex];
    document.getElementById('email-from').textContent = email.from;
    document.getElementById('email-subject').textContent = email.subject;
    document.getElementById('email-date').textContent = email.date;
    document.getElementById('email-body').innerHTML = email.body;
    document.getElementById('phishing-count').textContent = (currentPhishingIndex + 1) + '/' + phishingEmails.length;
    document.getElementById('phishing-feedback').classList.remove('show');
}

function checkPhishing(userSaysPhishing) {
    const email = phishingEmails[currentPhishingIndex];
    const feedback = document.getElementById('phishing-feedback');
    const isCorrect = userSaysPhishing === email.isPhishing;
    
    if (isCorrect) {
        phishingCorrect++;
        feedback.className = 'phishing-feedback show correct';
        feedback.innerHTML = '<strong>✓ ¡Correcto!</strong><br><br>' + email.explanation;
    } else {
        phishingIncorrect++;
        feedback.className = 'phishing-feedback show incorrect';
        feedback.innerHTML = '<strong>✗ Incorrecto.</strong><br><br>' + email.explanation;
    }
    
    updatePhishingStats();
    
    setTimeout(() => {
        currentPhishingIndex++;
        showPhishingEmail();
    }, 4000);
}

function updatePhishingStats() {
    if (document.getElementById('phishing-correct')) {
        document.getElementById('phishing-correct').textContent = phishingCorrect;
        document.getElementById('phishing-incorrect').textContent = phishingIncorrect;
    }
}

function showPhishingResults() {
    const total = phishingCorrect + phishingIncorrect;
    const percentage = (phishingCorrect / total) * 100;
    let message = '';
    
    if (percentage >= 90) {
        message = '¡Excelente! Tienes un ojo experto para detectar phishing 🎯';
    } else if (percentage >= 70) {
        message = '¡Bien hecho! Estás en el camino correcto 👍';
    } else {
        message = 'Necesitas más práctica. Ten cuidado con los emails sospechosos ⚠️';
    }
    
    if (document.getElementById('email-body')) {
        document.getElementById('email-body').innerHTML = '<h2 style="color: #00ff41; text-align: center;">Simulación Completada</h2><div style="text-align: center;"><p style="font-size: 1.5rem;">Correctas: <strong style="color: #00ff41;">' + phishingCorrect + '</strong> / ' + total + '</p><p style="font-size: 1.2rem; color: #00ffff;">' + message + '</p><button onclick="initPhishing()" style="margin-top: 30px; padding: 15px 40px; background: #00ff41; color: #000; border: none; font-size: 1.1rem; cursor: pointer;">Reintentar</button></div>';
    }
}

// ==================== PASSWORD GENERATOR ====================

function generatePassword() {
    const length = document.getElementById('password-length') ? document.getElementById('password-length').value : 12;
    const useUppercase = document.getElementById('opt-uppercase') ? document.getElementById('opt-uppercase').checked : true;
    const useLowercase = document.getElementById('opt-lowercase') ? document.getElementById('opt-lowercase').checked : true;
    const useNumbers = document.getElementById('opt-numbers') ? document.getElementById('opt-numbers').checked : true;
    const useSymbols = document.getElementById('opt-symbols') ? document.getElementById('opt-symbols').checked : false;
    
    let chars = '';
    if (useUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (useNumbers) chars += '0123456789';
    if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (chars === '') {
        alert('Selecciona al menos una opción');
        return;
    }
    
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    if (document.getElementById('generated-password')) {
        document.getElementById('generated-password').value = password;
    }
}

function copyPassword() {
    const password = document.getElementById('generated-password');
    if (password) {
        password.select();
        document.execCommand('copy');
        alert('Contraseña copiada');
    }
}

function updateLength(value) {
    if (document.getElementById('length-value')) {
        document.getElementById('length-value').textContent = value;
    }
}

function togglePasswordVisibility() {
    const input = document.getElementById('check-password');
    if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
    }
}

if (document.getElementById('phishing')) {
    initPhishing();
}