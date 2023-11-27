// Variables globales
let carrito = {};

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
        pintarCarrito();
    }
});

const cards = document.getElementById('cards');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.getElementById('template-card').content;
const templateFooter = document.getElementById('template-footer').content;
const templateCarrito = document.getElementById('template-carrito').content;
const fragment = document.createDocumentFragment();

cards.addEventListener('click', e => {
    addCarrito(e);
});

items.addEventListener('click', e => {
    btnAccion(e);
});

// Función para obtener los datos de los productos
const fetchData = async () => {
    try {
        const res = await fetch('ID_products.json'); // Asegúrate de que esta ruta es correcta
        const data = await res.json();
        pintarCard(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

// Función para pintar cada tarjeta de producto
const pintarCard = data => {
    data.forEach(product => {
        templateCard.querySelector('.product-image').setAttribute('src', product.image);
        templateCard.querySelector('.product-name').textContent = product.name;
        templateCard.querySelector('.product-price').textContent = `${product.price}€`;
        templateCard.querySelector('.btn-add-to-cart').dataset.id = product.id;
        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone);
    });
    cards.appendChild(fragment);
};

// Función para añadir productos al carrito
const addCarrito = e => {
    if (e.target.classList.contains('btn-add-to-cart')) {
        setCarrito(e.target.parentElement);
    }
    e.stopPropagation();
};

// Función para establecer el producto en el carrito
const setCarrito = item => {
    const producto = {
        id: item.querySelector('.btn-add-to-cart').dataset.id,
        name: item.querySelector('.product-name').textContent,
        price: parseFloat(item.querySelector('.product-price').textContent.replace('€', '')),
        image: item.querySelector('.product-image').src,
        cantidad: 1
    };
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1;
    }
    carrito[producto.id] = { ...producto };
    pintarCarrito();
};

// Función para mostrar los productos en el carrito
const pintarCarrito = () => {
    items.innerHTML = '';
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('.product-image').src = producto.image;
        templateCarrito.querySelector('.product-name').textContent = producto.name;
        templateCarrito.querySelector('.product-quantity').textContent = producto.cantidad;
        templateCarrito.querySelector('.product-price').textContent = `${producto.price}€`;
        templateCarrito.querySelector('.btn-increase').dataset.id = producto.id;
        templateCarrito.querySelector('.btn-decrease').dataset.id = producto.id;
        templateCarrito.querySelector('.product-subtotal').textContent = (producto.cantidad * producto.price).toFixed(2) + '€';
        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    });
    items.appendChild(fragment);
    pintarFooter();
    localStorage.setItem('carrito', JSON.stringify(carrito));
};

// Función para mostrar el pie del carrito
const pintarFooter = () => {
    footer.innerHTML = '';
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = '<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>';
        return;
    }
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0);
    const nPrecio = Object.values(carrito).reduce((acc, { cantidad, price }) => acc + cantidad * price, 0);
    templateFooter.querySelector('.total-quantity').textContent = nCantidad;
    templateFooter.querySelector('.total-price').textContent = nPrecio.toFixed(2) + '€';
    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);

    const btnVaciar = document.getElementById('vaciar-carrito');
    btnVaciar.addEventListener('click', () => {
        carrito = {};
        pintarCarrito();
    });
};

// Función para manejar acciones en los botones del carrito
const btnAccion = e => {
    if (e.target.classList.contains('btn-increase')) {
        const producto = carrito[e.target.dataset.id];
        producto.cantidad++;
        carrito[e.target.dataset.id] = { ...producto };
        pintarCarrito();
    }
    if (e.target.classList.contains('btn-decrease')) {
        const producto = carrito[e.target.dataset.id];
        producto.cantidad--;
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id];
        }
        pintarCarrito();
    }
    e.stopPropagation();
};
