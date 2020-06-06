import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import Grid from '@material-ui/core/Grid';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import Container from '@material-ui/core/Container';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import { CardActionArea, Typography } from '@material-ui/core';
import { getParams } from 'components/Utils/utils';
import { BudgetRecord, budgetStatusList } from 'components/Budget/BudgetModels'
import { budgetApi } from 'components/Api/BudgetApi';
import { clientApi } from 'components/Api/ClientApi';
import { productApi } from 'components/Api/ProductApi';
import {  } from 'components/Api/ClientApi';
import { Logger } from 'components/Utils/Logger';
import Select from '@material-ui/core/Select';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import BudgetFormProductsDetail from 'components/Budget/BudgetFormProductsDetail';
import CommercialTerms from 'components/Budget/CommercialTerms';
import LinearProgress from '@material-ui/core/LinearProgress';  

const filter = createFilterOptions();
const logger = new Logger('BudgetForm');

const useStyles = makeStyles((theme) => ({
    dataSection: {
        marginTop: '10px'
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: '25ch',
    },
    linearProgressArea: {
        height: '5px',
        marginTop: '5px'
    }
}));

const getObjectFromOptionsArray = (objectId, optionsArray, idColumn = 'id') => {
    const objectFound = optionsArray.find( element => {
        return element[idColumn] === objectId;
    })
    if (objectFound) {
        return objectFound;
    }
    return objectId;
}

const getObjectFromOptionsArrayOrPickFirst = (objectId, optionsArray, idColumn = 'id') => {
    if (objectId === -1) {
        if (optionsArray.length > 0) {
            return optionsArray[0];
        }
    } else {
        return getObjectFromOptionsArray(objectId, optionsArray, idColumn)
    }
    return objectId;
}

const updateQueryParam = (param, value) => {
    if (history.pushState) {
        const protocol = window.location.protocol;
        const host = window.location.host;
        const pathName = window.location.pathname;
        const newUrl = `${protocol}//${host}${pathName}?${param}=${value}`;
        window.history.pushState({path: newUrl}, '', newUrl);
    }
}

const FIELD_BUDGET_STATUS = 'budgetStatus';
const FIELD_PAYMENT_TERM = 'paymentTerm';
const FIELD_CLIENT = 'client';
const FIELD_CLIENT_ADDRESS = 'clientAddress';
const FIELD_SHIPPING = 'shipping';
const FIELD_DELIVERY_CITY = 'deliveryCity';
export const FIELD_COMMERCIAL_TERMS = 'commercialTerms';
export const FIELD_DISCOUNT = 'discount';

function getSteps() {
    return ['Select campaign settings', 'Create an ad group', 'Create an ad'];
}

