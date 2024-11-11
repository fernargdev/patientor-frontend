// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';

import { useState } from 'react';

import { Box, Button, Typography } from '@mui/material';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import WorkIcon from '@mui/icons-material/Work';
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
// import diagnosesService from '../../services/diagnoses';
// import AddEntry from '../AddEntry';
import axios from 'axios';
import AddEntryModal from '../AddEntry';

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

// const getDiagnoseName = (code: string) => {
//   const Diagnose = diagnoses.find((Diagnose) => Diagnose.code === code);
//   return Diagnose ? Diagnose.name : null;
// };

interface Props {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  patient: Patient | null | undefined;
  diagnoses: Diagnose[];
}

const PatientDetailsPage = ({
  patients,
  setPatients,
  patient,
  diagnoses,
}: Props) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryWithoutId) => {
    // try {
    //   if (patient) {
    //     const entry = await patientService.addEntry(patient.id, values);

    //     patient = {
    //       ...patient,
    //       entries: patient.entries.concat(entry),
    //     };

    //     // setModalOpen(false);
    //     // setError('');
    //     closeModal();
    //   }

    try {
      if (patient) {
        const newEntry = await patientService.addEntry(patient.id, values);

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

  // const id = useParams().id;

  // useEffect(() => {
  //   const fetchPatient = async () => {
  //     if (id) {
  //       const patient = await patientService.getById(id);
  //       setPatient(patient);
  //       console.log(patient);
  //     } else {
  //       console.error('Patient not found');
  //     }
  //   };

  //   const fetchDiagnoses = async () => {
  //     const diagnoses = await diagnosesService.getAllDiagnoses();
  //     setDiagnoses(diagnoses);
  //   };

  //   void fetchPatient();
  //   void fetchDiagnoses();
  // }, [id]);

  return (
    <div>
      <Typography component="h5" variant="h5">
        {patient?.name} {genderIcon(patient?.gender)}
      </Typography>

      <p>ssn: {patient?.ssn}</p>
      <p>occupation: {patient?.occupation}</p>

      <AddEntryModal
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
        modalOpen={modalOpen}
      />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Entry
      </Button>

      <Typography component="h6" variant="h6">
        Entries
      </Typography>

      {patient?.entries.map((e) => {
        return (
          <div key={e.id}>
            <Box
              sx={{
                border: '1px solid grey',
                borderRadius: 4,
                padding: 2,
                margin: 1,
              }}
            >
              <p>{e.date}</p>

              {e.type === 'OccupationalHealthcare' ? (
                e.employerName ? (
                  <p>
                    <WorkIcon /> {e.employerName}
                  </p>
                ) : (
                  <WorkIcon />
                )
              ) : (
                <MedicalServicesIcon />
              )}

              <p>
                <i>{e.description}</i>
              </p>

              <ul>
                {e.diagnosisCodes?.map((d) => {
                  const Diagnose = diagnoses.find(
                    (diagnose) => diagnose.code === d
                  )?.name;

                  return (
                    <li key={d}>
                      {d} {Diagnose ? Diagnose : null}
                    </li>
                  );
                })}
              </ul>

              <EntryDetails entry={e} />

              <p>diagnose by {e.specialist}</p>
            </Box>
          </div>
        );
      })}
    </div>
  );

  // return (
  //   <section>
  //     <div>
  //       <h2>
  //         {patient?.name} {genderIcon(patient?.gender)}
  //       </h2>

  //       <span>ssn: {patient?.ssn}</span>
  //       <br />

  //       <span>occupation: {patient?.occupation}</span>
  //     </div>

  //     <div>
  //       <AddEntry onSubmit={submitNewEntry} />
  //     </div>

  //     <div>
  //       <h2>entries</h2>

  //       {patient?.entries.map((entry) => {
  //         return (
  //           <div key={entry.id}>
  //             <Box
  //               sx={{
  //                 border: '1px solid black',
  //                 borderRadius: '5px',
  //                 padding: '5px',
  //                 margin: '5px',
  //               }}
  //             >
  //               <EntryDetails entry={entry} />

  //               <ul>
  //                 {entry.diagnosisCodes?.map((code) => (
  //                   <li key={code}>
  //                     {code} {getDiagnoseName(code)}
  //                   </li>
  //                 ))}
  //               </ul>

  //               <p>diagnose by {entry.specialist}</p>
  //             </Box>
  //           </div>
  //         );
  //       })}
  //     </div>
  //   </section>
  // );
};

export default PatientDetailsPage;
