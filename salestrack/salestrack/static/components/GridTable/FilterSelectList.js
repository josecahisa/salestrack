import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  filterListArea: {
    overflow: 'auto',
    border: '1px dashed red'
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
}));

function not(a, b) {
  return a.filter(value => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter(value => b.indexOf(value) !== -1);
}

export default function FilterSelectList(props) {
  const classes = useStyles();
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState([0, 1, 2, 3]);

  const leftChecked = intersection(checked, left);

  const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const customList = items => (
      <List dense component="div" role="list">
        {items.map(value => {
          const labelId = `list-item-${value[props.column]}-label`;

          return (
            <ListItem key={value} role="listitem" button onClick={handleToggle(value.label)}>
              <ListItemText id={labelId} primary={value[props.column]} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
  );

  return (
    <Grid container spacing={2} justify="flex-start" alignItems="center" className={classes.filterListArea} >
        <Grid item>{customList(props.suggestions)}</Grid>
    </Grid>
  );
}