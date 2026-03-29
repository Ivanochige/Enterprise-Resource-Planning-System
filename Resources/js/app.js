//HTML Template.//
//My-Navbar//
class Mynavbar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div class="navbar">
            <span id="toggle-menu" onclick="toggleSidebar()" class="material-symbols-outlined">
                menu
            </span>
            Ocson
        </div>`;
    }
}
customElements.define('my-navbar', Mynavbar);

//My-sidebar//
class MySidebar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div class="sidebar">
            Sidebar
        </div>
        `
        ;
    }
}
customElements.define('my-sidebar', MySidebar);

//My-footer//
class MyFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div class="footer">
<p>&copy; 2026 Ocson Inc</p>
        </div>`;
    }
}
customElements.define('my-footer', MyFooter);
//End of HTML Template.//