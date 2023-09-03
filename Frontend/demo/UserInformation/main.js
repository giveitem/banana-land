document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/get_data')
        .then(response => response.json())
        .then(data => {
            document.getElementById('data-container').innerText = data.message;
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
