// Storage keys for different content types
const STORAGE_KEYS = {
    ANNOUNCEMENTS: 'hadiya_announcements',
    NEWS: 'hadiya_news',
    VACANCIES: 'hadiya_vacancies',
    EVENTS: 'hadiya_events',
    PRESS: 'hadiya_press',
    ADMIN_CREDENTIALS: 'hadiya_admin_credentials'
};

// Initialize default admin credentials if not exists
function initializeAdmin() {
    if (!localStorage.getItem(STORAGE_KEYS.ADMIN_CREDENTIALS)) {
        const defaultAdmin = {
            username: 'admin',
            password: 'hadiya123', // You should change this
            lastLogin: null
        };
        localStorage.setItem(STORAGE_KEYS.ADMIN_CREDENTIALS, JSON.stringify(defaultAdmin));
    }
    
    // Initialize empty arrays for each content type if not exists
    Object.values(STORAGE_KEYS).forEach(key => {
        if (key !== STORAGE_KEYS.ADMIN_CREDENTIALS && !localStorage.getItem(key)) {
            localStorage.setItem(key, JSON.stringify([]));
        }
    });
}

// CRUD Operations
const Storage = {
    // Get all items of a type
    getAll: (type) => {
        const data = localStorage.getItem(type);
        return data ? JSON.parse(data) : [];
    },
    
    // Add new item
    add: (type, item) => {
        const items = Storage.getAll(type);
        item.id = Date.now(); // Simple ID based on timestamp
        item.createdAt = new Date().toISOString();
        items.push(item);
        localStorage.setItem(type, JSON.stringify(items));
        return item;
    },
    
    // Update item
    update: (type, id, updates) => {
        const items = Storage.getAll(type);
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
            localStorage.setItem(type, JSON.stringify(items));
            return items[index];
        }
        return null;
    },
    
    // Delete item
    delete: (type, id) => {
        const items = Storage.getAll(type);
        const filtered = items.filter(item => item.id !== id);
        localStorage.setItem(type, JSON.stringify(filtered));
        return true;
    },
    
    // Get single item
    getById: (type, id) => {
        const items = Storage.getAll(type);
        return items.find(item => item.id === id);
    }
};

// Initialize on load
window.addEventListener('DOMContentLoaded', initializeAdmin);
// Image handling functions (stores images as Base64 in localStorage)
const ImageStorage = {
    // Store image as Base64
    uploadImage: (file) => {
        return new Promise((resolve, reject) => {
            if (!file.type.match('image.*')) {
                reject('File is not an image');
                return;
            }
            
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const imageData = {
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    data: e.target.result,
                    uploadedAt: new Date().toISOString()
                };
                
                // Get existing images or initialize array
                const existingImages = JSON.parse(localStorage.getItem('hadiya_images') || '[]');
                imageData.id = 'img_' + Date.now();
                existingImages.push(imageData);
                
                // Store in localStorage (be careful with size limits)
                localStorage.setItem('hadiya_images', JSON.stringify(existingImages));
                
                resolve({
                    id: imageData.id,
                    url: imageData.data,
                    name: file.name
                });
            };
            
            reader.onerror = () => {
                reject('Error reading file');
            };
            
            reader.readAsDataURL(file);
        });
    },
    
    // Get all uploaded images
    getAllImages: () => {
        return JSON.parse(localStorage.getItem('hadiya_images') || '[]');
    },
    
    // Delete image
    deleteImage: (id) => {
        const images = ImageStorage.getAllImages();
        const filtered = images.filter(img => img.id !== id);
        localStorage.setItem('hadiya_images', JSON.stringify(filtered));
        return true;
    }
};
// Update the STORAGE_KEYS object in storage.js
