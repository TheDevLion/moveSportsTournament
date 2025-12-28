export const setAdminToken = () => {
    window.localStorage.setItem("admin-mode", "true");
}

export const deleteAdminToken = () => {
    window.localStorage.removeItem("admin-mode");
}

export const isAdminMode = () => {
    const mode = window.localStorage.getItem("admin-mode");
    return mode === "true";
}