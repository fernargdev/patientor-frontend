import {
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
} from '@mui/material';

import { Diagnose, EntryWithoutId } from '../../types';
import AddEntryForm from './AddEntryForm';

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: EntryWithoutId) => void;
  error?: string;
  diagnoses: Diagnose[];
}

const AddEntryModal = ({
  modalOpen,
  onClose,
  onSubmit,
  error,
  diagnoses,
}: Props) => {
  return (
    <Dialog fullWidth={true} open={modalOpen} onClose={() => onClose()}>
      <DialogTitle>Add a New Entry</DialogTitle>
      <Divider />
      <DialogContent>
        {error && <Alert severity="error">{`Error: ${error}`}</Alert>}
        <AddEntryForm
          onSubmit={onSubmit}
          onCancel={onClose}
          diagnoses={diagnoses}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddEntryModal;
