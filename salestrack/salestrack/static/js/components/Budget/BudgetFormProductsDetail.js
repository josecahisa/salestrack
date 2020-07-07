import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { productApi } from 'components/Api/ProductApi';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import ProductDetailLine from 'components/Budget/ProductDetailLine';
import { ProductRecord } from 'components/Budget/BudgetModels';
import { FIELD_DISCOUNT } from 'components/Budget/BudgetForm';
import InputAdornment from '@material-ui/core/InputAdornment';

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
    },
    totals: {
        marginTop: '40px'
    },
    lastButtonsSection: {
        marginTop: '40px'
    },
    discountFormat: {
        color: 'red'
    }
}));

const FIELD_PRODUCT_SELECTION = 'productSelection';

export default function BudgetFormProductsDetail(props) {
    const {
        handleBack,
        handleNext,
        updateBudgetDetail,
        budgetdetailSet,
        deleteBudgetDetail,
        addBudgetDetail,
        onFieldChange,
        discount
    } = props;
    const classes = useStyles();
    const spacing = 1;
    const emptyProduct = new ProductRecord();
    
    const [productSelection, setProductSelection] = useState(emptyProduct);
    const [productSelectionOptions, setProductSelectionOptions] = useState([]);

    const onProductoSelectionChange = (field, newValue) => {
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
        addBudgetDetail(budgetDetail);
        setProductSelection(emptyProduct);
    }

    // setup product selection
    useEffect(() => {
        productApi.getMainProducts().then(products => {
            setProductSelectionOptions(products);
        });
    }, []);

    let budgetTotal = 0;
    budgetdetailSet.map(detail => {
        const quantity = detail.quantity ? detail.quantity : 1;
        budgetTotal = budgetTotal + quantity * detail.price;
    });

    const budgetDiscountApplied = discount && discount > 0 ? budgetTotal * discount / 100 : 0;
    const budgetTotalWithDiscount = budgetTotal - budgetDiscountApplied;

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
                            onProductoSelectionChange(FIELD_PRODUCT_SELECTION, newValue);
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
                        id={detail.id}
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
            <div className={classes.totals} >
                <Grid key="detailSubTotalCal" container spacing={spacing} alignItems='center' alignItems='center'>
                    <Grid item xs={7} />
                    <Grid item xs={1} > <Typography variant="subtitle2"> Subtotal: </Typography>  </Grid>
                    <Grid item xs={1}/>
                    <Grid item xs={1} container justify='flex-end' > {budgetTotal} </Grid>
                </Grid>
                <Grid key="detailDiscount" container spacing={spacing} alignItems='center' alignItems='center'>
                    <Grid item xs={7} />
                    <Grid item xs={1} > <Typography variant="subtitle2"> Descuento: </Typography>  </Grid>
                    <Grid item xs={1}>
                        <TextField
                            id="discount"
                            placeholder="Descuento"
                            fullWidth
                            margin="normal"
                            value={discount}
                            onChange={(event) => {
                                onFieldChange(FIELD_DISCOUNT, event.target.value);
                            }}
                            InputProps={{
                                endAdornment: (<InputAdornment position="end"> % </InputAdornment>)
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={1} container justify='flex-end' className={classes.discountFormat} > 
                        ( {budgetDiscountApplied} )
                    </Grid>
                </Grid>
                <Grid key="detailTotal" container spacing={spacing} alignItems='center' alignItems='center'>
                    <Grid item xs={7} />
                    <Grid item xs={1} > <Typography variant="subtitle2"> Total: </Typography>  </Grid>
                    <Grid item xs={1}/>
                    <Grid item xs={1} container justify='flex-end' > {budgetTotalWithDiscount} </Grid>
                </Grid>

            </div>
            <div className={classes.actionsContainer}>
                <div className={classes.lastButtonsSection}>
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