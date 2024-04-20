import React, { useState } from "react";

const items = [
  {
    id: 1,
    name: 'Apples',
    price: 20,
    image: "a.jpg",
  },
  {
    id: 2,
    name: 'Bananas',
    price: 50,
    image: 'banana.jpg',
  },
  {
    id: 3,
    name: 'Bread',
    price: 30,
    image: 'bread.jpg',
  },
]

function Button({ children, onClick }) {
  return <button className="button" onClick={onClick}>{children}</button>
}

function Cart({ cartItems, onRemoveFromCart }) {
  return (
    <div className="cart">
      <h2>Cart 🛒</h2>
      <ul>
        {cartItems.map((item) => (
          <li key={item.id} className="cart-item"> 
            <div className="item-details">
              <img src={item.image} alt={item.name} />
              <div className="item-info">
                <p>{item.name}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Total: ${item.price * item.quantity}</p>
              </div>
            </div>
            <div className="item-actions">
              <button onClick={() => onRemoveFromCart(item.id)}>Remove</button>
            </div>
          </li>
        ))}
      </ul>
      {cartItems.length === 0 && <p>Your cart is empty</p>}
    </div>
  );
}

export default function App() {
  const [products, setProducts] = useState(items)
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  function handleShowAddProduct() {
    setShowAddProduct(show => !show)
  }

  function handleAddProduct(product) {
    setProducts(products => [...products, product]);
    setShowAddProduct(false);
  }

  function handleSelection(product) {
    setSelectedProduct(cur => cur?.id === product.id ? null : product);
    setShowAddProduct(null);
  }

  function handleAddToCart(product) {
    const existingProduct = cartItems.find(item => item.id === product.id);
    if (existingProduct) {
      const updatedCartItems = cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCartItems(updatedCartItems);
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  }

  function handleRemoveFromCart(productId) {
    setCartItems(cartItems.filter(item => item.id !== productId));
  }

  return (
    <div className="app">
      <div className="sidebar">
        <Products
          products={products}
          selectedProduct={selectedProduct}
          onSelection={handleSelection}
        />
        {showAddProduct && <FormAddProduct onAddProduct={handleAddProduct} />}
        <Button onClick={handleShowAddProduct}>{showAddProduct ? 'Close' : 'Add New Product'}</Button>
      </div>
      {selectedProduct && <FormCarProduct selectedProduct={selectedProduct} onAddToCart={handleAddToCart} />}
      <Cart cartItems={cartItems} onRemoveFromCart={handleRemoveFromCart} />
    </div>
  );
}

function Products({ products, onSelection, selectedProduct }) {
  return (
    <ul>
      {products.map((product) => (
        <Product product={product} key={product.id} selectedProduct={selectedProduct} onSelection={onSelection} />
      ))}
    </ul>
  );
}

function Product({ product, onSelection, selectedProduct }) {
  const isSelected = selectedProduct?.id === product.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <h5>{product.price} <span>$</span></h5>
      <Button onClick={() => onSelection(product)}>{isSelected ? "Remove from cart" : "Add to cart"}</Button>
    </li>
  );
}

function FormAddProduct({ onAddProduct }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState("https://www.bootdey.com/image/280x280/20B2AA/000000");
  const [price, setPrice] = useState(0);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image || !price) return;
    const newProduct = {
      id: Math.random().toString(36).substr(2, 9), // Generate random ID
      name,
      price,
      image,
    };
    onAddProduct(newProduct);
    setName("");
    setImage("https://www.bootdey.com/image");
    setPrice(0);
  }

  return (
    <form className="form-add-product" onSubmit={handleSubmit}>
      <label>📦 Product name</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <label>🖼️ Product image</label>
      <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
      <label>🆕💰 Price</label>
      <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
      <Button>Add</Button>
    </form>
  );
}

function FormCarProduct({ selectedProduct, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    setQuantity(newQuantity);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    const productToAdd = { ...selectedProduct, quantity };
    onAddToCart(productToAdd);
  };
  
  return (
    <form className="form-car-product" onSubmit={handleAddToCart}>
      <h2>Add To Cart 🛒 and Pay 💸💰</h2>
      {selectedProduct && (
        <>
          <label>Your product is {selectedProduct.name} and the price is ${selectedProduct.price}</label>
          <label>How many kilos ⚖️</label>
          <input type="number" value={quantity} onChange={handleQuantityChange} />
          <label>Total price 💰</label>
          <input type="text" value={quantity * selectedProduct.price} disabled />
          <Button type="submit">Add to Cart</Button> 
        </>
      )}
    </form>
  );
}
