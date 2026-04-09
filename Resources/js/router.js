// ==============================
// ROUTER + DYNAMIC PAGE TITLE
// ==============================

const mainBody = document.querySelector(".main-body");

// Get page from URL hash
function getPageFromHash() {
    let hash = location.hash.replace("#", "");
    if (!hash) hash = "dashboard";
    return `${hash}.html`;
}

// Highlight active sidebar link
function setActiveLink(page) {
    document.querySelectorAll("a[data-page]").forEach(link => {
        link.classList.toggle("active", link.dataset.page === page);
    });
}

// Load page content
async function loadPage(page) {
    try {
        mainBody.style.opacity = "0";

        const res = await fetch(`./Resources/pages/${page}`);
        if (!res.ok) throw new Error("Page not found");

        const html = await res.text();
        mainBody.innerHTML = html;

        // ==============================
        // DYNAMIC TITLE LOGIC
        // ==============================
        const pageElement = mainBody.querySelector("[data-title]");

        let title;

        if (pageElement && pageElement.dataset.title) {
            title = pageElement.dataset.title;
        } else if (page) {
            title = page
                .replace(".html", "")
                .replace(/-/g, " ")
                .replace(/\b\w/g, c => c.toUpperCase());
        } else {
            title = "Home";
        }

        title = title.trim();

        // Update navbar title safely
        const titleEl = document.getElementById("page-title");
        if (titleEl) {
            titleEl.innerText = title;
        }

        // Update browser tab title
        document.title = `Ocson Systems Inc`;

        // ==============================

        setActiveLink(page);

        requestAnimationFrame(() => {
            mainBody.style.opacity = "1";
        });

    } catch (err) {
        mainBody.innerHTML = "<h3>Failed to load content</h3>";
        mainBody.style.opacity = "1";
        console.error(err);
    }
}

// Handle sidebar clicks
document.addEventListener("click", (e) => {
    const link = e.target.closest("a[data-page]");
    if (!link) return;

    e.preventDefault();
    location.hash = link.dataset.page.replace(".html", "");
});

// Handle back/forward navigation
window.addEventListener("hashchange", () => {
    loadPage(getPageFromHash());
});

// Initial load
window.addEventListener("DOMContentLoaded", () => {
    loadPage(getPageFromHash());
});
