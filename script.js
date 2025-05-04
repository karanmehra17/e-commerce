// Initialize cart and wishlist
let cart = [];
let wishlist = [];
let products = [];
let currentProductId = null;
let selectedSize = null;

// Fetch products from Fake Store API
async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        products = await response.json();
        displayProducts();
    } catch (error) {
        console.error('Error fetching products:', error);
        const productsGrid = document.querySelector('.products-grid');
        productsGrid.innerHTML = '<p class="error">Error loading products. Please try again later.</p>';
    }
}

// Tab switching functionality
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(button.dataset.tab).classList.add('active');
    });
});

// Display products
function displayProducts() {
    const productsGrid = document.querySelector('.products-grid');
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p class="category">${product.category}</p>
            <p class="price">$${product.price.toFixed(2)}</p>
            <p class="rating">Rating: ${product.rating.rate} (${product.rating.count} reviews)</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
            <button onclick="addToWishlist(${product.id})">Add to Wishlist</button>
            <button onclick="showProductDetails(${product.id})">View Details</button>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Show product details
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        currentProductId = productId;
        selectedSize = null;
        
        // Update product details
        document.getElementById('details-image').src = product.image;
        document.getElementById('details-title').textContent = product.title;
        document.getElementById('details-category').textContent = product.category;
        document.getElementById('details-price').textContent = `$${product.price.toFixed(2)}`;
        document.getElementById('details-rating').textContent = `Rating: ${product.rating.rate}`;
        document.getElementById('details-reviews').textContent = `(${product.rating.count} reviews)`;
        document.getElementById('details-description').textContent = product.description;
        
        // Reset size selection
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.classList.remove('selected', 'unavailable');
            btn.disabled = false;
        });
        
        // Switch to product details tab
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById('product-details').classList.add('active');
    }
}

// Go back to products
function goBackToProducts() {
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById('products').classList.add('active');
}

// Initialize size selection
document.querySelectorAll('.size-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Remove selected class from all buttons
        document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('selected'));
        
        // Add selected class to clicked button
        button.classList.add('selected');
        selectedSize = button.dataset.size;
    });
});

// Add to cart from details
function addToCartFromDetails() {
    if (currentProductId) {
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }
        const product = products.find(p => p.id === currentProductId);
        if (product) {
            const productWithSize = {
                ...product,
                size: selectedSize
            };
            cart.push(productWithSize);
            updateCart();
            updateTotal();
            updateCartCount();
            alert(`Added ${product.title} (Size: ${selectedSize}) to cart`);
        }
    }
}

// Add to wishlist from details
function addToWishlistFromDetails() {
    if (currentProductId) {
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }
        const product = products.find(p => p.id === currentProductId);
        if (product && !wishlist.find(p => p.id === currentProductId)) {
            const productWithSize = {
                ...product,
                size: selectedSize
            };
            wishlist.push(productWithSize);
            updateWishlist();
            updateWishlistCount();
            alert(`Added ${product.title} (Size: ${selectedSize}) to wishlist`);
        }
    }
}

// Update cart count in header
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cart.length;
}

// Update wishlist count in header
function updateWishlistCount() {
    const wishlistCount = document.getElementById('wishlist-count');
    wishlistCount.textContent = wishlist.length;
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCart();
        updateTotal();
        updateCartCount();
    }
}

// Add to wishlist
function addToWishlist(productId) {
    const product = products.find(p => p.id === productId);
    if (product && !wishlist.find(p => p.id === productId)) {
        wishlist.push(product);
        updateWishlist();
        updateWishlistCount();
    }
}

// Update cart display
function updateCart() {
    const cartItems = document.querySelector('.cart-items');
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
            <div class="cart-item-details">
                <span>${item.title}</span>
                <span>Size: ${item.size}</span>
                <span>$${item.price.toFixed(2)}</span>
            </div>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItems.appendChild(cartItem);
    });
}

// Update wishlist display
function updateWishlist() {
    const wishlistItems = document.querySelector('.wishlist-items');
    wishlistItems.innerHTML = '';
    
    wishlist.forEach(item => {
        const wishlistItem = document.createElement('div');
        wishlistItem.className = 'wishlist-item';
        wishlistItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="wishlist-item-image">
            <div class="wishlist-item-details">
                <span>${item.title}</span>
                <span>Size: ${item.size}</span>
                <span>$${item.price.toFixed(2)}</span>
            </div>
            <button onclick="removeFromWishlist(${item.id})">Remove</button>
        `;
        wishlistItems.appendChild(wishlistItem);
    });
}

// Update total
function updateTotal() {
    const totalItems = document.getElementById('total-items');
    const totalPrice = document.getElementById('total-price');
    
    totalItems.textContent = cart.length;
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalPrice.textContent = total.toFixed(2);
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    updateTotal();
    updateCartCount();
}

// Remove from wishlist
function removeFromWishlist(productId) {
    wishlist = wishlist.filter(item => item.id !== productId);
    updateWishlist();
    updateWishlistCount();
}

// Header button click handler
document.querySelectorAll('.header-btn').forEach(button => {
    button.addEventListener('click', () => {
        const tab = button.dataset.tab;
        // Remove active class from all buttons and contents
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Add active class to corresponding tab button and content
        document.querySelector(`.tab-btn[data-tab="${tab}"]`).classList.add('active');
        document.getElementById(tab).classList.add('active');
    });
});

// Initialize the page
fetchProducts();
updateCart();
updateWishlist();
updateTotal();
updateCartCount();
updateWishlistCount(); 