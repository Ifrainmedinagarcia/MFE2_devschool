/* eslint-disable no-array-constructor */
import React, { useRef, useState } from 'react'
import {
  TextField,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  FormLabel,
  RadioGroup,
  InputLabel,
  NativeSelect,
  Button,
  Grid,
  FormHelperText
} from '@mui/material'
import { valueRadioButtons, optionsValueSelect, initialStateErrorMessages, } from './Domain/const'
import "./style.css"

const Register = () => {
  const [messageErrors, setMessageErrors] = useState(initialStateErrorMessages)
  const [messageSuccess, setMessageSuccess] = useState("")
  const form = useRef(null)

  const validateInputs = (value, name) => {
    value === "" ?
      setMessageErrors((prev) => ({ ...prev, [name]: `${name} es requerido` }))
      : setMessageErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleOnBlur = ({ target: { value, name } }) => validateInputs(value, name)

  const canSubmit = ({ nombre, apellido, email, region, password }) => {
    if (
      nombre.value === "" ||
      apellido.value === "" ||
      email.value === "" ||
      region.value === "" ||
      password.value === "") {
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { nombre, apellido, email, region, genero, password } = e.target.elements
    const elements = new Array(nombre, apellido, email, region, genero, password)
    elements.map(el => validateInputs(el.value, el.name))
    if (!canSubmit({ nombre, apellido, email, region, genero, password })) return
    await Promise.resolve()
    setMessageSuccess("Te registraste con éxito")
    form.current.reset()
  }

  const handleChangeInputs = ({ target: { value, name } }) => validateInputs(value, name)

  return (
    <Grid
      className='container__titles'
      container
      direction="column"
      spacing={1}
      justifyContent="center"
      alignContent="center"
    >
      <Grid item xs={6}>
        <Typography className='title' align='center' component='h1' variant='h2'>¡Bienvenido!</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography className='title' align='center' component='h2' variant='h6'>Regístrate y disfruta de nuestra plataforma</Typography>
      </Grid>

      <Grid item className='container__form'>

        <form ref={form} action="" onSubmit={handleSubmit} >

          <Grid container justifyContent='center' >

            <Grid item padding={3}>
              <TextField
                onChange={handleChangeInputs}
                onBlur={handleOnBlur}
                helperText={messageErrors.nombre}
                error={!!messageErrors.nombre.length}
                color='primary'
                label="Nombre"
                variant="outlined"
                name='nombre'
              />
            </Grid>

            <Grid item padding={3}>
              <TextField
                onChange={handleChangeInputs}
                onBlur={handleOnBlur}
                helperText={messageErrors.apellido}
                error={!!messageErrors.apellido.length}
                color='primary'
                label="Apellido"
                variant="outlined"
                name='apellido'
              />
            </Grid>

            <Grid item xs={12} padding={3}>
              <TextField
                onChange={handleChangeInputs}
                onBlur={handleOnBlur}
                helperText={messageErrors.email}
                error={!!messageErrors.email.length}
                fullWidth
                color='primary'
                label="Email"
                variant="outlined"
                type="email"
                name='email'
              />
            </Grid>

            <Grid item xs={8} padding={1}>
              <FormControl>
                <FormLabel color='primary' id="gender">Género</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="gender"
                  defaultValue="Masculino"
                >
                  {valueRadioButtons.map(value => (
                    <FormControlLabel name='genero' key={value} value={value} control={<Radio color='primary' size="small" />} label={value} />
                  ))}
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item>
              <FormControl >
                <InputLabel color='primary' htmlFor="region">Región</InputLabel>
                <NativeSelect
                  onChange={handleChangeInputs}
                  onBlur={handleOnBlur}
                  error={!!messageErrors.region.length}
                  color='primary'
                  inputProps={{
                    name: 'region',
                    id: 'region',
                  }}
                >
                  {optionsValueSelect.map(value => (<option key={value} value={value}>{value}</option>))}
                </NativeSelect>
                <FormHelperText id='error__message'>{messageErrors.region} </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} padding={3}>
              <TextField
                onChange={handleChangeInputs}
                onBlur={handleOnBlur}
                helperText={messageErrors.password}
                error={!!messageErrors.password.length}
                fullWidth
                color='primary'
                label="Password"
                variant="outlined"
                type="password"
                name='password'
              />
            </Grid>

            <Grid item className='container__button'>
              <Button type='submit' variant="contained" color='primary'>Registrarse</Button>
            </Grid>

          </Grid>

        </form>

      </Grid>
      <Typography align='center'>{messageSuccess}</Typography>
    </Grid>
  )
}

export default Register
