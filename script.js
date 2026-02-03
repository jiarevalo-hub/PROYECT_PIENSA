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

// ==================== INICIALIZACIÓN AOS ====================
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 100,
        easing: 'ease-in-out',
        delay: 50
    });
});

// ==================== AUTENTICACIÓN ====================

window.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (isLoggedIn === 'true' && currentUser) {
        document.getElementById('landing-page').classList.remove('active');
        document.getElementById('auth-page').classList.remove('active');
        document.getElementById('main-header').classList.add('active');
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
    
    // Crear icono SVG según el tipo
    const icon = type === 'error' 
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
    
    messageDiv.innerHTML = '<span>' + icon + '</span><p>' + message + '</p>';
    
    // Agregar estilos inline para el mensaje
    messageDiv.style.padding = '15px';
    messageDiv.style.marginBottom = '20px';
    messageDiv.style.borderRadius = '8px';
    messageDiv.style.border = '2px solid';
    messageDiv.style.textAlign = 'center';
    messageDiv.style.display = 'flex';
    messageDiv.style.alignItems = 'center';
    messageDiv.style.gap = '10px';
    
    if (type === 'error') {
        messageDiv.style.backgroundColor = 'rgba(255, 0, 100, 0.1)';
        messageDiv.style.borderColor = '#ff0066';
        messageDiv.style.color = '#ff0066';
    } else {
        messageDiv.style.backgroundColor = 'rgba(0, 255, 65, 0.1)';
        messageDiv.style.borderColor = '#00ff41';
        messageDiv.style.color = '#00ff41';
    }
    
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
        document.getElementById('auth-page').classList.remove('active');
        document.getElementById('landing-page').classList.remove('active');
        document.getElementById('main-header').classList.add('active');
        showPage('home');
        form.reset();
    }, 1500);
}

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    
    document.getElementById('main-header').classList.remove('active');
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
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
    
    // Scroll al inicio de la página
    window.scrollTo(0, 0);
    
    // Refrescar animaciones AOS
    setTimeout(() => {
        AOS.refresh();
    }, 100);
}

// ==================== MENÚ COLAPSABLE ====================
function toggleMenu(event) {
    event.preventDefault();
    
    const menuToggle = document.querySelector('.menu-toggle');
    const menuDropdown = document.querySelector('.menu-dropdown');
    
    menuToggle.classList.toggle('active');
    menuDropdown.classList.toggle('active');
}

// Cerrar menú al hacer clic en una opción
document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-dropdown a');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const menuToggle = document.querySelector('.menu-toggle');
            const menuDropdown = document.querySelector('.menu-dropdown');
            if (menuToggle && menuDropdown) {
                menuToggle.classList.remove('active');
                menuDropdown.classList.remove('active');
            }
        });
    });
});

// ==================== BÚSQUEDA FUNCIONAL CON SCROLL AUTOMÁTICO ====================

