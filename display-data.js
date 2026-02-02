// Display announcements on frontend
function displayAnnouncements() {
    const container = document.getElementById('announcementsContainer');
    if (!container) return;
    
    const announcements = Storage.getAll(STORAGE_KEYS.ANNOUNCEMENTS);
    
    // Sort by date (newest first)
    announcements.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (announcements.length === 0) {
        container.innerHTML = `
            <div class="no-announcements">
                <i class="fas fa-bullhorn"></i>
                <h3>No announcements yet</h3>
                <p>Check back later for updates</p>
            </div>
        `;
        return;
    }
    
    let html = '<div class="announcements-list">';
    
    announcements.forEach(announcement => {
        const date = new Date(announcement.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        html += `
            <div class="announcement-card ${announcement.category.toLowerCase()}">
                <div class="announcement-header">
                    <div class="announcement-category">${announcement.category}</div>
                    <div class="announcement-date">${date}</div>
                </div>
                <div class="announcement-body">
                    <h3 class="announcement-title">${announcement.title}</h3>
                    <div class="announcement-content">
                        ${announcement.content.replace(/\n/g, '<br>')}
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// You can also create specific display functions for other pages
function displayNews() {
    const container = document.getElementById('newsContainer');
    if (!container) return;
    
    const news = Storage.getAll(STORAGE_KEYS.NEWS);
    // Similar logic to displayAnnouncements
}

function displayVacancies() {
    const container = document.getElementById('vacanciesContainer');
    if (!container) return;
    
    const vacancies = Storage.getAll(STORAGE_KEYS.VACANCIES);
    // Similar logic to displayAnnouncements
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check which page we're on and load appropriate data
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'announcements.html':
            displayAnnouncements();
            break;
        case 'news.html':
            displayNews();
            break;
        case 'vacancy.html':
            displayVacancies();
            break;
        // Add more cases as needed
    }
});