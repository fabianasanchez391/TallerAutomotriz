function toggleMenu() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const icon = document.getElementById("toggleIcon");

    if (window.innerWidth <= 768) {
        sidebar.classList.toggle("active");
        overlay.classList.toggle("active");
    } else {
        sidebar.classList.toggle("collapsed");

        if (sidebar.classList.contains("collapsed")) {
            document.querySelectorAll(".has-submenu").forEach(item => {
                item.classList.remove("active");
            });

            if (icon) {
                icon.classList.replace("fa-angle-left", "fa-angle-right");
            }
        } else {
            if (icon) {
                icon.classList.replace("fa-angle-right", "fa-angle-left");
            }
        }
    }
}

document.querySelectorAll(".menu-item").forEach(item => {
    item.addEventListener("click", function () {
        const sidebar = document.getElementById("sidebar");
        const overlay = document.getElementById("overlay");

        if (window.innerWidth <= 768) {
            sidebar.classList.remove("active");
            overlay.classList.remove("active");
        }
    });
});