// Configuration
const apiKey = 'AIzaSyB3GGP7EVVaN4MAd-fWYMZrLdyA4gqfXp8';
const apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=';
const defaultSearchTerm = 'javascript';

// DOM Elements
const bookList = document.getElementById('bookList');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const loadingIndicator = document.getElementById('loadingIndicator');

// Initialize the app
function init() {
    // Set up event listeners
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    // Load default books
    fetchBooks(defaultSearchTerm);
}

// Handle search functionality
function handleSearch() {
    const searchTerm = searchInput.value.trim() || defaultSearchTerm;
    fetchBooks(searchTerm);
}

// Fetch books from API
function fetchBooks(searchTerm) {
    showLoading(true);
    bookList.innerHTML = '';
    
    const xhr = new XMLHttpRequest();
    const url = `${apiUrl}${encodeURIComponent(searchTerm)}&key=${apiKey}`;
    
    xhr.open('GET', url);
    xhr.send();
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                displayBooks(response.items || []);
            } catch (error) {
                displayError('Error parsing book data');
                console.error('Parsing error:', error);
            }
        } else {
            displayError(`API request failed with status ${xhr.status}`);
            console.error('API error:', xhr.statusText);
        }
        showLoading(false);
    };
    
    xhr.onerror = function() {
        displayError('Network error occurred');
        console.error('Network error');
        showLoading(false);
    };
}

// Display books in the UI
function displayBooks(books) {
    if (books.length === 0) {
        bookList.innerHTML = '<li class="no-results">No books found. Try a different search term.</li>';
        return;
    }
    
    books.forEach(book => {
        const volumeInfo = book.volumeInfo || {};
        const title = volumeInfo.title || 'No Title';
        const link = volumeInfo.infoLink || '#';
        const image = volumeInfo.imageLinks?.thumbnail || '';
        const authors = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author';
        
        const bookElement = document.createElement('li');
        bookElement.className = 'book-item';
        bookElement.innerHTML = `
            <div class="book-card">
                ${image ? `<img src="${image}" alt="${title}" class="book-cover">` : ''}
                <div class="book-details">
                    <h3 class="book-title">
                        <a href="${link}" target="_blank" rel="noopener noreferrer">${title}</a>
                    </h3>
                    <p class="book-author">${authors}</p>
                </div>
            </div>
        `;
        
        bookList.appendChild(bookElement);
    });
}

// Show error message
function displayError(message) {
    bookList.innerHTML = `<li class="error">${message}</li>`;
}

// Toggle loading indicator
function showLoading(show) {
    loadingIndicator.hidden = !show;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', init);