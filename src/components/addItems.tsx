// components/AddItems.tsx
import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';

interface AddItemsProps {
  open: boolean;
  handleClose: () => void;
  addItem: (itemName: string, itemDescription: string) => void;
  itemName: string;
  setItemName: (name: string) => void;
  itemDescription: string;
  setItemDescription: (description: string) => void;
}

const AddItems: React.FC<AddItemsProps> = ({ open, handleClose, addItem, itemName, setItemName, itemDescription, setItemDescription }) => {
  const handleAddItem = () => {
    addItem(itemName, itemDescription);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Item</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Item Name"
          fullWidth
          variant="outlined"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Item Description"
          fullWidth
          variant="outlined"
          value={itemDescription}
          onChange={(e) => setItemDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAddItem}>Add Item</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddItems;
