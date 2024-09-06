import { Gender, Patient } from '../../types';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';

import patientService from '../../services/patients';

const PatientDetailsPage = () => {
  const [patient, setPatient] = useState<Patient | null | undefined>(null);
  const id = useParams().id;

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

    void fetchPatient();
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

        {patient?.entries.map((entry) => (
          <div key={entry.id}>
            <p>
              {entry.date} {entry.description}
            </p>
            <ul>
              {entry.diagnosisCodes?.map((code) => (
                <li key={code}>{code}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PatientDetailsPage;
