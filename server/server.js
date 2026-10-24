
const express = require('express')
const cors = require('cors')
const multer = require('multer')
const pdfParse = require('pdf-parse')

const app = express()
const PORT = 5000

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
        cb(null, true)
        } else {
        cb(new Error('Only PDF files are allowed!'))
        }
    },
})


app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Learnova backend is running!')
})


app.post('/api/analyze-syllabus', upload.single('syllabus'), async (req, res) => {
    try {
        if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'Please upload a PDF syllabus.',
        })
        }

        const result = await pdfParse(req.file.buffer)

        if (!result.text.trim()) {
        return res.status(400).json({
            success: false,
            message: 'No readable text found in this PDF.',
        })
        }

        res.json({
        success: true,
        filename: req.file.originalname,
        text: result.text,
        message: 'Syllabus text extracted successfully!',
        })
    } catch (error) {
        console.error('PDF analysis error:', error)
        res.status(500).json({
        success: false,
        message: 'Could not read the PDF file.',
        })
    }
})


app.listen(PORT, () => {
    console.log(`Learnova server running at http://localhost:${PORT}`)
})
