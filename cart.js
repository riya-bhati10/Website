document.addEventListener("DOMContentLoaded", function () {
    const cartIcon = document.querySelector("#cart-icon");
    const cart = document.querySelector(".cart");
    const cartClose = document.querySelector("#cart-close");
    const cartContent = document.querySelector(".cart-content");
    const cartCount = document.querySelector(".cart-icon-count");
    const cartTotal = document.querySelector(".cart-total"); // Total price display

    cartIcon.addEventListener("click", () => cart.classList.add("active"));
    cartClose.addEventListener("click", () => cart.classList.remove("active"));

    document.querySelectorAll(".add-cart").forEach(button => {
        button.addEventListener("click", function (event) {
            const productBox = event.target.closest(".product-box");
            if (productBox) {
                addToCart(productBox);
            }
        });
    });

    function addToCart(productBox) {
        const productImgSrc = productBox.querySelector("img").src;
        const productTitle = productBox.querySelector(".product-title").textContent;
        const productPriceText = productBox.querySelector(".price").textContent;
        
        // Extract the numeric price from text (remove ₹ symbol or other non-numeric characters)
        const productPrice = parseFloat(productPriceText.replace(/[^\d.]/g, ""));

        if (isNaN(productPrice)) {
            console.error("Error: Invalid product price detected.");
            return;
        }

        let existingCartItem = Array.from(cartContent.querySelectorAll(".cart-box")).find(cartBox =>
            cartBox.querySelector(".cart-product-title").textContent.trim() === productTitle.trim()
        );

        if (existingCartItem) {
            let quantityElement = existingCartItem.querySelector(".number");
            quantityElement.textContent = parseInt(quantityElement.textContent) + 1;
        } else {
            const cartBox = document.createElement("div");
            cartBox.classList.add("cart-box");

            cartBox.innerHTML = `
                <img src="${productImgSrc}" class="cart-img">
                <div class="cart-detail">
                    <h2 class="cart-product-title">${productTitle}</h2>
                    <span class="cart-price">$${productPrice.toFixed(2)}</span>
                    <div class="cart-quantity">
                        <button class="decrement">-</button>
                        <span class="number">1</span>
                        <button class="increment">+</button>
                    </div>
                </div>
                <i class="fa-solid fa-trash cart-remove"></i>
            `;

            cartContent.appendChild(cartBox);

            cartBox.querySelector(".increment").addEventListener("click", () => {
                let quantityElement = cartBox.querySelector(".number");
                quantityElement.textContent = parseInt(quantityElement.textContent) + 1;
                updateCart();
            });

            cartBox.querySelector(".decrement").addEventListener("click", () => {
                let quantityElement = cartBox.querySelector(".number");
                if (parseInt(quantityElement.textContent) > 1) {
                    quantityElement.textContent = parseInt(quantityElement.textContent) - 1;
                } else {
                    cartBox.remove();
                }
                updateCart();
            });

            cartBox.querySelector(".cart-remove").addEventListener("click", () => {
                cartBox.remove();
                updateCart();
            });
        }

        updateCart();
    }

    function updateCart() {
        updateCartCount();
        updateCartTotal();
    }

    function updateCartCount() {
        let count = 0;
        document.querySelectorAll(".cart-box .number").forEach(item => {
            count += parseInt(item.textContent);
        });

        if (count > 0) {
            cartCount.textContent = count;
            cartCount.style.visibility = "visible";
        } else {
            cartCount.style.visibility = "hidden";
        }
    }

    function updateCartTotal() {
        let total = 0;
        document.querySelectorAll(".cart-box").forEach(cartBox => {
            let priceText = cartBox.querySelector(".cart-price").textContent;
            let price = parseFloat(priceText.replace(/[^\d.]/g, ""));
            let quantity = parseInt(cartBox.querySelector(".number").textContent);

            if (!isNaN(price) && !isNaN(quantity)) {
                total += price * quantity;
            }
        });

        cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    }
});
