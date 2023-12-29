document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Lakukan logika login di sini (validasi, panggil backend, dll.)

    // Redirect ke halaman index.html setelah login selesai
    window.location.href = 'index.html';
});
