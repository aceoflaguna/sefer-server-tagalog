const bookSelect = document.getElementById("book");
const results = document.getElementById("results");

loadBooks();

async function loadBooks() {
  const books = await fetch("/api/books").then((r) => r.json());

  books.forEach((b) => {
    const op = document.createElement("option");

    op.value = b.id;
    op.textContent = b.name;

    bookSelect.appendChild(op);
  });
}

document.getElementById("btnSearch").onclick = search;

document.getElementById("search").addEventListener("keypress", (e) => {
  if (e.key === "Enter") search();
});

async function search() {
  const keyword = document.getElementById("search").value;

  const book = bookSelect.value;

  const rows = await fetch(
    `/api/search?keyword=${encodeURIComponent(keyword)}&book=${book}`,
  ).then((r) => r.json());

  results.innerHTML = "";

  rows.forEach((r) => {
    const div = document.createElement("div");

    div.className = "card";

    const highlighted = highlight(r.text, keyword);

    div.innerHTML = `
    <div class="card-body">

        <h5>${r.book} ${r.chapter}:${r.verse}</h5>

        <p>${highlighted}</p>

        <textarea
            class="form-control editor"
            rows="3">${r.text}</textarea>

        <div class="mt-2">
            <button class="btn btn-success save">Save</button>
            <button class="btn btn-secondary cancel">Cancel</button>
        </div>

        <button class="btn btn-danger btn-sm remove-btn">
            Remove
        </button>

    </div>
    `;

    const textarea = div.querySelector(".editor");
    const saveBtn = div.querySelector(".save");
    const cancelBtn = div.querySelector(".cancel");
    const removeBtn = div.querySelector(".remove-btn");

    textarea.style.display = "none";
    saveBtn.style.display = "none";
    cancelBtn.style.display = "none";

    textarea.addEventListener("input", () => {
      textarea.style.display = "block";

      saveBtn.style.display = "inline-block";

      cancelBtn.style.display = "inline-block";
    });

    textarea.style.display = "block";

    const original = r.text;

    textarea.oninput = () => {
      if (textarea.value !== original) {
        saveBtn.style.display = "inline-block";
        cancelBtn.style.display = "inline-block";
      } else {
        saveBtn.style.display = "none";
        cancelBtn.style.display = "none";
      }
    };

saveBtn.onclick = async () => {

    const response = await fetch("/api/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: r.id,
            text: textarea.value
        })
    });

    const result = await response.json();

    if (result.success) {
        div.style.transition = "opacity .3s";
        div.style.opacity = "0";

        setTimeout(() => {
            div.remove();
        }, 300);
    }
};

    cancelBtn.onclick = () => {
      textarea.value = original;

      saveBtn.style.display = "none";
      cancelBtn.style.display = "none";
    };

    removeBtn.onclick = () => {
        div.remove();
    };


    results.appendChild(div);
  });
}

function highlight(text, word) {
  if (!word) return text;

  const regex = new RegExp(`(${escapeRegex(word)})`, "gi");

  return text.replace(regex, "<span class='highlight'>$1</span>");
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
