import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { productApi } from 'components/Api/ProductApi';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { cloneDeep } from 'lodash';
import Button from '@material-ui/core/Button';
import { FIELD_COMMERCIAL_TERMS } from 'components/Budget/BudgetForm';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

const useStyles = makeStyles((theme) => ({
    lastButtonsSection: {
        marginTop: '40px',
        display: 'flex',
        justifyContent: 'space-between'
    }
}));

export default function CommercialTerms(props) {
    const {
        handleBack,
        handleNext,
        onFieldChange,
        commercialTerms,
        budgetId
    } = props;
    const classes = useStyles();

    const pdfLink = `generate_pdf/${budgetId}`;

    return (
        <div>
            <div> 
                <TextField
                    value={commercialTerms}
                    placeholder="Terminos Comerciales"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={6}
                    onChange={(event) => {
                        onFieldChange(FIELD_COMMERCIAL_TERMS, event.target.value);
                    }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="outlined"
                />
            </div>

            <div className={classes.lastButtonsSection}>
                <Button
                    onClick={handleBack}
                >
                    Volver
                </Button>

                <Button
                    variant="outlined"
                    color="primary"
                    href={pdfLink}
                >
                    Imprimir
                </Button>
            </div>
        </div>
    );
}