const searchableContent = [
    {
        title: "Criptografía",
        text: "Técnica de protección de información mediante algoritmos matemáticos que convierten datos legibles en código cifrado. Utiliza AES-256, RSA y SHA.",
        page: "home",
        scrollTo: "info-criptografia",
        keywords: ["cifrado", "encriptación", "algoritmos", "aes", "rsa", "sha", "seguridad", "criptografia"]
    },
    {
        title: "Firewall",
        text: "Sistema de seguridad de red que monitorea y controla el tráfico entrante y saliente basándose en reglas de seguridad.",
        page: "home",
        scrollTo: "info-firewall",
        keywords: ["firewall", "red", "tráfico", "seguridad", "protección", "barrera"]
    },
    {
        title: "Phishing",
        text: "Ataque de ingeniería social que engaña a usuarios para revelar información confidencial mediante correos o sitios web falsos.",
        page: "home",
        scrollTo: "info-phishing",
        keywords: ["phishing", "ataque", "correo", "email", "estafa", "ingeniería social", "fraude"]
    },
    {
        title: "Malware",
        text: "Software malicioso diseñado para dañar, explotar o tomar control no autorizado de sistemas. Incluye virus, troyanos, ransomware y spyware.",
        page: "home",
        scrollTo: "info-malware",
        keywords: ["malware", "virus", "troyano", "ransomware", "spyware", "amenaza", "infección"]
    },
    {
        title: "Autenticación 2FA",
        text: "Método de seguridad que requiere dos formas diferentes de verificación de identidad.",
        page: "home",
        scrollTo: "info-2fa",
        keywords: ["2fa", "autenticación", "verificación", "dos factores", "seguridad", "contraseña"]
    },
    {
        title: "VPN",
        text: "Red Privada Virtual que crea conexiones seguras y cifradas sobre redes menos seguras como Internet.",
        page: "home",
        scrollTo: "info-vpn",
        keywords: ["vpn", "red privada", "conexión segura", "privacidad", "anonimato", "cifrado"]
    },
    {
        title: "Pentesting",
        text: "Pruebas de penetración autorizadas que simulan ataques cibernéticos para identificar vulnerabilidades.",
        page: "home",
        scrollTo: "info-pentesting",
        keywords: ["pentesting", "hacking ético", "vulnerabilidades", "pruebas", "seguridad", "auditoría"]
    },
    {
        title: "DDoS Attack",
        text: "Ataque de Denegación de Servicio Distribuido que sobrecarga servidores con tráfico masivo.",
        page: "home",
        scrollTo: "info-ddos",
        keywords: ["ddos", "ataque", "denegación", "servicio", "tráfico", "botnet"]
    },
    {
        title: "Zero Trust",
        text: "Modelo de seguridad que no confía en ningún usuario o dispositivo por defecto.",
        page: "home",
        scrollTo: "info-zerotrust",
        keywords: ["zero trust", "confianza cero", "seguridad", "modelo", "verificación"]
    },
    {
        title: "SIEM",
        text: "Security Information and Event Management recopila y analiza logs de seguridad en tiempo real.",
        page: "home",
        scrollTo: "info-siem",
        keywords: ["siem", "monitoreo", "logs", "eventos", "seguridad", "análisis"]
    },
    {
        title: "Backup & Recovery",
        text: "Proceso de crear copias de seguridad de datos críticos y establecer procedimientos de restauración.",
        page: "home",
        scrollTo: "info-backup",
        keywords: ["backup", "respaldo", "recuperación", "recovery", "datos", "copias"]
    },
    {
        title: "Seguridad en la Nube",
        text: "Conjunto de políticas y tecnologías para proteger datos en cloud computing.",
        page: "home",
        scrollTo: "info-cloud",
        keywords: ["nube", "cloud", "seguridad", "protección", "datos", "almacenamiento"]
    },
    {
        title: "Videos Educativos",
        text: "Galería de videos educativos sobre ciberseguridad, hacking ético y seguridad informática.",
        page: "videos",
        scrollTo: null,
        keywords: ["videos", "tutoriales", "educación", "aprender", "curso", "hacking"]
    },
    {
        title: "Quizz de Ciberseguridad",
        text: "Pon a prueba tus conocimientos con nuestro quizz progresivo de ciberseguridad.",
        page: "quiz",
        scrollTo: null,
        keywords: ["quiz", "quizz", "examen", "prueba", "test", "evaluación", "conocimientos"]
    },
    {
        title: "VirusTotal",
        text: "Herramienta para escanear archivos y URLs en busca de malware utilizando múltiples motores antivirus.",
        page: "home",
        scrollTo: "tools-section",
        keywords: ["virustotal", "escanear", "malware", "antivirus", "herramienta", "analisis"]
    },
    {
        title: "Kali Linux",
        text: "Distribución Linux especializada en pentesting y auditorías de seguridad avanzadas.",
        page: "home",
        scrollTo: "tools-section",
        keywords: ["kali", "linux", "pentesting", "hacking", "distribución", "sistema operativo"]
    },
    {
        title: "Metasploit",
        text: "Framework de pentesting para desarrollar, probar y ejecutar exploits de seguridad.",
        page: "home",
        scrollTo: "tools-section",
        keywords: ["metasploit", "framework", "exploits", "pentesting", "hacking"]
    },
    {
        title: "Wireshark",
        text: "Analizador de protocolos de red para capturar y examinar tráfico de datos.",
        page: "home",
        scrollTo: "tools-section",
        keywords: ["wireshark", "analisis", "red", "tráfico", "protocolos", "captura"]
    },
    {
        title: "Burp Suite",
        text: "Plataforma integrada para realizar pruebas de seguridad en aplicaciones web.",
        page: "home",
        scrollTo: "tools-section",
        keywords: ["burp", "suite", "web", "seguridad", "pruebas", "aplicaciones"]
    },
    {
        title: "LastPass",
        text: "Gestor de contraseñas seguro que almacena y encripta todas tus credenciales.",
        page: "home",
        scrollTo: "tools-section",
        keywords: ["lastpass", "gestor", "contraseñas", "password", "seguridad"]
    },
    {
        title: "ProtonMail",
        text: "Servicio de correo electrónico cifrado de extremo a extremo para máxima privacidad.",
        page: "home",
        scrollTo: "tools-section",
        keywords: ["protonmail", "email", "correo", "cifrado", "privacidad", "seguro"]
    },
    {
        title: "Malwarebytes",
        text: "Antivirus avanzado especializado en detección y eliminación de malware moderno.",
        page: "home",
        scrollTo: "tools-section",
        keywords: ["malwarebytes", "antivirus", "malware", "protección", "seguridad"]
    },
    {
        title: "Introducción a la Ciberseguridad",
        text: "Aprende los conceptos fundamentales de la ciberseguridad y su importancia en el mundo digital.",
        page: "intro",
        scrollTo: null,
        keywords: ["introducción", "fundamentos", "conceptos", "básico", "aprender", "ciberseguridad"]
    }
];

