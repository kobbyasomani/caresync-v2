import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import "@testing-library/dom"
import { ButtonAddCarer, ButtonDownload, ButtonPrimary, ButtonSecondary, ActionButtonGroup } from "../components/root/Buttons";



describe('ActionButtonGroup component', () => {
  test('renders with children', () => {
    render(
      <ActionButtonGroup>
        <ButtonPrimary>Back</ButtonPrimary>
        <ButtonPrimary>Next</ButtonPrimary>
      </ActionButtonGroup>
    );
    const backButtonElement = screen.getByText(/Back/i);
    const nextButtonElement = screen.getByText(/Next/i);
    expect(backButtonElement).toBeInTheDocument();
    expect(nextButtonElement).toBeInTheDocument();
  });
});


describe('ButtonDownload component', () => {
  test('renders without crashing', () => {
    render(<ButtonDownload resourceURL="https://example.com" filename="example" />);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeInTheDocument();
  });
});


describe('Buttons', () => {
  describe('ButtonPrimary', () => {
    it('renders correctly', () => {
      const { getByText } = render(<ButtonPrimary>Click me</ButtonPrimary>);
      expect(getByText('Click me')).toBeInTheDocument();
    });

    it('triggers onClick when clicked', () => {
      const onClick = jest.fn();
      const { getByText } = render(<ButtonPrimary onClick={onClick}>Click me</ButtonPrimary>);
      fireEvent.click(getByText('Click me'));
      expect(onClick).toHaveBeenCalled();
    });

    it('renders the correct variant when specified', () => {
      const { getByText } = render(<ButtonPrimary variant="outlined">Click me</ButtonPrimary>);
      expect(getByText('Click me')).toHaveClass('MuiButton-outlined');
    });
  });

  describe('ButtonSecondary', () => {
    it('renders correctly', () => {
      const { getByText } = render(<ButtonSecondary>Click me</ButtonSecondary>);
      expect(getByText('Click me')).toBeInTheDocument();
    });

    it('triggers onClick when clicked', () => {
      const onClick = jest.fn();
      const { getByText } = render(<ButtonSecondary onClick={onClick}>Click me</ButtonSecondary>);
      fireEvent.click(getByText('Click me'));
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('ActionButtonGroup', () => {
    it('renders correctly', () => {
      const { getByText } = render(
        <ActionButtonGroup>
          <ButtonPrimary>Back</ButtonPrimary>
          <ButtonPrimary>Next</ButtonPrimary>
        </ActionButtonGroup>
      );
      expect(getByText('Back')).toBeInTheDocument();
      expect(getByText('Next')).toBeInTheDocument();
    });
  });
});