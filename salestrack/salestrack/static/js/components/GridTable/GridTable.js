import React, { Fragment } from 'react';
import { Grid, Box, Paper, Typography, Divider } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ArrowDownWard from '@material-ui/icons/ArrowDownWard';
import ArrowUpWard from '@material-ui/icons/ArrowUpWard';
import ReorderOutlined from '@material-ui/icons/ReorderOutlined';
import FilterDialog from 'components/GridTable/FilterDialog';
import Semaphore from 'components/GridTable/Semaphore';
import lodash from 'lodash';

class Column {
    constructor (column) {
        this.dataColumn = column.dataColumn;
        this.order = '';
        this.filter = [];
        this.column = column;
    }
}

const columnHasFilter = gridColumn => {
    return Array.isArray(gridColumn.filter) && gridColumn.filter.length;
}

class GridTableTitle extends React.Component {
    render() {
        const { classes, columnsSpec, titleFormatting, displayFilters, orderApplied, gridColumns, stateUpdated } = this.props;

        return (
            <Box
                width="100%"
                fontWeight="fontWeightBold"
                {...titleFormatting}
                className={classes.titleRow}
            >
                <Grid container  >
                    { columnsSpec.map( (columnSpec, index) => {

                        let orderDirection = gridColumns[columnSpec.dataColumn].order;

                        return (
                            <GridTableColumnTitle
                                gridColumn={gridColumns[columnSpec.dataColumn]}
                                classes={classes}
                                displayFilter={displayFilters}
                                key={'gridTableTitle' + index + '-' + columnSpec.dataColumn }
                                onColumnHeaderClick={this.props.onColumnHeaderClick}
                                onColumnFilterClick={this.props.onColumnFilterClick}
                                orderDirection={orderDirection}
                                stateUpdated={stateUpdated}
                            />
                        )
                    })}
                </Grid>
            </Box>
        )
    }
}

class GridTableColumnTitle extends React.PureComponent {

    displayOrderIcon() {
        const { orderDirection, classes } = this.props;

        return (
            (orderDirection === 'asc')
                ? <ArrowDownWard className={classes.columnTitleOrderDirectionIcon} /> 
                : <ArrowUpWard className={classes.columnTitleOrderDirectionIcon} /> 
        )
    }

    displayFilteredIcon(filterApplied) {
        const { classes } = this.props;
        if (Array.isArray(filterApplied) && filterApplied.length) {
            return ( <ReorderOutlined className={classes.filterIcon} /> ); 
        }
    }

    render() {
        const { gridColumn, classes, displayFilter, onColumnHeaderClick, onColumnFilterClick, orderDirection } = this.props;
        const columnSpec = gridColumn.column;
        const renderDisplayOrderIcon = orderDirection === '' ? false : true;

        return (
            <Grid
                item xs={12}
                sm={columnSpec.size}
                className={classes.columnTitle}
            >
                <Typography variant='subtitle2' align='center' onClick={onColumnHeaderClick(columnSpec.dataColumn)} >
                    <Box fontWeight="fontWeightBold">
                        {columnSpec.name}
                    </Box>
                </Typography>
                { displayFilter && renderDisplayOrderIcon && this.displayOrderIcon()}
                { displayFilter && this.displayFilteredIcon(gridColumn.filter)}
                { displayFilter && <ArrowDropDown className={classes.columnTitleArrow} onClick={onColumnFilterClick(columnSpec.dataColumn)} /> }
            </Grid>
        )
    }
}

class GridTableRow extends React.PureComponent {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this)
        this.state = {
            toggled: false
        }
    };

    onClick() {
        const { rowData } = this.props;
        rowData.detalle ? this.setState({ toggled: !this.state.toggled}) : '';
    };

    renderDetails() {
        const { rowData, detailClasses, detailColumSpec } = this.props;

        return (
            <GridTable
                data={rowData.detalle}
                columnsSpec={detailColumSpec}
                classes={detailClasses}
                rowInPaper={false}
                displayFilters={false}
            />
        )
    }

    render() {
        const { rowData, columnsSpec, rowFormatting } = this.props;
        const { toggled } = this.state;

        return (
            <>
                <Box
                    width="100%"
                    {...rowFormatting}
                >
                    <Grid container onClick={this.onClick}>
                        { columnsSpec.map( (columnSpec, index) => {
                            return (
                                    <Grid item xs={12} sm={columnSpec.size} key={'gridTableRow' + index + '-' + columnSpec.dataColumn }>
                                    {
                                        columnSpec.displayType === 'text' && 
                                        <Typography align={columnSpec.alignment} variant='body2' >
                                            {rowData[columnSpec.dataColumn]}
                                        </Typography>
                                    }
                                    {
                                        columnSpec.displayType === 'semaphore' && 
                                        <Semaphore
                                            displayText={false}
                                            semaphoreValue={rowData[columnSpec.dataColumn]}
                                        />
                                    }
                                    </Grid>
                            )
                        })}
                    </Grid>
                </Box>
                {toggled && this.renderDetails()}
            </>
        )
    }
}

