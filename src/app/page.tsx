"use client";

import { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/firebase';
import Login from '../components/login';
import Signup from '../components/Signup';
import PantryList from '../components/pantryList';
import AddItems from '../components/addItems';
import { collection, doc, getDoc, setDoc, deleteDoc, getDocs, query } from 'firebase/firestore';
import { firestore } from '@/firebase';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState(""); 
  const [pantry, setPantry] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        // Fetch user data when authenticated
        try {
          const userDocRef = doc(firestore, `users/${user.uid}`);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setDisplayName(userData.displayName || 'User');
          } else {
            setDisplayName('User');
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setDisplayName('User');
        }

        updatePantry(user.uid);
      } else {
        setPantry([]);
        setDisplayName(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Sign out error", error);
    }
  };

  const updatePantry = async (userId: string) => {
    try {
      const userPantryRef = collection(firestore, `users/${userId}/pantry`);
      const snapshot = query(userPantryRef);
      const docs = await getDocs(snapshot);

      const pantryList = docs.docs.map(doc => ({
        name: doc.id,
        ...doc.data()
      }));

      setPantry(pantryList);
    } catch (error) {
      console.error("Error updating pantry", error);
    }
  };

  const addItem = async (itemName: string, itemDescription: string) => {
    if (!user) return;

    const docRef = doc(firestore, `users/${user.uid}/pantry`, itemName);
    const docSnap = await getDoc(docRef);
    const dateAdded = new Date();

    try {
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          description: itemDescription,
          dateAdded: dateAdded.toISOString(),
          quantity: 1,
        });
      } else {
        const data = docSnap.data();
        const { quantity } = data;
        await setDoc(docRef, {
          description: itemDescription,
          dateAdded: dateAdded.toISOString(),
          quantity: quantity + 1,
        });
      }
      await updatePantry(user.uid);
    } catch (error) {
      console.error("Error adding item", error);
    }
  };

  const removeItem = async (itemName: string) => {
    if (!user) return;

    const docRef = doc(firestore, `users/${user.uid}/pantry`, itemName);
    const docSnap = await getDoc(docRef);

    try {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const { quantity } = data;

        if (quantity === 1) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, {
            ...data,
            quantity: quantity - 1,
          });
        }
        await updatePantry(user.uid);
      }
    } catch (error) {
      console.error("Error removing item", error);
    }
  };

  const filteredPantry = pantry.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      bgcolor="#f0f2f5"
    >
      <Box
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="center" 
        padding={3}
        sx={{ backgroundColor: "#4a90e2", color: "#fff", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}
      >
        <Typography variant="h4" fontWeight="bold">
          {user ? `Welcome Back, ${displayName || 'User'}!` : 'Inventory Manager'}
        </Typography>
      </Box>

      <Box
        flex="1"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={3}
      >
        {user ? (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpen(true)}
              sx={{ marginBottom: 2, borderRadius: '20px' }}
            >
              Add New Item
            </Button>

            <AddItems
              open={open}
              handleClose={() => setOpen(false)}
              addItem={addItem}
              itemName={itemName}
              setItemName={setItemName}
              itemDescription={itemDescription}
              setItemDescription={setItemDescription}
            />

            <Box
              width="90%"
              maxWidth="800px"
              border="1px solid #ddd"
              borderRadius={2}
              boxShadow={3}
              bgcolor="#fff"
              overflow="hidden"
              mt={2}
            >
              <Box
                width="100%"
                bgcolor="#e1e8ed"
                display="flex"
                justifyContent="center"
                alignItems="center"
                padding={2}
                borderBottom="1px solid #ddd"
              >
                <Typography variant="h5" color="#333" fontWeight="bold">
                  Inventory Items
                </Typography>
              </Box>

              <Box
                display="flex"
                justifyContent="center"
                margin={2}
              >
                <TextField
                  label="Search Items"
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  fullWidth
                  sx={{ maxWidth: 500 }}
                />
              </Box>

              <PantryList pantry={filteredPantry} removeItem={removeItem} addItem={addItem} />

            </Box>

            <Button variant="outlined" color="secondary" onClick={handleSignOut} sx={{ marginTop: 2, borderRadius: '20px' }}>
              Sign Out
            </Button>
          </>
        ) : (
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            alignItems="center"
            justifyContent="center"
            gap={2}
            width="100%"
          >
            <Signup setUser={setUser} />
            <Login setUser={setUser} />
          </Box>
        )}
      </Box>

      <Box
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        padding={3}
        sx={{ backgroundColor: "#4a90e2", color: "#fff" }}
      >
        <Typography variant="body2">
          &copy; 2024 My Inventory App
        </Typography>
      </Box>
    </Box>
  );
}
