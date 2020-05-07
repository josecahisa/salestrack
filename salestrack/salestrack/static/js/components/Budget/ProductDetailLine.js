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

export default function ProductDetailLine(props) {
    const { key, budgetDetail, deleteBudgetDetail, updateBudgetDetail } = props;

    const size1 = props.size1 ? props.size1 : 1; 
    const size2 = props.size2 ? props.size2 : 8; 
    const size3 = props.size3 ? props.size3 : 1; 
    const size4 = props.size4 ? props.size4 : 2; 

    const spacing = 1;

    const onQuantityChange = event => {
        const newDetail = cloneDeep(budgetDetail);
        newDetail.quantity = Number(event.target.value);
        updateBudgetDetail(newDetail);
    }

    const onPriceChange = event => {
        const newDetail = cloneDeep(budgetDetail);
        newDetail.price = Number(event.target.value);
        updateBudgetDetail(newDetail);
    }

    const onDeleteLine = () => {
        deleteBudgetDetail(budgetDetail.id);
    }

    return (
        <Grid key={key} container spacing={spacing} alignItems='center' alignItems='center'>
            <Grid item xs={size1} container justify='center'>
                <Avatar src={'/media/' + budgetDetail.product.getPhoto} />
            </Grid>
            <Grid item xs={size2}>
                <div> {budgetDetail.product.description} </div>
            </Grid>
            <Grid item xs={size3} container justify='center'>
                    <TextField
                        value={budgetDetail.quantity}
                        placeholder="Cantidad"
                        fullWidth
                        margin="normal"
                        onChange={onQuantityChange}
                        inputProps={{min: 0, style: { textAlign: 'center' }}}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

            </Grid>
            <Grid item xs={size4} container justify='center'>
                <div> 
                    <TextField
                        value={budgetDetail.price}
                        placeholder="Precio"
                        fullWidth
                        margin="normal"
                        onChange={onPriceChange}
                        inputProps={{min: 0, style: { textAlign: 'center' }}}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            startAdornment:(
                                <InputAdornment position="start">$</InputAdornment>
                            )
                        }}
                    />
                </div>
            </Grid>
            <Grid item xs={1} container justify='center'>
                <IconButton
                    aria-label="borrar detalle"
                    component="span"
                    onClick={onDeleteLine}
                >
                    <DeleteOutlineIcon />
                </IconButton>
            </Grid>
        </Grid>
    );
}