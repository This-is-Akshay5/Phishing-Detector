async function checkURL() {
    const url = document.getElementById('urlInput').value;
    const result = document.getElementById('urlResult');
    
    if (!url) {
        result.innerHTML = "⚠️ Please enter a URL!";
        return;
    }
    
    result.innerHTML = "⏳ Checking...";
    
    try {
        const response = await fetch('/check-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });
        const data = await response.json();
        result.innerHTML = data.message;
    } catch (error) {
        result.innerHTML = "❌ Error checking URL.";
    }
}

async function checkEmail() {
    const email = document.getElementById('emailInput').value;
    const result = document.getElementById('emailResult');

    if (!email) {
        result.innerHTML = "⚠️ Please enter an email!";
        return;
    }
    
    result.innerHTML = "⏳ Checking...";
    
    try {
        const response = await fetch('/check-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        result.innerHTML = data.message;
    } catch (error) {
        result.innerHTML = "❌ Error checking email.";
    }
}
