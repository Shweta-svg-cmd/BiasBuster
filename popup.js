document.addEventListener("DOMContentLoaded", function () {
    console.log("Popup loaded successfully!");

    let analyzeButton = document.getElementById("analyze-btn");
    let resultDiv = document.getElementById("result");

    if (!analyzeButton || !resultDiv) {
        console.error("Missing elements in popup.html");
        return;
    }

    analyzeButton.addEventListener("click", function () {
        console.log("Analyze button clicked");

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript(
                {
                    target: { tabId: tabs[0].id },
                    func: extractArticleText
                },
                (results) => {
                    if (!results || !results[0] || !results[0].result) {
                        resultDiv.innerHTML = "Failed to extract article text.";
                        return;
                    }

                    let articleText = results[0].result;
                    console.log("Extracted text:", articleText);

                    fetch("http://127.0.0.1:5000/predict", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ text: articleText })
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.error) {
                                resultDiv.innerHTML = `<p style="color: red;">${data.error}</p>`;
                            } else {
                                resultDiv.innerHTML = `
                                    <h3>Original Text with Bias Highlighted:</h3>
                                    <p>${data.biased_text}</p>
                                    <h3>Bias-Free Version:</h3>
                                    <p>${data.corrected_text}</p>
                                `;
                            }
                        })
                        .catch(error => {
                            console.error("Fetch error:", error);
                            resultDiv.innerHTML = `<p style="color: red;">Server Error: Unable to fetch results.</p>`;
                        });
                }
            );
        });
    });

    function extractArticleText() {
        return document.body.innerText;
    } 
});
