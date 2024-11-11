import axios from 'axios';
// import { Patient, PatientFormValues, Entry, EntryWithoutId } from '../types';
import { EntryWithoutId, Entry, Patient, PatientFormValues } from '../types';

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

const create = async (object: PatientFormValues) => {
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
