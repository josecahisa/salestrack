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

export default function MenuAppBar() {
  const classes = useStyles();
  const [auth, setAuth] = React.useState(true);
  const [informAnchorEl, setInformAnchorEl] = React.useState(null);
  const [adminAnchorEl, setAdminAnchorEl] = React.useState(null);
  const [importAnchorEl, setImportAnchorEl] = React.useState(null);
  const [iconButtonAnchorEl, setIconButtonAnchorEl] = React.useState(null);
  const alertasUrl = '/maquinas/alertas';
  const informeProyectoUrl = '/maquinas/horas_proyecto';
  const historiaMaquinaUrl = '/maquinas/historia_maquina';
  const parteDiarioUrl = '/admin/maquinas_app/partediario/';
  const ordenMantenimientoUrl = '/admin/maquinas_app/ordenmantenimiento/';
  const ordenTrabajoUrl = '/admin/maquinas_app/ordentrabajo/';
  const tipoMaquinaUrl = '/admin/maquinas_app/tipomaquina/';
  const marcaUrl = '/admin/maquinas_app/marca/';
  const modeloUrl = '/admin/maquinas_app/modelo/';
  const maquinasUrl = '/admin/maquinas_app/maquina/';
  const tareasMantenimientoUrl = '/admin/maquinas_app/tareamantenimiento/';
  const tareasReparacionUrl = '/admin/maquinas_app/tareareparacion/';
  const lugarUrl = '/admin/maquinas_app/lugar/';
  const proyectoUrl = '/admin/maquinas_app/proyecto/';
  const unidadMantenimientoUrl = '/admin/maquinas_app/unidadmantenimiento/';
  const importarMaquinasUrl = '/maquinas/importar_maquinas';
  const importarServiciosUrl = '/maquinas/importar_servicios';
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
    // console.log('clicked on link ' + clickedLink);
  }

  return (
    <div className={classes.root}>
        <AppBar position="static" className={classes.appBar}>
            <Toolbar  variant="dense" className={classes.toolBar} data-test="mainMenu">
                <div className={classes.leftPane} >
                    <Typography variant="h6" className={classes.title}>
                        Softrack
                    </Typography>
                    <Button
                        color="inherit"
                        aria-controls="inform-menu"
                        aria-haspopup="true"
                        onClick={handleMenu("inform")}
                        className={classes.topMenuButton}
                        data-test="menuInformes"
                    >
                        Informes
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
                                Alertas de Mantenimiento
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={handleClose} data-test="menuOption-InformeDeProyectos">
                            <Link
                                href={informeProyectoUrl} color="inherit" className={classes.link}>
                                Informe de Proyectos
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={handleClose} >
                            <Link
                                href={historiaMaquinaUrl}
                                color="inherit"
                                className={classes.link}
                                data-test="menuOption-HistoriaDeMaquinas"
                            >
                                Historia de Maquinas
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
                                href={parteDiarioUrl}
                                color="inherit"
                                className={classes.link}
                                onClick={displayClickedLink(parteDiarioUrl)}
                                data-test="menuOption-PartesDiarios"
                            >
                                Partes Diarios
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={handleClose} >
                            <Link
                                href={ordenMantenimientoUrl}
                                color="inherit"
                                className={classes.link}
                                onClick={displayClickedLink(ordenMantenimientoUrl)}
                                data-test="menuOption-OrdenMantYReparacion"
                            >
                                Orden de Mantenimiento y Reparación
                            </Link>
                        </MenuItem>
                        <Divider/>
                        <MenuItem onClick={handleClose}>
                            <Link
                                href={tipoMaquinaUrl}
                                color="inherit"
                                className={classes.link}
                                onClick={displayClickedLink(tipoMaquinaUrl)}
                                data-test="menuOption-TiposDeMaquinas"
                            >
                                Tipos de Maquinas
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                            <Link
                                href={marcaUrl}
                                color="inherit"
                                className={classes.link}
                                onClick={displayClickedLink(marcaUrl)}
                                data-test="menuOption-Marcas"
                            >
                                Marcas
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                            <Link
                                href={modeloUrl}
                                color="inherit"
                                className={classes.link}
                                data-test="menuOption-Modelos"
                            >
                                Modelos
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                            <Link
                                href={maquinasUrl}
                                color="inherit"
                                className={classes.link}
                                data-test="menuOption-Maquinas"
                            >
                                Máquinas
                            </Link>
                        </MenuItem>
                        <Divider/>
                        <MenuItem onClick={handleClose}>
                            <Link
                                href={tareasMantenimientoUrl}
                                color="inherit"
                                className={classes.link}
                                data-test="menuOption-TareasDeMantenimiento"
                            >
                                Tareas de Mantenimiento
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                            <Link
                                href={tareasReparacionUrl}
                                color="inherit"
                                className={classes.link}
                                data-test="menuOption-TareasDeReparacion"
                            >
                                Tareas de Reparación
                            </Link>
                        </MenuItem>
                        <Divider/>
                        <MenuItem onClick={handleClose}>
                            <Link
                                href={lugarUrl}
                                color="inherit"
                                className={classes.link}
                                data-test="menuOption-Lugares"
                            >
                                Lugares
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                            <Link
                                href={proyectoUrl}
                                color="inherit"
                                className={classes.link}
                                data-test="menuOption-Proyectos"
                            >
                                Proyectos
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                            <Link
                                href={unidadMantenimientoUrl}
                                color="inherit"
                                className={classes.link}
                                data-test="menuOption-Unidades"
                            >
                                Unidades
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
                            <Link href={importarMaquinasUrl} color="inherit" className={classes.link}>
                                Importar Máquinas
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                            <Link href={importarServiciosUrl} color="inherit" className={classes.link}>
                                Importar Servicios de Mantenimiento
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

