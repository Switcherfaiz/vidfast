const checkMode=()=>{
    let theme = localStorage.getItem('theme');
    if (!theme) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            theme = 'dark_mode';
        } else {
            theme = 'light_mode';
        }
        localStorage.setItem('theme', theme);
    }
    return theme;
}

document.body.classList.add(checkMode()||'light_mode');