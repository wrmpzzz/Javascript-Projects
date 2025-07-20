document.addEventListener("DOMContentLoaded", () => {
    const mostrarProductos = document.getElementById("products-box");
    const mostrarProductoAlCarrito = document.getElementById("cart");
    const mostrarTotalDelProducto = document.getElementById("total-amount");
    const contadorCarrito = document.getElementById("cart-counter")
    const carritoDropdown = document.getElementById("cart-dropdown")
    const carritoIcon = document.querySelector(".cart-icon-container")
    const closeCartBtn = document.getElementById("close-cart");
  
 
    let carritoDeCompra = [];

    const actualizarCarrito = () => {
        mostrarProductoAlCarrito.innerHTML = "";
        let total = 0;
        let cantidadTotal = 0;

        carritoDeCompra.forEach(producto => {
            total += producto.precio * producto.cantidad;
            cantidadTotal = cantidadTotal + producto.cantidad
        
            const articuloAlCarrito = document.createElement("div");
            articuloAlCarrito.classList.add("cart-item");
            articuloAlCarrito.innerHTML = `
                <img src="${producto.image}" alt="">
                <div class="info">
                    <p>${producto.nombre}</p>
                    <div>
                        <button class="decrease-quantity" data-id="${producto.id}">-</button>
                        <span>${producto.cantidad}</span>
                        <button class="increase-quantity" data-id="${producto.id}">+</button>
                    </div>
                    <p>${(producto.precio * producto.cantidad).toFixed(2)}</p>
                    <button class="remove-item" data-id="${producto.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            mostrarProductoAlCarrito.appendChild(articuloAlCarrito);
        });

        mostrarTotalDelProducto.textContent = total.toFixed(2);
        contadorCarrito.textContent = cantidadTotal;

        //llamar la funcion configurarEventos
        configurarEventos();
    };


 
//funcion para los botones 
    const configurarEventos = () => {
        document.querySelectorAll(".increase-quantity").forEach(button => {
            button.addEventListener("click", () => {
                 const idboton = parseInt(button.getAttribute("data-id"))
                 carritoDeCompra = carritoDeCompra.map(producto => {
                    if (producto.id === idboton) {
                        return {
                            ...producto,
                            cantidad: producto.cantidad + 1
                        };
                    }
                    return producto;
                 });
                 actualizarCarrito();
            })
        })

        //funcion para disminuir cantidad del producto 

    document.querySelectorAll(".decrease-quantity").forEach(button  => {
        button.addEventListener("click", ()  => {
             const idboton = parseInt(button.getAttribute("data-id"));
            carritoDeCompra = carritoDeCompra.map(producto => {
                if (producto.id === idboton && producto.cantidad > 1) {
                    return {
                        ...producto,
                        cantidad: producto.cantidad - 1
                    };
                }
                return producto;
            })
            actualizarCarrito();
        })
    })

    //funcion para eliminar producto en el carrito
     document.querySelectorAll(".remove-item").forEach(button  => {
        button.addEventListener("click", ()  => {
             const idboton = parseInt(button.getAttribute("data-id"));
             carritoDeCompra = carritoDeCompra.filter(producto => {
                return producto.id !== idboton;
             })
             actualizarCarrito();
        })
     })
    }


    //funcion para mostrar los productos
    productos.forEach(producto => {
        const crearDiv = document.createElement("div");
        crearDiv.classList.add("products");
        crearDiv.innerHTML = `
            <img src="${producto.image}" alt="">
            <div class="details">
                <span>${producto.categoria}</span>
                <h6>${producto.nombre}</h6>
                <div class="star">
                    ${'<i class="fas fa-star"></i>'.repeat(producto.estrellas)}
                    <span>${producto.opinion}</span>
                    <button class="add-to-cart" data-id="${producto.id}" data-image="${producto.image}" data-nombre="${producto.nombre}" data-precio="${producto.precio}">
                        Comprar
                    </button>
                </div>
            </div>
            <div class="cost">$${producto.precio}</div>
        `;
        mostrarProductos.appendChild(crearDiv);
    });

    //funcion para agregar productos al carrito
    document.querySelectorAll(".add-to-cart").forEach(boton => {
        boton.addEventListener("click", (e) => {
            const productoId = parseInt(e.target.getAttribute("data-id"));
            const productoImage = e.target.getAttribute("data-image");
            const productoNombre = e.target.getAttribute("data-nombre");
            const productoPrecio = parseFloat(e.target.getAttribute("data-precio"));
            const productoExistente = carritoDeCompra.find(item => item.id === productoId);
            if (productoExistente) {
                productoExistente.cantidad++;
            } else {
                const nuevoProducto = {
                    id: productoId,
                    nombre: productoNombre,
                    image: productoImage,
                    precio: productoPrecio,
                    cantidad: 1
                };
                carritoDeCompra = [...carritoDeCompra, nuevoProducto];
            }
            actualizarCarrito();
        });
    });


    //funcion para mostrar y ocultar el carrito de compra 
      carritoIcon.addEventListener("click", () => {
        carritoDropdown.classList.toggle("hidden")
      })

      closeCartBtn.addEventListener("click", () => {
        carritoDropdown.classList.add("hidden");
    });
    // Seleccionamos el botón de WhatsApp en el HTML
     // Seleccionamos el botón de WhatsApp en el HTML
const whatsappBtn = document.getElementById("whatsappBtn");

// Añadimos un evento de clic al botón y una función de flecha
whatsappBtn.addEventListener("click", () => {
    // Definimos una variable para construir el mensaje
    let mensaje = "Hola, quiero comprar los siguientes productos:\n\n";
    
    // Recorremos cada producto en el carrito utilizando for eahc que toma un parámetro 
    carritoDeCompra.forEach(producto => {
        // Añadimos el nombre, cantidad y precio al mensaje
        mensaje += `${producto.nombre} 
        - Cantidad: ${producto.cantidad} 
        - Precio: $${(producto.precio * producto.cantidad)
            .toFixed(2)}\n`;
    });
    
    // Añadimos el total del carrito al mensaje
    mensaje += `\nTotal: 
    $${mostrarTotalDelProducto.textContent}`;
    
    // Creamos una URL con el número de teléfono y el mensaje, codificando
    const url = `
    https://api.whatsapp.com/send?phone=50245984577&text=${encodeURIComponent(mensaje)}`;
    
    // Abrimos una nueva ventana con la URL de WhatsApp
    window.open(url, '_blank');
});


});