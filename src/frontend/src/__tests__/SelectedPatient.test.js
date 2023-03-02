import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { useGlobalState } from "../utils/globalStateContext";
import Patient from "../components/SelectedPatient"
import'@testing-library/jest-dom'


jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn(),
  }));
  
  jest.mock("../utils/globalStateContext", () => ({
    useGlobalState: jest.fn(),
  }));
  
  describe("Patient", () => {
    const patient = {
      _id: "1",
      firstName: "John",
      lastName: "Doe",
      nextShift: "2023-03-05T16:30:00Z",
    };
  
    const dispatch = jest.fn();
  
    beforeEach(() => {
      useGlobalState.mockReturnValue({ dispatch });
      useNavigate.mockReturnValue(jest.fn());
    });
  
    afterEach(() => {
      jest.resetAllMocks();
    });
  
    it("renders patient name and next shift date", () => {
      render(<Patient patient={patient} />);
      const name = screen.getByText("John Doe");
      const nextShiftDate = screen.getByText("5/3/2023");
      expect(name).toBeInTheDocument();
      expect(nextShiftDate).toBeInTheDocument();
    });
  
    it("dispatches setSelectedPatient action when clicked", () => {
      render(<Patient patient={patient} />);
      const card = screen.getByRole("button");
      fireEvent.click(card);
      expect(dispatch).toHaveBeenCalledWith({
        type: "setSelectedPatient",
        data: "",
      });
    });
  });
