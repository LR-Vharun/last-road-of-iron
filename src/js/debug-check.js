console.log("DEBUG: debug-check.js loaded and executed.");
document.body.style.border = "5px solid green";
const log = document.getElementById('narrative-log');
if (log) {
    const p = document.createElement('p');
    p.textContent = "DEBUG: JS Environment Active.";
    p.style.color = "lime";
    log.appendChild(p);
}