export default class GridTable extends React.Component {
    constructor(props) {
        super(props);
        this.onColumnFilterClick = this.onColumnFilterClick.bind(this);
        this.toggleColumnOrder = this.toggleColumnOrder.bind(this);

        var gridColumns = {};
        this.props.columnsSpec.map( column => gridColumns[column.dataColumn] = new Column(column));

        this.state = {
            filterDialogOpened: false,
            filterDialogColumn: '',
            gridColumns: gridColumns,
            stateUpdated: false
        }
    };

    onColumnFilterClick = column => event => {
        this.setState({ filterDialogOpened: true, filterDialogColumn: column });
    }

    onCloseFilterDialog = (dataColumn, action, filteredItems, order) => () => {
        if (action === 'Apply') {
            this.setState( state => {
                const gridColumns = Object.assign({}, state.gridColumns);
                gridColumns[dataColumn].filter = filteredItems;
                return { gridColumns, stateUpdated : !state.stateUpdated };
            });
        }
        this.setState({ filterDialogOpened: false, filterDialogColumn: '' });
    }

    toggleColumnOrder = dataColumn => () => {
        const { gridColumns } = this.state; 
        const { updateData } = this.props;
        let currentOrderForDataColumn = gridColumns[dataColumn].order;
        this.removePreviousOrder();
        let updatedGridColumns = gridColumns;
        updatedGridColumns[dataColumn].order = currentOrderForDataColumn === 'asc' ? 'desc' : 'asc';
        this.setState({ gridColumns: updatedGridColumns });

        const sortedData = lodash.orderBy(this.props.data, [dataColumn], [updatedGridColumns[dataColumn].order]);
        updateData(sortedData);
    }

    removePreviousOrder = () => {
        const { gridColumns } = this.state; 
        let updatedGridColumns = gridColumns;
        Object.keys(updatedGridColumns).map( key => updatedGridColumns[key].order = '');
        this.setState({ gridColumns: updatedGridColumns });
    }

    filterRow = (gridColumnsWithFilters, dataRecord) => {
        let filterRow = false;
        
        if (gridColumnsWithFilters.length > 0) {
            filterRow = !gridColumnsWithFilters.some( filterColumn => {
                const elementFound = filterColumn.filter.find( filterValue => 
                    filterValue === dataRecord[filterColumn.dataColumn]
                )
                return elementFound;
            });
        } 
        return filterRow
    }

    render() {
        const { columnsSpec, detailColumSpec, classes, detailClasses, data } = this.props;
        const { filterDialogOpened, filterDialogColumn, gridColumns, stateUpdated } = this.state; 
        const rowInPaper = this.props.rowInPaper ? this.props.rowInPaper : false;

        const defaultRowFormatting = {
            borderBottom: 1,
            borderColor: grey[200]
        }

        const defaultTitleFormatting = {
            borderBottom: 1,
            borderColor: grey[700],
            borderRadius: 12
        }

        const rowFormatting = this.props.rowFormatting ? this.props.rowFormatting : defaultRowFormatting;
        const titleFormatting = this.props.titleFormatting ? this.props.titleFormatting : defaultTitleFormatting;
        let displayFilters;
        if (this.props.displayFilters === undefined) {
            displayFilters = true;
        } else {
            displayFilters = this.props.displayFilters;
        }

        const filterDialogGridColumn = gridColumns[filterDialogColumn];
        const gridColumnsWithFilters = Object.keys(gridColumns).map( key => {
            return columnHasFilter(gridColumns[key]) ? gridColumns[key] : null
        }).filter( n => n);

        return (
            <>
            {data &&
            <Grid container spacing={1}>
                    <GridTableTitle
                        classes={classes}
                        columnsSpec={columnsSpec}
                        titleFormatting={titleFormatting}
                        displayFilters={displayFilters}
                        onColumnHeaderClick={this.toggleColumnOrder}
                        onColumnFilterClick={this.onColumnFilterClick}
                        orderApplied={this.state.orderApplied}
                        gridColumns={gridColumns}
                        stateUpdated={stateUpdated}
                    />
                    {
                        data.map( (dataRecord, index) => {
                            if (!this.filterRow(gridColumnsWithFilters, dataRecord)) {
                                return (
                                    <Fragment key={'fragment' + index} >
                                        {
                                            rowInPaper 
                                            ? 
                                            <Paper className={classes.paper} key={'paper' + index}>
                                                <GridTableRow
                                                    key={'GridTableRow' + index}
                                                    rowData={dataRecord}
                                                    classes={classes}
                                                    detailClasses={detailClasses}
                                                    columnsSpec={columnsSpec}
                                                    detailColumSpec={detailColumSpec}
                                                />
                                            </Paper>
                                            :
                                            <GridTableRow
                                                key={'GridTableRow' + index}
                                                rowData={dataRecord}
                                                classes={classes}
                                                columnsSpec={columnsSpec}
                                                detailClasses={detailClasses}
                                                rowFormatting={rowFormatting}
                                            />
                                        }
                                    </Fragment>
                                )
                            }
                        })
                    }
                </Grid>}
                {filterDialogOpened && 
                    <FilterDialog
                        open={filterDialogOpened}
                        onClose={this.onCloseFilterDialog}
                        gridColumn={filterDialogGridColumn}
                        data={data}
                        classes={classes}
                        selectedItem={gridColumns[filterDialogColumn].filter}
                    />
                }
                </>
        );
    }
}
