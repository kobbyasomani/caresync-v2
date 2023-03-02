import React from "react";
import { render, screen } from '@testing-library/react';
import Shift from '../components/Shift';
import'@testing-library/jest-dom'

test('Renders shift component', () => {
  render(<Shift />);
  const shift = screen.getByTestId('card');
  expect(shift).toBeInTheDocument();
});

test('Renders shift date and carer name', () => {
  render(<Shift />);
  const shiftDate = screen.getByText(/DD\/MM\/YY | 00:00 – 00:00/i);
  const shiftCarer = screen.getByText(/Carer: Firstname LastName/i);
  expect(shiftDate).toBeInTheDocument();
  expect(shiftCarer).toBeInTheDocument();
});

test('Renders shift buttons', () => {
  render(<Shift />);
  const handoverButton = screen.getByTestId("handover");
  const notesButton = screen.getByTestId("notes");
  const incidentsButton = screen.getByTestId("incidents");
  expect(handoverButton).toBeInTheDocument();
  expect(notesButton).toBeInTheDocument();
  expect(incidentsButton).toBeInTheDocument();
});

