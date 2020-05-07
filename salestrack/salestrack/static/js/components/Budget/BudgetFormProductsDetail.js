import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { productApi } from 'components/Api/ProductApi';
import Grid from '@material-ui/core/Grid';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import ProductDetailLine from 'components/Budget/ProductDetailLine';
import { ProductRecord } from 'components/Budget/BudgetModels';

const filter = createFilterOptions();

const useStyles = makeStyles((theme) => ({
    dataSection: {
        marginTop: '10px'
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: '25ch',
    },
    autoCompleteOptionDescription: {
        marginLeft: theme.spacing(1)
    },
    productDetailTable: {
        marginTop: '20px',
        marginBottom: '20px'
    },
    actionsContainer: {
        marginTop: '40px'
    },
    toggleIconSection: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    productSelectionLine : {
        display: 'flex',
        alignItems: 'center'
    }
}));

const FIELD_PRODUCT_SELECTION = 'productSelection';

export default function BudgetFormProductsDetail(props) {
    const { handleBack, handleNext, updateBudgetDetail, budgetdetailSet, deleteBudgetDetail } = props;
    const classes = useStyles();
    const spacing = 1;
    const emptyProduct = new ProductRecord();
    
    const [productSelection, setProductSelection] = useState(emptyProduct);
    const [productSelectionOptions, setProductSelectionOptions] = useState([]);

    const onFieldChange = (field, newValue) => {
        if (!newValue) {
            return;
        }

        switch (field) {
            case FIELD_PRODUCT_SELECTION:
                setProductSelection(newValue);
                break;
        }
    };
    
    const addProduct = () => {
        const budgetDetail = {
            id: 0,
            productId: productSelection.id,
            quantity: "1"
        }
        updateBudgetDetail(budgetDetail);
        setProductSelection(emptyProduct);
    }

    // setup product selection
    useEffect(() => {
        productApi.getMainProducts().then(products => {
            setProductSelectionOptions(products);
        });
    }, []);

    const handleProductAccesorySelection = (event, newProductAccesory) => {
        setProductAccesorySelection(newProductAccesory);
    };

    return (
        <div>
            <Grid container spacing={spacing} alignItems='center' alignItems='center' className={classes.productSelectionLine}>
                <Grid item xs={9}>
                    <Autocomplete
                        options={productSelectionOptions}
                        getOptionLabel={(option) => {
                            if (option && option.description) {
                                return option.description;
                            }
                            return '';
                        }}
                        renderOption={(option) => (
                            <React.Fragment>
                                <Avatar alt={option.code} src={'/media/' + option.photo} />
                                <div className={classes.autoCompleteOptionDescription}> {option.description} </div>
                            </React.Fragment>
                        )}                        
                        value={productSelection}
                        onChange={(event, newValue) => {
                            onFieldChange(FIELD_PRODUCT_SELECTION, newValue);
                        }}
                        id="product-selection-id"
                        renderInput={(params) => 
                            <TextField
                                {...params}
                                label="Seleccione el producto"
                                margin="normal"
                            />
                        }
                    />
                </Grid>
                <Grid item xs={2}>
                    <Button onClick={addProduct} variant="contained" color="primary">
                        Agregar
                    </Button>
                </Grid>
            </Grid>
            <div className={classes.productDetailTable}>
                <Grid key="detailHeader" container spacing={spacing} alignItems='center' alignItems='center'>
                    <Grid item xs={1} container justify='center' alignItems='center'>
                        <Typography variant="subtitle2">
                        Imagen
                        </Typography>
                    </Grid>
                    <Grid item xs={7}>
                        <Typography variant="subtitle2">
                        Descripcion
                        </Typography>
                    </Grid>
                    <Grid item xs={1} container justify='center'>
                        <Typography variant="subtitle2">
                        Cantidad
                        </Typography>
                    </Grid>
                    <Grid item xs={1} container justify='center'>
                        <Typography variant="subtitle2">
                        Precio
                        </Typography>
                    </Grid>
                </Grid>

                {budgetdetailSet.map(detail => {
                    return (
                    <ProductDetailLine
                        key={detail.id}
                        budgetDetail={detail}
                        size1={1}
                        size2={7}
                        size3={1}
                        size4={1}
                        deleteBudgetDetail={deleteBudgetDetail}
                        updateBudgetDetail={updateBudgetDetail}
                    />)
                })}
            </div>
            <div className={classes.actionsContainer}>
                <div>
                    <Button
                        onClick={handleBack}
                        className={classes.button}
                    >
                        Volver
                    </Button>
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
        </div>            
    );
}