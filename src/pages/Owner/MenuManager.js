import { useEffect, useState } from "react";
import "./owner.css";

const API = "https://qr-dine-backend-xbja.onrender.com/api";

export default function MenuManager() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    image: null
  });

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  function fetchItems() {
    fetch(`${API}/menu/`)
      .then(res => res.json())
      .then(setItems);
  }

  function fetchCategories() {
    fetch(`${API}/categories/`)
      .then(res => res.json())
      .then(setCategories);
  }

  function addCategory() {
    if (!newCategory) return;

    fetch(`${API}/categories/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategory })
    }).then(() => {
      setNewCategory("");
      fetchCategories();
    });
  }

  function deleteCategory(id) {
    fetch(`${API}/categories/${id}/`, {
      method: "DELETE"
    }).then(fetchCategories);
  }

  function addItem() {
    const data = new FormData();
    data.append("name", form.name);
    data.append("price", form.price);
    data.append("category", form.category);
    if (form.image) data.append("image", form.image);

    fetch(`${API}/menu/`, {
      method: "POST",
      body: data
    }).then(() => {
      fetchItems();
      setForm({ name: "", price: "", category: "", image: null });
    });
  }

  function deleteItem(id) {
    fetch(`${API}/menu/${id}/`, {
      method: "DELETE"
    }).then(fetchItems);
  }

  return (
    <div>
      <h1 className="page-title">Menu Manager</h1>

      {/* CATEGORY SECTION */}
      <div className="kpi-card" style={{ marginBottom: 30 }}>
        <h3>Add Category</h3>
        <div className="form-row">
          <input
            placeholder="New Category"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
          />
          <button onClick={addCategory}>Add</button>
        </div>

        <div className="grid-cards">
          {categories.map(c => (
            <div key={c.id} className="mini-card">
              {c.name}
              <button onClick={() => deleteCategory(c.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ADD ITEM */}
      <div className="kpi-card" style={{ marginBottom: 30 }}>
        <h3>Add Menu Item</h3>

        <div className="form-row">
          <input
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Price"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
          />

          <select
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          >
            <option>Select Category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="file"
            onChange={e =>
              setForm({ ...form, image: e.target.files[0] })
            }
          />

          <button onClick={addItem}>Add</button>
        </div>
      </div>

    {/* ITEMS GRID */}
    <div className="product-grid">
      {items.map(i => (
        <div key={i.id} className="product-card">
          <div className="product-img-wrapper">
            <img
              src={i.image || "https://via.placeholder.com/150"}
              alt={i.name}
            />
          </div>

          <div className="product-info">
            <h3>{i.name}</h3>
            <p className="price">₹ {i.price}</p>

            <button
              className="delete-btn"
              onClick={() => deleteItem(i.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
}
