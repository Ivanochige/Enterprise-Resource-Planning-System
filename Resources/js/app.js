//HTML TEMPLATES//
//My-Navbar Template//
class MyNavbar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header class="top-navbar">
                <div class="nav-left">
                    <button class="toggle-btn" id="sidebarToggle">
                        <span class="material-symbols-outlined">menu</span>
                    </button>

                    <!-- DYNAMICPAGE TITLE -->
                    <h2 id="page-title" style="margin-left: 1px;">Dashboard</h2>

                    <div class="search-bar">
                        <span class="material-symbols-outlined" style="color: #9ca3af;">search</span>
                        <input type="text" placeholder="Search ERP...">
                    </div>
                </div>

                <div class="nav-right">
                    <button class="icon-btn">
                        <span class="material-symbols-outlined">notifications</span>
                        <span class="badge">20</span>
                    </button>
                    
                    <!-- User Profile with Dropdown -->
                    <div class="user-profile-container">
                        <div class="user-profile" id="userProfileTrigger">
                            <div class="avatar">IO</div>
                            <div class="profile-info">
                                <span class="profile-name">Ivan Ochige</span>
                                <span class="profile-role">Admin</span>
                            </div>
                            <span class="material-symbols-outlined" style="font-size: 18px; color: var(--text-muted);">expand_more</span>
                        </div>

                        <!-- Dropdown Menu -->
                        <div class="profile-dropdown" id="profileDropdown">
                            <div class="dropdown-header">
                                <p>Ivan Ochige.</p>
                                <p>ivan.ochige@ocson.com</p>
                            </div>
                            
                            <a href="#" class="dropdown-item">
                                <span class="material-symbols-outlined">person</span>
                                My Profile
                            </a>
                            <a href="#account-settings" data-page="account-settings.html" class="dropdown-item">
                                <span class="material-symbols-outlined">settings</span>
                                Account Settings
                            </a>
                            <a href="#privacy" data-page="privacy.html" class="dropdown-item">
                                <span class="material-symbols-outlined">security</span>
                                Privacy
                            </a>
                            
                            <div class="dropdown-divider"></div>
                            
                            <a href="#logout" data-page="logout.html" data-page="logout.html" class="dropdown-item logout-item">
                                <span class="material-symbols-outlined">logout</span>
                                Logout
                            </a>
                        </div>
                    </div>
                </div>
            </header>
            `
    }
}
customElements.define('my-navbar', MyNavbar);

//My-Sidebar Template//
class MySidebar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <aside class="sidebar" id="sidebar">
                <div class="logo-container">
                    <div class="logo-text">
                        <span class="material-symbols-outlined">grid_view</span>
                        Ocson ERP
                    </div>
                </div>

                <nav class="nav-links">
                    
                    <a href="#dashboard" data-page="dashboard.html" class="nav-item active">
                        <span class="material-symbols-outlined">dashboard</span> Dashboard
                    </a>
                    <a href="#reports" data-page="reports.html" class="nav-item">
                        <span class="material-symbols-outlined">analytics</span> Reports
                    </a>

                    <!-- SALES DROPDOWN -->
                    <div class="nav-section-title">Sales</div>
                    <div class="nav-group">
                        <button class="dropdown-toggle">
                            <span class="material-symbols-outlined">point_of_sale</span>
                            Sales Management
                            <span class="material-symbols-outlined dropdown-arrow">expand_more</span>
                        </button>
                        <div class="submenu">
                            <a href="#pos" data-page="pos.html">Sales</a>
                            <a href="#orders" data-page="orders.html">Orders</a>
                            <a href="#invoices" data-page="invoices.html">Invoices</a>
                            <a href="#customers" data-page="customers.html">Customers</a>
                            <a href="#returns" data-page="returns.html">Returns</a>
                        </div>
                    </div>

                    <!-- PURCHASES DROPDOWN -->
                    <div class="nav-section-title">Purchasing</div>
                    <div class="nav-group">
                        <button class="dropdown-toggle">
                            <span class="material-symbols-outlined">shopping_bag</span>
                            Purchases
                            <span class="material-symbols-outlined dropdown-arrow">expand_more</span>
                        </button>
                        <div class="submenu">
                            <a href="#purchases" data-page="purchases.html">Purchase Orders</a>
                            <a href="#suppliers" data-page="suppliers.html">Suppliers</a>
                        </div>
                    </div>

                    <!-- INVENTORY DROPDOWN -->
                    <div class="nav-section-title">Inventory</div>
                    <div class="nav-group">
                        <button class="dropdown-toggle">
                            <span class="material-symbols-outlined">inventory_2</span>
                            Inventory Control
                            <span class="material-symbols-outlined dropdown-arrow">expand_more</span>
                        </button>
                        <div class="submenu">
                            <a href="#products" data-page="products.html">Products</a>
                            <a href="#stock" data-page="stock.html">Stock Levels</a>
                            <a href="#transfers" data-page="transfers.html">Transfers</a>
                            <a href="#warehouses" data-page="warehouses.html">Warehouses</a>
                        </div>
                    </div>

                    <!-- FINANCE DROPDOWN -->
                    <div class="nav-section-title">Finance</div>
                    <div class="nav-group">
                        <button class="dropdown-toggle">
                            <span class="material-symbols-outlined">account_balance</span>
                            Finance
                            <span class="material-symbols-outlined dropdown-arrow">expand_more</span>
                        </button>
                        <div class="submenu">
                            <a href="#payments" data-page="payments.html">Payments</a>
                            <a href="#expenses" data-page="expenses.html">Expenses</a>
                            <a href="#financial-reports" data-page="financial-reports.html">Financial Reports</a>
                        </div>
                    </div>

                    <div class="nav-section-title">System</div>
                    <a href="#settings" data-page="settings.html" class="nav-item">
                        <span class="material-symbols-outlined">settings</span> Settings
                    </a>
                </nav>
            </aside>
            `
        ;
    }
}
customElements.define('my-sidebar', MySidebar);
