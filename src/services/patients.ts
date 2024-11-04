import axios from 'axios';
import { Patient, NonSensitivePatient, Entry, EntryWithoutId } from '../types';

// export type PatientFormValues = Omit<Patient, 'id' | 'entries'>;

import { apiBaseUrl } from '../constants';

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(`${apiBaseUrl}/patients`);

  return data;
};

const getById = async (id: string) => {
  const { data } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);

  return data;
};

const create = async (object: NonSensitivePatient) => {
  const { data } = await axios.post<Patient>(`${apiBaseUrl}/patients`, object);

  return data;
};

const addEntry = async (id: string, object: EntryWithoutId) => {
  const { data } = await axios.post<Entry>(
    `${apiBaseUrl}/patients/${id}/entries`,
    object
  );

  return data;
};

export default {
  getAll,
  getById,
  create,
  addEntry,
};
