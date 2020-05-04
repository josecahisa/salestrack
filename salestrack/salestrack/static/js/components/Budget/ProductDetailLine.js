import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { productApi } from 'components/Api/ProductApi';
import Grid from '@material-ui/core/Grid';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';

export default function ProductDetailLine(props) {
    const { key, budgetDetail } = props;

    const size1 = props.size1 ? props.size1 : 1; 
    const size2 = props.size2 ? props.size2 : 8; 
    const size3 = props.size3 ? props.size3 : 1; 
    const size4 = props.size4 ? props.size4 : 2; 

    const spacing = 1;

    return (
        <Grid key={key} container spacing={spacing} alignItems='center' alignItems='center'>
            <Grid item xs={size1}>
                <Avatar src={'/media/' + budgetDetail.product.getPhoto} />
            </Grid>
            <Grid item xs={size2}>
                <div> {budgetDetail.product.description} </div>
            </Grid>
            <Grid item xs={size3}>
                Cantidad
            </Grid>
            <Grid item xs={size4}>
                Precio
            </Grid>
        </Grid>
    );
}