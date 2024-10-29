Ecwid.OnAPILoaded.add(function() {
    Ecwid.OnPageLoaded.add(function(page) {
      if (page.type === 'PRODUCT') {
          const productIds = [55001151, 74102380, 506210440, 570262509, 94782479];
  
          // Check if the current product ID is in the allowed list
          if (!productIds.includes(page.productId)) {return;}

          // ------------------------- CONSTANTS ------------------------- 
  
          const BASE_PRICES = {55001151: 119.95, 74102380: 131.95, 506210440: 136.95, 570262509: 119.95, 94782479: 71.00};
          const CORK_PRICE = 14;
          const STRAP_PRICES = {'None': -3, 'Adjustable': 10, 'Fixed': 0, 'mtnStrap': 19.99};

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
            QUANTITY: "input[name='ec-qty']"
          };

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

          const basePrice = BASE_PRICES[page.productId];

          // To change these, need to also go into Ecwid and change the individual product option prices
          const customEngraving = ['0', '1-6', '1-6', '1-6', '1-6', '1-6', '1-6', '7-8', '7-8', '9-10', '9-10', '11-12', '11-12', '13-14', '13-14', '15-16', '15-16', '17-18', '17-18', '19-20', '19-20', '21-22', '21-22', '23-24', '23-24', '25-26', '25-26', '27-28', '27-28', '29-30', '29-30', '31-32', '31-32', '33-34', '33-34', '35-36', '35-36', '37-38', '37-38', '39-40', '39-40'];
          const engraveInd=[0,18,18,18,18,18,18,19.75,19.75,21.5,21.5,23.25,23.25,25,25,26.75,26.75,28.5,28.5,30.25,30.25,32,32,33.75,33.75,35.5,35.5,37.25,37.25,39,39,40.75,40.75,42.5,42.5,44.25,44.25,46,46,47.75,47.75];

          // ------------------------- FUNCTIONS ------------------------- 
          // Function to update the price --- CHANGES.... get the price values from ecwid so that we don't have to manually update them in the code
          function updatePrice() {
            try {
              const engravingInput1 = document.querySelector(SELECTORS.ENGRAVING_1);
              const engravingInput2 = document.querySelector(SELECTORS.ENGRAVING_2);
              const engravingText1 = engravingInput1 ? engravingInput1.value : '';
              const engravingText2 = engravingInput2 ? engravingInput2.value : '';
  
              // STRAP
              const strapRadio = document.querySelector(SELECTORS.STRAP);
              const strapValue = strapRadio ? strapRadio.value : '';
  
              // GRIP COLOR
              const gripColorSelect = document.querySelector(SELECTORS.GRIP_COLOR);
              const gripColorValue = gripColorSelect ? gripColorSelect.value : '';
  
  
              const charCount = engravingText1.length + engravingText2.length;
              const engravingCost = engraveInd[charCount];
  
              // Update the displayed price
              const priceElement = document.querySelector(SELECTORS.PRICE_DISPLAY);
              const gripPrice = (gripColorValue === 'Cork') ? CORK_PRICE : 0;
              let strapPrice;
              if (strapValue in STRAP_PRICES) {strapPrice = STRAP_PRICES[strapValue];}
              else {strapPrice = STRAP_PRICES['mtnStrap'];}
              const newPrice = basePrice + engravingCost + gripPrice + strapPrice;
  
              if (priceElement) {
                  priceElement.textContent = `$${newPrice.toFixed(2)}`;
              }
            }
            catch (error) {
              console.error('Error updating price:', error);
            }
          }
  
          // Function to get the current product configuration
          function getProduct() {
            try {
              // Engraving
              const engravingInput1 = document.querySelector(SELECTORS.ENGRAVING_1);
              const engravingInput2 = document.querySelector(SELECTORS.ENGRAVING_2);
              const engravingText1 = engravingInput1 ? engravingInput1.value : '';
              const engravingText2 = engravingInput2 ? engravingInput2.value : '';
              const charCount = engravingText1.length + engravingText2.length;
              const engravingCost = customEngraving[charCount];

              // Get all select values
              const basketSizeSelect = document.querySelector(SELECTORS.BASKET_SIZE);
              const gripColorSelect = document.querySelector(SELECTORS.GRIP_COLOR);
              const basketColorSelect = document.querySelector(SELECTORS.BASKET_COLOR);
              const strapRadio = document.querySelector(SELECTORS.STRAP);
              const lengthInput = document.querySelector(SELECTORS.LENGTH);
              const quantityCheck = document.querySelector(SELECTORS.QUANTITY);

              return {
                id: page.productId,
                quantity: quantityCheck ? parseInt(quantityCheck.value, 10) || 1 : 1,
                options: {
                  [OPTION_NAMES.BASKET_SIZE]: basketSizeSelect?.value || '',
                  [OPTION_NAMES.GRIP_COLOR]: gripColorSelect?.value || '',
                  [OPTION_NAMES.BASKET_COLOR]: basketColorSelect?.value || '',
                  [OPTION_NAMES.STRAP]: strapRadio?.value || '',
                  [OPTION_NAMES.ENGRAVING]: engravingCost,
                  [OPTION_NAMES.LENGTH]: lengthInput?.value || '',
                  [OPTION_NAMES.ENGRAVING_1]: engravingText1,
                  [OPTION_NAMES.ENGRAVING_2]: engravingText2
                }
              };
            } catch (error) {
              console.error('Error in getProduct:', error);
              return null;
            }
          }
  
          // Add to cart
          function handleAddToCart(event) {
            return new Promise((resolve, reject) => {
              event.preventDefault();
              
              const product = getProduct();
              
              // Validate length input
              if (!product.options[OPTION_NAMES.LENGTH]) {
                return reject(new Error('Length input is required'));
              }

              // Add callback to the product object
              const cartProduct = {
                ...product,
                callback: function(success, addedProduct, cart, error) {                  
                  if (success) {
                    resolve(product); // Resolve with our original product object
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
            const addButton = target.querySelector(".form-control__button");
            if (addButton) {            
              // Remove existing listeners first
              const clone = target.cloneNode(true);
              target.parentNode.replaceChild(clone, target);
              
              // Add new listener to the cloned element
              clone.addEventListener('click', async (event) => {
                try {
                  await handleAddToCart(event);
                  // await new Promise(resolve => setTimeout(resolve, CART_UPDATE_DELAY));
                  // await handleRemoveFromCart(getProduct());
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

          // Create a MutationObserver to watch for DOM changes
          function setupMutationObserver(debouncedAttachCartListeners) {
            const observer = new MutationObserver((mutations) => {
            try {
              mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                  // Check if the add to cart button was added
                  const addedNodes = Array.from(mutation.addedNodes);
                  const hasAddToCartButton = addedNodes.some(node => 
                    node.querySelector && (
                      node.querySelector(SELECTORS.ADD_TO_BAG) ||
                      node.querySelector(SELECTORS.ADD_MORE)
                    )
                  );

                  if (hasAddToCartButton) {
                    // Re-attach the listeners
                    debouncedAttachCartListeners();
                  }
                }
              });
            } catch (error) {
              console.error('Error in MutationObserver callback:', error);
            }
          });

          // Start observing the document with the configured parameters
          observer.observe(document.body, { childList: true, subtree: true });
          }

          // Function to attach all product-related event listeners
          function attachProductListeners() {
            // Engraving input listeners
            const engravingInput1 = document.querySelector(SELECTORS.ENGRAVING_1);
            const engravingInput2 = document.querySelector(SELECTORS.ENGRAVING_2);
            if (engravingInput1) {
              engravingInput1.addEventListener('input', updatePrice);
            }
            if (engravingInput2) {
              engravingInput2.addEventListener('input', updatePrice);
            }

            // Strap selection listeners
            const strapRadios = document.querySelectorAll(SELECTORS.STRAP);
            strapRadios.forEach(radio => {
              radio.addEventListener('change', updatePrice);
            });

            // Grip color selection listener
            const gripColorElement = document.querySelector(SELECTORS.GRIP_COLOR);
            const gripColorWindow = gripColorElement ? gripColorElement.querySelector('.form-control--select.form-control.form-control--flexible') : null;
            const gripColorSelect = gripColorWindow ? gripColorWindow.querySelector('.form-control__select') : null;
            if (gripColorSelect) {
              gripColorSelect.addEventListener('change', updatePrice);
            }
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
            attachCartListeners();
            attachProductListeners();
            const debouncedAttachCartListeners = debounce(attachCartListeners, CART_UPDATE_DELAY);
            setupMutationObserver(debouncedAttachCartListeners);
          } catch (error) {
            console.error('Error during initialization:', error);
          }
        }
    });
  });



