// --- Sidebar Toggle Logic (Mobile) ---
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const toggleBtn = document.getElementById('sidebarToggle');

function toggleSidebar() {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

toggleBtn.addEventListener('click', toggleSidebar);
overlay.addEventListener('click', toggleSidebar);

// --- Sidebar Dropdown Logic (Accordion) ---
const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        const submenu = toggle.nextElementSibling;
        submenu.classList.toggle('open');
    });
});

// --- User Profile Dropdown Logic ---
const userProfileTrigger = document.getElementById('userProfileTrigger');
const profileDropdown = document.getElementById('profileDropdown');

// Toggle dropdown on click
userProfileTrigger.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent click from bubbling to document
    profileDropdown.classList.toggle('show');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!profileDropdown.contains(e.target) && !userProfileTrigger.contains(e.target)) {
        profileDropdown.classList.remove('show');
    }
});

// --- Active State Logic for Sidebar Links ---
const navItems = document.querySelectorAll('.nav-item, .submenu a');
navItems.forEach(item => {
    item.addEventListener('click', function(e) {
        if(this.classList.contains('dropdown-toggle')) return;

        navItems.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
        
        if (window.innerWidth <= 768) {
            toggleSidebar();
        }
    });
});