import React from "react";
import { render, screen } from "@testing-library/react";
import'@testing-library/jest-dom'

import Shift from "../components/Shift";

jest.mock("../utils/globalUtils", () => ({
  useGlobalContext: () => ({
    dispatch: jest.fn(),
  }),
}));

jest.mock("../utils/modalUtils", () => ({
  useModalContext: () => ({
    modalDispatch: jest.fn(),
  }),
}));

const mockShift = {
  carer: {
    firstName: "John",
    lastName: "Doe",
  },
  shiftStartTime: "2022-03-03T10:00:00.000Z",
};

describe("Shift", () => {
  it("renders the carer's name correctly", () => {
    render(<Shift shift={mockShift} />);
    const carerName = screen.getByText("Carer: John Doe");
    expect(carerName).toBeInTheDocument();
  });
});