const sidebar = document.getElementById('sidebar');

function toggleSidebar() {
    const nav = document.querySelector("nav");
    const icon = document.getElementById("toggle-menu");

    // Toggle sidebar visibility
    if (sidebar) {
        sidebar.classList.toggle('active');
    }

    // Toggle nav state
    if (nav) {
        nav.classList.toggle("active");
    }

    // Update icon text
    if (icon && nav) {
        icon.textContent = nav.classList.contains("active") ? "close" : "menu";
    }
}