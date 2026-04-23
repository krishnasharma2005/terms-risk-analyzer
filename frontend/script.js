let lastData = null;
// ---------- GLOBAL SAFEGUARDS ----------
console.log("SCRIPT LOADED");

// Block any accidental form submissions anywhere
document.addEventListener("submit", function (e) {
    e.preventDefault();
});

// Detect if anything tries to reload the page
window.addEventListener("beforeunload", function () {
    console.log(" PAGE IS RELOADING");
});

// ---------- API CALLS ----------

async function analyzeText() {
    console.log("TEXT FUNCTION CALLED");

    try {
        let text = document.getElementById("textInput").value;

        if (!text || text.trim() === "") {
            console.log("No text entered");
            return;
        }

        let formData = new FormData();
        formData.append("text", text);

        let res = await fetch("http://127.0.0.1:8000/analyze-text", {
            method: "POST",
            body: formData
        });

        console.log("STATUS:", res.status);

        let data = await res.json();
        console.log("DATA:", data);
        lastData = data;
        display(data);

    } catch (err) {
        console.error("TEXT ERROR:", err);
    }
}


async function analyzeFile() {
    console.log("FILE FUNCTION CALLED");

    try {
        let file = document.getElementById("fileInput").files[0];

        if (!file) {
            console.log("No file selected");
            return;
        }

        let formData = new FormData();
        formData.append("file", file);

        let res = await fetch("http://127.0.0.1:8000/analyze-file", {
            method: "POST",
            body: formData
        });

        console.log("STATUS:", res.status);

        let data = await res.json();
        console.log("DATA:", data);
        lastData = data;
        display(data);


    } catch (err) {
        console.error("FILE ERROR:", err);
    }
}
function highlight(text) {
    let keywords = [
        "liable",
        "liability",
        "refund",
        "non-refundable",
        "terminate",
        "termination",
        "penalty",
        "interest",
        "charges",
        "damages",
        "third parties"
    ];

    keywords.forEach(word => {
        let regex = new RegExp(word, "gi");
        text = text.replace(regex, (match) => `<mark>${match}</mark>`);
    });

    return text;
}

// ---------- DISPLAY FUNCTION ----------

function display(data) {
    try {
        console.log("DISPLAY RUNNING", data);

        // Safety: ensure valid object
        if (!data || typeof data !== "object") {
            document.getElementById("output").innerHTML = "Invalid response";
            return;
        }

        let output = "";

        // Overall Risk
        let risk = data.overall_risk || "Low";
        output += `<h2>Overall Risk: <span class="${risk.toLowerCase()}">${risk}</span></h2>`;
        let scorePercent = risk === "High" ? 80 :
                   risk === "Medium" ? 50 : 20;

        output += `
        <div class="meter">
            <div class="meter-fill" style="width:${scorePercent}%"></div>
        </div>
        `;  
        // Summary Section
        output += `<h3>Summary</h3>`;

        if (data.summary && typeof data.summary === "object") {
            for (let category in data.summary) {
                let item = data.summary[category];

                if (!item) continue;

                let count = item.count || 0;
                let severity = item.severity || "Unknown";

                output += `<p>${category}: ${count} (${severity})</p>`;
            }
        } else {
            output += `<p>No summary available</p>`;
        }

        // Detailed Risks
        if (data.risks && data.risks.length > 0) {
    output += `<h3>Detected Risks</h3>`;

    data.risks.forEach(r => {
        output += `
            <div class="risk-card">
                <h4>${r.category.toUpperCase()} (${r.severity})</h4>
                <p>${highlight(r.simplified || r.clause)}</p>
                <p><i>${r.explanation || ""}</i></p>
            </div>
        `;
    });
}

        document.getElementById("output").innerHTML = output;
        document.getElementById("output").scrollIntoView({ behavior: "smooth" });

    } catch (err) {
        console.error("DISPLAY ERROR:", err);
        document.getElementById("output").innerHTML = "Error displaying results";
    }
}


// ---------- EVENT BINDING (SAFE) ----------

window.addEventListener("DOMContentLoaded", function () {

    let textBtn = document.getElementById("textBtn");
    let fileBtn = document.getElementById("fileBtn");

    if (textBtn) {
        textBtn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            analyzeText();
        });
    }

    if (fileBtn) {
        fileBtn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            analyzeFile();
        });
    }

});
window.addEventListener("DOMContentLoaded", function () {

    const outputDiv = document.getElementById("output");

    const observer = new MutationObserver(() => {
        console.log("🚨 OUTPUT WAS MODIFIED:", outputDiv.innerHTML);
    });

    observer.observe(outputDiv, { childList: true, subtree: true });

});
function downloadReport() {
    if (!lastData) {
        alert("No data to download!");
        return;
    }

    let content = "";

    // Title
    content += "=== Terms & Conditions Risk Report ===\n\n";

    // Overall risk
    content += `Overall Risk: ${lastData.overall_risk}\n\n`;

    // Summary
    content += "Summary:\n";
    if (lastData.summary) {
        for (let category in lastData.summary) {
            let item = lastData.summary[category];
            content += `- ${category}: ${item.count} (${item.severity})\n`;
        }
    }

    content += "\nDetailed Risks:\n";

    // Details
    if (lastData.risks) {
        lastData.risks.forEach(r => {
            content += `\n[${r.category.toUpperCase()} - ${r.severity}]\n`;
            content += `Clause: ${r.simplified || r.clause}\n`;
            content += `Why risky: ${r.explanation}\n`;
        });
    }

    // Create file
    let blob = new Blob([content], { type: "text/plain" });
    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.download = "risk_report.txt";
    a.click();
}