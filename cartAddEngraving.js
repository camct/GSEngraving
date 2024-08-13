Ecwid.OnAPILoaded.add(function() {
    console.log('onApiLoaded Works')
  Ecwid.OnPageLoaded.add(function(page) {
    console.log('OnPageLoaded works')
    if (page.type === 'PRODUCT') {
    var productIds = ['55001151', '74102380', '506210440', '570262509', '94782479']

    // Check if the current product ID is in the allowed list
    if (!productIds.includes(page.productId)) {return;}

    // Find the engraving input field
    var engravingInput1 = document.querySelector("input[aria-label='Engraving - Ski Pole 1']");
    var engravingInput2 = document.querySelector("input[aria-label='Engraving - Ski Pole 2']");
    var addMoreDiv = document.querySelector(".form-control.form-control--button.form-control--large.form-control--secondary.form-control--flexible.form-control--animated.details-product-purchase__add-more.form-control__button--icon-center.form-control--done"); // Adjust the selector based on your theme
    var addToCartDiv = document.querySelector(".form-control.form-control--button.form-control--large.form-control--primary.form-control--flexible.form-control--animated.details-product-purchase__add-to-bag.form-control__button--icon-center.form-control--done")

    // Function to update the price
    function updatePrice() {
        console.log('In the price updater')
        var engravingText1 = engravingInput1 ? engravingInput1.value : '';  // Get the engraving text
        var engravingText2 = engravingInput2 ? engravingInput2.value : '';  // Get the engraving text
        const ind=[0,18,18,18,18,18,18,19.75,19.75,21.5,21.5,23.25,23.25,25,25,26.75,26.75,28.5,28.5,30.25,30.25,32,32,33.75,33.75,35.5,35.5,37.25,37.25,39,39,40.75,40.75,42.5,42.5,44.25,44.25,46,46,47.75,47.75]

        var charCount = engravingText1.length + engravingText2.length;  // Count the number of characters
        var engravingCost = ind[charCount];  // Calculate the additional cost

        // Update the displayed price
        var priceElement = document.querySelector('.details-product-price__value.ec-price-item.notranslate');
        var basePrice = priceElement ? parseFloat(priceElement.textContent.replace(/[^0-9.]/g, '')) : 0; // Convert price to float
        var newPrice = basePrice + engravingCost;  // Calculate the new price

        if (priceElement) {
            priceElement.textContent = `$${newPrice.toFixed(2)}`;
            console.log('price being updated')
        }
        }

        // Attach the input event listener to the engraving input
    if (engravingInput1 || engravingInput2) {
        engravingInput1.addEventListener('input', updatePrice);
        engravingInput2.addEventListener('input', updatePrice);
    }
      
    // Initial call to set the price when the page loads
    updatePrice();

    // Function to update product options on add to cart
    function handleAddToCart(event) {
        console.log("handle add to cart active")
        event.preventDefault();  // Prevent the default add to cart behavior
        
        // Engraving
        const customEngraving = ['0', '1-6', '1-6', '1-6', '1-6', '1-6', '1-6', '7-8', '7-8', '9-10', '9-10', '11-12', '11-12', '13-14', '13-14', '15-16', '15-16', '17-18', '17-18', '19-20', '19-20', '21-22', '21-22', '23-24', '23-24', '25-26', '25-26', '27-28', '27-28', '29-30', '29-30', '31-32', '31-32', '33-34', '33-34', '35-36', '35-36', '37-38', '37-38', '39-40', '39-40'];
        var engravingText1 = engravingInput1 ? engravingInput1.value : '';  // Get the engraving text
        var engravingText2 = engravingInput2 ? engravingInput2.value : '';  // Get the engraving text
        var charCount = engravingText1.length + engravingText2.length;  // Count the number of characters
        var engravingCost = customEngraving[charCount];  // Calculate the additional cost

        // BASKET SIZE
        const basketSizeElement = document.querySelector('.product-details-module.details-product-option.details-product-option--select.details-product-option--Basket-Size');
        const basketSizeWindow = basketSizeElement ? basketSizeElement.querySelector('.form-control--select.form-control.form-control--flexible') : null;
        const basketSizeSelect = basketSizeWindow ? basketSizeWindow.querySelector('.form-control__select') : null;
        const basketSizeValue = basketSizeSelect ? basketSizeSelect.value : '';
        const basketSizeMenu = { 'Tiny Disc- 2" (black only)': 0, 'Medium Basket- 4"': 1, 'Huge Powder Basket- 4.75" (black only)': 2 };
        const basketSize = basketSizeMenu[basketSizeValue] || 1;

        // GRIP COLOR
        const gripColorElement = document.querySelector('.product-details-module.details-product-option.details-product-option--select.details-product-option--Grip-Color');
        const gripColorWindow = gripColorElement ? gripColorElement.querySelector('.form-control--select.form-control.form-control--flexible') : null;
        const gripColorSelect = gripColorWindow ? gripColorWindow.querySelector('.form-control__select') : null;
        const gripColorValue = gripColorSelect ? gripColorSelect.value : '';
        const gripColorMenu = { 'Black': 0, 'Cork': 1, 'Blue': 2, 'Green': 3, 'Pink': 4, 'Purple': 5, 'Orange': 6, 'Red': 7, 'Turquoise': 8 };
        const gripColor = gripColorMenu[gripColorValue] || 2;

        // BASKET COLOR
        const basketColorElement = document.querySelector('.product-details-module.details-product-option.details-product-option--select.details-product-option--Basket-Color');
        const basketColorWindow = basketColorElement ? basketColorElement.querySelector('.form-control--select.form-control.form-control--flexible') : null;
        const basketColorSelect = basketColorWindow ? basketColorWindow.querySelector('.form-control__select') : null;
        const basketColorValue = basketColorSelect ? basketColorSelect.value : '';
        const basketColorMenu = { 'Black': 0, 'White': 1, 'Transparent': 2, 'Blue': 3, 'Green': 4, 'Pink': 5, 'Purple': 6, 'Orange': 7, 'Red': 8, 'Turquiose': 9 };
        const basketColor = basketColorMenu[basketColorValue] || 0;

        // STRAP
        const strapRadio = document.querySelector("input[name='Strap']:checked");
        const strapValue = strapRadio ? strapRadio.value : '';
        const strapMenu = { 'Salida Magic': 0, 'Autumn': 1, 'Bridgers': 2, 'Mount Tam': 3, 'Flow': 4, 'Idaho 9': 5, 'Dark Side': 6, 'Lone Peak': 7, 'Teton': 8, 'The Grand': 9, 'Spanish Peaks': 10, 'Adjustable': 11, 'Fixed': 12, 'None': 13 };
        const strap = strapMenu[strapValue] || 12;

        // Length
        const lengthInput = document.querySelector("input[aria-label='Length (cm or inches)']");
        const lengthInputVal = lengthInput ? lengthInput.value : '';

        // Quantity
        const quantityCheck = document.querySelector("input[name='ec-qty']")
        const quantityValue = quantityCheck ? quantityCheck.value : 1;

        // Prepare the product options to include the engraving cost
        var options = {
            'Basket Size' : `${basketSize}`,
            'Grip Color' : `${gripColor}`,
            'Basket Color' : `${basketColor}`,
            'Strap' : `${strap}`,
            'Engraving' : `${engravingCost}`,
            'Length (cm or inches)' : `${lengthInputVal}`,
            'Engraving - Ski Pole 1' : `${engravingText1}`,
            'Engraving - Ski Pole 2' : `${engravingText2}`
        }
        console.log('options', options)
        console.log('quantity:', quantity)
        
        // Add the product to the cart with the engraving option
        Ecwid.Cart.removeProduct(-1);
        Ecwid.Cart.addProduct({
            id: page.productId,
            quantity: quantityValue,
            options: options,
            callback: function(success, product, cart, error) {
                console.log('success', success)
                console.log('product:', product)
                console.log('cart:', cart)
                console.log('error:', error)
            }
        });
    }

    // Attach the click event listener to the Add to Cart button
    if (addToCartDiv) {
        var addToCartButton = addToCartDiv.querySelector(".form-control__button")
        if (addToCartButton) {
            console.log('Add to Bag button present')
            addToCartButton.addEventListener('click', handleAddToCart);
        }
    }
    if (addMoreDiv) {
        var addMoreButton = addMoreDiv.querySelector(".form-control__button")
        if (addMoreButton) {
            console.log('Add More button present')
            addMoreButton.addEventListener('click',handleAddToCart)
        }
    }
    }
  })
});