export default function BudgetForm() {
    const classes = useStyles();
    const spacing = 6;
    const [id, setId] = useState(0);
    const [number, setNumber] = useState(0);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [budgetStatus, setBudgetStatus] = useState(budgetStatusList[0]);
    const [paymentTermsOptions, setPaymentTermsOptions] = useState([]);
    const [paymentTerm, setPaymentTerm] = useState(-1);
    const [clientsOptions, setClientOptions] = useState([]);
    const [client, setClient] = useState({id:0,name:''});
    const [addressOptions, setAddressOptions] = useState([]);
    const [clientAddress, setClientAddress] = useState({id:0,address:'',description:''});
    const [shipping, setShipping] = useState(-1);
    const [shippingOptions, setShippingOptions] = useState([]);
    const [deliveryCity, setDeliveryCity] = useState(-1);
    const [deliveryCityOptions, setDeliveryCityOptions] = useState([]);
    const [activeStep, setActiveStep] = React.useState(0);
    const [budgetdetailSet, setBudgetdetailSet] = React.useState([]);
    const [discount, setDiscount] = React.useState(0);
    const [commercialTerms, setCommercialTerms] = React.useState("");
    const [updatingData, setUpdatingData] = React.useState(false);
    const [pendingUpdates, setPendingUpdates] = React.useState(false);
    const steps = getSteps();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    
    const handleReset = () => {
        setActiveStep(0);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const getBudgetData = () => {
        const sMonth = selectedDate.getMonth().toString().padStart(2, '0');
        const sDay = selectedDate.getDate().toString().padStart(2, '0');
        const date = selectedDate.getFullYear() + sMonth + sDay;
        const status = budgetStatus.id;

        let budget = {
            id,
            date,
            status
        };

        if (paymentTerm && paymentTerm.id && paymentTerm.id > 0) {
            budget['paymentTermId'] = paymentTerm.id;
        }

        if (shipping && shipping.id && shipping.id > 0) {
            budget['shippingId'] = shipping.id;
        }

        if (deliveryCity && deliveryCity.id && deliveryCity.id > 0) {
            budget['deliveryCityId'] = deliveryCity.id;
        }

        if (client && client.id && client.id > 0) {
            budget['clientId'] = client.id;
        }

        if (clientAddress && clientAddress.id && clientAddress.id > 0) {
            budget['deliveryAddressId'] = clientAddress.id;
        }

        if (commercialTerms) {
            budget.commercialTerms = commercialTerms;
        }

        return budget;
    }

    const updateBudget = (field, value) => {
        setPendingUpdates(true);

        // Prevent calling the Api again while another request is already running
        if (!updatingData) {
            let budget = getBudgetData();
            budget[field] = value;
    
            setUpdatingData(true);
            budgetApi.updateBudget(budget)
                .then(updatedBudget => {
                    setUpdatingData(false);
                    setPendingUpdates(false);
                    console.log(updatedBudget);
                    setId(updatedBudget.id);
                    setNumber(updatedBudget.number);
                    updateQueryParam('budgetId', updatedBudget.id);
                })
                .catch(error => {
                    setUpdatingData(false);
                    console.error(error);
                });
        }
    }

    const addBudgetDetail = budgetDetail => {
        budgetDetail.budgetId = id;

        budgetApi.addBudgetDetail(budgetDetail)
            .then(budgetDetailAdded => {
                retrieveBudgetData();
            });
    }

    const updateBudgetDetail = budgetDetail => {
        budgetDetail.budgetId = id;

        budgetApi.updateBudgetDetail(budgetDetail)
            .then(updatedBudgetDetail => {
                retrieveBudgetData();
            });
    }

    const deleteBudgetDetail = budgetDetailId => {
        budgetApi.deleteBudgetDetail(budgetDetailId)
            .then(response => {
                // TODO: missing error handling
                retrieveBudgetData();
            });
    }

    const onFieldChange = (field, newValue) => {
        logger.log(`Field '${field}' Changed to -> ${JSON.stringify(newValue)}`, 'onFieldChange');

        const addNewOption = newValue.inputValue != undefined; 

        switch (field) {
            case FIELD_BUDGET_STATUS:
                setBudgetStatus(newValue);
                updateBudget('status', newValue.id);
                break;

            case FIELD_PAYMENT_TERM:
                setPaymentTerm(newValue);
                updateBudget();
                break;

            case FIELD_CLIENT:
                if (addNewOption) {
                    clientApi
                        .createClient(newValue.inputValue)
                        .then(newClient => {
                            setClient(newClient);
                            updateBudget('clientId', newClient.id);
                        });
                } else {
                    setClient(newValue);
                    updateBudget('clientId', newValue.id);
                }
                break;
            
            case FIELD_CLIENT_ADDRESS:
                if (addNewOption) {
                    const clientId = client && client.id ? client.id : 0;
                    if (clientId) {
                        logger.log('adding new Address for Client', 'onFieldChange');
                        clientApi
                            .createAddress(clientId, newValue.inputValue)
                            .then(response => {
                                logger.log(`new Address Created  => ${response}`, 'onFieldChange');
                                setClientAddress(response);
                                updateBudget('deliveryAddressId', response.id);
                            });
                    }
                } else {
                    setClientAddress(newValue);
                    updateBudget('deliveryAddressId', newValue.id);
                }
                break;

            case FIELD_SHIPPING:
                setShipping(newValue);
                updateBudget('shippingId', newValue.id);
                break;

            case FIELD_DELIVERY_CITY:
                setDeliveryCity(newValue);
                updateBudget('deliveryCityId', newValue.id);
                break;

            case FIELD_DISCOUNT:
                setDiscount(newValue);
                updateBudget('discount', newValue);
                break;

            case FIELD_COMMERCIAL_TERMS:
                setCommercialTerms(newValue);
                updateBudget('commercialTerms', newValue);
                break;
        }
    };

    const getBudgetHeaderDetail = () => {
        if (activeStep != 0) {
            return <>
                <div>Cliente: {client.name} - ({clientAddress.address}) |
                     Forma de Pago: {paymentTerm.name} - Transporte : {shipping.name}
                </div>
            </>;
        } else {
            return <div>Encabezado del Presupuesto</div>;
        }
    }

    const getBudgetId = () => {
        if (id === 0) {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('budgetId')) {
                return parseInt(urlParams.get('budgetId'));
            } 
        }

        return id;
    }

    const retrieveBudgetData = () => {
        logger.log('retrieving budget data...');
        const budgetId = getBudgetId();
        if (budgetId !== 0) {
            budgetApi.getBudgetById(budgetId)
                .then(budget =>  {
                    logger.log(`budget retrieved = ${JSON.stringify(budget)}`);

                    if (budget) {
                        if (budget.id) {
                            setId(budget.id);
                        }
                        if (budget.number) {
                            setNumber(budget.number);
                        }

                        if (budget.date) {
                            const date = new Date(budget.date);
                            setSelectedDate(date);
                        }

                        if (budget.status) {
                            const budgetStatus = budgetStatusList.find( status => status.id === budget.status);
                            setBudgetStatus(budgetStatus);
                        }

                        if (budget.paymentTerm) {
                            setPaymentTerm(budget.paymentTerm);
                        }

                        if (budget.client) {
                            setClient(budget.client);
                        }

                        if (budget.deliveryAddress) {
                            setClientAddress(budget.deliveryAddress);
                        }

                        if (budget.shipping) {
                            setShipping(budget.shipping);
                        }

                        if (budget.deliveryCity) {
                            setDeliveryCity(budget.deliveryCity);
                        }

                        if (budget.budgetdetailSet) {
                            setBudgetdetailSet(budget.budgetdetailSet);
                        }

                        if (budget.discount) {
                            setDiscount(budget.discount);
                        }

                        if (budget.commercialTerms) {
                            setCommercialTerms(decodeURIComponent(budget.commercialTerms));   
                        }
                    }
                })
        }
    }

    // setup payment terms
    useEffect(() => {
        retrieveBudgetData();
        budgetApi.getPaymentTerms().then(paymentTerms => {
            setPaymentTermsOptions(paymentTerms);
            const firstObject = getObjectFromOptionsArrayOrPickFirst(paymentTerm, paymentTerms);
            if (firstObject) {
                setPaymentTerm(firstObject);
            }
        });
    }, []);

    // setup Clients autofill
    useEffect(() => {
        clientApi.getClients().then(clientOptions => {
            setClientOptions(clientOptions);
        });
    }, []);

    // Fill client Address List
    useEffect(() => {
        if (client && client.id) {
            clientApi.getClientAddressSet(client.id)
                .then( addressSet => {
                    logger.log(`list of address obtained ${JSON.stringify(addressSet)}`, 'useEffect.getClientAddressSet');
                    setAddressOptions(addressSet);
                })
        }
    }, [client, clientAddress]);

    // Fill shipping List
    useEffect(() => {
        budgetApi.getShippings().then(shippingOptions => {
            setShippingOptions(shippingOptions);
            const firstObject = getObjectFromOptionsArrayOrPickFirst(shipping, shippingOptions);
            if (firstObject) {
                setShipping(firstObject);
            }
        });
    }, []);

    // Fill delivery city List
    useEffect(() => {
        clientApi.getCities().then(deliveryCityOptions => {
            setDeliveryCityOptions(deliveryCityOptions);
            const firstObject = getObjectFromOptionsArrayOrPickFirst(deliveryCity, deliveryCityOptions);
            if (firstObject) {
                setDeliveryCity(firstObject);
            }
        })
    },[]);

    logger.log('');
    logger.log('Rendering all components ------ ');
    logger.log(`client = ${JSON.stringify(client)} - options ${JSON.stringify(clientsOptions)}`);
    logger.log(`address = ${JSON.stringify(clientAddress)}`);
    logger.log(`paymentTerm = ${JSON.stringify(paymentTerm)}`);
    logger.log(`shipping = ${JSON.stringify(shipping)}`);
    logger.log(`deliveryCity = ${JSON.stringify(deliveryCity)}`);
    logger.log('');
    return (
        <Container >
            <div className={classes.linearProgressArea} >
            { updatingData && <LinearProgress /> }
            </div>
            <Stepper activeStep={activeStep} orientation="vertical">
                <Step key="step1">
                    <StepLabel>
                        {getBudgetHeaderDetail()}
                    </StepLabel>
                    <StepContent>
                        {/* <Card className={classes.dataSection}> */}
                            {/* <CardContent> */}
                                <Grid container spacing={spacing}>
                                    <Grid item xs={2}>
                                        <TextField
                                            id="nroPresupuesto"
                                            label="Nro de Presupuesto"
                                            value={number}
                                            fullWidth
                                            margin="normal"
                                            disabled
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <MuiPickersUtilsProvider
                                            variant="inline"
                                            format="dd/MM/yy"                
                                            utils={DateFnsUtils}>

                                            <KeyboardDatePicker
                                                disableToolbar
                                                variant="inline"
                                                format="MM/dd/yyyy"
                                                margin="normal"
                                                id="date-picker-inline"
                                                label="Fecha"
                                                value={selectedDate}
                                                onChange={handleDateChange}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'Cambiar la fecha',
                                                }}
                                            />

                                        </MuiPickersUtilsProvider>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Autocomplete
                                            options={budgetStatusList}
                                            getOptionLabel={(option) => {
                                                if (option && option.name) {
                                                    return option.name;
                                                }
                                                return '';
                                            }}
                                            value={budgetStatus}
                                            onChange={(event, newValue) => {
                                                onFieldChange(FIELD_BUDGET_STATUS, newValue);
                                            }}
                                            id="budget-status"
                                            disableClearable
                                            renderInput={(params) => 
                                                <TextField
                                                    {...params}
                                                    label="Estado"
                                                    margin="normal"
                                                />
                                            }
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={spacing}>
                                    <Grid item xs={4}>
                                        <Autocomplete
                                            id="idCliente"
                                            filterOptions={(options, params) => {
                                                const filtered = filter(options, params);
                                        
                                                if (params.inputValue !== '') {
                                                filtered.push({
                                                    id: params.inputValue,
                                                    inputValue: params.inputValue,
                                                    name: `Agregar "${params.inputValue}"`,
                                                });
                                                }
                                        
                                                return filtered;
                                            }}
                                            options={clientsOptions}
                                            value={client}
                                            onChange={(event, newValue) => {
                                                onFieldChange(FIELD_CLIENT, newValue);
                                            }}
                                            getOptionLabel={(option) => {
                                                if (option && option.name) {
                                                    return option.name;
                                                }
                                                return '';
                                            }}

                                            renderOption={(option) => option.name}
                                            renderInput={(params) => (
                                            <TextField {...params} label="Cliente" margin="normal" />
                                            )}
                                        />
                                    </Grid>

                                    <Grid item xs={4}>
                                        <Autocomplete
                                            id="idAddress"
                                            filterOptions={(options, params) => {
                                                const filtered = filter(options, params);
                                        
                                                if (params.inputValue !== '') {
                                                filtered.push({
                                                    id: params.inputValue,
                                                    inputValue: params.inputValue,
                                                    address: `Agregar "${params.inputValue}"`,
                                                });
                                                }
                                        
                                                return filtered;
                                            }}
                                            options={addressOptions}
                                            value={clientAddress}
                                            onChange={(event, newValue) => {
                                                onFieldChange(FIELD_CLIENT_ADDRESS, newValue);
                                            }}
                                            getOptionLabel={(option) => {
                                                if (option && option.address) {
                                                    return option.address;
                                                }
                                                return '';
                                            }}
                                            renderOption={(option) => option.address}
                                            renderInput={(params) => (
                                                <TextField 
                                                    {...params}
                                                    label="Dirección del Cliente"
                                                    margin="normal"
                                                    inputProps={{
                                                        ...params.inputProps,
                                                        autoComplete: "no"
                                                    }}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>

                                </Grid>

                                <Grid container spacing={spacing} >
                                    <Grid item xs={2}>
                                        <Autocomplete
                                            options={paymentTermsOptions}
                                            getOptionLabel={(option) => {
                                                if (option && option.name) {
                                                    return option.name;
                                                }
                                                return '';
                                            }}
                                            value={paymentTerm}
                                            onChange={(event, newValue) => {
                                                onFieldChange(FIELD_PAYMENT_TERM, newValue);
                                            }}
                                            id="payment-term-id"
                                            disableClearable
                                            renderInput={(params) => 
                                                <TextField
                                                    {...params}
                                                    label="Forma de Pago"
                                                    fullWidth
                                                    margin="normal"
                                                />
                                            }
                                        />
                                    </Grid>

                                    <Grid item xs={3}>
                                        <Autocomplete
                                            options={shippingOptions}
                                            getOptionLabel={(option) => {
                                                if (option && option.name) {
                                                    return option.name;
                                                }
                                                return '';
                                            }}
                                            value={shipping}
                                            onChange={(event, newValue) => {
                                                onFieldChange(FIELD_SHIPPING, newValue);
                                            }}
                                            id="shipping-id"
                                            disableClearable
                                            renderInput={(params) => 
                                                <TextField
                                                    {...params}
                                                    label="Transporte"
                                                    fullWidth
                                                    margin="normal"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Autocomplete
                                            options={deliveryCityOptions}
                                            getOptionLabel={(option) => {
                                                if (option && option.name) {
                                                    return option.name;
                                                }
                                                return '';
                                            }}
                                            value={deliveryCity}
                                            onChange={(event, newValue) => {
                                                onFieldChange(FIELD_DELIVERY_CITY, newValue);
                                            }}
                                            id="delivery-city-id"
                                            disableClearable
                                            renderInput={(params) => 
                                                <TextField
                                                    {...params}
                                                    label="Ciudad de Entrega"
                                                    fullWidth
                                                    margin="normal"
                                                    inputProps={{
                                                        ...params.inputProps,
                                                        autoComplete: "no"
                                                    }}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            }
                                        />
                                    </Grid>
                                </Grid>                    
                            {/* </CardContent> */}
                        {/* </Card> */}
                        <div className={classes.actionsContainer}>
                            <div>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNext}
                                    className={classes.button}
                                >
                                    Siguiente
                                </Button>
                            </div>
                        </div>
                    </StepContent>
                </Step>
                <Step key="step2">
                    <StepLabel>Productos</StepLabel>
                    <StepContent>
                        <BudgetFormProductsDetail
                            handleBack={handleBack}
                            handleNext={handleNext}
                            updateBudgetDetail={updateBudgetDetail}
                            deleteBudgetDetail={deleteBudgetDetail}
                            addBudgetDetail={addBudgetDetail}
                            onFieldChange={onFieldChange}
                            budgetdetailSet={budgetdetailSet}
                            discount={discount}
                        />
                    </StepContent>
                </Step>
                <Step key="step3">
                    <StepLabel>Condiciones Comerciales</StepLabel>
                    <StepContent>
                        <CommercialTerms
                            handleBack={handleBack}
                            handleNext={handleNext}
                            onFieldChange={onFieldChange}
                            commercialTerms={commercialTerms}
                            budgetId={id}
                        >

                        </CommercialTerms>
                    </StepContent>
                </Step>
            </Stepper>

        </Container>    
    )
}
