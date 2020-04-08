import React from 'react';
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
      width: "100px"
  },
  appBar: {
  },
  toolBar: {
  },
  leftPane: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center"
  },
  topMenuButton: {
      padding: "15px"
  },
  link: {
    '&:hover': {
        textDecoration: 'none'
    },
    textDecoration: 'none'
  }
}));

// TODO: the menu should receive an array
export default function MenuAppBar() {
  const classes = useStyles();
  const [auth, setAuth] = React.useState(true);
  const [informAnchorEl, setInformAnchorEl] = React.useState(null);
  const [adminAnchorEl, setAdminAnchorEl] = React.useState(null);
  const [importAnchorEl, setImportAnchorEl] = React.useState(null);
  const [iconButtonAnchorEl, setIconButtonAnchorEl] = React.useState(null);
  // Models Admin
  const productsAdminUrl = '/admin/products/product/';
  const categoryAdminUrl = '/admin/products/category/';
  const classificationAdminUrl = '/admin/products/classification/';
  const brandAdminUrl = '/admin/products/brand/';
  const businessUnitAdminUrl = '/admin/products/business_unit/';
  // Not in Use:
  const alertasUrl = '/budgets/budget_form';
  const informeProyectoUrl = '/maquinas/horas_proyecto';
  const historiaMaquinaUrl = '/maquinas/historia_maquina';
  // Import options
  const productImportUrl = '/products/import_products';
  // Logout
  const logOutUrl = '/users/logout?next=/users/login';

  const handleMenu = option => event => {
    switch (option) {
        case "inform": setInformAnchorEl(event.currentTarget); break;
        case "admin": setAdminAnchorEl(event.currentTarget); break;
        case "import": setImportAnchorEl(event.currentTarget); break;
        case "userButton": setIconButtonAnchorEl(event.currentTarget); break;
    }
  }

  function handleClose() {
    setInformAnchorEl(null);
    setAdminAnchorEl(null);
    setImportAnchorEl(null);
    setIconButtonAnchorEl(null);
  }

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  const displayClickedLink = clickedLink => () => {
    console.log('clicked on link ' + clickedLink);
  }

  return (
    <div className={classes.root}>
        <AppBar position="static" className={classes.appBar}>
            <Toolbar  variant="dense" className={classes.toolBar} data-test="mainMenu">
                <div className={classes.leftPane} >
                    <Typography variant="h6" className={classes.title}>
                        Salestrack
                    </Typography>
                    <Button
                        color="inherit"
                        aria-controls="inform-menu"
                        aria-haspopup="true"
                        onClick={handleMenu("inform")}
                        className={classes.topMenuButton}
                        data-test="menuInformes"
                    >
                        Presupuestos
                    </Button>
                    <Menu
                        id="inform-menu"
                        anchorEl={informAnchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        getContentAnchorEl={null}
                        keepMounted
                        open={Boolean(informAnchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem
                            onClick={handleClose}
                            data-test="menuOption-AlertasDeMantenimiento"
                        >
                            <Link
                                href={alertasUrl}
                                color="inherit"
                                className={classes.link}
                                onClick={displayClickedLink(alertasUrl)}
                            >
                                Nuevo Presupuesto
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={handleClose} data-test="menuOption-InformeDeProyectos">
                            <Link
                                href={informeProyectoUrl} color="inherit" className={classes.link}>
                                Listado de Presupuestos
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={handleClose} >
                            <Link
                                href={historiaMaquinaUrl}
                                color="inherit"
                                className={classes.link}
                                data-test="menuOption-HistoriaDeMaquinas"
                            >
                                Listado de Notas de Ventas
                            </Link>
                        </MenuItem>
                    </Menu>
                    <Button
                        color="inherit"
                        aria-controls="admin-menu"
                        aria-haspopup="true"
                        onClick={handleMenu("admin")}
                        className={classes.topMenuButton}
                        data-test="menuAdministracion"
                    >
                        Administración
                    </Button>
                    <Menu
                        id="admin-menu"
                        anchorEl={adminAnchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        getContentAnchorEl={null}
                        keepMounted
                        open={Boolean(adminAnchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose} >
                            <Link
                                href={productsAdminUrl}
                                color="inherit"
                                className={classes.link}
                                onClick={displayClickedLink(productsAdminUrl)}
                                data-test="menuOption-productAdmin"
                            >
                                Productos
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={handleClose} >
                            <Link
                                href={categoryAdminUrl}
                                color="inherit"
                                className={classes.link}
                                onClick={displayClickedLink(categoryAdminUrl)}
                                data-test="menuOption-categoryAdmin"
                            >
                                Categorías
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={handleClose} >
                            <Link
                                href={classificationAdminUrl}
                                color="inherit"
                                className={classes.link}
                                onClick={displayClickedLink(classificationAdminUrl)}
                                data-test="menuOption-classificationAdmin"
                            >
                                Rubro
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={handleClose} >
                            <Link
                                href={businessUnitAdminUrl}
                                color="inherit"
                                className={classes.link}
                                onClick={displayClickedLink(businessUnitAdminUrl)}
                                data-test="menuOption-businessUnitAdmin"
                            >
                                Unidad de Negocio
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={handleClose} >
                            <Link
                                href={brandAdminUrl}
                                color="inherit"
                                className={classes.link}
                                onClick={displayClickedLink(brandAdminUrl)}
                                data-test="menuOption-businessUnitAdmin"
                            >
                                ABM Marcas
                            </Link>
                        </MenuItem>
                    </Menu>
                    <Button color="inherit" aria-controls="import-menu" aria-haspopup="true" onClick={handleMenu("import")} className={classes.topMenuButton}>
                        Importar Datos
                    </Button>
                    <Menu
                        id="import-menu"
                        anchorEl={importAnchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        getContentAnchorEl={null}
                        keepMounted
                        open={Boolean(importAnchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>
                            <Link href={productImportUrl} color="inherit" className={classes.link}>
                                Importar Productos
                            </Link>
                        </MenuItem>
                    </Menu>                    
                </div>
                {auth && (
                    <div>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu("userButton")}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={iconButtonAnchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            getContentAnchorEl={null}
                            keepMounted
                            open={Boolean(iconButtonAnchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}>
                                <Link href={logOutUrl} color="inherit" className={classes.link}>
                                    Salir
                                </Link>
                            </MenuItem>
                        </Menu>
                    </div>
                )}
            </Toolbar>
        </AppBar>
    </div>
  );
}

