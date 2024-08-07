import { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Alert } from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "@/firebase";

async function addUserToFirestore(userId: string, email: string, displayName: string)  {
  try {
    const userDocRef = doc(firestore, 'users', userId);
    const userData = { email, displayName };
    await setDoc(userDocRef, userData);
  } catch (e) {
    console.error('Error writing user document: ', e);
  }
}

export default function Signup({ setUser }: { setUser: (user: any) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await addUserToFirestore(user.uid, email, displayName);
      setUser(user);
      setError("");
    } catch (error) {
      console.error("Signup error:", error);
      setError("Failed to create an account.");
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 400, width: '100%', bgcolor: "#fff", borderRadius: 2, boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Sign Up
      </Typography>

      <TextField
        label="Display Name"
        variant="outlined"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        margin="normal"
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Email"
        variant="outlined"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Password"
        variant="outlined"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
        fullWidth
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSignup}
        fullWidth
        sx={{ borderRadius: '20px', mt: 2 }}
      >
        Sign Up
      </Button>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Paper>
  );
}
