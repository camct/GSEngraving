Ecwid.OnAPILoaded.add(function() {
    Ecwid.OnPageLoaded.add(function(page) {
      if (page.type === 'PRODUCT') {
          console.log(page.productId);
          const productIds = [55001151, 74102380, 506210440, 570262509, 94782479];
          let cartUpdateProduct = null;
  
          // Check if the current product ID is in the allowed list
          if (!productIds.includes(page.productId)) {return;}
  
          const basePrices = {55001151: 119.95, 74102380: 131.95, 506210440: 136.95, 570262509: 119.95, 94782479: 71.00};
          const basePrice = basePrices[page.productId];
  
          // Find the engraving input field
          const engravingInput1 = document.querySelector("input[aria-label='Engraving - Ski Pole 1']");
          const engravingInput2 = document.querySelector("input[aria-label='Engraving - Ski Pole 2']");
          const addMoreDiv = document.querySelector(".details-product-purchase__add-more");
          const addToBagDiv = document.querySelector(".details-product-purchase__add-to-bag");
          
          // ------------------------- FUNCTIONS ------------------------- 
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
  
              // BASKET SIZE
              const basketSizeSelect = document.querySelector('.details-product-option--Basket-Size select');
              const basketSizeValue = basketSizeSelect ? basketSizeSelect.value : '';
              // const basketSizeMenu = { 'Tiny Disc- 2" (black only)': 0, 'Medium Basket- 4"': 1, 'Huge Powder Basket- 4.75" (black only)': 2 };
              // const basketSize = basketSizeMenu[basketSizeValue] !== undefined ? basketSizeMenu[basketSizeValue] : 1;
  
              // GRIP COLOR
              const gripColorSelect = document.querySelector('.details-product-option--Grip-Color select');
              const gripColorValue = gripColorSelect ? gripColorSelect.value : '';
              // const gripColorMenu = { 'Black': 0, 'Cork': 1, 'Blue': 2, 'Green': 3, 'Pink': 4, 'Purple': 5, 'Orange': 6, 'Red': 7, 'Turquoise': 8 };
              // const gripColor = gripColorMenu[gripColorValue] !== undefined ? gripColorMenu[gripColorValue] : 2;
  
              // BASKET COLOR
              const basketColorSelect = document.querySelector('.details-product-option--Basket-Color select');
              const basketColorValue = basketColorSelect ? basketColorSelect.value : '';
              // const basketColorMenu = { 'Black': 0, 'White': 1, 'Transparent': 2, 'Blue': 3, 'Green': 4, 'Pink': 5, 'Purple': 6, 'Orange': 7, 'Red': 8, 'Turquiose': 9 };
              // const basketColor = basketColorMenu[basketColorValue] !== undefined ? basketColorMenu[basketColorValue] : 0;
  
              // STRAP
              const strapRadio = document.querySelector("input[name='Strap']:checked");
              const strapValue = strapRadio ? strapRadio.value : '';
              // const strapMenu = { 'Salida Magic': 0, 'Autumn': 1, 'Bridgers': 2, 'Mount Tam': 3, 'Flow': 4, 'Idaho 9': 5, 'Dark Side': 6, 'Lone Peak': 7, 'Teton': 8, 'The Grand': 9, 'Spanish Peaks': 10, 'Adjustable': 11, 'Fixed': 12, 'None': 13 };
              // const strap = strapMenu[strapValue] !== undefined ? strapMenu[strapValue] : 12;
  
              // Length
              const lengthInput = document.querySelector("input[aria-label='Length (cm or inches)']");
              const lengthInputVal = lengthInput ? lengthInput.value : '';
              if (lengthInputVal === '') {
                console.log('Length input not present');
                return reject(new Error('Length input is required'));
              }
  
              // Quantity
              const quantityCheck = document.querySelector("input[name='ec-qty']");
              let quantityValue = quantityCheck ? parseInt(quantityCheck.value, 10) : 1;
              if (isNaN(quantityValue)) {
                  quantityValue = 1;
              }
  
              // Prepare the product options to include the engraving cost
              const options = {
                  'Basket Size': basketSizeValue,
                  'Grip Color': gripColorValue,
                  'Basket Color': basketColorValue,
                  'Strap': strapValue,
                  'Engraving': engravingCost,
                  'Length (cm or inches)': lengthInputVal,
                  'Engraving - Ski Pole 1': engravingText1,
                  'Engraving - Ski Pole 2': engravingText2
              };
              console.log('options', options);
              console.log('quantity:', quantityValue);

              cartUpdateProduct = {
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
                    console.log('product added to cart');
                  } else {
                    reject(error || new Error('Failed to add product to cart'));
                  }
                }
              };
              
              // Add the product to the cart with the engraving option
              Ecwid.Cart.addProduct(cartUpdateProduct);
            });
          }

          function convertOptionValues(product) {
            const flippedBasketSizeMenu = {
              '0': 'Tiny Disc- 2" (black only)',
              '1': 'Medium Basket- 4"',
              '2': 'Huge Powder Basket- 4.75" (black only)'
            };

            const flippedGripColorMenu = {
              '0': 'Black',
              '1': 'Cork',
              '2': 'Blue',
              '3': 'Green',
              '4': 'Pink',
              '5': 'Purple',
              '6': 'Orange',
              '7': 'Red',
              '8': 'Turquoise'
            };

            const flippedBasketColorMenu = {
              '0': 'Black',
              '1': 'White',
              '2': 'Transparent',
              '3': 'Blue',
              '4': 'Green',
              '5': 'Pink',
              '6': 'Purple',
              '7': 'Orange',
              '8': 'Red',
              '9': 'Turquiose'
            };

            const flippedStrapMenu = {
              '0': 'Salida Magic',
              '1': 'Autumn',
              '2': 'Bridgers',
              '3': 'Mount Tam',
              '4': 'Flow',
              '5': 'Idaho 9',
              '6': 'Dark Side',
              '7': 'Lone Peak',
              '8': 'Teton',
              '9': 'The Grand',
              '10': 'Spanish Peaks',
              '11': 'Adjustable',
              '12': 'Fixed',
              '13': 'None'
            };

            // Example usage
            const basketSizeName = flippedBasketSizeMenu[product.options['Basket Size']];
            const gripColorName = flippedGripColorMenu[product.options['Grip Color']];
            const basketColorName = flippedBasketColorMenu[product.options['Basket Color']];
            const strapName = flippedStrapMenu[product.options['Strap']];
            product.options['Engraving'] = '0';


            console.log('Converted option values:', {
              basketSizeName,
              gripColorName,
              basketColorName,
              strapName
            });

            // Return the converted product if needed
            return {
              ...product,
              options: {
                ...product.options,
                'Basket Size': basketSizeName,
                'Grip Color': gripColorName,
                'Basket Color': basketColorName,
                'Strap': strapName
              }
            };
          }

          function handleRemoveFromCart(product) {
            return new Promise((resolve) => {
              // const item=convertOptionValues(product);
              product.options['Engraving'] = '0';
              const item = product;
              console.log('item to remove:', item);
              Ecwid.Cart.get(function(cart) {
                try {
                  console.log('current cart:', cart);

                  if (!cart || !cart.items) {
                    console.error('Cart is not available or empty');
                    resolve();
                    return;
                  }

                  for (let i = 0; i < cart.items.length; i++) {
                    if (isEqual(cart.items[i].options, item.options) && cart.items[i].product.id === item.id) {
                      console.log(`Cart item matches:`, {...cart.items[i]}, `item:`, {...item});
                      if (cart.items[i].quantity > item.quantity) {
                        cart.items[i].quantity -= item.quantity;
                        Ecwid.Cart.removeProduct(i);
                        
                        // Add a small delay before adding the product back
                        setTimeout(() => {
                          Ecwid.Cart.addProduct(cart.items[i], function(success) {
                            if (success) {
                              console.log(`Cart item ${i} quantity decremented to ${cart.items[i].quantity}`);
                            } else {
                              console.error('Failed to update cart item quantity');
                            }
                            resolve();
                          });
                        }, 100); // 100ms delay
                      } else {
                        Ecwid.Cart.removeProduct(i);
                        console.log(`Cart item ${i} removed`);
                        resolve();
                      }
                      return; // Exit the function after initiating cart update
                    }
                  }

                  console.log('No matching product found in cart');
                  resolve();
                } catch (error) {
                  console.error('Error removing product from cart:', error);
                  resolve();
                }
              });
            });
          }

          function isEqual(obj1, obj2) {
              // Check if the number of keys is different
            if (Object.keys(obj1).length !== Object.keys(obj2).length) {
              return false;
            }

            for (const key in obj1) {
              // Check if the key exists in obj2
              if (!(key in obj2)) {
                return false;
              }

              // Check if the values are equal
              if (obj1[key] !== obj2[key]) {
                return false;
              }
            }

            return true;
          }

          // Takes in a button and adds an event listener to it that updates the cart with the correct item
          function listenUpdateCart(target) {
            const [targetVariable] = Object.keys({target});
            console.log(`In updateCart with ${targetVariable}`);
            const addButton = target.querySelector(".form-control__button");
            if (addButton) {
              console.log('Button found');
              target.addEventListener('click', async (event) => {
                try {
                  await handleAddToCart(event);
                  // Add a small delay before removing the product
                  await new Promise(resolve => setTimeout(resolve, 100));
                  await handleRemoveFromCart(cartUpdateProduct);
                } catch (error) {
                  console.error('Error handling cart update:', error);
                }
              });
            }
            else {
              console.log('No button found');
            }
          }


          // ------------------------- EVENT LISTENERS ------------------------- 
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
          const gripColorElement = document.querySelector('.details-product-option--Grip-Color');
          const gripColorWindow = gripColorElement ? gripColorElement.querySelector('.form-control--select.form-control.form-control--flexible') : null;
          const gripColorSelect = gripColorWindow ? gripColorWindow.querySelector('.form-control__select') : null;
          if (gripColorSelect) {
              gripColorSelect.addEventListener('change', updatePrice);
          }
          
          // Initial call to set the price when the page loads
          updatePrice();
  
          // Attach the click event listener to the Add to Cart button
          if (addToBagDiv) { listenUpdateCart(addToBagDiv); }
          else if (addMoreDiv) { listenUpdateCart(addMoreDiv); }
        }
    });
  });









 

