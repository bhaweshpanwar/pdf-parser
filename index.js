const express = require('express');
const multer = require('multer');
const pdfparse = require('pdf-parse');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public')); // Serve static files from the 'public' directory
app.use('/outputs', express.static(path.join(__dirname, 'outputs'))); // Serve files from the 'outputs' directory under /outputs

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const outputsDir = path.join(__dirname, 'outputs');

async function ensureOutputsDirectoryExists() {
  try {
    await fs.mkdir(outputsDir, { recursive: true });
  } catch (error) {
    console.error('Error creating outputs directory:', error);
    throw error; // Re-throw the error to prevent the server from starting
  }
}

async function extractTextFromPdf(pdfBuffer) {
  try {
    const data = await pdfparse(pdfBuffer);
    return data.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    return null;
  }
}

/*function structureBookData(text) {
  const chapters = [];
  let currentChapter = null;
  let currentHeading = null;
  const lines = text.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    if (
      trimmedLine.startsWith('CHAPTER ') ||
      (trimmedLine.toUpperCase() === trimmedLine && trimmedLine.length > 10)
    ) {
      currentChapter = { title: trimmedLine, headings: [] };
      chapters.push(currentChapter);
      currentHeading = null;
    } else if (trimmedLine.length < 50 && trimmedLine.length > 5) {
      currentHeading = { title: trimmedLine, data: '' };
      if (currentChapter) currentChapter.headings.push(currentHeading);
    } else {
      if (currentHeading) {
        currentHeading.data += trimmedLine + '\n';
      } else if (currentChapter) {
        currentChapter.introduction =
          (currentChapter.introduction || '') + trimmedLine + '\n';
      }
    }
  }

  return { chapters: chapters };
}*/

function structureBookData(text) {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line);

  let bookTitle = lines[0] || 'Unknown Title';
  let authorName = lines.length > 1 ? lines[1] : 'Unknown Author';

  const chapters = [];
  let currentChapter = null;
  let currentHeading = null;
  let isFirstPage = true;

  for (const line of lines) {
    if (isFirstPage) {
      // Skip first-page lines after extracting title & author
      if (line.includes('CHAPTER ') || line.match(/chapter \d+/i)) {
        isFirstPage = false;
      } else {
        continue;
      }
    }

    if (
      line.match(/^CHAPTER\s+\d+/i) ||
      (line === line.toUpperCase() && line.length > 10)
    ) {
      // Start a new chapter
      currentChapter = { title: line, content: [], headings: [] };
      chapters.push(currentChapter);
      currentHeading = null;
    } else if (line.length < 50 && line.length > 5) {
      // This is likely a heading
      currentHeading = { title: line, paragraphs: [] };
      if (currentChapter) {
        currentChapter.headings.push(currentHeading);
      }
    } else {
      // Normal paragraph, assign it to the right place
      if (currentHeading) {
        currentHeading.paragraphs.push(line);
      } else if (currentChapter) {
        currentChapter.content.push(line);
      }
    }
  }

  return {
    title: bookTitle,
    author: authorName,
    chapters,
  };
}

app.post('/api/v1/upload', upload.single('pdfFile'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send('No File Uploaded');

    const pdfBuffer = req.file.buffer;
    const extractedText = await extractTextFromPdf(pdfBuffer);
    if (!extractedText)
      return res.status(500).send('Failed to extract text from PDF');

    const structuredData = structureBookData(extractedText);
    const filename = `output_${Date.now()}.json`;
    const filePath = path.join(outputsDir, filename);

    await fs.writeFile(filePath, JSON.stringify(structuredData, null, 2));

    // Send the filename *only*
    res.json({ filename: filename }); //Send only the filename for security purposes
  } catch (error) {
    console.error('Error processing upload:', error);
    res.status(500).json({ error: 'An error occurred during processing.' });
  }
});

ensureOutputsDirectoryExists()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error('Failed to start server:', err));
