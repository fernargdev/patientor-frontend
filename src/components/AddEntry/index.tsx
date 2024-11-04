import { EntryWithoutId } from '../../types';
import AddEntryForm from './AddEntryForm';

interface Props {
  onSubmit: (values: EntryWithoutId) => void;
}

const AddEntry = ({ onSubmit }: Props) => {
  return (
    <>
      <AddEntryForm onSubmit={onSubmit} />
    </>
  );
};

export default AddEntry;
