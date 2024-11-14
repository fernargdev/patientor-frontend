import { useState } from 'react';
import axios from 'axios';

import { Box, Button, Typography } from '@mui/material';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import WorkIcon from '@mui/icons-material/Work';
import HospitalIcon from '@mui/icons-material/LocalHospital';
import FavoriteIcon from '@mui/icons-material/Favorite';

import {
  Gender,
  Patient,
  Diagnose,
  Entry,
  HealthCheckRating,
  EntryWithoutId,
} from '../../types';

import patientService from '../../services/patients';

import AddEntryModal from '../AddEntryModal';

interface Props {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  patient: Patient | null | undefined;
  diagnoses: Diagnose[];
}

const genderIcon = (gender: Gender | undefined) => {
  if (gender === 'female') {
    return <FemaleIcon />;
  } else if (gender === 'male') {
    return <MaleIcon />;
  } else {
    return null;
  }
};

const HealthIcon = (health: HealthCheckRating) => {
  switch (health) {
    case 0:
      return (
        <p
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            color: 'green',
          }}
        >
          Healthy
          <FavoriteIcon sx={{ color: 'green' }} />
        </p>
      );

    case 1:
      return (
        <p
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            color: 'yellow',
          }}
        >
          LowRisk
          <FavoriteIcon sx={{ color: 'yellow' }} />
        </p>
      );

    case 2:
      return (
        <p
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            color: 'orange',
          }}
        >
          HighRisk
          <FavoriteIcon sx={{ color: 'orange' }} />
        </p>
      );

    case 3:
      return (
        <p
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            color: 'red',
          }}
        >
          CriticalRisk
          <FavoriteIcon sx={{ color: 'red' }} />
        </p>
      );
  }
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const EntryDetails = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case 'HealthCheck':
      return (
        <div>
          <p style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {entry.date}
            <span>
              <MedicalServicesIcon />
            </span>
          </p>
          <p>{entry.description}</p>
          {HealthIcon(entry.healthCheckRating)}
        </div>
      );

    case 'OccupationalHealthcare':
      return (
        <div>
          <p style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {entry.date}
            <span>
              <WorkIcon />
            </span>
            {entry.employerName}
          </p>
          <p>{entry.description}</p>

          {entry.sickLeave ? (
            <p>
              SICK LEAVE: <br />
              From {entry.sickLeave.startDate} to {entry.sickLeave.endDate}
            </p>
          ) : null}
        </div>
      );

    case 'Hospital':
      return (
        <div>
          <p style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {entry.date}
            <span>
              <HospitalIcon />
            </span>
          </p>
          <p>{entry.description}</p>

          <p>
            Discharge :
            <br />- Date: {entry.discharge.date}
            <br />- Criteria: {entry.discharge.criteria}
            <br />
          </p>
        </div>
      );

    default:
      return assertNever(entry);
  }
};

const PatientDetailsPage = ({
  patients,
  setPatients,
  patient,
  diagnoses,
}: Props) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  // console.log(diagnoses);

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryWithoutId) => {
    try {
      if (patient) {
        const newEntry = await patientService.addEntry(patient.id, values);

        console.log(newEntry);

        const newPatient = {
          ...patient,
          entries: patient.entries.concat(newEntry),
        };

        setPatients(
          patients.map((p) => (p.id === newPatient.id ? newPatient : p))
        );

        closeModal();
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (
          error?.response?.data &&
          typeof error?.response?.data === 'string'
        ) {
          const message = error.response.data.replace(
            'Something went wrong. Error: ',
            ''
          );

          console.error(message);
          setError(message);
        } else {
          console.log('Unrecognized axios error: ', error);
          setError('Unrecognized axios error');
        }
      } else {
        console.error('Unknown Error: ', error);
        setError('Unknown Error');
      }
    }
  };

  return (
    <div>
      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <Typography component="h5" variant="h5">
          {patient?.name} {genderIcon(patient?.gender)}
        </Typography>

        <p>SSN: {patient?.ssn}</p>
        <p>Occupation: {patient?.occupation}</p>
      </div>

      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <Button variant="contained" onClick={() => openModal()}>
          Add New Entry
        </Button>
        <AddEntryModal
          onSubmit={submitNewEntry}
          error={error}
          onClose={closeModal}
          modalOpen={modalOpen}
          diagnoses={diagnoses}
        />
      </div>

      <div>
        <Typography component="h6" variant="h6">
          Entries :
        </Typography>

        {patient?.entries.map((e) => {
          return (
            <div key={e.id}>
              <Box
                sx={{
                  border: '1px solid grey',
                  borderRadius: 4,
                  paddingLeft: 2,
                  marginTop: 1,
                }}
              >
                <EntryDetails entry={e} />

                {e.diagnosisCodes && e.diagnosisCodes.length > 0 ? (
                  <div>
                    <span>Diagnoses :</span>

                    <ul style={{ marginTop: 0 }}>
                      {e.diagnosisCodes?.map((d) => {
                        const Diagnose = diagnoses.find(
                          (diagnose) => diagnose.code === d
                        )?.name;

                        return (
                          <li key={d}>
                            {d} : {Diagnose ? Diagnose : null}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}

                <p>diagnose by {e.specialist}.</p>
              </Box>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PatientDetailsPage;
