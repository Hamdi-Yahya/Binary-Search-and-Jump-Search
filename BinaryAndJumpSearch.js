const fs = require("fs");
const { performance } = require("perf_hooks");
const prompt = require("prompt-sync")({ sigint: true });

// ===============================
// BINARY SEARCH
// ===============================
function binarySearch(arr, target) {
    let left = 0, right = arr.length - 1, steps = 0;
    while (left <= right) {
        steps++;
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return { index: mid, steps };
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return { index: -1, steps };
}

// ===============================
// JUMP SEARCH  (FINAL FIXED)
// ===============================
function jumpSearch(arr, target) {
    const n = arr.length;
    let step = Math.floor(Math.sqrt(n));
    let prev = 0;
    let steps = 0;

    while (prev < n && arr[Math.min(step, n) - 1] < target) {
        steps++;
        prev = step;
        step += Math.floor(Math.sqrt(n));
        if (prev >= n) return { index: -1, steps };
    }

    for (let i = prev; i < Math.min(step, n); i++) {
        steps++;
        if (arr[i] === target) return { index: i, steps };
    }

    return { index: -1, steps };
}

// ===============================
// BACA CSV MULTI-KOLOM (AUTO , / ;)
// ===============================
console.log("=== UAS Searching Algorithm ===");

const filePath = prompt("Masukkan nama/path file CSV: ");
if (!fs.existsSync(filePath)) {
    console.log("❌ File tidak ditemukan!");
    process.exit();
}

const raw = fs.readFileSync(filePath, "utf8").trim();
const firstLine = raw.split(/\r?\n/)[0];
const delimiter = (firstLine.match(/;/g) || []).length > (firstLine.match(/,/g) || []).length ? ";" : ",";

const rows = raw.split(/\r?\n/).map(row => row.split(delimiter));
const header = rows[0].map(h => h.trim());
const dataRows = rows.slice(1);

console.log("\n=== Daftar Kolom CSV ===");
header.forEach((col, i) => {
    console.log(`${i + 1}. ${col}`);
});

const colIndex = parseInt(prompt("\nPilih nomor kolom untuk pencarian: "), 10) - 1;
if (colIndex < 0 || colIndex >= header.length) {
    console.log("❌ Nomor kolom tidak valid!");
    process.exit();
}

let selectedData = dataRows.map(r => (r[colIndex] ?? "").trim()).filter(x => x !== "");
let isNumeric = selectedData.every(x => !isNaN(x));

if (isNumeric) {
    selectedData = selectedData.map(Number).sort((a, b) => a - b);
    console.log("\n📌 Mode: Pencarian Angka");
} else {
    selectedData = selectedData.sort((a, b) => a.localeCompare(b));
    console.log("\n📌 Mode: Pencarian Teks");
}

console.log("\n=== DATA TERURUT ===");
console.log(selectedData);
console.log(`Jumlah Data: ${selectedData.length}`);

let target = prompt("\nMasukkan nilai yang ingin dicari: ");
if (isNumeric) target = Number(target);

// ===============================
// BINARY SEARCH
// ===============================
let start = performance.now();
let binResult = binarySearch(selectedData, target);
let end = performance.now();
console.log("\n===== BINARY SEARCH =====");
console.log(binResult.index !== -1 ? "DITEMUKAN" : "❌ TIDAK DITEMUKAN");
console.log("Index   :", binResult.index);
console.log("Langkah :", binResult.steps);
console.log("Waktu   :", (end - start).toFixed(6), "ms");

// ===============================
// JUMP SEARCH
// ===============================
start = performance.now();
let jumpResult = jumpSearch(selectedData, target);
end = performance.now();
console.log("\n===== JUMP SEARCH =====");
console.log(jumpResult.index !== -1 ? "DITEMUKAN" : "❌ TIDAK DITEMUKAN");
console.log("Index   :", jumpResult.index);
console.log("Langkah :", jumpResult.steps);
console.log("Waktu   :", (end - start).toFixed(6), "ms");

console.log("\n=== PROGRAM SELESAI ===\n");