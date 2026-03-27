//HTML Template.//
//My-Navbar//
class Mynavbar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <nav>
            <span id="toggle-menu" onclick="toggleSidebar()" class="material-symbols-outlined">
                menu
            </span>
            Ocson
        </nav>`;
    }
}
customElements.define('my-navbar', Mynavbar);

//My-sidebar//
class MySidebar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <my-sidebar id="sidebar">
            Sidebar
        </my-sidebar>
        `
        ;
    }
}
customElements.define('my-sidebar', MySidebar);

//My-footer//
class MyFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <footer>&copy; 2026 Ocson Inc.</footer>`;
    }
}
customElements.define('my-footer', MyFooter);
//End of HTML Template.//