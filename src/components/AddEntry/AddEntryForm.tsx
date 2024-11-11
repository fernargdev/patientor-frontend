import { useState, SyntheticEvent } from 'react';
import { TextField, Grid, Button } from '@mui/material';
import { Diagnose, EntryWithoutId, HealthCheckRating } from '../../types';

interface Props {
  onCancel: () => void;
  onSubmit: (values: EntryWithoutId) => void;
}

const AddEntryForm = ({ onCancel, onSubmit }: Props) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');

  const [diagnosisCodes, setdiagnosisCodes] = useState<Array<Diagnose['code']>>(
    []
  );

  const [healthCheckRating, setHealthCheckRating] = useState(
    HealthCheckRating.Healthy
  );

  // const addEntry = () => {
  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();

    const baseEntry = {
      description,
      date,
      specialist,
      diagnosisCodes,
    };

    onSubmit({
      type: 'HealthCheck',
      ...baseEntry,
      healthCheckRating,
    });
  };

  return (
    <div>
      <form onSubmit={addEntry}>
        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />

        <TextField
          label="Date"
          fullWidth
          value={date}
          onChange={({ target }) => setDate(target.value)}
        />

        <TextField
          label="Specialist"
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />

        <TextField
          label="Healthcheck Rating"
          fullWidth
          value={healthCheckRating}
          onChange={({ target }) => {
            const healthCheckRatingValue = Number(target.value);
            if (
              healthCheckRatingValue === 0 ||
              healthCheckRatingValue === 1 ||
              healthCheckRatingValue === 2 ||
              healthCheckRatingValue === 3
            ) {
              setHealthCheckRating(healthCheckRatingValue);
            }
          }}
        />

        <TextField
          label="Diagnose codes"
          fullWidth
          value={diagnosisCodes}
          onChange={({ target }) => {
            const diagnosisCodesArray = target.value.split(', ');
            console.log(diagnosisCodesArray);
            setdiagnosisCodes(diagnosisCodesArray);
          }}
        />

        <Grid>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              style={{ float: 'left' }}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{
                float: 'right',
              }}
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AddEntryForm;
