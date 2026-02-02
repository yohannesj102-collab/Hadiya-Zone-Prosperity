// CRUD Operations for Announcements
let currentEditId = null;
let deleteItemId = null;

// Open announcement form
function openAnnouncementForm(announcement = null) {
    const formContainer = document.getElementById('announcementFormContainer');
    const formTitle = document.getElementById('formTitle');
    const submitBtn = document.getElementById('submitBtn');
    
    if (announcement) {
        // Edit mode
        formTitle.textContent = 'Edit';
        submitBtn.textContent = 'Update Announcement';
        
        document.getElementById('announcementId').value = announcement.id;
        document.getElementById('announcementTitle').value = announcement.title;
        document.getElementById('announcementCategory').value = announcement.category;
        document.getElementById('announcementDate').value = announcement.date;
        document.getElementById('announcementContent').value = announcement.content;
        
        currentEditId = announcement.id;
    } else {
        // Add mode
        formTitle.textContent = 'Add New';
        submitBtn.textContent = 'Add Announcement';
        
        document.getElementById('announcementForm').reset();
        document.getElementById('announcementId').value = '';
        document.getElementById('announcementDate').value = new Date().toISOString().split('T')[0];
        
        currentEditId = null;
    }
    
    formContainer.style.display = 'block';
    formContainer.scrollIntoView({ behavior: 'smooth' });
}

// Close announcement form
function closeAnnouncementForm() {
    document.getElementById('announcementFormContainer').style.display = 'none';
    document.getElementById('announcementForm').reset();
    currentEditId = null;
}

// Handle form submission
document.getElementById('announcementForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const announcementData = {
        title: document.getElementById('announcementTitle').value,
        category: document.getElementById('announcementCategory').value,
        date: document.getElementById('announcementDate').value,
        content: document.getElementById('announcementContent').value
    };
    
    if (currentEditId) {
        // Update existing announcement
        Storage.update(STORAGE_KEYS.ANNOUNCEMENTS, currentEditId, announcementData);
        showNotification('Announcement updated successfully!', 'success');
    } else {
        // Add new announcement
        Storage.add(STORAGE_KEYS.ANNOUNCEMENTS, announcementData);
        showNotification('Announcement added successfully!', 'success');
    }
    
    closeAnnouncementForm();
    loadAnnouncements();
});

// Load all announcements
function loadAnnouncements() {
    const announcements = Storage.getAll(STORAGE_KEYS.ANNOUNCEMENTS);
    const tableBody = document.getElementById('announcementsTableBody');
    const noDataMessage = document.getElementById('noDataMessage');
    const totalCount = document.getElementById('totalCount');
    
    // Sort by date (newest first)
    announcements.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (announcements.length === 0) {
        tableBody.innerHTML = '';
        noDataMessage.style.display = 'block';
        totalCount.textContent = '0 announcements';
        return;
    }
    
    noDataMessage.style.display = 'none';
    totalCount.textContent = `${announcements.length} announcement${announcements.length !== 1 ? 's' : ''}`;
    
    let tableHTML = '';
    
    announcements.forEach(announcement => {
        const createdDate = new Date(announcement.createdAt).toLocaleDateString();
        
        tableHTML += `
            <tr>
                <td>
                    <strong>${announcement.title}</strong>
                    <div class="preview-content">${announcement.content.substring(0, 100)}...</div>
                </td>
                <td><span class="category-badge ${announcement.category.toLowerCase()}">${announcement.category}</span></td>
                <td>${announcement.date}</td>
                <td>${createdDate}</td>
                <td>
                    <button class="btn-action edit" onclick="editAnnouncement(${announcement.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-action delete" onclick="openDeleteModal(${announcement.id}, '${announcement.title}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = tableHTML;
}

// Edit announcement
function editAnnouncement(id) {
    const announcement = Storage.getById(STORAGE_KEYS.ANNOUNCEMENTS, id);
    if (announcement) {
        openAnnouncementForm(announcement);
    }
}

// Open delete confirmation modal
function openDeleteModal(id, title) {
    deleteItemId = id;
    document.getElementById('deleteItemTitle').textContent = title;
    document.getElementById('deleteModal').style.display = 'flex';
}

// Close modal
function closeModal() {
    document.getElementById('deleteModal').style.display = 'none';
    deleteItemId = null;
}

// Confirm deletion
function confirmDelete() {
    if (deleteItemId) {
        Storage.delete(STORAGE_KEYS.ANNOUNCEMENTS, deleteItemId);
        showNotification('Announcement deleted successfully!', 'success');
        loadAnnouncements();
        closeModal();
    }
}

// Search announcements
function searchAnnouncements() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#announcementsTableBody tr');
    let visibleCount = 0;
    
    rows.forEach(row => {
        const title = row.querySelector('td:first-child strong').textContent.toLowerCase();
        const content = row.querySelector('.preview-content').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || content.includes(searchTerm)) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    // Show no results message
    if (visibleCount === 0 && searchTerm) {
        document.getElementById('noDataMessage').innerHTML = `
            <i class="fas fa-search"></i>
            <p>No announcements found for "${searchTerm}"</p>
        `;
        document.getElementById('noDataMessage').style.display = 'block';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Load announcements on page load
document.addEventListener('DOMContentLoaded', loadAnnouncements);