function handleSearch(query) {
    const resultsContainer = document.getElementById('search-results');
    
    if (!query || query.trim().length < 2) {
        resultsContainer.classList.remove('active');
        return;
    }
    
    const searchTerm = query.toLowerCase().trim();
    const results = searchableContent.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(searchTerm);
        const textMatch = item.text.toLowerCase().includes(searchTerm);
        const keywordMatch = item.keywords.some(keyword => keyword.includes(searchTerm));
        return titleMatch || textMatch || keywordMatch;
    });
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="no-results"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg> No se encontraron resultados para "' + query + '"</div>';
        resultsContainer.classList.add('active');
        return;
    }
    
    let html = '';
    results.slice(0, 6).forEach(result => {
        html += '<div class="search-result-item" onclick="navigateToResult(\'' + result.page + '\', \'' + (result.scrollTo || '') + '\')">';
        html += '<div class="search-result-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg> ' + result.title + '</div>';
        html += '<div class="search-result-text">' + result.text.substring(0, 120) + '...</div>';
        html += '</div>';
    });
    
    resultsContainer.innerHTML = html;
    resultsContainer.classList.add('active');
}

function navigateToResult(page, scrollToId) {
    // Cerrar resultados de búsqueda
    document.getElementById('search-results').classList.remove('active');
    document.getElementById('search-input').value = '';
    
    // Navegar a la página
    showPage(page);
    
    // Hacer scroll al elemento si existe
    if (scrollToId) {
        setTimeout(() => {
            const element = document.getElementById(scrollToId);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                
                // Efecto de resaltado temporal
                element.style.transition = 'all 0.5s ease';
                element.style.transform = 'scale(1.05)';
                element.style.boxShadow = '0 0 40px rgba(0, 255, 255, 0.8)';
                
                setTimeout(() => {
                    element.style.transform = '';
                    element.style.boxShadow = '';
                }, 2000);
            }
        }, 300);
    }
}

