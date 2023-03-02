import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Modal from "../components/Modal";
import'@testing-library/jest-dom'


describe("Modal", () => {
  test("should render the title correctly", () => {
    const { getByText } = render(<Modal  title="Test Title" text="Test Text" state={{ isOpen: true, setIsOpen: jest.fn() }}/>);
    expect(getByText("Test Title")).toBeInTheDocument();
  });

  test("should render the text correctly", () => {
    const { getByText } = render(<Modal  title="Test Title" text="Test Text" state={{ isOpen: true, setIsOpen: jest.fn() }}/>);
    expect(getByText("Test Text")).toBeInTheDocument();
  });

 
  test("should render the children correctly", () => {
    const { getByText } = render(<Modal title="Test Title" text="Test Text" state={{ isOpen: true, setIsOpen: jest.fn() }}>Test Children</Modal>);
    expect(getByText("Test Children")).toBeInTheDocument();
  });
});