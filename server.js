const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let menuItems = [
    { id: 1, name: "Classic Cheeseburger", price: 120, description: "Juicy flame-grilled beef patty with cheddar cheese." },
    { id: 2, name: "Margherita Pizza", price: 240, description: "Fresh mozzarella cheese, tomatoes, and basil." },
    { id: 3, name: "Spaghetti Carbonara", price: 180, description: "Creamy pasta with smoked bacon and parmesan." }
];
let orders = [];

const styles = `<style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; color: #333; }
    header { background-color: #e74c3c; color: white; padding: 1.5rem; text-align: center; font-size: 1.5rem; font-weight: bold; }
    nav { background: #34495e; padding: 0.5rem; text-align: center; }
    nav a { color: white; margin: 0 15px; text-decoration: none; font-weight: bold; }
    .container { max-width: 900px; margin: 30px auto; padding: 20px; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-radius: 8px; }
    .menu-item { border-bottom: 1px solid #ddd; padding: 15px 0; display: flex; justify-content: space-between; align-items: center; }
    .btn { background: #e74c3c; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
    .btn-admin { background: #2ecc71; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; font-weight: bold; }
    input, textarea { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background-color: #f2f2f2; }
</style>`;

const navigation = `<nav><a href="/">Browse Menu (Customer)</a><a href="/admin">Admin Dashboard</a></nav>`;

app.get('/', (req, res) => {
    let menuHtml = menuItems.map(item => `
        <div class="menu-item">
            <div><h3>${item.name}</h3><p>${item.description}</p><strong>₹${item.price}</strong></div>
            <form action="/place-order" method="POST"><input type="hidden" name="itemId" value="${item.id}"><button type="submit" class="btn">Order Now</button></form>
        </div>`).join('');
    res.send(`<html><head>${styles}</head><body><header>🍔 QuickBites Food Delivery</header>${navigation}<div class="container"><h2>Our Interactive Menu</h2>${menuHtml}</div></body></html>`);
});

app.post('/place-order', (req, res) => {
    const item = menuItems.find(i => i.id === parseInt(req.body.itemId));
    if (item) orders.push({ id: orders.length + 1, itemName: item.name, price: item.price, status: "Pending Approval" });
    res.send(`<html><head>${styles}</head><body style="text-align: center; padding-top: 50px;"><h2>🎉 Order Placed!</h2><a href="/" class="btn">Back to Menu</a></body></html>`);
});

app.get('/admin', (req, res) => {
    let orderRows = orders.map(o => `<tr><td>#${o.id}</td><td>${o.itemName}</td><td>₹${o.price}</td><td style="color: #e67e22;">${o.status}</td></tr>`).join('');
    res.send(`<html><head>${styles}</head><body><header style="background-color: #2c3e50;">⚙️ Restaurant Control Panel</header>${navigation}<div class="container"><h2>Add Menu Item</h2><form action="/admin/add-item" method="POST"><div class="form-group"><label>Name</label><input type="text" name="name" required></div><div class="form-group"><label>Price</label><input type="number" name="price" required></div><div class="form-group"><label>Description</label><textarea name="description" required></textarea></div><button type="submit" class="btn btn-admin">Add Item</button></form><h2>Orders</h2><table><thead><tr><th>ID</th><th>Item</th><th>Price</th><th>Status</th></tr></thead><tbody>${orderRows || '<tr><td colspan="4">No orders yet.</td></tr>'}</tbody></table></div></body></html>`);
});

app.post('/admin/add-item', (req, res) => {
    menuItems.push({ id: menuItems.length + 1, name: req.body.name, price: parseInt(req.body.price), description: req.body.description });
    res.redirect('/admin');
});

app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));