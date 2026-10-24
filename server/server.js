
const { Ollama } = require('ollama')
const ollama = new Ollama({ host: 'http://127.0.0.1:11434' })
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

        const aiResponse = await ollama.chat({
            model: 'gemma2:2b',
            messages: [
                {
                    role: 'system',
                    content: `You are Learnova, an educational study assistant.
Analyze the provided syllabus and identify its important topics.
Return:
1. A brief syllabus overview
2. A list of important topics
3. A suggested study order
4. Five practice questions based on the syllabus.
Only use information supported by the syllabus.`,
                },
                {
                    role: 'user',
                    content: `Analyze this syllabus: Variables, Loops, Functions. List 3 important topics.`,
                },
            ],
        })

        res.json({
            success: true,
            filename: req.file.originalname,
            text: result.text,
            analysis: aiResponse.message.content,
            message: 'Syllabus analyzed successfully!',
        })
    } catch (error) {
        console.error('Syllabus analysis error:', error)
        res.status(500).json({
            success: false,
            message: 'Could not analyze the syllabus. Check the backend terminal for details.',
        })
    }
})



app.listen(PORT, () => {
    console.log(`Learnova server running at http://localhost:${PORT}`)
})
