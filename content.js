async function analyzeBias(articleText) {
    try {
        const response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: articleText }),
        });

        const result = await response.json();
        if (result.bias === true) {
            alert("⚠️ This article contains biased content!");
        } else {
            alert("✅ This article appears unbiased.");
        }
    } catch (error) {
        console.error("❌ Error analyzing bias:", error);
    }
}

// Example: Extract text from article (Modify this for real website parsing)
const articleText = document.body.innerText;
analyzeBias(articleText);
