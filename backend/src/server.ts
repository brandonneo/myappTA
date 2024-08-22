import express from 'express';
import cors from 'cors';
import multer from 'multer';
import Papa from 'papaparse'; // Import PapaParse
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
  const filePath = path.join(__dirname, '../uploads', req.file?.filename || '');
  const results: any[] = [];

  Papa.parse(fs.createReadStream(filePath), {
    header: true, // Assuming CSV has a header row
    complete: (parsedResults: { data: any; }) => {
      results.push(...parsedResults.data);
      fs.unlinkSync(filePath); // Clean up file after processing
      res.json(results);
    },
    error: (error: any) => {
      fs.unlinkSync(filePath); // Clean up file if error occurs
      res.status(500).send('Error parsing CSV');
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
