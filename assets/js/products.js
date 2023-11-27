// Función para cargar productos relacionados
function loadRelatedProducts(currentProductId, products) {
  const currentProduct = products.find(p => p.id === currentProductId);
  if (!currentProduct) return [];

  return products.filter(p => {
    return p.id !== currentProductId && p.tags.some(tag => currentProduct.tags.includes(tag));
  });
}

// Función para mostrar productos relacionados
function displayRelatedProducts(relatedProducts) {
  const container = document.getElementById('related-products');
  container.innerHTML = ''; // Limpia el contenedor

  relatedProducts.forEach(product => {
    const productElement = document.createElement('div');
    productElement.innerHTML = `
      <h3>${product.name}</h3>
      <p>${product.price}</p>
      <img src="${product.image}" alt="${product.name}">
    `;
    container.appendChild(productElement);
  });
}

const loadProductDetails = (productId) => {
  fetch('assets/json/ID_product.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      const product = data.find(p => p.id === productId);
      if (product) {
        // Asigna los datos del producto a los elementos HTML
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-category').textContent = product.category;
        document.getElementById('product-tags').textContent = product.tags.map(tag => `#${tag}`).join('     ');
        document.getElementById('product-price').textContent = product.price;
        document.getElementById('product-description').textContent = product.description;
        document.getElementById('product-specification').textContent = product.specification;
        document.getElementById('product-image').src = product.image;

        // Actualizar las valoraciones
        const ratings = document.getElementById('product-ratings');
        ratings.innerHTML = '';
        for (let i = 0; i < 5; i++) {
          const star = document.createElement('i');
          star.className = i < product.ratings ? 'fa fa-star text-warning' : 'fa fa-star text-muted';
          ratings.appendChild(star);
        }

        // Cargar y mostrar productos relacionados
        const relatedProducts = loadRelatedProducts(productId, data);
        displayRelatedProducts(relatedProducts);
      } else {
        console.error('Product not found!');
      }
    })
    .catch(error => {
      console.error('Error loading product data:', error);
    });
};

// Obtener el ID del producto de la URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const productId = parseInt(urlParams.get('id'));

if (productId) {
  loadProductDetails(productId);
} else {
  console.error('Product ID not found in the URL');
}

function displayRelatedProducts(relatedProducts) {
  const container = document.getElementById('related-products');
  container.innerHTML = ''; // Limpia el contenedor

  relatedProducts.forEach(product => {
    // Crear un contenedor para las estrellas
    let stars = '';
    for (let i = 0; i < 5; i++) {
      stars += i < product.ratings ? '<i class="fa fa-star text-warning"></i>' : '<i class="fa fa-star text-muted"></i>';
    }

    // Crear el elemento HTML del producto
    const productElement = document.createElement('div');
    productElement.innerHTML = `
      <a href="shop-single.html?id=${product.id}" class="related-product-link">
        <h3>${product.name}</h3>
        <p>${product.price}</p>
        <div class="product-rating">${stars}</div>
        <img src="${product.image}" alt="${product.name}">
      </a>
    `;
    container.appendChild(productElement);
  });
}

