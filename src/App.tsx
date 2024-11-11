import { useState, useEffect } from 'react';
import axios from 'axios';
import { Route, Link, Routes, useMatch } from 'react-router-dom';
import { Button, Divider, Container, Typography } from '@mui/material';

import { apiBaseUrl } from './constants';
import { Diagnose, Patient } from './types';

import patientService from './services/patients';
import diagnoseService from './services/diagnoses';

import PatientListPage from './components/PatientListPage';
import PatientDetailsPage from './components/PatientDetailsPage';

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnose[]>([]);

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      const allPatients = await patientService.getAll();
      setPatients(allPatients);
    };
    void fetchPatientList();

    const fetchDiagnoseList = async () => {
      const allDiagnoses = await diagnoseService.getAll();
      setDiagnoses(allDiagnoses);
    };
    void fetchDiagnoseList;
  }, []);

  const match = useMatch('/patients/:id');

  const patient = match ? patients.find((p) => p.id === match.params.id) : null;

  return (
    <div className="App">
      <Container>
        <Typography variant="h3" style={{ marginBottom: '0.5em' }}>
          Patientor
        </Typography>

        <Button component={Link} to="/" variant="contained" color="primary">
          Home
        </Button>

        <Divider hidden />

        <Routes>
          <Route
            path="/"
            element={
              <PatientListPage patients={patients} setPatients={setPatients} />
            }
          />

          <Route
            path="/patients/:id"
            element={
              <PatientDetailsPage
                patients={patients}
                setPatients={setPatients}
                patient={patient}
                diagnoses={diagnoses}
              />
            }
          />
        </Routes>
      </Container>
    </div>
  );
};

export default App;
