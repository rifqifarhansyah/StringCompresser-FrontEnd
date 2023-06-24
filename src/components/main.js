import React, { useState } from 'react';
import {
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  Snackbar,
  Select,
  MenuItem
} from '@mui/material';
import axios from 'axios';

function LZWCompression() {
  const [inputEncoder, setInputEncoder] = useState('');
  const [inputDecoder, setInputDecoder] = useState('');
  const [encodedOutput, setEncodedOutput] = useState('');
  const [decodedOutput, setDecodedOutput] = useState('');
  const [outputChoice, setOutputChoice] = useState("binary"); // "binary" atau "decimal"
  const [inputChoice, setInputChoice] = useState("binary"); // "binary" atau "decimal"
  const [error, setError] = useState(""); // State untuk pesan kesalahan
  const [showError, setShowError] = useState(false); // State untuk menampilkan pop-up informasi
  const [algorithm, setAlgorithm] = useState("LZW");

  // const api = axios.create({
  //   baseURL: 'http://localhost:5000',
  // });
  const api = axios.create({
    baseURL: 'https://string-compresser-backend.vercel.app',
  });
  
    const handleCloseError = () => {
      // Fungsi penanganan penutupan pop-up informasi
      setShowError(false);
    };
  
    // Fungsi untuk memvalidasi string sebagai bilangan biner
    const isValidBinary = (input) => {
      const binaryRegex = /^[01\s]+$/; // Regular expression untuk bilangan biner
      return binaryRegex.test(input);
    };
    
    // Fungsi untuk memvalidasi string sebagai bilangan desimal
    const isValidDecimal = (input) => {
        const decimalRegex = /^[\d\s]+$/; // Regular expression untuk bilangan desimal dengan spasi
      return decimalRegex.test(input);
    };
    
    const encode = () => {
        if (algorithm === "LZW") {
          console.log("encode")
          api
            .post('/api/encode', {inputEncoder, outputChoice })
            .then((response) => {
              setEncodedOutput(response.data.encodedOutput);
            })
            .catch((error) => {
              console.error('Error:', error);
            });
          console.log("encode front end selesai")
        } else if (algorithm === "Huffman") {
          api
            .post('/api/huffmanEncode', {inputEncoder, outputChoice })
            .then((response) => {
              setEncodedOutput(response.data.encodedOutput);
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        }
      };
      
      const decode = () => {
        if (algorithm === "LZW") {
          api
            .post("/api/decode", { inputDecoder, inputChoice })
            .then((response) => {
              setDecodedOutput(response.data.decodedOutput);
            })
            .catch((error) => {
              console.error("Error:", error);
            })
            .finally(() => {
              if (
                (inputChoice === "binary" && !isValidBinary(inputDecoder)) ||
                (inputChoice === "decimal" && !isValidDecimal(inputDecoder))
              ) {
                setError("Invalid input format");
                setShowError(true);
              }
            });
        } else if (algorithm === "Huffman") {
          api
            .post("/api/huffmanDecode", {inputDecoder, inputChoice })
            .then((response) => {
              setDecodedOutput(response.data.decodedOutput);
            })
            .catch((error) => {
              console.error("Error:", error);
            })
            .finally(() => {
              if (
                (inputChoice === "binary" && !isValidBinary(inputDecoder)) ||
                (inputChoice === "decimal" && !isValidDecimal(inputDecoder))
              ) {
                setError("Invalid input format");
                setShowError(true);
              }
            });
        }
      };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h2" gutterBottom sx={{ textAlign: 'center' }}>
        Text Compresser
      </Typography>
      <Select
          labelId="algorithm-select-label"
          id="algorithm-select"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          displayEmpty
          style={{ marginBottom: '2rem'}}
        >
          <MenuItem value="" disabled>
            Select Algorithm
          </MenuItem>
          <MenuItem value="LZW">LZW</MenuItem>
          <MenuItem value="Huffman">Huffman</MenuItem>
        </Select>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h4" sx={{ textAlign: 'center' }}>
              Encoder
            </Typography>
            <TextField
              value={inputEncoder}
              onChange={(e) => setInputEncoder(e.target.value)}
              label="Masukkan teks yang akan di-encode"
              multiline
              fullWidth
            />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Output Choice:
            </Typography>
            <RadioGroup
              row
              aria-label="output-choice"
              name="output-choice"
              value={outputChoice}
              onChange={(e) => setOutputChoice(e.target.value)}
              sx={{ mb: 1 }}
            >
              <FormControlLabel
                value="binary"
                control={<Radio />}
                label="Binary Code"
              />
              <FormControlLabel
                value="decimal"
                control={<Radio />}
                label="Decimal Value"
              />
            </RadioGroup>
            <Button variant="contained" onClick={encode} sx={{ mt: 1 }}>
              Encode
            </Button>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Encoded Output:
            </Typography>
            <Typography>{encodedOutput}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h4" sx={{ textAlign: 'center' }}>
              Decoder
            </Typography>
            <TextField
              value={inputDecoder}
              onChange={(e) => setInputDecoder(e.target.value)}
              label="Masukkan teks yang akan di-decode"
              multiline
              fullWidth
            />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Input Choice:
            </Typography>
            <RadioGroup
              row
              aria-label="input-choice"
              name="input-choice"
              value={inputChoice}
              onChange={(e) => setInputChoice(e.target.value)}
              sx={{ mb: 1 }}
            >
              <FormControlLabel
                value="binary"
                control={<Radio />}
                label="Binary Code"
              />
              <FormControlLabel
                value="decimal"
                control={<Radio />}
                label="Decimal Value"
              />
            </RadioGroup>
            <Button variant="contained" onClick={decode} sx={{ mt: 1 }}>
              Decode
            </Button>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Decoded Output:
            </Typography>
            <Typography>{decodedOutput}</Typography>
          </Paper>
        </Grid>
      </Grid>
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        message={error}
      />
    </div>
  );
}

export default LZWCompression;
