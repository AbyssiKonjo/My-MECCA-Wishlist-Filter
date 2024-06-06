/* jshint esversion: 6 */
$(document).ready(function () {
    // FULLPAGE Initialisation
    new fullpage('#fullpage', {
        // license
        licenseKey: 'gplv3-license', // Open Source Free license
        //options here
        autoScrolling: true,
        scrollHorizontally: true,
        // turn on navigation arrows:
        // navigation: true, // comment out or remove to remove nav arrows    
        controlArrows: false,
        // Specificy all fixed elements:
        fixedElements:'#fixedNav'
    });

    fullpage_api.setAllowScrolling(false); // prevent scroll of sections and slides

    //  Function to move to the specified section
    function moveToSection(number) {
        fullpage_api.silentMoveTo(number); // allows you to move sections or "jump"
    }

    $('#goToHome').click(function() {
        moveToSection(1);
    });

    $('#goToAddProduct, #navGoToAddProduct').click(function() {
        moveToSection(2);
    });

    $('#goToAccountDetails').click(function() {
        moveToSection(3);
    });

    $('#goToWishlist').click(function() {
        moveToSection(4);
    });

    $('#goToCart').click(function() {
        moveToSection(5);
    });

    // Fetch products and initialize filters
    fetchProducts();

    // Handle form submission
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', function(event) {
            event.preventDefault();
            addProduct();
        });
    } else {
        console.error('Product form element not found');
    }

    // ------****** FORM SUBMISSION *****-------
    function fetchProducts() {
        console.log('Fetching data...');
        fetch('data/products.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Data fetched:', data); // Log the data to see if it is correct
                window.products = data;
                filterAndPopulateResults(); // Call the function after fetching data
            })
            .catch(error => console.error('Fetch error:', error)); // Log any fetch errors
    }

    // Function to add a new product
    function addProduct() {
        const formData = new FormData(productForm);
        const newProduct = {
            brandName: formData.get('brandName'),
            productName: formData.get('productName'),
            price: parseFloat(formData.get('price')),
            available: formData.get('available'),
            shade: formData.get('shade'),
            category: formData.get('category'),
            image: formData.get('image')
        };
        console.log('Adding product:', newProduct);

        // Add the new product to the products array
        window.products.push(newProduct);

        // Update the UI with the new product list
        filterAndPopulateResults();
    }

    // Filter input elements
    const filter = document.getElementById("filterName");
    if (filter) {
        // Event listeners for filters
        filter.addEventListener("input", filterAndPopulateResults);
    } else {
        console.error('Filter input element not found');
    }

    // Filter cards based on filter input
    function filterCards() {
        const filter = document.getElementById("filterName");
        if (!window.products) {
            console.error('Products not loaded');
            return [];
        }

        return window.products.filter(product => {
            // Check if category matches
            if (filter.value && !product.category.toLowerCase().includes(filter.value.toLowerCase())) {
                return false;
            }
            return true;
        });
    }
    
    // Filter and then Populate Results
    function filterAndPopulateResults() {
        const filteredProducts = filterCards();
        console.log('Filtered products:', filteredProducts);
        populateResults(filteredProducts);
    }
    
    // Populate card container with filtered products
    function populateResults(filteredResults) {
        const cardContainer = document.getElementsByClassName('card-container')[0];
        cardContainer.innerHTML = "";
        
        if (filteredResults.length === 0) {
            cardContainer.innerHTML = `<p class="no-results">No Results Found</p>`;
        } else {
            filteredResults.forEach(product => {
                const productsCardHTML = `
                    <div class="card">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="product-details">
                            <h4>${product.brandName}</h4>
                            <h3>${product.productName}</h3>
                            <h4>$${product.price.toFixed(2)}</h4>
                            <p>Shade: ${product.shade}</p>
                        </div>
                    </div>
                `;
                cardContainer.innerHTML += productsCardHTML;
            });
        }
    }
    
});
