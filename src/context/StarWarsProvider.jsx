import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import StarWarsContext from './StarWarsContext';

function Provider({ children }) {
  const [planets, setPlanets] = useState([]);
  const [filteredPlanets, setFilteredPlanets] = useState([]);
  const [headersTable, setHeadersTable] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [filterNumeric, setFilterNumeric] = useState([]);
  const [filterActive, setFilterActive] = useState(false);
  const [optionsList, setOptionsList] = useState([]);
  const [order, setOrder] = useState({
    column: '',
    sort: '',
  });
  // const InitialFilters = {
  //   filters: {
  //     filterByName: {
  //       name: '',
  //     },
  //     filterByNumericValues: [],
  //     filterActive: false,
  //     order: {
  //       column: 'Name',
  //       sort: 'ASC',
  //     },
  //   },
  // };

  const regexOptions = new RegExp('^(\\d*)$', 'i');

  const ordened = (list, column, sort) => {
    list.sort((a, b) => {
      let aColumn;
      let bColumn;
      const zero = 0;
      const negative = -1;
      if (regexOptions.test(a[column]) || regexOptions.test(a[column])) {
        aColumn = parseInt(a[column], 0);
        bColumn = parseInt(b[column], 0);
      } else {
        aColumn = a[column];
        bColumn = b[column];
      }
      if (aColumn < bColumn) {
        return negative;
      }
      if (aColumn > bColumn) {
        return 1;
      }
      return zero;
    });
    if (sort === 'ASC') {
      return list;
    }
    return list.reverse();
  };
  // chamada da api
  const apiPlanets = async () => {
    const response = await fetch('https://swapi-trybe.herokuapp.com/api/planets/');
    const responseJson = await response.json();
    const infoPlanets = responseJson.results.map((info) => {
      delete info.residents;
      return info;
    });

    setPlanets(ordened(infoPlanets, 'name', 'ASC'));
    setFilteredPlanets(infoPlanets);
    setHeadersTable(Object.keys(infoPlanets[0]));
  };

  useEffect(() => {
    apiPlanets();
  }, []);

  const data = {
    planets,
    setPlanets,
    filteredPlanets,
    setFilteredPlanets,
    headersTable,
    apiPlanets,
    setFilterName,
    setFilterNumeric,
    filterNumeric,
    setFilterActive,
    setOptionsList,
    optionsList,
    setOrder,
    order,
    ordened,
    filters: {
      filterByName: {
        name: filterName,
      },
      filterByNumericValues: [],
      filterText: [],
      filterActive,
      order: {
        column: 'name',
        sort: 'ASC',
      },
    },
  };

  return (
    <StarWarsContext.Provider value={ data }>
      {children}
    </StarWarsContext.Provider>
  );
}

Provider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Provider;
