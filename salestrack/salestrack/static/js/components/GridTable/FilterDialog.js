import React from 'react';
import { Dialog, Typography, Divider, Box } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import FilterSelectInput from 'components/GridTable/FilterSelectInput'
import lodash from 'lodash';

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles({
    root: {
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
    icon: {
      borderRadius: '50%',
      width: 16,
      height: 16,
      boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
      backgroundColor: '#f5f8fa',
      backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
      '$root.Mui-focusVisible &': {
        outline: '2px auto rgba(19,124,189,.6)',
        outlineOffset: 2,
      },
      'input:hover ~ &': {
        backgroundColor: '#ebf1f5',
      },
      'input:disabled ~ &': {
        boxShadow: 'none',
        background: 'rgba(206,217,224,.5)',
      },
    },
    checkedIcon: {
      backgroundColor: '#137cbd',
      backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
      '&:before': {
        display: 'block',
        width: 16,
        height: 16,
        backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
        content: '""',
      },
      'input:hover ~ &': {
        backgroundColor: '#106ba3',
      },
    },
});

// Inspired by blueprintjs
function StyledRadio(props) {
    const classes = useStyles();
  
    return (
        <Radio
            className={classes.root}
            disableRipple
            color="default"
            checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
            icon={<span className={classes.icon} />}
            {...props}
        />
    );
}

export default class FilterDialog extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            selectedItem: props.selectedItem
        }
    };

    handleKeyDown = event => {
        const { selectedItem, inputValue } = this.state;
        if (selectedItem.length && !inputValue.length && event.key === 'Backspace') {
            this.setState({
                selectedItem: selectedItem.slice(0, selectedItem.length - 1)
            })
        }
    }

    handleInputChange = event => {
        this.setState({
            inputValue: event.target.value
        });
    }

    handleChange = item => {
        let newSelectedItem = [...this.state.selectedItem];
        if (newSelectedItem.indexOf(item) === -1) {
          newSelectedItem = [...newSelectedItem, item];
        }
        this.setState({
            inputValue: '',
            selectedItem: newSelectedItem
        })
    }

    handleDelete = item => () => {
        const newSelectedItem = [...this.state.selectedItem];
        newSelectedItem.splice(newSelectedItem.indexOf(item), 1);
        this.setState({
            selectedItem: newSelectedItem
        })
    };    

    displaySortOptions = () => {
        return (
            <>
                <FormControl component="fieldset">
                    <RadioGroup defaultValue="female" aria-label="gender" name="customized-radios">
                        <FormControlLabel value="female" control={<StyledRadio />} label="Ordenar A -> Z" />
                        <FormControlLabel value="male" control={<StyledRadio />} label="Ordenar Z -> A" />
                    </RadioGroup>
                </FormControl>
                <Divider className={classes.filterDialogDivider} />
            </>
        )
    }

    render() {
        const { open, onClose, data, classes, gridColumn } = this.props;
        const { inputValue, selectedItem } = this.state;
        
        const column = gridColumn.dataColumn;
        const sortedData = lodash.orderBy(data, [column]);
        const suggestions = lodash.sortedUniqBy(sortedData, column);

        return (
            <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title"
                maxWidth='md'
                fullWidth={true}
                className={classes.filterDialog}
                classes={{ paper: classes.dialogPaper }}
            >
                <DialogContent>
                    <Typography align='left' variant='subtitle2' gutterBottom>
                        <Box fontWeight="fontWeightBold">
                            Filtrar por columna {gridColumn.name}
                        </Box>
                    </Typography>

                    <Divider className={classes.filterDialogDivider} />

                    {/* <Typography align='left' variant='subtitle2' >
                        <Box fontWeight="fontWeightBold">
                            Filtrar
                        </Box>
                    </Typography> */}
                    <FilterSelectInput
                        suggestions={suggestions}
                        gridColumn={gridColumn}
                        inputValue={inputValue}
                        selectedItem={selectedItem}
                        handleKeyDown={this.handleKeyDown}
                        handleInputChange={this.handleInputChange}
                        handleChange={this.handleChange}
                        handleDelete={this.handleDelete}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose(column, 'Cancel', selectedItem, '')} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={onClose(column, 'Apply', selectedItem, '')} color="primary">
                        Aplicar
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}