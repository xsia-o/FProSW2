import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Stack, TextField, Button, IconButton } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import '../App.css';

function MonthlyLimitPage({ onBack }) {
    const userId = Cookies.get('userId'); // Se obtiene el usuario actual
    const [formData, setFormData] = useState({
        monthlyLimit: '',
    }); //Data de formulario

    const handleRequestError = (error) => {
        if (error.response && error.response.data && error.response.data.error) {
            console.error(error.response.data.error);
        } else {
            console.error("Error desconocido al actualizar la cuenta");
        }
    }; //Encargado de manejar los errores del servidor

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }; //Encargado de manejar los cambios del formulario (En vivo y en directo)

    const updateDebitCard = () => {
        if (userId) {
            axios.post('http://localhost:3000/actualizar-limite', {
                userId,
                monthlyLimit: formData.monthlyLimit,
            }).then((response) => {
                console.log('Limite mensual actualizado con éxito');
            }).catch((error) => {
                handleRequestError(error);
            });
        }
    }; //Función para poder actualizar el Limite Mensual

    //Código necesario para un correcto formato
    const isValidMount = (mount) => {
        return mount === '' || (!isNaN(mount) && mount >= 0);
    };

    //Propiedades comunes de la página
    const stackProps = {
        justifyContent: "center",
        alignItems: "center",
        spacing: 2,
    }
    const rowStackProps = {
        direction: "row",
        ...stackProps,
    };
    const columnStackProps = {
        direction: "column",
        ...stackProps,
    };
    return (
        <div className='whiteBoxDM'> {/*Caja Blanca*/}
            <IconButton color="primary" aria-label="Back to FrontPage" onClick={() => onBack()}>
                <ArrowBackIcon />
            </IconButton>
            <Stack {...columnStackProps}> {/*Formulario de Modificacion de Limite Mensual*/}
                <h2>Modificar Tarjeta Debito</h2>
                <p>Completa los datos de tu tarjeta:</p>
                <Stack {...rowStackProps}>
                    <TextField required label="Limite Mensual" name="monthlyLimit" value={formData.monthlyLimit} onChange={handleChange}
                        error={!isValidMount(formData.monthlyLimit)}
                        helperText={
                            !isValidMount(formData.monthlyLimit) ? 'Monto inválido' : ''} />
                </Stack>
                <Stack {...rowStackProps}>
                    <Button variant="contained" onClick={() => { updateDebitCard(); onBack(); }} > Actualizar Débito </Button>
                </Stack>
            </Stack>
        </div>
    );
}
export default MonthlyLimitPage;