import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import grey from '@material-ui/core/colors/grey';

const loadingMessageStyles = makeStyles(theme => ({
    messageContainer: {
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        margin: '50px'
    },
    paper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '50px',
        width: '50%',
        background: grey['100']
    },
    loadingText: {
        margin: '20px'
    }
}))

export default function LoadingMessage(){
    const loadingMessageClasses = loadingMessageStyles();

    return (
        <div className={loadingMessageClasses.messageContainer}>
            <Paper className={loadingMessageClasses.paper}>
                <CircularProgress />
                <Typography variant="h5" className={loadingMessageClasses.loadingText}>
                    Generando el informe
                </Typography>
            </Paper>
        </div>
    )
}
