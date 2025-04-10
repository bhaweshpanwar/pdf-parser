````
# 📄 PDF Parser to JSON Converter

A lightweight web app that parses PDF files and converts the content into JSON format using **Node.js** and **pdf-parse**. Users can upload a PDF, and the output JSON is automatically generated and made available for download.

> 💡 Built to help extract structured data from PDFs for further processing or analysis.

---

## 🚀 Features

- 📥 Upload PDFs through a simple frontend
- 🧠 Extracts content using `pdf-parse`
- 📤 Generates downloadable JSON output
- 🗃️ Output stored in `/outputs` folder
- 💻 Built with Express and vanilla JS frontend

---

## 🧰 Tech Stack

- **Backend:** Node.js, Express
- **PDF Parsing:** [pdf-parse](https://www.npmjs.com/package/pdf-parse)
- **Frontend:** HTML, CSS, JavaScript
- **File Uploads:** multer

---

## 📁 Project Structure

```bash
pdf-parser/
├── public/
│   ├── index.html       # Upload interface
│   ├── script.js        # Handles PDF upload and response
│   └── style.css        # Simple styling
├── outputs/             # Folder for parsed JSON outputs
├── index.js             # Main server logic
├── package.json
└── .gitignore
````

---

## 🛠️ Installation

1. **Clone the repo**

```bash
git clone https://github.com/bhaweshpanwar/pdf-parser.git
cd pdf-parser
```

2. **Install dependencies**

```bash
npm install
```

3. **Run the server**

```bash
node index.js
```

4. **Open in browser**

Navigate to `http://localhost:3000` to use the interface.

---

## 📂 Output Example

A sample output might look like:

```json
{
  "pages": [
    {
      "text": "Chapter 1: Introduction\nWhat is PDF?\nPDF stands for Portable Document Format...",
      "pageNumber": 1
    },
    {
      "text": "Chapter 2: Parsing\nExtracting content from PDF requires...",
      "pageNumber": 2
    }
  ]
}
```

> ⚠️ **Note:** The JSON structure is not always fully hierarchical (e.g. chapters → topics → subtopics) due to limitations in parsing accuracy. Contributions to improve this structure are welcome!

---

## ⚙️ Known Issues / Limitations

- ❌ Structure extraction (headings, chapters, paragraphs) may be inconsistent for complex layouts
- 🧪 Needs better logic for semantic parsing (hierarchical JSON)
- 🛠️ Contributions to improve text parsing or add NLP techniques are welcome!

---

## 🤝 Contributing

If you'd like to improve the parsing accuracy or add new features (e.g. semantic structuring, better formatting), feel free to fork the repo and open a PR. All contributions are appreciated!

---

## 📬 Contact

Maintained by [Bhawesh Panwar](https://github.com/bhaweshpanwar) — feel free to reach out or open issues.

---

## 🪄 Future Plans

- [ ] Improve JSON hierarchy (Chapter → Topic → Subtopic → Paragraph)
- [ ] Add page-wise separation
- [ ] Support bulk PDF uploads
- [ ] Use NLP to detect section breaks

```



```
