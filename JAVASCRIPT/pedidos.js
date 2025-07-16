tailwind.config = {
        theme: {
          extend: {
            colors: {
              "brown-dark": "#5A3A1E",
              gold: "#D4A84F",
              cream: "#FDF6E3",
            },
          },
        },
      };
    
      // Cart state management
      let cart = [];
      let cartTotal = 0;
      let confirmCallback = null;

      // Initialize the application
      document.addEventListener("DOMContentLoaded", function () {
        initializeEventListeners();
        updateCartDisplay();
      });

      // Initialize all event listeners
      function initializeEventListeners() {
        // Quantity buttons for all menu items
        document.querySelectorAll(".menu-item").forEach((item) => {
          const plusBtn = item.querySelector(".qty-btn-plus");
          const minusBtn = item.querySelector(".qty-btn-minus");
          const qtyDisplay = item.querySelector(".qty-display");

          plusBtn.addEventListener("click", () => {
            let currentQty = parseInt(qtyDisplay.textContent);
            currentQty++;
            qtyDisplay.textContent = currentQty;
            updateCartFromQuantity(item, currentQty);
          });

          minusBtn.addEventListener("click", () => {
            let currentQty = parseInt(qtyDisplay.textContent);
            if (currentQty > 0) {
              currentQty--;
              qtyDisplay.textContent = currentQty;
              updateCartFromQuantity(item, currentQty);
            }
          });
        });

        // Cart action buttons
        document
          .getElementById("clear-cart")
          .addEventListener("click", clearCart);
        document
          .getElementById("finish-order")
          .addEventListener("click", finishOrder);
        document
          .getElementById("close-modal")
          .addEventListener("click", closeModal);
        document
          .getElementById("confirm-yes")
          .addEventListener("click", function () {
            if (confirmCallback) confirmCallback();
            closeConfirmModal();
          });
      }

      // Update cart based on quantity changes
      function updateCartFromQuantity(itemElement, quantity) {
        const name = itemElement.dataset.name;
        const price = parseFloat(itemElement.dataset.price);
        const image = itemElement.dataset.image;

        // Remove item from cart first
        cart = cart.filter((item) => item.name !== name);

        // Add item back if quantity > 0
        if (quantity > 0) {
          cart.push({
            name: name,
            price: price,
            quantity: quantity,
            image: image,
            subtotal: price * quantity,
          });
        }

        updateCartDisplay();
      }

      // Update cart display and total
      function updateCartDisplay() {
        const cartItemsContainer = document.getElementById("cart-items");
        const cartTotalElement = document.getElementById("cart-total");
        const finishOrderBtn = document.getElementById("finish-order");

        // Clear current display
        cartItemsContainer.innerHTML = "";

        if (cart.length === 0) {
          cartItemsContainer.innerHTML = `
                    <div class="text-gray-500 text-center py-4">
                        Nenhum item adicionado
                    </div>
                `;
          cartTotal = 0;
          finishOrderBtn.disabled = true;
        } else {
          // Display cart items
          cart.forEach((item, index) => {
            const itemElement = document.createElement("div");
            itemElement.className =
              "flex items-center justify-between p-3 bg-gray-50 rounded-lg";
            itemElement.innerHTML = `
                        <div class="flex items-center space-x-2 flex-1">
                            <img src="${item.image}" alt="${
              item.name
            }" class="w-8 h-8 object-cover rounded">
                            <div class="flex-1 min-w-0">
                                <p class="font-semibold text-sm text-brown-dark truncate">${
                                  item.name
                                }</p>
                                <p class="text-xs text-gray-600">${
                                  item.quantity
                                }x R$ ${item.price.toFixed(2)}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="font-bold text-gold text-sm">R$ ${item.subtotal.toFixed(
                              2
                            )}</span>
                            <button onclick="removeFromCart(${index})" class="text-red-500 hover:text-red-700 w-6 h-6 flex items-center justify-center">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                    `;
            cartItemsContainer.appendChild(itemElement);
          });

          // Calculate total
          cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
          finishOrderBtn.disabled = false;
        }

        // Update total display
        cartTotalElement.textContent = `R$ ${cartTotal.toFixed(2)}`;
      }

      // Remove item from cart
      function removeFromCart(index) {
        const removedItem = cart[index];
        cart.splice(index, 1);

        // Reset quantity display for the item
        document.querySelectorAll(".menu-item").forEach((item) => {
          if (item.dataset.name === removedItem.name) {
            item.querySelector(".qty-display").textContent = "0";
          }
        });

        updateCartDisplay();
      }

      // Clear entire cart
      function clearCart() {
        if (cart.length === 0) return;
        showConfirmModal(
          "Tem certeza que deseja limpar todo o carrinho?",
          () => {
            cart = [];

            // Reset all quantity displays
            document.querySelectorAll(".qty-display").forEach((display) => {
              display.textContent = "0";
            });

            updateCartDisplay();
          }
        );
      }

      // Finish order
      function finishOrder() {
        if (cart.length === 0) {
          showAlertModal(
            "Adicione itens ao carrinho antes de finalizar o pedido."
          );
          return;
        }

        // Get observations
        const observations = document
          .getElementById("observations")
          .value.trim();

        // Show order confirmation modal
        showOrderModal(observations);
      }

      // Show order confirmation modal
      function showOrderModal(observations) {
        const modal = document.getElementById("order-modal");
        const summaryContainer = document.getElementById("order-summary");

        // Build order summary
        let summaryHTML = `
                <h4 class="font-bold text-brown-dark mb-3">Resumo do Pedido:</h4>
                <div class="space-y-2 mb-4">
            `;

        cart.forEach((item) => {
          summaryHTML += `
                    <div class="flex justify-between text-sm">
                        <span>${item.quantity}x ${item.name}</span>
                        <span class="font-semibold">R$ ${item.subtotal.toFixed(
                          2
                        )}</span>
                    </div>
                `;
        });

        summaryHTML += `
                </div>
                <div class="border-t pt-2 mb-3">
                    <div class="flex justify-between font-bold">
                        <span>Total:</span>
                        <span class="text-gold">R$ ${cartTotal.toFixed(
                          2
                        )}</span>
                    </div>
                </div>
            `;

        if (observations) {
          summaryHTML += `
                    <div class="border-t pt-2">
                        <p class="text-sm font-semibold text-brown-dark">Observações:</p>
                        <p class="text-sm text-gray-600">${observations}</p>
                    </div>
                `;
        }

        summaryContainer.innerHTML = summaryHTML;
        modal.classList.remove("hidden");

        // Reset form after showing modal
        setTimeout(() => {
          resetForm();
        }, 500);
      }

      // Close modal
      function closeModal() {
        document.getElementById("order-modal").classList.add("hidden");
      }

      // Reset entire form
      function resetForm() {
        cart = [];

        // Reset all quantity displays
        document.querySelectorAll(".qty-display").forEach((display) => {
          display.textContent = "0";
        });

        // Clear observations
        document.getElementById("observations").value = "";

        updateCartDisplay();
      }

      // Go back function
      function goBack() {
        if (cart.length > 0) {
          showConfirmModal(
            "Você tem itens no carrinho. Deseja realmente sair?",
            () => {
              window.history.back();
            }
          );
        } else {
          window.history.back();
        }
      }

      // Alert modal functions
      function showAlertModal(message) {
        document.getElementById("alert-modal-message").textContent = message;
        document.getElementById("alert-modal").classList.remove("hidden");
      }

      function closeAlertModal() {
        document.getElementById("alert-modal").classList.add("hidden");
      }

      // Confirm modal functions
      function showConfirmModal(message, callback) {
        document.getElementById("confirm-modal-message").textContent = message;
        document.getElementById("confirm-modal").classList.remove("hidden");
        confirmCallback = callback;
      }

      function closeConfirmModal() {
        document.getElementById("confirm-modal").classList.add("hidden");
        confirmCallback = null;
      }

      // Close modal when clicking outside
      document
        .getElementById("order-modal")
        .addEventListener("click", function (e) {
          if (e.target === this) {
            closeModal();
          }
        });