import { useState, SyntheticEvent } from 'react';
import {
  TextField,
  Grid,
  Button,
  // Typography,
  // InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputLabel,
} from '@mui/material';
import { Diagnose, EntryWithoutId, HealthCheckRating } from '../../types';

interface Props {
  onCancel: () => void;
  onSubmit: (values: EntryWithoutId) => void;
}

interface HealthCheckRatingOption {
  value: number;
  label: string;
}

const healthCheckRatingOptions: HealthCheckRatingOption[] = Object.values(
  HealthCheckRating
)
  .filter((value) => typeof value === 'number')
  .map((v) => ({
    // value: v as number,
    // label: HealthCheckRating[v as keyof typeof HealthCheckRating],

    value: v as number,
    label: HealthCheckRating[v as number],
  }));

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

  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');

  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStart, setSickLeaveStart] = useState('');
  const [sickLeaveEnd, setSickLeaveEnd] = useState('');

  // const [entryOptions, setEntryOptions] = useState();
  const [entryOptions, setEntryOptions] = useState('HealthCheck');

  const onHealthCheckRatingChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();

    const value = Number(event.target.value);
    // console.log(value);

    const healthCheckRating = Object.values(HealthCheckRating);
    // console.log(healthCheckRating);

    if (value && healthCheckRating.includes(value)) {
      setHealthCheckRating(value);

      console.log(value);
    }
  };

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
      <InputLabel style={{ padding: 10 }}>Entry Options :</InputLabel>
      <Select
        label="Options"
        fullWidth
        value={entryOptions}
        onChange={({ target }) => setEntryOptions(target.value)}
      >
        <MenuItem key="HealthCheck" value="HealthCheck">
          Health Check
        </MenuItem>
        <MenuItem key="Hospital" value="Hospital">
          Hospital
        </MenuItem>
        <MenuItem key="OccupationalHealthcare" value="OccupationalHealthcare">
          Occupational Healthcare
        </MenuItem>
      </Select>

      <form onSubmit={addEntry}>
        <InputLabel style={{ padding: 10 }}>Description :</InputLabel>
        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />

        <InputLabel style={{ padding: 10 }}>Date:</InputLabel>
        <TextField
          // label="Date"
          type="date"
          fullWidth
          value={date}
          onChange={({ target }) => setDate(target.value)}
        />

        <InputLabel style={{ padding: 10 }}>Specialist :</InputLabel>
        <TextField
          label="Specialist"
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />

        <InputLabel style={{ padding: 10 }}>Diagnose codes :</InputLabel>
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

        {/* <TextField
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
        /> */}

        {entryOptions === 'HealthCheck' && (
          <>
            {/* <InputLabel>Healthcheck Rating:</InputLabel> */}
            <InputLabel style={{ padding: 10 }}>
              Healthcheck Rating :
            </InputLabel>
            <Select
              label="Healthcheck Rating"
              fullWidth
              value={healthCheckRating.toString()}
              onChange={onHealthCheckRatingChange}
            >
              {healthCheckRatingOptions.map((option) => (
                <MenuItem key={option.label} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </>
        )}

        {entryOptions === 'Hospital' && (
          <>
            <InputLabel style={{ padding: 10 }}>Discharge Date :</InputLabel>
            <TextField
              // label="Discharge Date"
              type="date"
              fullWidth
              value={dischargeDate}
              onChange={({ target }) => setDischargeDate(target.value)}
            />

            <InputLabel style={{ padding: 10 }}>
              Discharge Criteria :
            </InputLabel>
            <TextField
              label="Discharge Criteria"
              fullWidth
              value={dischargeCriteria}
              onChange={({ target }) => setDischargeCriteria(target.value)}
            />
          </>
        )}

        {entryOptions === 'OccupationalHealthcare' && (
          <>
            <InputLabel style={{ padding: 10 }}>Employer Name :</InputLabel>
            <TextField
              label="Employer Name"
              fullWidth
              value={employerName}
              onChange={({ target }) => setEmployerName(target.value)}
            />

            <InputLabel style={{ padding: 10 }}>Sick Leave :</InputLabel>
            <TextField
              type="date"
              fullWidth
              value={sickLeaveStart}
              onChange={({ target }) => setSickLeaveStart(target.value)}
            />

            <InputLabel style={{ padding: 10 }}>Sick Leave :</InputLabel>
            <TextField
              type="date"
              fullWidth
              value={sickLeaveEnd}
              onChange={({ target }) => setSickLeaveEnd(target.value)}
            />
          </>
        )}

        <Grid style={{ marginTop: 20 }}>
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
