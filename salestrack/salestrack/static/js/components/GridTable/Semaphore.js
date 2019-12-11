import React from 'react';
import { Typography } from '@material-ui/core';
import Alarm from '@material-ui/icons/AlarmOutlined';
import Error from '@material-ui/icons/ErrorOutlineOutlined';
import CheckCircle from '@material-ui/icons/CheckCircleOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { red, yellow, green } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
    okIcon: {
        color: green['500']
    },
    alarmIcon: {
        color: yellow['A700']
    },
    errorIcon: {
        color: red['500']
    }
}));

export default function Semaphore(props) {
    const { semaphoreValue, displayText } = props;
    const classes = useStyles();
    const semaphoreText = semaphoreValue==='V' ? 'Ok' : semaphoreValue==='A' ? 'Proximo a Vencer' : 'Vencido';

    return(
        <div>
            <Typography align='center' >
                { semaphoreValue==='V' && <CheckCircle className={classes.okIcon}/> } 
                { semaphoreValue==='A' && <Alarm className={classes.alarmIcon}/> }
                { semaphoreValue==='R' && <Error className={classes.errorIcon} /> }
            </Typography>
            { displayText && <Typography variant='caption' align='center' className={classes.semaphoreText}> {semaphoreText} </Typography> }
        </div>
    )
}
