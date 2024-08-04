import { useState } from 'react';
import { Box, Stack, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

interface PantryItem {
  name: string;
  description: string;
  dateAdded: string;
  quantity: number;
}

interface PantryListProps {
  pantry: PantryItem[];
  removeItem: (itemName: string) => void;
  addItem: (itemName: string, itemDescription: string) => void;
}

export default function PantryList({ pantry, addItem, removeItem }: PantryListProps) {
  const [selectedItem, setSelectedItem] = useState<PantryItem | null>(null);

  const handleClickItem = (item: PantryItem) => {
    setSelectedItem(item);
  };

  const handleClose = () => {
    setSelectedItem(null);
  };

  return (
    <>
      <Stack
        width="100%"
        maxWidth="800px"
        height="300px"
        spacing={2}
        overflow="auto"
        padding={2}
        sx={{
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f0f2f5', // Consistent background color
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '6px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        }}
      >
        {pantry.map((item) => (
          <Box
            key={item.name}
            width="100%"
            minHeight="80px"
            bgcolor="#fff" // Consistent background color
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            padding={2}
            borderRadius={2}
            boxShadow={3}
            sx={{
              transition: 'transform 0.2s ease-in-out',
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: 6,
              },
            }}
            onClick={() => handleClickItem(item)}
          >
            {/* Name */}
            <Typography variant="h6" color="text.primary">
              {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
            </Typography>

            {/* Quantity */}
            <Stack direction="row" alignItems="center" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  addItem(item.name, item.description);
                }}
                sx={{ minWidth: '40px', padding: '6px 10px' }}
              >
                +
              </Button>
              <Typography variant="h6" color="text.primary">
                {item.quantity}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(item.name);
                }}
                sx={{ minWidth: '40px', padding: '6px 10px' }}
              >
                -
              </Button>
            </Stack>
          </Box>
        ))}
      </Stack>

      {/* Item Details Dialog */}
      <Dialog open={!!selectedItem} onClose={handleClose}>
        <DialogTitle>Item Details</DialogTitle>
        <DialogContent>
          {selectedItem && (
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {selectedItem.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                Description: {selectedItem.description}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Date Added: {new Date(selectedItem.dateAdded).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Quantity: {selectedItem.quantity}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <Button
            onClick={() => {
              if (selectedItem) {
                removeItem(selectedItem.name);
                handleClose();
              }
            }}
            color="secondary"
          >
            Remove Item
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
