import React from 'react';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import Downshift from 'downshift';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import Semaphore from 'components/GridTable/Semaphore';
import { Typography } from '@material-ui/core';

let suggestions = [];

function renderInput(inputProps) {
    const { InputProps, classes, ref, ...other } = inputProps;

    return (
        <TextField
            InputProps={{
                inputRef: ref,
                classes: {
                    root: classes.inputRoot,
                    input: classes.inputInput,
                },
                ...InputProps,
            }}
            {...other}
        />
    );
}

renderInput.propTypes = {
  classes: PropTypes.object.isRequired,
  InputProps: PropTypes.object,
};

function renderSuggestion(suggestionProps) {
    const { suggestion, index, itemProps, highlightedIndex, selectedItem, gridColumn } = suggestionProps;
    const isHighlighted = highlightedIndex === index;
    const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1;

    return (
        <MenuItem
            {...itemProps}
            key={suggestion.label}
            selected={isHighlighted}
            component="div"
            style={{
                fontWeight: isSelected ? 500 : 400,
            }}
        >
            {
                gridColumn.column.displayType === 'text' && 
                <Typography align={gridColumn.column.alignment} variant='body2' >
                    {suggestion.label}
                </Typography>
            }
            {
                gridColumn.column.displayType === 'semaphore' && 
                <Semaphore
                    displayText={false}
                    semaphoreValue={suggestion.label}
                />
            }

        </MenuItem>
    );
}

renderSuggestion.propTypes = {
    highlightedIndex: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.number]).isRequired,
    index: PropTypes.number.isRequired,
    itemProps: PropTypes.object.isRequired,
    selectedItem: PropTypes.string.isRequired,
    suggestion: PropTypes.shape({
        label: PropTypes.string.isRequired,
    }).isRequired,
};

function getSuggestions(value, selectedItems) {
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;

    return suggestions.filter(suggestion => {
        const keep =
            suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

        if (keep) {
            if (selectedItems.find(element => element === suggestion.label)) {
                return false;
            }
        }

        return keep;
      });
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    height: 200,
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    // marginTop: theme.spacing(1),
    left: 0,
    right: 0,
    padding: 0,
    overflow: 'auto'
  },
  chip: {
    // margin: theme.spacing(0.5, 0.25),
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1,
  },
  divider: {
    // height: theme.spacing(2),
  },
}));

export default function FilterSelectInput(props) {
    const classes = useStyles();
    const inputValue = props.inputValue;
    const selectedItem = props.selectedItem;
    const handleKeyDown = props.handleKeyDown;
    const handleInputChange = props.handleInputChange;
    const handleChange = props.handleChange;
    const handleDelete = props.handleDelete;
    const gridColumn = props.gridColumn;

    suggestions = props.suggestions.map(item => {
        return ({
            label: item[gridColumn.dataColumn]
        });}
    );

    return (
        <div className={classes.root}>
            <div className={classes.divider} />
            <Downshift
                id="downshift-options"
                isOpen={true}
                selectedItem={selectedItem}
                onChange={handleChange}
                selectedItem={selectedItem}
                inputValue={inputValue}
            >
                {({
                    clearSelection,
                    getInputProps,
                    getItemProps,
                    getLabelProps,
                    getMenuProps,
                    highlightedIndex,
                    inputValue: inputValue2,
                    selectedItem: selectedItem2,
                    isOpen,
                    openMenu,
                    selectedItem,
                }) => {
                    const { onBlur, onChange, onFocus, ...inputProps } = getInputProps({
                        onKeyDown: handleKeyDown,
                        placeholder: 'Seleccione los valores a filtrar',
                    });

                    return (
                        <div className={classes.container}>
                            { renderInput({
                                fullWidth: true,
                                classes,
                                label: '',
                                InputLabelProps: getLabelProps(),
                                InputProps: {
                                    startAdornment: selectedItem.map(item => (
                                        <Chip
                                            key={item}
                                            tabIndex={-1}
                                            label={item}
                                            className={classes.chip}
                                            onDelete={handleDelete(item)}
                                        />
                                    )),
                                    onBlur,
                                    onChange: event => {
                                        handleInputChange(event);
                                        onChange(event);
                                    },
                                    onFocus,
                                },
                                inputProps,
                            })}

                            <div {...getMenuProps()}>
                                {isOpen ? (
                                    <Paper className={classes.paper} square>
                                        {
                                            getSuggestions(inputValue2, selectedItem).map((suggestion, index) =>
                                                renderSuggestion({
                                                    suggestion,
                                                    index,
                                                    itemProps: getItemProps({ item: suggestion.label }),
                                                    highlightedIndex,
                                                    selectedItem,
                                                    gridColumn
                                                }),
                                        )}
                                    </Paper>
                                    ) : null
                                }
                            </div>
                        </div>
                    );
                }}
            </Downshift>
        </div>
    );
}