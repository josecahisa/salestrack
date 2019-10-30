
import React from 'react';
import ReactDOM from 'react-dom';
import request from 'superagent';

import { makeStyles } from '@material-ui/core/styles';
import { brown, blueGrey, grey, red, yellow, green } from '@material-ui/core/colors';

import Button from '@material-ui/core/Button';
import CloudDownload from '@material-ui/icons/CloudDownloadOutlined';
import PrintIcon from '@material-ui/icons/PrintOutlined';
import CachedIcon from '@material-ui/icons/CachedOutlined';

import MenuAppBar from 'components/Menu/menu';
import GridTable from 'components/GridTable/GridTable';
import LoadingMessage from 'components/LoadingMessage/LoadingMessage';


const useStyles = makeStyles(theme => ({
    mainContainer: {
        display: 'flex',
        flexDirection: 'column'
    },
    titleArea: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '0 20px',
        backgroundColor: brown['50'],
        alignItems: 'center',
        '& h6' : {
            marginBottom: 0
        }
    },
    dataContainer: {
        padding: '0 20px',
    },
    filtersArea: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    input: {
      display: 'none',
    },
    fab: {
        margin: theme.spacing(1),
      },
      extendedIcon: {
        marginRight: theme.spacing(1),
    },
    // Grid Table
    root: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        height: 48,
        padding: '0 30px',
    },
    rootParent: {
        flexGrow: 1
    },
    paper: {
        margin: '4px 0 4px 0',
        padding: '5px',
        width: '100%',
        minWidth: 500,
        cursor: 'pointer'
    },
    titleRow: {
        marginTop: '30px',
        padding: '10px 0',
        backgroundColor: blueGrey['800'],
        color: 'white'
    }
}));

const mainGridStyles = makeStyles(theme => ({
    paper: {
        margin: '4px 0 4px 0',
        padding: '5px',
        width: '100%',
        minWidth: 500,
        cursor: 'pointer'
    },
    titleRow: {
        marginTop: '30px',
        padding: '10px 0',
        backgroundColor: blueGrey['800'],
        color: 'white'
    },
    okIcon: {
        color: green['500']
    },
    alarmIcon: {
        color: yellow['A700']
    },
    errorIcon: {
        color: red['500']
    },
    columnTitle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer'
    },
    columnTitleArrow: {
        marginLeft: '1px'
    },
    columnTitleOrderDirectionIcon: {
        fontSize: '14px'
    },
    filterIcon: {
        marginLeft: '3px',
        fontSize: '14px'
    },
    filterDialog: {
        overflow: 'hidden'
    },
    dialogPaper: {
        minHeight: '90vh',
        maxHeight: '90vh'
    },
    filterDialogDivider: {
        margin: "10px"
    }
}));

const detailGridStyles = makeStyles(theme => ({
    paper: {
        margin: '4px 0 4px 0',
        padding: '5px',
        width: '100%',
        minWidth: 500,
        cursor: 'pointer'
    },
    titleRow: {
        marginTop: '5px',
        padding: '10px 0',
        backgroundColor: grey['50'],
        color: 'black',
        fontWeight: 'fontWeightBold'
    },
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

export default function AlertsReport() {
    const classes = useStyles();
    const mainGridClasses = mainGridStyles();
    const detailGridClasses = detailGridStyles();
    const [alertReportData, setAlertReportData] = React.useState(null);
    const [isLoading, setLoadingState] = React.useState(false);
    const [automaticLoad, setAutomaticLoad] = React.useState(true);
    const [automaticLoaded, setAutomaticLoaded] = React.useState(false);
    
    React.useEffect(() => {
        if (automaticLoad && !automaticLoaded) {
            retrieveAlertReportJsonData();
            setAutomaticLoaded(true);
        }
    });

    function retrieveAlertReportJsonData() {
        setLoadingState(true);
        setAlertReportData(null);
        request
            .get('/maquinas/json/alert_report/')
            .set('Accept', 'application/json')
            .then( response => {
                setLoadingState(false);
                const alertsReport = JSON.parse(response.text);
                setAlertReportData(alertsReport);
            });
    }

    function onGenerateReportClick(e) {
        retrieveAlertReportJsonData();
    }

    function getReportColumns() {
        return ([
            {name: 'Código', size: 1, dataColumn: 'codigo', displayType:'text', alignment:'center'},
            {name: 'Modelo', size: 3, dataColumn: 'modelo', displayType:'text', alignment:'center'},
            {name: 'Marca', size: 1, dataColumn: 'marca', displayType:'text', alignment:'center'},
            {name: 'Dominio', size: 1, dataColumn: 'dominio', displayType:'text', alignment:'center'},
            {name: 'Hs / Km', size: 1, dataColumn: 'kilometraje_actual', displayType:'text', alignment:'center'},
            {name: 'Ubicación', size: 2, dataColumn: 'ubicacion', displayType:'text', alignment:'center'},
            {name: 'Proyecto', size: 2, dataColumn: 'proyecto', displayType:'text', alignment:'center'},
            {name: 'Estado Service', size: 1, dataColumn: 'semaforo', displayType:'semaphore', alignment:'center'},
        ]);
    }

    function getReportDetailColumns() {
        return ([
            {name: '', size: 1, dataColumn: '', displayType:'dummy', alignment:'center'},
            {name: 'Service', size: 4, dataColumn: 'mantenimiento', displayType:'text', alignment:'left'},
            {name: 'Próxima Inspección', size: 2, dataColumn: 'proxima_inspeccion', displayType:'text', alignment:'center'},
            {name: 'Fecha Ult. Mant.', size: 2, dataColumn: 'fecha_mantenimiento', displayType:'text', alignment:'center'},
            {name: 'Hr/Km Ult. Mant. ', size: 2, dataColumn: 'kilometraje_mantenimiento', displayType:'text', alignment:'center'},
            {name: '', size: 1, dataColumn: 'semaforo', displayType:'semaphore'},
        ])
    }

    function updateSortAndFilteredData(updatedData) {
        setAlertReportData(updatedData);
    }

    return (
        <>
            <MenuAppBar />
            <div className={classes.mainContainer}>
                <div className={classes.titleArea}>
                    <h6>Alertas de Mantenimiento de Máquinas</h6>
                    <div className={classes.filtersArea}>
                        <Button color="primary" size="small" onClick={onGenerateReportClick}>
                            <CachedIcon size="small" className={classes.extendedIcon} />
                            Generar
                        </Button>
                        <Button href="/maquinas/csv/alertas" aria-label="Exportar" className={classes.fab} size="small" >
                            <CloudDownload size="small" className={classes.extendedIcon} />
                            Exportar
                        </Button>
                        <Button aria-label="Imprimir" className={classes.fab} size="small" disabled >
                            <PrintIcon size="small" className={classes.extendedIcon} />
                            Imprimir
                        </Button>
                    </div>
                </div>
                <div className={classes.dataContainer}>
                    { isLoading && <LoadingMessage />}
                    { !isLoading &&
                        <GridTable
                            data={alertReportData}
                            columnsSpec={getReportColumns()}
                            detailColumSpec={getReportDetailColumns()}
                            rowInPaper={true}
                            classes={mainGridClasses}
                            detailClasses={detailGridClasses}
                            updateData={updateSortAndFilteredData}
                        />
                    }
                </div>
            </div>
        </>
    );
}

ReactDOM.render(<AlertsReport />, document.getElementById('react-app'));