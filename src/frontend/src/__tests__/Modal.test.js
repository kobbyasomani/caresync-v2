import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Modal from "../components/Modal";
import'@testing-library/jest-dom'



// Mock the useModalContext hook
jest.mock('../utils/modalUtils', () => ({
  useModalContext: jest.fn(() => ({
    modalStore: { modalIsOpen: true, activeModal: { title: 'Test Modal', text: 'Test Text' } },
    modalDispatch: jest.fn(),
  })),
}));

describe('Modal', () => {
  test('renders the title passed as a prop', () => {
    const { getByText } = render(<Modal title="Test Title" />);
    expect(getByText('Test Title')).toBeInTheDocument();
  });

  test('renders the title from the active modal if no title prop is passed', () => {
    const { getByText } = render(<Modal />);
    expect(getByText('Test Modal')).toBeInTheDocument();
  });

  test('renders the text passed as a prop', () => {
    const { getByText } = render(<Modal text="Test Text" />);
    expect(getByText('Test Text')).toBeInTheDocument();
  });

  test('renders the text from the active modal if no text prop is passed', () => {
    const { getByText } = render(<Modal />);
    expect(getByText('Test Text')).toBeInTheDocument();
  });

  test('renders any nested content passed as a child', () => {
    const { getByText } = render(<Modal><div>Nested Content</div></Modal>);
    expect(getByText('Nested Content')).toBeInTheDocument();
  });
});