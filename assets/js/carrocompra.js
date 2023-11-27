// Variables globales
let products = [];
let cart = [];



document.getElementById('cart-icon').addEventListener('mouseover', () => {
    document.getElementById('cart-panel').style.display = 'block';
    updateCartPanelDisplay(); // Asegúrate de que la información del carrito esté actualizada
});

document.getElementById('cart-icon').addEventListener('mouseout', () => {
    document.getElementById('cart-panel').style.display = 'none';
});

function updateCartPanelDisplay() {
    const cartPanelItemsContainer = document.getElementById('cart-panel-items');
    cartPanelItemsContainer.innerHTML = ''; // Limpiar el contenedor

    let total = 0;
    cart.forEach(product => {
        const productElement = document.createElement('div');
        productElement.innerHTML = `
            <h4>${product.name} x ${product.quantity}</h4>
            <p>Unitary: ${product.price}</p>
            <img src="${product.image}" alt="${product.name}" style="width:150px; height:150px;" />
        `;
        cartPanelItemsContainer.appendChild(productElement);
        total += parseFloat(product.price) * product.quantity;
    });

    document.getElementById('total-cart-panel').innerText = `Total: ${total.toFixed(2)}€`;
}



// Cargar los productos desde el JSON al iniciar
fetch('assets/json/ID_product.json')
  .then(response => response.json())
  .then(data => {
    products = data;
  })
  .catch(error => console.error('Error loading products:', error));

// Función para obtener el ID del producto de la URL
function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Función para actualizar el valor del campo oculto con el ID del producto
function setProductIdInputValue(productId) {
    const productIdInput = document.getElementById('product-id');
    if (productIdInput) {
        productIdInput.value = productId;
    }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const productId = getProductIdFromUrl();
    setProductIdInputValue(productId);
});







// Función para actualizar el badge del carrito
function updateCartBadge() {
    const cartBadge = document.querySelector('.nav-icon .badge');
    // Calcular la cantidad total de productos en el carrito
    const totalQuantity = cart.reduce((total, product) => total + product.quantity, 0);
    cartBadge.textContent = totalQuantity; // Actualizar el texto del badge
}


// Añadir producto al carrito
// Modifica esta parte para incluir la cantidad al añadir al carrito
document.getElementById('add-to-cart-button').addEventListener('click', () => {
    const productId = document.getElementById('product-id').value;
    const quantity = parseInt(document.getElementById('product-quanity').value);
    const product = products.find(p => p.id == productId);

    if (product) {
        // Verifica si el producto ya está en el carrito
        const existingProductIndex = cart.findIndex(p => p.id == productId);
        if (existingProductIndex !== -1) {
            // Si ya está, actualiza la cantidad
            cart[existingProductIndex].quantity += quantity;
        } else {
            // Si no está, establece la cantidad y añade el producto al carrito
            product.quantity = quantity;
            cart.push(product);
        }
        updateCartDisplay(); // Actualizar la visualización del carrito
        updateCartBadge();
    } else {
        console.error('Producto no encontrado');
    }
});

function updateCartDisplay() {
    // Asegúrate de que el contenedor del carrito esté limpio antes de añadir nuevos elementos
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = '';
    let total = 0;

    // Itera sobre los elementos del carrito y actualiza el DOM y el total
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.innerHTML = `
            <h4>${item.name}</h4>
            <p>${item.price} x ${item.quantity}</p>
            <img src="${item.image}" alt="${item.name}" />
        `;
        cartContainer.appendChild(itemElement);

        // Asegúrate de convertir el precio a un número y multiplicarlo por la cantidad
        total += parseFloat(item.price) * item.quantity;
    });

    // Actualiza el total en el DOM
    document.getElementById('total-cart').textContent = `Total: ${total.toFixed(2)}€`;
}
