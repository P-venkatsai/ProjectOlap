const express = require('express');
const multer = require('multer');
const cors = require('cors'); // Add the cors middleware
const app = express();
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const port = 3000;

// Set up multer to handle file uploads and store them in the 'uploads' directory
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

app.use(cors()); // Enable CORS for all routes

// Set up a route to handle file uploads
app.post('/upload', upload.single('file'), (req, res) => 
{
  const pythonScript = 'mal2csv.py';
  const directoryPath = './uploads/output/';
  fs.readdirSync(directoryPath).forEach(file => {
    fs.unlinkSync(path.join(directoryPath, file));
    console.log(`Deleted: ${file}`);
  });
  let command = `python ${pythonScript} -i "./uploads/${req.file.filename}" -o "./uploads/output/"`;
  if(req.body.boolDeobfuscate)command=command +" -d true"
  if(req.body.boolOutputSuspicious)command=command +" -l true"
  if(req.body.boolphpids)command=command+" -p true"
  if(req.body.boolOutputIDS)command=command+" -r true"
  if(req.body.boolOutputInteresting)command=command+" -f true"
  if(req.body.MicrosoftIIS)command=command+" -m true"
  if(req.body.FileType)command=command+` -t ${req.body.FileType}`
  if(req.body.OutputFormat)command=command+` -e ${req.body.OutputFormat}`
  if(req.body.boolJSON)command=command+" -j true"
  if(req.body.customJsonFieldNames)command=command+` ---field-names ${req.body.customJsonFieldNames}`


  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Error executing Python script:', error);
      return res.status(500).send('Internal Server Error');
    }

    // Log the script output (stdout and stderr)
    console.log('Python script output:', stdout);
    console.error('Python script errors:', stderr);

    res.send('File uploaded and Python script executed successfully!');
  });
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