// Cerrar resultados al hacer clic fuera
document.addEventListener('click', function(event) {
    const searchContainer = document.querySelector('.search-container');
    const searchResults = document.getElementById('search-results');
    
    if (searchContainer && !searchContainer.contains(event.target)) {
        if (searchResults) {
            searchResults.classList.remove('active');
        }
    }
});

// Manejo de teclas para la búsqueda
document.addEventListener('keydown', (e) => {
    const searchInput = document.getElementById('search-input');
    
    // Ctrl/Cmd + K para enfocar la búsqueda
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape para cerrar resultados de búsqueda
    if (e.key === 'Escape') {
        const searchResults = document.getElementById('search-results');
        if (searchResults) {
            searchResults.classList.remove('active');
        }
        if (searchInput) {
            searchInput.blur();
        }
    }
});

// ==================== QUIZ FUNCTIONALITY - PREGUNTAS CORREGIDAS ====================

const questions = [
    // ===== NIVEL PRINCIPIANTE (5 preguntas) =====
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
        level: "Principiante",
        question: "¿Cuál es la mejor práctica para crear contraseñas seguras?",
        answers: ["Usar el mismo password en todas las cuentas", "Usar tu fecha de nacimiento", "Combinar letras, números y símbolos", "Usar palabras del diccionario"],
        correct: 2,
        explanation: "La mejor práctica es combinar letras mayúsculas, minúsculas, números y símbolos para crear contraseñas robustas y únicas para cada cuenta."
    },
    {
        level: "Principiante",
        question: "¿Qué protocolo utiliza HTTPS para cifrar la comunicación?",
        answers: ["FTP", "SSL/TLS", "SMTP", "HTTP"],
        correct: 1,
        explanation: "HTTPS utiliza SSL/TLS (Secure Sockets Layer/Transport Layer Security) para cifrar la comunicación entre el navegador y el servidor web."
    },
    
    // ===== NIVEL INTERMEDIO (7 preguntas) =====
    {
        level: "Intermedio",
        question: "¿Cuántos caracteres mínimo debe tener una contraseña segura según las mejores prácticas actuales?",
        answers: ["6 caracteres", "8 caracteres", "12 caracteres", "16 caracteres"],
        correct: 2,
        explanation: "Las mejores prácticas actuales recomiendan un mínimo de 12 caracteres para una contraseña segura, aunque 16 o más es aún mejor."
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
        explanation: "DDoS (Distributed Denial of Service) es un ataque que busca hacer inaccesible un servicio sobrecargándolo con tráfico de múltiples fuentes."
    },
    {
        level: "Intermedio",
        question: "¿Qué tipo de ataque utiliza una botnet?",
        answers: ["Phishing", "SQL Injection", "DDoS", "Man-in-the-Middle"],
        correct: 2,
        explanation: "Una botnet (red de dispositivos infectados) se utiliza comúnmente en ataques DDoS para generar tráfico masivo desde múltiples fuentes."
    },
    {
        level: "Intermedio",
        question: "¿Qué significa el término 'Zero-Day' en ciberseguridad?",
        answers: ["El primer día del año", "Una vulnerabilidad sin parche conocido", "Un ataque que dura cero días", "Un sistema sin vulnerabilidades"],
        correct: 1,
        explanation: "Zero-Day se refiere a una vulnerabilidad de seguridad que es explotada antes de que el fabricante tenga conocimiento de ella o pueda lanzar un parche."
    },
    {
        level: "Intermedio",
        question: "¿Cuál de estas herramientas se utiliza para pentesting?",
        answers: ["Microsoft Word", "Metasploit", "Adobe Photoshop", "VLC Media Player"],
        correct: 1,
        explanation: "Metasploit es un framework ampliamente utilizado para realizar pruebas de penetración y auditorías de seguridad."
    },
    
    // ===== NIVEL AVANZADO (8 preguntas) =====
    {
        level: "Avanzado",
        question: "¿Qué capa del modelo OSI se encarga principalmente del cifrado?",
        answers: ["Capa de Aplicación (7)", "Capa de Transporte (4)", "Capa de Presentación (6)", "Capa Física (1)"],
        correct: 2,
        explanation: "La Capa de Presentación (capa 6) del modelo OSI es responsable del cifrado, compresión y formato de datos."
    },
    {
        level: "Avanzado",
        question: "En criptografía, ¿qué es un 'salt' en el contexto de hash de contraseñas?",
        answers: ["Un dato aleatorio agregado antes de hashear", "Una contraseña temporal", "Un tipo de algoritmo de cifrado", "Un protocolo de red"],
        correct: 0,
        explanation: "Un 'salt' es un dato aleatorio único que se agrega a cada contraseña antes de aplicar el hash, previniendo ataques de diccionario y rainbow tables."
    },
    {
        level: "Avanzado",
        question: "¿Qué algoritmo de cifrado simétrico es considerado el estándar actual?",
        answers: ["DES", "AES", "RSA", "MD5"],
        correct: 1,
        explanation: "AES (Advanced Encryption Standard) es el algoritmo de cifrado simétrico estándar actual, utilizado ampliamente en comunicaciones seguras."
    },
    {
        level: "Avanzado",
        question: "¿Qué tipo de ataque explota vulnerabilidades en la entrada de datos de aplicaciones web?",
        answers: ["Phishing", "SQL Injection", "DDoS", "Spoofing"],
        correct: 1,
        explanation: "SQL Injection explota vulnerabilidades en la validación de entrada para ejecutar comandos SQL maliciosos en la base de datos."
    },
    {
        level: "Avanzado",
        question: "¿Qué principio de seguridad establece que los usuarios solo deben tener el acceso mínimo necesario?",
        answers: ["Defensa en profundidad", "Segmentación de red", "Principio de mínimo privilegio", "Autenticación multifactor"],
        correct: 2,
        explanation: "El Principio de Mínimo Privilegio establece que los usuarios y procesos solo deben tener los permisos mínimos necesarios para realizar sus funciones."
    },
    {
        level: "Avanzado",
        question: "¿Qué herramienta se utiliza principalmente para análisis de tráfico de red?",
        answers: ["Nmap", "Wireshark", "Burp Suite", "John the Ripper"],
        correct: 1,
        explanation: "Wireshark es un analizador de protocolos de red que permite capturar y examinar el tráfico de datos en tiempo real."
    },
    {
        level: "Avanzado",
        question: "¿Qué técnica de hacking utiliza engaño psicológico para manipular personas?",
        answers: ["Buffer Overflow", "Ingeniería Social", "Cross-Site Scripting", "Brute Force"],
        correct: 1,
        explanation: "La Ingeniería Social utiliza manipulación psicológica para engañar a las personas y obtener información confidencial o acceso a sistemas."
    },
    {
        level: "Avanzado",
        question: "¿Qué significa SIEM en el contexto de ciberseguridad?",
        answers: ["Secure Internet Email Management", "Security Information and Event Management", "System Integration and Error Monitoring", "Software Installation and Encryption Module"],
        correct: 1,
        explanation: "SIEM (Security Information and Event Management) es un sistema que recopila, analiza y correlaciona logs de seguridad para detectar amenazas."
    }
];

