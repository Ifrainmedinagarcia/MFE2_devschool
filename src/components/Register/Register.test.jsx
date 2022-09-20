import { fireEvent, getByText, render, screen, waitFor, within } from "@testing-library/react";
import React from "react"
import Register from "./Register";

beforeEach(()=> {
    render(<Register/>)
})
describe('When the component is mounted', () => {
    test('The ragister page should contain the following tiltles ("Bienvenido", "Regístrate y disfruta de nuestra plataforma")', () => {
        expect(screen.getByRole("heading", {name: /Bienvenido/i})).toBeInTheDocument()
        expect(screen.getByRole("heading", {name: /Regístrate y disfruta de nuestra plataforma/i})).toBeInTheDocument()
    })
    test('The form should contain the following inputs(Nombre, Apellido, email, region, genero and password)', () => {
        expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Apellido/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/región/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/género/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    });
    test('The initial value of each inputs should be empty', () => {
        expect(screen.getByLabelText(/Nombre/i)).toHaveValue("")
        expect(screen.getByLabelText(/Apellido/i)).toHaveValue("")
        expect(screen.getByLabelText(/email/i)).toHaveValue("")
        expect(screen.getByLabelText(/región/i)).toHaveValue("")
        expect(screen.getByLabelText(/password/i)).toHaveValue("")
    });
    test('The radio buttons should be checkeck with value masculino', () => {
        const labelRadioButtons = screen.getByLabelText(/género/i)
        const radioButtons = within(labelRadioButtons).getAllByRole("radio")
        const [masculino, femenino, otro] = radioButtons
        expect(masculino).toBeChecked()
        expect(femenino).not.toBeChecked()
        expect(otro).not.toBeChecked()
    })
    test('The select input should contain the following values (Empyt, América, Europa, África, Asia, Oceanía) ', () => {
        const selectInput = screen.getByLabelText(/región/i)
        const valuesSelectInput = within(selectInput).getAllByRole("option")
        const [empty, america, europa, africa, asia, oceania] = valuesSelectInput
        expect(valuesSelectInput).toHaveLength(6)
        expect(empty).toHaveValue("")
        expect(america).toHaveValue("América")
        expect(europa).toHaveValue("Europa")
        expect(africa).toHaveValue("África")
        expect(asia).toHaveValue("Asia")
        expect(oceania).toHaveValue("Oceanía")
    })
    
    test('The form should contain a button with the name "Registrarse"', () => {
        expect(screen.getByRole("button", {name: /Registrarse/i})).toBeInTheDocument()
    });

    test('The succes message should not exist in the initial state ', () => {
      expect(screen.queryByText(/Te registraste con éxito/i)).not.toBeInTheDocument()
    })
    
});

describe('When the user uses the form', () => {
    test("The select's options should to be in the document when the user does click in the select input", () => {
        const selectInput = screen.getByLabelText(/región/i)
        const valuesSelectInput = within(selectInput).getAllByRole("option")
        const [empty, america, europa, africa, asia, ociania] = valuesSelectInput
        fireEvent.click(selectInput)
        expect(empty).toBeInTheDocument()
        expect(america).toBeInTheDocument()
        expect(europa).toBeInTheDocument()
        expect(africa).toBeInTheDocument()
        expect(asia).toBeInTheDocument()
        expect(ociania).toBeInTheDocument()
    });
    test('should show errors in each input when the user does blur in each inputs and errors should disappear when the user fills one of the fields', () => {
        const nameInput = screen.getByLabelText(/Nombre/i)
        const lastNameInput = screen.getByLabelText(/Apellido/i)
        const emailInput = screen.getByLabelText(/email/i)
        const ragionInput = screen.getByLabelText(/región/i)
        const passInput = screen.getByLabelText(/password/i)

        
        fireEvent.blur(nameInput)
        fireEvent.blur(lastNameInput)
        fireEvent.blur(emailInput)
        fireEvent.blur(ragionInput)
        fireEvent.blur(passInput)

        expect(screen.getByText(/nombre es requerido/i)).toBeInTheDocument()
        expect(screen.getByText(/apellido es requerido/i)).toBeInTheDocument()
        expect(screen.getByText(/email es requerido/i)).toBeInTheDocument()
        expect(screen.getByText(/region es requerido/i)).toBeInTheDocument()
        expect(screen.getByText(/password es requerido/i)).toBeInTheDocument()

        fireEvent.change(nameInput, {target: {value: 'Ifrain'}})
        fireEvent.change(lastNameInput, {target: {value: 'Medina'}})
        fireEvent.change(emailInput, {target: {value: 'medina.ifrain@gmail.com'}})
        fireEvent.change(passInput, {target: {value: "123456"}})
        fireEvent.change(ragionInput, {target: {value: "América"}})

        expect(screen.queryByText(/nombre es requerido/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/apellido es requerido/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/password es requerido/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/region es requerido/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/email es requerido/i)).not.toBeInTheDocument()

    });

    test('should show all the errors if the user does click in the buttons without fill all the inputs', () => {
        const btnRegister = screen.getByRole("button", {name: /Registrarse/i})
        
        fireEvent.click(btnRegister)

        expect(screen.getByText(/nombre es requerido/i)).toBeInTheDocument()
        expect(screen.getByText(/apellido es requerido/i)).toBeInTheDocument()
        expect(screen.getByText(/email es requerido/i)).toBeInTheDocument()
        expect(screen.getByText(/region es requerido/i)).toBeInTheDocument()
        expect(screen.getByText(/password es requerido/i)).toBeInTheDocument()
        expect(screen.queryByText(/Te registraste con éxito/i)).not.toBeInTheDocument()
    })

    test('should be sending the form with the inputs filled and show the success mesagge and clean the inputs', async () => {
        const btnRegister = screen.getByRole("button", {name: /Registrarse/i})
        const nameInput = screen.getByLabelText(/Nombre/i)
        const lastNameInput = screen.getByLabelText(/Apellido/i)
        const emailInput = screen.getByLabelText(/email/i)
        const ragionInput = screen.getByLabelText(/región/i)
        const passInput = screen.getByLabelText(/password/i)

        fireEvent.change(nameInput, {target: {value: 'Ifrain'}})
        fireEvent.change(lastNameInput, {target: {value: 'Medina'}})
        fireEvent.change(emailInput, {target: {value: 'medina.ifrain@gmail.com'}})
        fireEvent.change(passInput, {target: {value: "123456"}})
        fireEvent.change(ragionInput, {target: {value: "América"}})

        fireEvent.click(btnRegister)

        await waitFor(()=> expect(screen.getByText(/Te registraste con éxito/i)).toBeInTheDocument())

        expect(nameInput).toHaveValue("")
        expect(lastNameInput).toHaveValue("")
        expect(emailInput).toHaveValue("")
        expect(passInput).toHaveValue("")
        expect(passInput).toHaveValue("")
    });
});
