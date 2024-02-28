const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();
const multer  = require('multer');
const port = 2000;
const upload = multer({ dest: 'uploads/' });
const path = require('path');



// Middleware to enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Replace with your frontend URL
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.post('/upload', upload.single('mp4Data'), (req, res) => {
    const video = req.file;
    
    if (!video) {
        res.status(400).send('No video uploaded.');
        return;
    }
    
    const tempPath = video.path;
    const targetPath = path.join(__dirname, './recorded_video.mp4');
    
    fs.rename(tempPath, targetPath, (err) => {
        if (err) {
        console.error(`Error moving file: ${err}`);
        res.status(500).send('Error moving file');
        return;
        }
    
        res.status(200).send('File uploaded successfully');
    });
});

app.get('/nodding-pigeon', (req, res) => {
    const pythonScriptPath = '../../python-backend/new.py';


    exec(`python3 ${pythonScriptPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing Python script: ${error}`);
            res.status(500).send('Error executing Python script');
            return;
        }
        
        console.log('Python script output:');
        console.log(stderr, stdout);



        fs.readFile('./result.json', 'utf8', (err, data) => {
            if (err) {
                console.error(`Error reading result.json: ${err}`);
                res.status(500).send('Error reading result.json');
                return;
            }

            res.send(data);
        });
    });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
