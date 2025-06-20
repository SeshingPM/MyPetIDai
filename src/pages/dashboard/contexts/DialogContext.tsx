
import React, { createContext, useContext, useState } from 'react';
import AddPetDialog from './dialogs/AddPetDialog';

export interface DialogContextType {
  isAddPetDialogOpen: boolean;
  openAddPetDialog: () => void;
  closeAddPetDialog: () => void;
  openAddReminderDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [isAddPetDialogOpen, setIsAddPetDialogOpen] = useState(false);

  const openAddPetDialog = () => setIsAddPetDialogOpen(true);
  const closeAddPetDialog = () => setIsAddPetDialogOpen(false);
  
  const openAddReminderDialog = () => {
    // This function doesn't need to do anything - just a stub for type compatibility
    console.log("Add reminder dialog requested");
  };

  return (
    <DialogContext.Provider value={{ 
      isAddPetDialogOpen, 
      openAddPetDialog, 
      closeAddPetDialog,
      openAddReminderDialog
    }}>
      {children}
      <AddPetDialog isOpen={isAddPetDialogOpen} onClose={closeAddPetDialog} />
    </DialogContext.Provider>
  );
};

export const useDialogs = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialogs must be used within a DialogProvider');
  }
  return context;
};
