/**
 * @fileoverview This file adds an engraving feature to the ski pole products on the ecwid store and in the GrassSticks website.  It uses the Ecwid API with listeners and mutation observers to maintain the correct display and cart.
 * @author Cabot McTavish
 * 
 * This file is grouped by sections: Constants, Functions, Initialization.  In the need for edits, only the constants section should be changed.  The functions section should not be edited.  The initialization section should be used to setup the listeners.
 */

Ecwid.OnAPILoaded.add(function() {
    Ecwid.OnPageLoaded.add(function(page) {
      if (page.type === 'PRODUCT') {
          const productIds = [707439498, 707449474, 707449472, 707464855, 707464853];
  
          // Check if the current product ID is in the allowed list
          if (!productIds.includes(page.productId)) {return;}

          // ------------------------- CONSTANTS ------------------------- 
          // Option names (used in multiple places)
          const OPTION_NAMES = {
            BASKET_SIZE: 'Basket Size',
            GRIP_COLOR: 'Grip Color',
            BASKET_COLOR: 'Basket Color',
            STRAP: 'Strap',
            ENGRAVING: 'Engraving',
            LENGTH: 'Length (cm or inches)',
            ENGRAVING_1: 'Engraving - Ski Pole 1',
            ENGRAVING_2: 'Engraving - Ski Pole 2'
          };
  
          const BASE_PRICES = {707439498: 119.95, 707449474: 131.95, 707449472: 136.95, 707464855: 119.95, 707464853: 71.00};
          const CORK_PRICE = 14;
          const SINGLE_HIKING_PRICE = -59.98;
          const STRAP_PRICES = {'None': -3, 'Adjustable': 10, 'Fixed': 0, 'mtnStrap': 19.99};
          const CURRENT = {
            [OPTION_NAMES.STRAP]: null,
            [OPTION_NAMES.GRIP_COLOR]: null,
            [OPTION_NAMES.BASKET_SIZE]: null,
            [OPTION_NAMES.BASKET_COLOR]: null,
            [OPTION_NAMES.LENGTH]: null,
            [OPTION_NAMES.ENGRAVING]: null,
            [OPTION_NAMES.ENGRAVING_1]: null,
            [OPTION_NAMES.ENGRAVING_2]: null
          };

          const CURRENT_PRICE = {
            [OPTION_NAMES.STRAP]: 0,
            [OPTION_NAMES.GRIP_COLOR]: 0,
            [OPTION_NAMES.ENGRAVING]: 0,
          };

          if (page.productId === 707464855) {
            OPTION_NAMES.HIKING_QUANTITY = 'Quantity';
            CURRENT[OPTION_NAMES.HIKING_QUANTITY] = null;
            CURRENT_PRICE[OPTION_NAMES.HIKING_QUANTITY] = 0;
          }

          // Timing constants
          const CART_UPDATE_DELAY = 100;

          // DOM Selectors (frequently used)
          const SELECTORS = {
            ENGRAVING_1: "input[aria-label='Engraving - Ski Pole 1']",
            ENGRAVING_2: "input[aria-label='Engraving - Ski Pole 2']",
            LENGTH: "input[aria-label='Length (cm or inches)']",
            STRAP: "input[name='Strap']:checked",
            GRIP_COLOR: '.details-product-option--Grip-Color select',
            BASKET_SIZE: '.details-product-option--Basket-Size select',
            BASKET_COLOR: '.details-product-option--Basket-Color select',
            PRICE_DISPLAY: '.details-product-price__value.ec-price-item.notranslate',
            ADD_TO_BAG: '.details-product-purchase__add-to-bag',
            ADD_MORE: '.details-product-purchase__add-more',
            QUANTITY: "input[name='ec-qty']",
            HIKING_QUANTITY: '.details-product-option--Quantity select'
          };

          const basePrice = BASE_PRICES[page.productId];

          // To change these, need to also go into Ecwid and change the individual product option prices
          const customEngraving = ['0', '1-6', '1-6', '1-6', '1-6', '1-6', '1-6', '7-8', '7-8', '9-10', '9-10', '11-12', '11-12', '13-14', '13-14', '15-16', '15-16', '17-18', '17-18', '19-20', '19-20', '21-22', '21-22', '23-24', '23-24', '25-26', '25-26', '27-28', '27-28', '29-30', '29-30', '31-32', '31-32', '33-34', '33-34', '35-36', '35-36', '37-38', '37-38', '39-40', '39-40'];
          const engraveInd=[0,18,18,18,18,18,18,19.75,19.75,21.5,21.5,23.25,23.25,25,25,26.75,26.75,28.5,28.5,30.25,30.25,32,32,33.75,33.75,35.5,35.5,37.25,37.25,39,39,40.75,40.75,42.5,42.5,44.25,44.25,46,46,47.75,47.75];

          // ------------------------- FUNCTIONS ------------------------- 
          // Simplified updatePrice function
          function updatePrice() {
            try {
              console.log('Starting updatePrice()');
              const priceElement = document.querySelector(SELECTORS.PRICE_DISPLAY);
              if (!priceElement) {
                console.log('Price element not found');
                return;
              }

              const totalPrice = basePrice + 
                CURRENT_PRICE[OPTION_NAMES.STRAP] + 
                CURRENT_PRICE[OPTION_NAMES.GRIP_COLOR] + 
                CURRENT_PRICE[OPTION_NAMES.ENGRAVING] +
                (page.productId === 707464855 ? CURRENT_PRICE[OPTION_NAMES.HIKING_QUANTITY] : 0);
              
              console.log('Price calculation:', {
                basePrice,
                strapPrice: CURRENT_PRICE[OPTION_NAMES.STRAP],
                gripPrice: CURRENT_PRICE[OPTION_NAMES.GRIP_COLOR],
                engravingPrice: CURRENT_PRICE[OPTION_NAMES.ENGRAVING],
                totalPrice
              });

              // Create a new price element and replace the old one
              const newPriceElement = priceElement.cloneNode(false);
              newPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
              priceElement.parentNode.replaceChild(newPriceElement, priceElement);
            }
            catch (error) {
              console.error('Error updating price:', error);
            }
          }

          // Function to get the current product configuration
          function getProduct() {
            try {
              console.log('Starting getProduct()');
              
              // Get quantity from DOM since it's not tracked in CURRENT
              const quantityCheck = document.querySelector(SELECTORS.QUANTITY);
              console.log('Quantity element found:', !!quantityCheck, 'Value:', quantityCheck?.value);
              
              const product = {
                id: page.productId,
                quantity: quantityCheck ? parseInt(quantityCheck.value, 10) || 1 : 1,
                options: {
                  [OPTION_NAMES.BASKET_SIZE]: CURRENT[OPTION_NAMES.BASKET_SIZE] || '',
                  [OPTION_NAMES.GRIP_COLOR]: CURRENT[OPTION_NAMES.GRIP_COLOR] || '',
                  [OPTION_NAMES.BASKET_COLOR]: CURRENT[OPTION_NAMES.BASKET_COLOR] || '',
                  [OPTION_NAMES.STRAP]: CURRENT[OPTION_NAMES.STRAP] || '',
                  [OPTION_NAMES.ENGRAVING]: CURRENT[OPTION_NAMES.ENGRAVING] || '0',
                  [OPTION_NAMES.LENGTH]: CURRENT[OPTION_NAMES.LENGTH] || '',
                  [OPTION_NAMES.ENGRAVING_1]: CURRENT[OPTION_NAMES.ENGRAVING_1] || '',
                  [OPTION_NAMES.ENGRAVING_2]: CURRENT[OPTION_NAMES.ENGRAVING_2] || ''
                }
              };

              console.log('Current values:', CURRENT);
              console.log('Product to be returned:', product);
              
              return product;
            } catch (error) {
              console.error('Error in getProduct:', error);
              return null;
            }
          }
  
          // Add to cart
          function handleAddToCart(event) {
            return new Promise((resolve, reject) => {
              console.log('Starting handleAddToCart()');
              event.preventDefault();
              
              const product = getProduct();
              console.log('Product configuration:', product);
              
              // Validate length input
              if (!product.options[OPTION_NAMES.LENGTH]) {
                console.log('Length validation failed');
                return reject(new Error('Length input is required'));
              }

              // Check engraving length
              const totalEngravingLength = 
                  (product.options[OPTION_NAMES.ENGRAVING_1]?.length || 0) + 
                  (product.options[OPTION_NAMES.ENGRAVING_2]?.length || 0);

              console.log('Engraving validation:', {
                length1: product.options[OPTION_NAMES.ENGRAVING_1]?.length || 0,
                length2: product.options[OPTION_NAMES.ENGRAVING_2]?.length || 0,
                totalLength: totalEngravingLength
              });

              // if (totalEngravingLength > 40) {
              //     // Create and show error popup
              //     const popup = document.createElement('div');
              //     popup.id = 'engraving-error-popup';
              //     popup.style.cssText = `
              //         position: fixed;
              //         top: 50%;
              //         left: 50%;
              //         transform: translate(-50%, -50%);
              //         background: #ff4444;
              //         color: white;
              //         padding: 20px;
              //         border-radius: 5px;
              //         z-index: 1000;
              //         box-shadow: 0 2px 10px rgba(0,0,0,0.2);
              //     `;
              //     popup.textContent = 'Engraving text is too long. Maximum 40 characters total.';
              //     document.body.appendChild(popup);

              //     // Add shake animation to button
              //     const button = document.querySelector(SELECTORS.ADD_TO_BAG);
              //     button.style.animation = 'shake-cart-button 0.5s';
              //     button.style.animationIterationCount = '1';

              //     // Remove popup and animation after delay
              //     setTimeout(() => {
              //         document.body.removeChild(popup);
              //         button.style.animation = '';
              //     }, 3000);

              //     return reject(new Error('Engraving text too long'));
              // }

              // Add callback to the product object
              const cartProduct = {
                ...product,
                callback: function(success, addedProduct, cart, error) {                  
                  if (success) {
                    resolve(product);
                  } else {
                    reject(error || new Error('Failed to add product to cart'));
                  }
                }
              };
              
              // Add the product to the cart
              Ecwid.Cart.addProduct(cartProduct);
            });
          }

          // Remove from cart (DISABLED)
          function handleRemoveFromCart(product) {
            return new Promise((resolve) => {
              product.options[OPTION_NAMES.ENGRAVING] = '0';
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
                        }, CART_UPDATE_DELAY); // 100ms delay
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

          // Check if two objects are equal
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

          // Listen for add to cart button
          function listenUpdateCart(target) {
            console.log('Starting listenUpdateCart()');
            const addButton = target.querySelector(".form-control__button");
            if (addButton) {            
              console.log('Add button found, setting up listener');
              const clone = target.cloneNode(true);
              target.parentNode.replaceChild(clone, target);
              
              clone.addEventListener('click', async (event) => {
                console.log('Add to cart button clicked');
                try {
                  await handleAddToCart(event);
                } catch (error) {
                  console.error('Error handling cart update:', error);
                }
              });
            }
            else {
              console.error('No button found');
            }
          }

          // Debounce function
          function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
              const later = () => {
                clearTimeout(timeout);
                func(...args);
              };
              clearTimeout(timeout);
              timeout = setTimeout(later, wait);
            };
          }

          // Modified listener functions
          function attachStrapListeners() {
            console.log('Starting attachStrapListeners()');
            const strapInputs = document.querySelectorAll('input[name="Strap"]');
            console.log('Found strap inputs:', strapInputs.length);
            
            strapInputs.forEach(input => {
              const clone = input.cloneNode(true);
              input.parentNode.replaceChild(clone, input);
              clone.addEventListener('change', () => {
                console.log('Strap input changed:', clone.value);
                const strapPrice = STRAP_PRICES[clone.value] ?? STRAP_PRICES['mtnStrap'];
                console.log('New strap price:', strapPrice);
                CURRENT[OPTION_NAMES.STRAP] = clone.value;
                CURRENT_PRICE[OPTION_NAMES.STRAP] = strapPrice;
                updatePrice();
              });
            });
          }

          function attachProductListeners() {
            console.log('Starting attachProductListeners()');
            
            // Engraving inputs
            const engravingInput1 = document.querySelector(SELECTORS.ENGRAVING_1);
            const engravingInput2 = document.querySelector(SELECTORS.ENGRAVING_2);
            
            console.log('Found engraving inputs:', {
                input1: !!engravingInput1,
                input2: !!engravingInput2
            });
            
            if (engravingInput1) {
                engravingInput1.addEventListener('input', () => {
                    console.log('Engraving 1 input changed:', engravingInput1.value);
                    const engravingText2 = engravingInput2 ? engravingInput2.value : '';
                    const engravingText1 = engravingInput1.value;
                    const charCount = engravingText1.length + engravingText2.length;
                    
                    // If over 40 characters, revert to previous value
                    if (charCount > 40) {
                        engravingInput1.value = engravingInput1.value.slice(0, -1);
                        return;
                    }
                    
                    console.log('Engraving 1 calculation:', {
                        text1: engravingText1,
                        text2: engravingText2,
                        totalChars: charCount,
                        newPrice: engraveInd[charCount]
                    });
                    CURRENT_PRICE[OPTION_NAMES.ENGRAVING] = engraveInd[charCount];
                    CURRENT[OPTION_NAMES.ENGRAVING_1] = engravingText1;
                    CURRENT[OPTION_NAMES.ENGRAVING] = customEngraving[charCount];
                    updatePrice();
                });
            }
            
            if (engravingInput2) {
                engravingInput2.addEventListener('input', () => {
                    console.log('Engraving 2 input changed:', engravingInput2.value);
                    const engravingText1 = engravingInput1 ? engravingInput1.value : '';
                    const engravingText2 = engravingInput2.value;
                    const charCount = engravingText1.length + engravingText2.length;
                    
                    // If over 40 characters, revert to previous value
                    if (charCount > 40) {
                        engravingInput2.value = engravingInput2.value.slice(0, -1);
                        return;
                    }
                    
                    console.log('Engraving 2 calculation:', {
                        text1: engravingText1,
                        text2: engravingText2,
                        totalChars: charCount,
                        newPrice: engraveInd[charCount]
                    });
                    CURRENT_PRICE[OPTION_NAMES.ENGRAVING] = engraveInd[charCount];
                    CURRENT[OPTION_NAMES.ENGRAVING_2] = engravingText2;
                    CURRENT[OPTION_NAMES.ENGRAVING] = customEngraving[charCount];
                    updatePrice();
                });
            }

            // Grip color listener
            const gripColorSelect = document.querySelector(SELECTORS.GRIP_COLOR);
            console.log('Found grip color select:', !!gripColorSelect);
            
            if (gripColorSelect) {
                gripColorSelect.addEventListener('change', () => {
                    const gripColorValue = gripColorSelect.value;
                    const gripPrice = (gripColorValue === 'Cork') ? CORK_PRICE : 0;
                    console.log('Grip color changed:', {
                        newValue: gripColorValue,
                        isCork: gripColorValue === 'Cork',
                        newPrice: gripPrice
                    });
                    CURRENT_PRICE[OPTION_NAMES.GRIP_COLOR] = gripPrice;
                    CURRENT[OPTION_NAMES.GRIP_COLOR] = gripColorValue;
                    updatePrice();
                });
            }

            // Basket size listener
            const basketSizeSelect = document.querySelector(SELECTORS.BASKET_SIZE);
            console.log('Found basket size select:', !!basketSizeSelect);
            
            if (basketSizeSelect) {
                basketSizeSelect.addEventListener('change', () => {
                    const basketSizeValue = basketSizeSelect.value;
                    console.log('Basket size changed:', {
                        newValue: basketSizeValue,
                        previousValue: CURRENT[OPTION_NAMES.BASKET_SIZE]
                    });
                    CURRENT[OPTION_NAMES.BASKET_SIZE] = basketSizeValue;
                });
            }

            // Basket color listener
            const basketColorSelect = document.querySelector(SELECTORS.BASKET_COLOR);
            console.log('Found basket color select:', !!basketColorSelect);
            
            if (basketColorSelect) {
                basketColorSelect.addEventListener('change', () => {
                    const basketColorValue = basketColorSelect.value;
                    console.log('Basket color changed:', {
                        newValue: basketColorValue,
                        previousValue: CURRENT[OPTION_NAMES.BASKET_COLOR]
                    });
                    CURRENT[OPTION_NAMES.BASKET_COLOR] = basketColorValue;
                });
            }

            // Length listener
            const lengthInput = document.querySelector(SELECTORS.LENGTH);
            console.log('Found length input:', !!lengthInput);
            
            if (lengthInput) {
              lengthInput.addEventListener('input', () => {
                let lengthInputValue = lengthInput.value;
                if (page.productId === 707464853 && lengthInputValue >= 42) {
                  lengthInputValue = 42;
                  lengthInput.value = 42;
                }
                CURRENT[OPTION_NAMES.LENGTH] = lengthInputValue;
                console.log('Length input changed:', lengthInputValue);
              });
            }

            // Hiking quantity listener
            if (page.productId === 707464855) {
              console.log('Processing hiking quantity for product 707464855');
              const hikingQuantitySelect = document.querySelector(SELECTORS.HIKING_QUANTITY);
              console.log('Hiking quantity select element:', hikingQuantitySelect);
              
              if (hikingQuantitySelect) {
                hikingQuantitySelect.addEventListener('change', () => {
                  const hikingQuantityValue = hikingQuantitySelect.value;
                  const hikingQuantityPrice = hikingQuantityValue ? SINGLE_HIKING_PRICE : 0;
                  console.log('Hiking quantity calculations:', {
                    value: hikingQuantityValue,
                    price: hikingQuantityPrice,
                  });

                  if (hikingQuantityPrice === SINGLE_HIKING_PRICE) {
                    console.log('Single hiking pole selected, hiding engraving 2');
                    document.querySelector(SELECTORS.ENGRAVING_2).style.display = 'none';
                  } else {
                    console.log('Pair of poles selected, showing engraving 2');
                    document.querySelector(SELECTORS.ENGRAVING_2).style.display = 'block';
                  }

                  console.log('Hiking quantity changed:', {
                    newValue: hikingQuantityValue,
                    previousValue: CURRENT[OPTION_NAMES.HIKING_QUANTITY],
                    newPrice: hikingQuantityPrice
                  });

                  CURRENT[OPTION_NAMES.HIKING_QUANTITY] = hikingQuantityValue;
                  CURRENT_PRICE[OPTION_NAMES.HIKING_QUANTITY] = hikingQuantityPrice;
                });
              } else {
                console.log('Hiking quantity select element not found');
              }
            }
          }

          // Initialize current values
          function initializeCurrentValues() {
            console.log('Starting initializeCurrentValues()');
            
            const strapRadio = document.querySelector(SELECTORS.STRAP);
            const gripColorSelect = document.querySelector(SELECTORS.GRIP_COLOR);
            const basketSizeSelect = document.querySelector(SELECTORS.BASKET_SIZE);
            const basketColorSelect = document.querySelector(SELECTORS.BASKET_COLOR);
            const lengthInput = document.querySelector(SELECTORS.LENGTH);
            const engravingInput1 = document.querySelector(SELECTORS.ENGRAVING_1);
            const engravingInput2 = document.querySelector(SELECTORS.ENGRAVING_2);

            console.log('Found form elements:', {
              strap: !!strapRadio,
              gripColor: !!gripColorSelect,
              basketSize: !!basketSizeSelect,
              basketColor: !!basketColorSelect,
              length: !!lengthInput,
              engraving1: !!engravingInput1,
              engraving2: !!engravingInput2
            });

            CURRENT[OPTION_NAMES.STRAP] = strapRadio ? strapRadio.value : null;
            CURRENT[OPTION_NAMES.GRIP_COLOR] = gripColorSelect ? gripColorSelect.value : null;
            CURRENT[OPTION_NAMES.BASKET_SIZE] = basketSizeSelect ? basketSizeSelect.value : null;
            CURRENT[OPTION_NAMES.BASKET_COLOR] = basketColorSelect ? basketColorSelect.value : null;
            CURRENT[OPTION_NAMES.LENGTH] = lengthInput ? lengthInput.value : null;
            CURRENT[OPTION_NAMES.ENGRAVING] = 0; // Initialize engraving cost to 0
            CURRENT[OPTION_NAMES.ENGRAVING_1] = engravingInput1 ? engravingInput1.value : null;
            CURRENT[OPTION_NAMES.ENGRAVING_2] = engravingInput2 ? engravingInput2.value : null;

            // Initial price calculation without updating any specific field
            updatePrice();
          }

          // Update the mutation observer to call the specific function
          function setupMutationObserver(debouncedAttachCartListeners) {
            const observer = new MutationObserver((mutations) => {
              try {
                mutations.forEach((mutation) => {
                  if (mutation.type === 'childList') {
                    const addedNodes = Array.from(mutation.addedNodes);
                    const hasAddToCartButton = addedNodes.some(node => 
                      node.querySelector && (
                        node.querySelector(SELECTORS.ADD_TO_BAG) ||
                        node.querySelector(SELECTORS.ADD_MORE)
                      )
                    );
                    const hasStrapOptions = addedNodes.some(node =>
                      node.querySelector && node.querySelector('input[name="Strap"]')
                    );

                    if (hasAddToCartButton) {
                      debouncedAttachCartListeners();
                    }
                    if (hasStrapOptions) {
                      attachStrapListeners();  // Call the specific function instead
                    }
                  }
                });
              } catch (error) {
                console.error('Error in MutationObserver callback:', error);
              }
            });
            
            observer.observe(document.body, { childList: true, subtree: true });
            
            // Define cleanup function
            const cleanup = () => {
                console.log('Cleaning up mutation observer');
                observer.disconnect();
                // Clean up any other listeners or resources
            };
            
            // Add cleanup trigger for page changes
            Ecwid.OnPageLoaded.add(function(page) {
                if (page.type !== 'PRODUCT') {
                    cleanup();
                }
            });
          }

          // Function to attach listeners to cart buttons
          function attachCartListeners() {
            const addToBagDiv = document.querySelector(SELECTORS.ADD_TO_BAG);
            const addMoreDiv = document.querySelector(SELECTORS.ADD_MORE);
            
            if (addToBagDiv) { listenUpdateCart(addToBagDiv); }
            else if (addMoreDiv) { listenUpdateCart(addMoreDiv); }
          }


          // ------------------------- Initialization ------------------------- 
          try {
            initializeCurrentValues();

            // setup listeners
            attachCartListeners();
            attachProductListeners();
            attachStrapListeners();
            const debouncedAttachCartListeners = debounce(attachCartListeners, CART_UPDATE_DELAY);
            setupMutationObserver(debouncedAttachCartListeners);


          } catch (error) {
            console.error('Error during initialization:', error);
          }
        }
    });
  });
