import {
  Container,
  Typography,
  Box,
  TextField,
  CircularProgress,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Card,
  CardContent
} from '@mui/material'
import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [emailContent, setEmailContent] = useState('')
  const [tone, setTone] = useState('')
  const [generatedReply, setGeneratedReply] = useState('')
  const [loading, setLoading] = useState(false)

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await axios.post(
        'http://localhost:8080/api/email/generate',
        { emailContent, tone }
      )

      setGeneratedReply(
        typeof response.data === 'string'
          ? response.data
          : JSON.stringify(response.data)
      )

      setSnackbar({
        open: true,
        message: 'Reply generated successfully!',
        severity: 'success'
      })
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to generate reply',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReply)
    setSnackbar({
      open: true,
      message: 'Copied to clipboard!',
      severity: 'info'
    })
  }

  const handleClear = () => {
    setEmailContent('')
    setGeneratedReply('')
    setTone('')
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Email Reply Generator
      </Typography>

      {/* Input Card */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            label="Original Email Content"
            placeholder="Paste the email you received here..."
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Typography variant="caption" color="text.secondary">
            {emailContent.length} characters
          </Typography>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Tone (Optional)</InputLabel>
            <Select
              value={tone}
              label="Tone (Optional)"
              onChange={(e) => setTone(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="Professional">Professional</MenuItem>
              <MenuItem value="Friendly">Friendly</MenuItem>
              <MenuItem value="Casual">Casual</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              disabled={!emailContent || loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Generate Reply'}
            </Button>

            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={handleClear}
            >
              Clear
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Output Card */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            label="Generated Reply"
            value={generatedReply}
            inputProps={{ readOnly: true }}
            sx={{ mb: 2 }}
          />

          <Button
            variant="outlined"
            onClick={handleCopy}
            disabled={!generatedReply}
          >
            Copy to Clipboard
          </Button>
        </CardContent>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default App
