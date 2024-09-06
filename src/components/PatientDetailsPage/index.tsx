import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Box } from '@mui/material';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import WorkIcon from '@mui/icons-material/Work';
import FavoriteIcon from '@mui/icons-material/Favorite';

import {
  Gender,
  Patient,
  Diagnosis,
  Entry,
  HealthCheckRating,
} from '../../types';

import patientService from '../../services/patients';
import diagnosesService from '../../services/diagnoses';

const HealthIcon = (health: HealthCheckRating) => {
  switch (health) {
    case 0:
      return <FavoriteIcon sx={{ color: 'green' }} />;

    case 1:
      return <FavoriteIcon sx={{ color: 'yellow' }} />;

    case 2:
      return <FavoriteIcon sx={{ color: 'orange' }} />;

    case 3:
      return <FavoriteIcon sx={{ color: 'red' }} />;
  }
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const EntryDetails = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case 'OccupationalHealthcare':
      return (
        <div>
          <p>
            {entry.date} <WorkIcon /> {entry.employerName}
          </p>
          <p>{entry.description}</p>
        </div>
      );

    case 'HealthCheck':
      return (
        <div>
          <p>
            {entry.date} <MedicalServicesIcon />
          </p>
          <p>{entry.description}</p>
          {HealthIcon(entry.healthCheckRating)}
        </div>
      );

    case 'Hospital':
      return (
        <div>
          <p>
            {entry.date} <MedicalServicesIcon />
          </p>
          <p>{entry.description}</p>
        </div>
      );

    default:
      return assertNever(entry);
  }
};

const PatientDetailsPage = () => {
  const id = useParams().id;

  const [patient, setPatient] = useState<Patient | null | undefined>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        const patient = await patientService.getById(id);
        setPatient(patient);
        console.log(patient);
      } else {
        console.error('Patient not found');
      }
    };

    const fetchDiagnoses = async () => {
      const diagnoses = await diagnosesService.getAllDiagnoses();
      setDiagnoses(diagnoses);
    };

    void fetchPatient();
    void fetchDiagnoses();
  }, [id]);

  const genderIcon = (gender: Gender | undefined) => {
    if (gender === 'female') {
      return <FemaleIcon />;
    } else if (gender === 'male') {
      return <MaleIcon />;
    } else {
      return null;
    }
  };

  const getDiagnosisName = (code: string) => {
    const diagnosis = diagnoses.find((diagnosis) => diagnosis.code === code);
    return diagnosis ? diagnosis.name : null;
  };

  return (
    <section>
      <div>
        <h2>
          {patient?.name} {genderIcon(patient?.gender)}
        </h2>

        <span>ssn: {patient?.ssn}</span>
        <br />

        <span>occupation: {patient?.occupation}</span>
      </div>

      <div>
        <h2>entries</h2>

        {patient?.entries.map((entry) => {
          return (
            <div key={entry.id}>
              <Box
                sx={{
                  border: '1px solid black',
                  borderRadius: '5px',
                  padding: '5px',
                  margin: '5px',
                }}
              >
                <EntryDetails entry={entry} />

                <ul>
                  {entry.diagnosisCodes?.map((code) => (
                    <li key={code}>
                      {code} {getDiagnosisName(code)}
                    </li>
                  ))}
                </ul>

                <p>diagnose by {entry.specialist}</p>
              </Box>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PatientDetailsPage;
