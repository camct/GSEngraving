Ecwid.OnAPILoaded.add(function() {
    Ecwid.OnPageLoaded.add(function(page) {
      console.log('Page type is', page.type, "!!!");
      if (page.type === 'PRODUCT') {
          console.log(page.productId);
          const productIds = [55001151, 74102380, 506210440, 570262509, 94782479];
  
          // Check if the current product ID is in the allowed list
          if (!productIds.includes(page.productId)) {return;}
  
          const basePrices = {55001151: 119.95, 74102380: 131.95, 506210440: 136.95, 570262509: 119.95, 94782479: 71.00};
          const basePrice = basePrices[page.productId];
  
          // Find the engraving input field
          const engravingInput1 = document.querySelector("input[aria-label='Engraving - Ski Pole 1']");
          const engravingInput2 = document.querySelector("input[aria-label='Engraving - Ski Pole 2']");
          const addMoreDiv = document.querySelector(".form-control.form-control--button.form-control--large.form-control--secondary.form-control--flexible.form-control--animated.form-control--done.details-product-purchase__add-more");
          const addToBagDiv = document.querySelector(".form-control.form-control--button.form-control--large.form-control--primary.form-control--flexible.form-control--animated.form-control--done.details-product-purchase__add-to-bag");
  
          // Function to update the price
          function updatePrice() {
            try {
              const engravingText1 = engravingInput1 ? engravingInput1.value : '';
              const engravingText2 = engravingInput2 ? engravingInput2.value : '';
  
              // STRAP
              const strapRadio = document.querySelector("input[name='Strap']:checked");
              const strapValue = strapRadio ? strapRadio.value : '';
  
              // GRIP COLOR
              const gripColorElement = document.querySelector('.product-details-module.details-product-option.details-product-option--select.details-product-option--Grip-Color');
              const gripColorWindow = gripColorElement ? gripColorElement.querySelector('.form-control--select.form-control.form-control--flexible') : null;
              const gripColorSelect = gripColorWindow ? gripColorWindow.querySelector('.form-control__select') : null;
              const gripColorValue = gripColorSelect ? gripColorSelect.value : '';
  
              const ind=[0,18,18,18,18,18,18,19.75,19.75,21.5,21.5,23.25,23.25,25,25,26.75,26.75,28.5,28.5,30.25,30.25,32,32,33.75,33.75,35.5,35.5,37.25,37.25,39,39,40.75,40.75,42.5,42.5,44.25,44.25,46,46,47.75,47.75];
  
              const charCount = engravingText1.length + engravingText2.length;
              const engravingCost = ind[charCount];
  
              // Update the displayed price
              const priceElement = document.querySelector('.details-product-price__value.ec-price-item.notranslate');
              const gripPrice = (gripColorValue === 'Cork') ? 14 : 0;
              let strapPrice;
              if (strapValue === 'None') {strapPrice = -3;}
              else if (strapValue === 'Adjustable') {strapPrice = 10;}
              else if (strapValue === 'Fixed') {strapPrice = 0;}
              else {strapPrice = 19.99;}
              const newPrice = basePrice + engravingCost + gripPrice + strapPrice;
  
              if (priceElement) {
                  priceElement.textContent = `$${newPrice.toFixed(2)}`;
                  console.log(`price being updated to $${newPrice.toFixed(2)}`);
              }
            }
            catch (error) {
              console.error('Error updating price:', error);
            }
          }
  
          // Function to update product options on add to cart
          function handleAddToCart(event) {
            return new Promise((resolve, reject) => {
              console.log("handle add to cart active");
              event.preventDefault();  // Prevent the default add to cart behavior
              
              // Engraving
              const customEngraving = ['0', '1-6', '1-6', '1-6', '1-6', '1-6', '1-6', '7-8', '7-8', '9-10', '9-10', '11-12', '11-12', '13-14', '13-14', '15-16', '15-16', '17-18', '17-18', '19-20', '19-20', '21-22', '21-22', '23-24', '23-24', '25-26', '25-26', '27-28', '27-28', '29-30', '29-30', '31-32', '31-32', '33-34', '33-34', '35-36', '35-36', '37-38', '37-38', '39-40', '39-40'];
              const engravingText1 = engravingInput1 ? engravingInput1.value : '';
              const engravingText2 = engravingInput2 ? engravingInput2.value : '';
              const charCount = engravingText1.length + engravingText2.length;
              const engravingCost = customEngraving[charCount];
              console.log('engraving cost:', engravingCost);
  
              // BASKET SIZE
              const basketSizeElement = document.querySelector('.product-details-module.details-product-option.details-product-option--select.details-product-option--Basket-Size');
              const basketSizeWindow = basketSizeElement ? basketSizeElement.querySelector('.form-control--select.form-control.form-control--flexible') : null;
              const basketSizeSelect = basketSizeWindow ? basketSizeWindow.querySelector('.form-control__select') : null;
              const basketSizeValue = basketSizeSelect ? basketSizeSelect.value : '';
              const basketSizeMenu = { 'Tiny Disc- 2" (black only)': 0, 'Medium Basket- 4"': 1, 'Huge Powder Basket- 4.75" (black only)': 2 };
              const basketSize = basketSizeMenu[basketSizeValue] || 1;
              console.log("basket size:", basketSize);
  
              // GRIP COLOR
              const gripColorElement = document.querySelector('.product-details-module.details-product-option.details-product-option--select.details-product-option--Grip-Color');
              const gripColorWindow = gripColorElement ? gripColorElement.querySelector('.form-control--select.form-control.form-control--flexible') : null;
              const gripColorSelect = gripColorWindow ? gripColorWindow.querySelector('.form-control__select') : null;
              const gripColorValue = gripColorSelect ? gripColorSelect.value : '';
              const gripColorMenu = { 'Black': 0, 'Cork': 1, 'Blue': 2, 'Green': 3, 'Pink': 4, 'Purple': 5, 'Orange': 6, 'Red': 7, 'Turquoise': 8 };
              const gripColor = gripColorMenu[gripColorValue] || 2;
              console.log("grip color:", gripColor);
  
              // BASKET COLOR
              const basketColorElement = document.querySelector('.product-details-module.details-product-option.details-product-option--select.details-product-option--Basket-Color');
              const basketColorWindow = basketColorElement ? basketColorElement.querySelector('.form-control--select.form-control.form-control--flexible') : null;
              const basketColorSelect = basketColorWindow ? basketColorWindow.querySelector('.form-control__select') : null;
              const basketColorValue = basketColorSelect ? basketColorSelect.value : '';
              const basketColorMenu = { 'Black': 0, 'White': 1, 'Transparent': 2, 'Blue': 3, 'Green': 4, 'Pink': 5, 'Purple': 6, 'Orange': 7, 'Red': 8, 'Turquiose': 9 };
              const basketColor = basketColorMenu[basketColorValue] || 0;
              console.log("basket color:", basketColor);
  
              // STRAP
              const strapRadio = document.querySelector("input[name='Strap']:checked");
              const strapValue = strapRadio ? strapRadio.value : '';
              const strapMenu = { 'Salida Magic': 0, 'Autumn': 1, 'Bridgers': 2, 'Mount Tam': 3, 'Flow': 4, 'Idaho 9': 5, 'Dark Side': 6, 'Lone Peak': 7, 'Teton': 8, 'The Grand': 9, 'Spanish Peaks': 10, 'Adjustable': 11, 'Fixed': 12, 'None': 13 };
              const strap = strapMenu[strapValue] || 12;
              console.log("strap:", strap);
  
              // Length
              const lengthInput = document.querySelector("input[aria-label='Length (cm or inches)']");
              const lengthInputVal = lengthInput ? lengthInput.value : '';
              console.log('length:', lengthInputVal);
              if (lengthInputVal === '') {
                console.log('Length input not present');
                return reject(new Error('Length input is required'));
              }
  
              // Quantity
              const quantityCheck = document.querySelector("input[name='ec-qty']");
              let quantityValue = quantityCheck ? parseInt(quantityCheck.value, 10) : 1;
              if (isNaN(quantityValue)) {
                  quantityValue = 1;
                  console.log('quantity default is not a number');
              }
              console.log('quantity:', quantityValue, 'and type:', typeof quantityValue);
  
              // Prepare the product options to include the engraving cost
              const options = {
                  'Basket Size': `${basketSize}`,
                  'Grip Color': `${gripColor}`,
                  'Basket Color': `${basketColor}`,
                  'Strap': `${strap}`,
                  'Engraving': `${engravingCost}`,
                  'Length (cm or inches)': `${lengthInputVal}`,
                  'Engraving - Ski Pole 1': `${engravingText1}`,
                  'Engraving - Ski Pole 2': `${engravingText2}`
              };
              console.log('options', options);
              console.log('quantity:', quantityValue);
              
              // Add the product to the cart with the engraving option
              Ecwid.Cart.addProduct({
                  id: page.productId,
                  quantity: quantityValue,
                  options: options,
                  callback: function(success, product, cart, error) {
                    console.log('success', success);
                    console.log('product:', product);
                    console.log('cart:', cart);
                    console.log('error:', error);
                    
                    if (success) {
                      resolve(product);
                    } else {
                      reject(error || new Error('Failed to add product to cart'));
                    }
                  }
              });
            });
          }

          function handleRemoveFromCart() {
            return new Promise(resolve => {
                Ecwid.Cart.removeProduct(-1);
                console.log('Product removed from cart');
                resolve();
              });
          }
  
          // Attach event listeners
          if (engravingInput1) {
              engravingInput1.addEventListener('input', updatePrice);
          }
          if (engravingInput2) {
              engravingInput2.addEventListener('input', updatePrice);
          }
  
          // Add listener for strap selection
          const strapRadios = document.querySelectorAll("input[name='Strap']");
          strapRadios.forEach(radio => {
              radio.addEventListener('change', updatePrice);
          });
  
          // Add listener for grip color selection
          const gripColorElement = document.querySelector('.product-details-module.details-product-option.details-product-option--select.details-product-option--Grip-Color');
          const gripColorWindow = gripColorElement ? gripColorElement.querySelector('.form-control--select.form-control.form-control--flexible') : null;
          const gripColorSelect = gripColorWindow ? gripColorWindow.querySelector('.form-control__select') : null;
          if (gripColorSelect) {
              gripColorSelect.addEventListener('change', updatePrice);
          }
          
          // Initial call to set the price when the page loads
          updatePrice();
  
          // Attach the click event listener to the Add to Cart button
          if (addToBagDiv) {
            const addToCartButton = addToBagDiv.querySelector(".form-control__button.form-control__button--icon-center");
            if (addToCartButton) {
              console.log('Add to Bag button present');
              addToCartButton.addEventListener('click', async (event) => {
                try {
                  await handleAddToCart(event);
                  console.log('Product added to cart successfully');
                  await handleRemoveFromCart();
                  console.log('Product removed from cart');
                } catch (error) {
                  console.error('Error handling add to cart:', error);
                }
              });
            }
          }
          if (addMoreDiv) {
            const addMoreButton = addMoreDiv.querySelector(".form-control__button.form-control__button--icon-center");
            if (addMoreButton) {
              console.log('Add More button present');
              addMoreButton.addEventListener('click', async (event) => {
                try {
                  await handleAddToCart(event);
                  console.log('Product added to cart successfully');
                  await handleRemoveFromCart();
                  console.log('Product removed from cart');
                } catch (error) {
                  console.error('Error handling add to cart:', error);
                }
              });
            }
          }
      }
    });
  });
