Ecwid.OnAPILoaded.add(function() {
    Ecwid.OnPageLoaded.add(function(page) {
      if (page.type === 'PRODUCT') {
          console.log(page.productId);
          const productIds = [55001151, 74102380, 506210440, 570262509, 94782479];
  
          // Check if the current product ID is in the allowed list
          if (!productIds.includes(page.productId)) {return;}

          // ------------------------- CONSTANTS ------------------------- 
  
          const basePrices = {55001151: 119.95, 74102380: 131.95, 506210440: 136.95, 570262509: 119.95, 94782479: 71.00};
          const basePrice = basePrices[page.productId];
  
          // Get all input fields
          const engravingInput1 = document.querySelector("input[aria-label='Engraving - Ski Pole 1']");
          const engravingInput2 = document.querySelector("input[aria-label='Engraving - Ski Pole 2']");
          const customEngraving = ['0', '1-6', '1-6', '1-6', '1-6', '1-6', '1-6', '7-8', '7-8', '9-10', '9-10', '11-12', '11-12', '13-14', '13-14', '15-16', '15-16', '17-18', '17-18', '19-20', '19-20', '21-22', '21-22', '23-24', '23-24', '25-26', '25-26', '27-28', '27-28', '29-30', '29-30', '31-32', '31-32', '33-34', '33-34', '35-36', '35-36', '37-38', '37-38', '39-40', '39-40'];
          const engraveInd=[0,18,18,18,18,18,18,19.75,19.75,21.5,21.5,23.25,23.25,25,25,26.75,26.75,28.5,28.5,30.25,30.25,32,32,33.75,33.75,35.5,35.5,37.25,37.25,39,39,40.75,40.75,42.5,42.5,44.25,44.25,46,46,47.75,47.75];
          const lengthInput = document.querySelector("input[aria-label='Length (cm or inches)']");
          const quantityCheck = document.querySelector("input[name='ec-qty']");

          // ------------------------- FUNCTIONS ------------------------- 
          // Function to update the price --- CHANGES.... get the price values from ecwid so that we don't have to manually update them in the code
          function updatePrice() {
            try {
              const engravingText1 = engravingInput1 ? engravingInput1.value : '';
              const engravingText2 = engravingInput2 ? engravingInput2.value : '';
  
              // STRAP
              const strapRadio = document.querySelector("input[name='Strap']:checked");
              const strapValue = strapRadio ? strapRadio.value : '';
  
              // GRIP COLOR
              const gripColorSelect = document.querySelector('.details-product-option--Grip-Color select');
              const gripColorValue = gripColorSelect ? gripColorSelect.value : '';
  
  
              const charCount = engravingText1.length + engravingText2.length;
              const engravingCost = engraveInd[charCount];
  
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
  
          // Function to get the current product configuration
          function getProduct() {
            try {
              // Engraving
              const engravingText1 = engravingInput1 ? engravingInput1.value : '';
              const engravingText2 = engravingInput2 ? engravingInput2.value : '';
              const charCount = engravingText1.length + engravingText2.length;
              const engravingCost = customEngraving[charCount];

              // Get all select values
              const basketSizeSelect = document.querySelector('.details-product-option--Basket-Size select');
              const gripColorSelect = document.querySelector('.details-product-option--Grip-Color select');
              const basketColorSelect = document.querySelector('.details-product-option--Basket-Color select');
              const strapRadio = document.querySelector("input[name='Strap']:checked");

              return {
                id: page.productId,
                quantity: quantityCheck ? parseInt(quantityCheck.value, 10) || 1 : 1,
                options: {
                  'Basket Size': basketSizeSelect?.value || '',
                  'Grip Color': gripColorSelect?.value || '',
                  'Basket Color': basketColorSelect?.value || '',
                  'Strap': strapRadio?.value || '',
                  'Engraving': engravingCost,
                  'Length (cm or inches)': lengthInput?.value || '',
                  'Engraving - Ski Pole 1': engravingText1,
                  'Engraving - Ski Pole 2': engravingText2
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
              console.log("handle add to cart active");
              event.preventDefault();
              
              const product = getProduct();
              
              // Validate length input
              if (!product.options['Length (cm or inches)']) {
                console.log('Length input not present');
                return reject(new Error('Length input is required'));
              }

              // Add callback to the product object
              const cartProduct = {
                ...product,
                callback: function(success, addedProduct, cart, error) {
                  console.log('success', success);
                  console.log('product:', addedProduct);
                  console.log('cart:', cart);
                  console.log('error:', error);
                  
                  if (success) {
                    resolve(product); // Resolve with our original product object
                    console.log('product added to cart');
                  } else {
                    reject(error || new Error('Failed to add product to cart'));
                  }
                }
              };
              
              // Add the product to the cart
              Ecwid.Cart.addProduct(cartProduct);
            });
          }

          // Remove from cart
          function handleRemoveFromCart(product) {
            return new Promise((resolve) => {
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
            const [targetVariable] = Object.keys({target});
            console.log(`In updateCart with ${targetVariable}`);
            const addButton = target.querySelector(".form-control__button");
            if (addButton) {
              console.log('Button found');
              
              // Remove existing listeners first
              const clone = target.cloneNode(true);
              target.parentNode.replaceChild(clone, target);
              
              // Add new listener to the cloned element
              clone.addEventListener('click', async (event) => {
                try {
                  await handleAddToCart(event);
                  await new Promise(resolve => setTimeout(resolve, 100));
                  await handleRemoveFromCart(getProduct());
                } catch (error) {
                  console.error('Error handling cart update:', error);
                }
              });
            }
            else {
              console.log('No button found');
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
                      node.querySelector(".details-product-purchase__add-to-bag") ||
                      node.querySelector(".details-product-purchase__add-more")
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
            if (engravingInput1) {
              engravingInput1.addEventListener('input', updatePrice);
            }
            if (engravingInput2) {
              engravingInput2.addEventListener('input', updatePrice);
            }

            // Strap selection listeners
            const strapRadios = document.querySelectorAll("input[name='Strap']");
            strapRadios.forEach(radio => {
              radio.addEventListener('change', updatePrice);
            });

            // Grip color selection listener
            const gripColorElement = document.querySelector('.details-product-option--Grip-Color');
            const gripColorWindow = gripColorElement ? gripColorElement.querySelector('.form-control--select.form-control.form-control--flexible') : null;
            const gripColorSelect = gripColorWindow ? gripColorWindow.querySelector('.form-control__select') : null;
            if (gripColorSelect) {
              gripColorSelect.addEventListener('change', updatePrice);
            }
          }
          
          // Function to attach listeners to cart buttons
          function attachCartListeners() {
            console.log('Attaching cart listeners');
            const addToBagDiv = document.querySelector(".details-product-purchase__add-to-bag");
            const addMoreDiv = document.querySelector(".details-product-purchase__add-more");
            
            if (addToBagDiv) { listenUpdateCart(addToBagDiv); }
            else if (addMoreDiv) { listenUpdateCart(addMoreDiv); }
          }


          // ------------------------- Initialization ------------------------- 
          try {
            attachCartListeners();
            attachProductListeners();
            const debouncedAttachCartListeners = debounce(attachCartListeners, 100);
            setupMutationObserver(debouncedAttachCartListeners);
          } catch (error) {
            console.error('Error during initialization:', error);
          }
        }
    });
  });

