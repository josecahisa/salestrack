import React, { useState, useEffect } from 'react';

// Material UI imports
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

// Local components
import { FIELD_CLIENT_PHONE } from 'components/Budget/BudgetForm';

export default function BudgetFormHeader(props) {
    const spacing = 6;
    const { clientPhone, onFieldChange, client } = props;
    const [phoneOptions, setPhoneOptions] = useState([]);

    // Fill client Address List
    useEffect(() => {
        if (client && client.id) {
            clientApi.getClientAddressSet(client.id)
                .then( phoneSet => {
                    logger.log(`list of address obtained ${JSON.stringify(addressSet)}`, 'useEffect.getClientAddressSet');
                    setPhoneOptions(phoneSet);
                })
        }
    }, [client, clientAddress]);

    return (
        <Grid container spacing={spacing}>
            <Grid item xs={4}>
                <Autocomplete
                    id="idPhone"
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
                    options={phoneOptions}
                    value={clientPhone}
                    onChange={(event, newValue) => {
                        onFieldChange(FIELD_CLIENT_PHONE, newValue);
                    }}
                    getOptionLabel={(option) => {
                        if (option && option.number) {
                            return option.number;
                        }
                        return '';
                    }}
                    renderOption={(option) => option.number}
                    renderInput={(params) => (
                        <TextField 
                            {...params}
                            label="Teléfono del Cliente"
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
    )
}