import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import '../App.css';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { FormControl } from '@mui/base/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Expense } from '../classes/expenses';

function RegisterExpense({ onBack }) {
    const userId = Cookies.get('userId');
    const [debitCards, setDebitCards] = useState([]);
    const [creditCards, setCreditCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState('');

    const [formData, setFormData] = useState({
        cardid: '',
        userid: userId,
        mount: '',
        category: '',
        business: '',
        date: null,
        type: '',
        installments: '1',
    });
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
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const handleDateChange = (name, date) => {
        setFormData({
            ...formData,
            [name]: date,
        });
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = Cookies.get('userId');
                const iresponse = await axios.post('http://localhost:3000/obtener-debito', { userId });
                setDebitCards(iresponse.data);
                const lresponse = await axios.post('http://localhost:3000/obtener-credito', { userId });
                setCreditCards(lresponse.data);
            } catch (error) {
                console.error('Error al obtener tarjetas de débito', error);
            }
        };
        fetchData();
    }, []);
    const handleSubmitExpense = async (e) => {
        e.preventDefault();
        const newExpense = new Expense(formData.cardid, formData.userid, formData.mount, formData.category, formData.business, formData.date, formData.type, formData.installments);
        try {
            await axios.post('http://localhost:3000/guardar-gasto', newExpense);
            console.log('Datos enviados con éxito');
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
        onBack();
    };
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
    return (
        <div className='whiteBoxRP'>
            <br />
            <IconButton color="primary" aria-label="back to login" onClick={() => onBack()}>
                <ArrowBackIcon />
            </IconButton>
            <Stack {...columnStackProps}>
                <Stack {...columnStackProps}>
                    <h2>Registrar Gasto</h2>
                    <p>En esta ventana puedes registrar tus gastos.</p>
                    <FormControl required>
                        <InputLabel>Selecciona tu tarjeta:</InputLabel>
                        <Select
                            fullWidth
                            name='cardid'
                            value={selectedCard}
                            onChange={handleCardChange}
                        >
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
                        <Select
                            fullWidth
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
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
                        <DatePicker
                            label="Fecha"
                            name="date"
                            value={formData.date}
                            onChange={(date) => handleDateChange("date", date)}
                            renderInput={(params) => <TextField />}
                        />
                    </LocalizationProvider>
                    <FormControl>
                        <InputLabel>Número de Cuotas</InputLabel>
                        <Select
                            fullWidth
                            name="installments"
                            value={formData.installments}
                            onChange={handleChange}
                            disabled={selectedCard.type === 'Debito'}
                        >
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
