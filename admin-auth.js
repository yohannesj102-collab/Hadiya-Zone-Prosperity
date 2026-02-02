// Admin Authentication
const AdminAuth = {
    // Check credentials
    login: (username, password) => {
        const adminData = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_CREDENTIALS));
        
        if (adminData.username === username && adminData.password === password) {
            // Update last login
            adminData.lastLogin = new Date().toISOString();
            localStorage.setItem(STORAGE_KEYS.ADMIN_CREDENTIALS, JSON.stringify(adminData));
            
            // Create session
            sessionStorage.setItem('hadiya_admin_logged_in', 'true');
            sessionStorage.setItem('hadiya_admin_user', username);
            
            return true;
        }
        return false;
    },
    
    // Check if user is logged in
    isLoggedIn: () => {
        return sessionStorage.getItem('hadiya_admin_logged_in') === 'true';
    },
    
    // Logout
    logout: () => {
        sessionStorage.removeItem('hadiya_admin_logged_in');
        sessionStorage.removeItem('hadiya_admin_user');
        window.location.href = 'index.html';
    }
};

// Handle login form
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorDiv = document.getElementById('loginError');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (AdminAuth.login(username, password)) {
                window.location.href = 'dashboard.html';
            } else {
                errorDiv.textContent = 'Invalid username or password';
                errorDiv.style.display = 'block';
            }
        });
    }
    
    // Check authentication for protected pages
    const protectedPages = ['dashboard.html', 'manage-announcements.html', 'manage-news.html', 
                           'manage-vacancy.html', 'manage-events.html', 'manage-press.html'];
    
    const currentPage = window.location.pathname.split('/').pop();
    if (protectedPages.includes(currentPage) && !AdminAuth.isLoggedIn()) {
        window.location.href = 'index.html';
    }
});