// Variables del quiz
let currentQuestion = 0;
let score = 0;
let levelScores = { "Principiante": 0, "Intermedio": 0, "Avanzado": 0 };
let levelTotals = { "Principiante": 5, "Intermedio": 7, "Avanzado": 8 };

// ==================== FUNCIONES DEL QUIZZ ====================

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
    
    document.getElementById('level-badge').textContent = 'NIVEL: ' + q.level.toUpperCase();
    
    // Cambiar color del badge según el nivel
    const badge = document.getElementById('level-badge');
    if (q.level === "Principiante") {
        badge.style.borderColor = "#00ff41";
        badge.style.color = "#00ff41";
        badge.style.backgroundColor = "rgba(0, 255, 65, 0.1)";
        badge.style.textShadow = "0 0 10px #00ff41";
    } else if (q.level === "Intermedio") {
        badge.style.borderColor = "#ffeb3b";
        badge.style.color = "#ffeb3b";
        badge.style.backgroundColor = "rgba(255, 235, 59, 0.1)";
        badge.style.textShadow = "0 0 10px #ffeb3b";
    } else {
        badge.style.borderColor = "#ff0066";
        badge.style.color = "#ff0066";
        badge.style.backgroundColor = "rgba(255, 0, 102, 0.1)";
        badge.style.textShadow = "0 0 10px #ff0066";
    }
    
    document.getElementById('current-question').textContent = currentQuestion + 1;
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
    
    const feedback = document.getElementById('quiz-feedback');
    feedback.classList.remove('show', 'correct', 'incorrect');
    feedback.style.display = 'none';
}

