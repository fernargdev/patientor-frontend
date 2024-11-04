import { useState, SyntheticEvent } from 'react';
import { TextField, Grid, Button, InputLabel } from '@mui/material';
import { Diagnosis, EntryWithoutId, HealthCheckRating } from '../../types';

interface Props {
  onSubmit: (values: EntryWithoutId) => void;
}

const AddEntryForm = ({ onSubmit }: Props) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');

  const [diagnosisCodes, setDiagnosisCodes] = useState<
    Array<Diagnosis['code']>
  >([]);

  const [healthCheckRating, setHealthCheckRating] = useState(
    HealthCheckRating.Healthy
  );

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault;

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
        <InputLabel style={{ marginTop: 20 }}>Description</InputLabel>
        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />

        <InputLabel style={{ marginTop: 20 }}>Date</InputLabel>
        <TextField
          label="Date"
          fullWidth
          value={date}
          onChange={({ target }) => setDate(target.value)}
        />

        <InputLabel style={{ marginTop: 20 }}>Specialist</InputLabel>
        <TextField
          label="Specialist"
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />

        <InputLabel style={{ marginTop: 20 }}>Healthcheck Rating</InputLabel>
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

        <InputLabel style={{ margin: 20 }}>Diagnosis codes</InputLabel>
        <TextField
          label="Diagnosis codes"
          fullWidth
          value={diagnosisCodes}
          onChange={({ target }) => {
            const diagnosisCodesArray = target.value.split(', ');
            console.log(diagnosisCodesArray);
            setDiagnosisCodes(diagnosisCodesArray);
          }}
        />

        <Grid>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              style={{ float: 'left' }}
              type="button"
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
