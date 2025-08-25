
document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        showError('No sitelist ID provided');
        return;
    }

    try {
        // Get the stored sitelist data
        const result = await browser.storage.local.get(`siteList_${id}`);
        const siteListData = result[`siteList_${id}`];

        if (!siteListData) {
            showError('No data found for this sitelist');
            return;
        }

        // Display the content
        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="icon">${siteListData.icon}</div>
            <div class="title">${escapeHtml(siteListData.name)}</div>
            <div class="reason">${escapeHtml(siteListData.reason)}</div>
            <a href="https://invisible-voice.com/sitelist/${id}" 
               class="more-info" 
               target="_blank"
               rel="noopener noreferrer">
                View More Information
            </a>
        `;
    } catch (error) {
        showError('Error loading sitelist data');
        console.error('Error:', error);
    }
});

function showError(message) {
    const content = document.getElementById('content');
    content.innerHTML = `<div class="error">${escapeHtml(message)}</div>`;
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}