function selectAnswer(index) {
    const q = questions[currentQuestion];
    const answers = document.querySelectorAll('.answer-option');
    const feedback = document.getElementById('quiz-feedback');
    
    // Deshabilitar todos los botones
    answers.forEach(a => {
        a.style.pointerEvents = 'none';
        a.style.cursor = 'default';
    });
    
    if (index === q.correct) {
        answers[index].classList.add('correct');
        feedback.className = 'quiz-feedback quiz-feedback-compact correct show';
        feedback.innerHTML = '<strong><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline-block; vertical-align: middle;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> ¡Correcto!</strong><br><br>' + q.explanation;
        score++;
        levelScores[q.level]++;
    } else {
        answers[index].classList.add('incorrect');
        answers[q.correct].classList.add('correct');
        feedback.className = 'quiz-feedback quiz-feedback-compact incorrect show';
        feedback.innerHTML = '<strong><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline-block; vertical-align: middle;"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg> Incorrecto.</strong><br><br>' + q.explanation;
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
    
    if (percentage === 100) {
        message = '¡PERFECTO! Eres un EXPERTO en ciberseguridad. Dominas todos los conceptos desde lo básico hasta lo avanzado.';
    } else if (percentage >= 90) {
        message = '¡EXCELENTE! Tienes un conocimiento sobresaliente. Estás muy cerca de la perfección.';
    } else if (percentage >= 80) {
        message = '¡MUY BIEN! Dominas la mayoría de los conceptos. Con un poco más de estudio serás experto.';
    } else if (percentage >= 70) {
        message = '¡BIEN HECHO! Vas por buen camino. Tienes una base sólida, sigue aprendiendo.';
    } else if (percentage >= 60) {
        message = 'APROBADO. Conoces lo básico pero necesitas profundizar en varios temas.';
    } else if (percentage >= 50) {
        message = 'JUSTO. Tienes conocimientos básicos pero necesitas estudiar más para mejorar.';
    } else if (percentage >= 40) {
        message = 'NECESITAS MEJORAR. Repasa los conceptos fundamentales de ciberseguridad.';
    } else {
        message = 'REPASA LOS CONCEPTOS. Te recomendamos estudiar más sobre ciberseguridad antes de reintentar.';
    }
    
    document.getElementById('score-message').textContent = message;
    
    // Scroll al inicio
    window.scrollTo(0, 0);
}

function restartQuiz() {
    document.getElementById('quiz-results').classList.remove('active');
    document.getElementById('start-screen').classList.add('active');
    window.scrollTo(0, 0);
}

// ==================== CONSOLE MESSAGES ====================
console.log('%c🔐 C.I.T. - Cybersecurity Intelligence Training', 'color: #00ff41; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #00ff41;');
console.log('%c⚠️ ADVERTENCIA: Esta es una zona de entrenamiento en ciberseguridad', 'color: #00ffff; font-size: 14px;');
console.log('%c🛡️ Mantén tu información segura y nunca compartas tus credenciales', 'color: #ff00ff; font-size: 12px;');
console.log('%c✨ Sistema cargado correctamente - Menú colapsable activo', 'color: #00ff41; font-size: 12px;');
