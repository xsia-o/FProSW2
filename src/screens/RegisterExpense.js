import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Stack, Button, IconButton, MenuItem, InputLabel, Select, TextField } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { FormControl } from '@mui/base/FormControl';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Expense } from '../classes/expenses';
import '../App.css';

function RegisterExpense({ onBack }) {
    const userId = Cookies.get('userId');                   // Se obtiene el UserId de las Cookies
    const [debitCards, setDebitCards] = useState([]);       // Se obtienen las Tarjetas Debito
    const [creditCards, setCreditCards] = useState([]);     // Se obtienen las Tarjetas Credito
    const [selectedCard, setSelectedCard] = useState('');   // Data de Tarjeta Seleccionada
    const [formData, setFormData] = useState({
        cardid: '',
        userid: userId,
        mount: '',
        category: '',
        business: '',
        date: null,
        type: '',
        installments: '1',
    }); // Data de Formulario

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

    const handleDateChange = (name, date) => {
        setFormData({
            ...formData,
            [name]: date,
        });
    }; //Encargado de manejar los cambios en las fechas

    const handleCardChange = (event) => {
        setSelectedCard(event.target.value);
        setFormData((prevFormData) => ({
            ...prevFormData,
            cardid: event.target.value.id,
            type: event.target.value.type,
        }));
        if (event.target.value.type === "Debito") {
            setFormData((prevFormData) => ({
                ...prevFormData,
                installments: '1',
            }));
        }
    }; //Encargado de manejar los cambios de la tarjeta seleccionada (En vivo y en directo)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = Cookies.get('userId');
                const iresponse = await axios.post('http://localhost:3000/obtener-debito', { userId });
                setDebitCards(iresponse.data);
                const lresponse = await axios.post('http://localhost:3000/obtener-credito', { userId });
                setCreditCards(lresponse.data);
            } catch (error) {
                handleRequestError(error);
            }
        };
        fetchData();
    }, []); //Se obtendran todas las tarjetas una vez se cargue la pagina

    const handleSubmitExpense = async (e) => {
        e.preventDefault();
        const newExpense = new Expense(formData.cardid, formData.userid, formData.mount,
             formData.category, formData.business, formData.date, formData.type, formData.installments);
        try {
            await axios.post('http://localhost:3000/guardar-gasto', newExpense);
            console.log('Datos enviados con éxito');
        } catch (error) {
            handleRequestError(error);
        }
        onBack();
    }; //Funcion para poder Registar Gasto

    //Código necesario para un correcto formato
    const isValidMount = (mount) => {
        return mount === '' || (!isNaN(mount) && mount >= 0);
    };
    const isRegisterButtonEnabled = () => {
        return (
            formData.mount.trim() !== '' &&
            formData.date !== null &&
            formData.category.trim() !== '' &&
            formData.business.trim() !== '' &&
            isValidMount(formData.mount)
        );
    };

    //Propiedades comunes de la página
    const rowStackProps = {
        direction: "row",
        justifyContent: "center",
        alignItems: "center",
        spacing: 2,
    };
    const columnStackProps = {
        direction: "column",
        justifyContent: "center",
        alignItems: "center",
        spacing: 2,
    };
    const categories = ["Entretenimiento", "Educación", "Comida", "Transporte", "Otros"];

    return (
        <div className='whiteBoxRP'> {/*Caja Blanca*/}
            <br />
            <IconButton color="primary" aria-label="back to login" onClick={() => onBack()}>
                <ArrowBackIcon />
            </IconButton>
            <Stack {...columnStackProps}> {/*Formulario de Registrar Gasto*/}
                <h2>Registrar Gasto</h2>
                <p>En esta ventana puedes registrar tus gastos.</p>
                <Stack {...columnStackProps}>
                    <FormControl required>
                        <InputLabel>Selecciona tu tarjeta:</InputLabel>
                        <Select fullWidth name='cardid' value={selectedCard} onChange={handleCardChange} >
                            {debitCards.map((card) => (
                                <MenuItem key={card.id} value={card}>
                                    {card.type}: {card.cardnumber}
                                </MenuItem>
                            ))}
                            {creditCards.map((card) => (
                                <MenuItem key={card.id} value={card} >
                                    {card.type}: {card.cardnumber}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField required label="Monto" name="mount" value={formData.mount} onChange={handleChange}
                        error={!isValidMount(formData.mount)}
                        helperText={!isValidMount(formData.mount) ? 'Ingrese monto válido' : ''} />
                </Stack>
                <Stack {...rowStackProps}>
                    <FormControl required>
                        <InputLabel>Categoría</InputLabel>
                        <Select fullWidth name="category" value={formData.category} onChange={handleChange} >
                            {categories.map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField required label="Negocio" name="business" value={formData.business} onChange={handleChange} />
                </Stack>
                <Stack {...rowStackProps}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker label="Fecha" name="date" value={formData.date} onChange={(date) => handleDateChange("date", date)} />
                    </LocalizationProvider>
                    <FormControl>
                        <InputLabel>Número de Cuotas</InputLabel>
                        <Select fullWidth name="installments" value={formData.installments} onChange={handleChange} disabled={selectedCard.type === 'Debito'} >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((installment) => (
                                <MenuItem key={installment} value={installment}>
                                    {installment}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
                <Button variant="contained" disabled={!isRegisterButtonEnabled()} onClick={handleSubmitExpense}> Registrar Gasto </Button>
            </Stack>
        </div>
    );
}

export default RegisterExpense;