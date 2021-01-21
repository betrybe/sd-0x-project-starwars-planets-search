// Agradeço a Leticia, Rebeca, Johnatas, Nonato, Jota, Renato, e minha esposa por acreditarem que eu conseguiria e pelos feedbacks construtivos.
import React, { useContext, useEffect } from 'react';
import StarWarsContext from '../context/StarWarsContext';

function InfoTable() {
  const {
    filterNumeric,
    planets,
    headersTable,
    setFilterName,
    setFilterNumeric,
    filteredPlanets,
    setFilteredPlanets,
    setFilterActive,
    optionsList,
    setOrder,
    ordened,
    filters: { filterByName, filterActive, order: { column, sort } },
  } = useContext(StarWarsContext);

  // ordened(filteredPlanets, 'name', 'ASC');

  const orderResulte = () => {
    const orders = document.getElementsByName('order');

    const columnOrder = document.getElementById('column-sort');
    const listOrders = {};
    orders.forEach((order) => {
      if (order.checked === true) {
        listOrders.order = order.value;
        listOrders.column = columnOrder.value;
      }
    });
    setFilteredPlanets(ordened(filteredPlanets, listOrders.column, listOrders.order));
    setOrder(listOrders);
  };

  const handle = () => {
    const regexName = new RegExp(`\\w*${filterByName.name}\\w*`);
    const min = 1;
    if (filterByName.name.length >= min) {
      const filterPlanetsByName = planets
        .filter(({ name }) => regexName.test(name));
      const mudou = ordened(filterPlanetsByName, column, sort);
      setFilteredPlanets(mudou);
      // setFilteredPlanets(filterPlanetsByName);
    } else {
      setFilteredPlanets(planets);
    }
  };
  const regexOptions = new RegExp('^(\\d*)$', 'i');
  const options = headersTable.filter((item) => regexOptions.test(planets[0][item]));

  const planetsRefined = (filterCopy, param) => {
    const refined = param
      .filter((planet) => {
        const filterComparison = filterCopy.map((obj) => {
          const valueColumn = parseInt(planet[`${obj.column}`], 0);
          if (obj.comparison === 'maior que' && valueColumn > obj.value) {
            return planet;
          }
          if (obj.comparison === 'menor que' && valueColumn < obj.value) {
            return planet;
          }
          if (obj.comparison === 'igual a' && valueColumn === obj.value) {
            return planet;
          }
          return undefined;
        });
        return filterComparison[0];
      });
    const mudou = ordened(refined);
    setFilteredPlanets(mudou);
  };

  const handleRefine = () => {
    const columnSelected = document.getElementById('column');
    const comparisonFilter = document.getElementById('comparison').value;
    const valueFilter = parseInt(document.getElementById('valueFilter').value, 0);
    const filtered = {
      column: columnSelected.value,
      comparison: comparisonFilter,
      value: valueFilter,
    };
    const filterCopy = Array.from(filterNumeric);
    const zero = 0;
    filterCopy.splice(zero, zero, filtered);
    setFilterNumeric(filterCopy);

    planetsRefined(filterCopy, filteredPlanets);
    setFilterActive(true);
  };

  const clearRenderFilter = (filterClear, plan) => {
    let filterPlan = [...plan];
    filterClear.forEach((filter) => {
      filterPlan = filterPlan.filter((planet) => {
        const valueColumn = parseInt(planet[`${filter.column}`], 0);
        if (filter.comparison === 'maior que' && valueColumn > filter.value) {
          return planet;
        }
        if (filter.comparison === 'menor que') return valueColumn < filter.value;
        if (filter.comparison === 'igual a') return valueColumn === filter.value;
        return undefined;
      });
    });
    setFilteredPlanets(filterPlan);
  };

  const clearFilter = ({ value }) => {
    setFilteredPlanets(planets);
    const newFilterNumeric = filterNumeric.filter((element) => {
      if (element.column !== value) {
        return element.column;
      }
      return null;
    });
    setFilterNumeric(newFilterNumeric);
    clearRenderFilter(newFilterNumeric, planets);
  };

  function renderFilters() {
    if (filterActive) {
      return filterNumeric.map((element, index) => {
        optionsList.forEach((option) => {
          if (element.column === option) {
            options.splice(options.indexof());
          }
        });
        return (
          <h4 key={ index } data-testid="filter">
            {`${element.column} ${element.comparison} ${element.value}`}
            <button
              type="button"
              value={ element.column }
              onClick={ ({ target }) => clearFilter(target) }
            >
              X
            </button>
          </h4>
        );
      });
    }
    return <p>no filters</p>;
  }

  // useEffect(() => {}, []);

  useEffect(() => {
    handle();
  }, [filterByName.name]);

  return (
    <div>
      <label htmlFor="filter-planets">
        Nome do planeta
        <br />
        <input
          type="text"
          data-testid="name-filter"
          name="filter-planets"
          id="filter-planets"
          placeholder="Tatooine"
          onChange={ ({ target: { value } }) => {
            setFilterName(value);
          } }
        />
      </label>
      <br />
      <fieldset>
        <legend>
          Ordenar
        </legend>
        <label htmlFor="column-sort">
          <select id="column-sort" data-testid="column-sort">
            {
              headersTable.map((option) => (
                <option id={ option } key={ option } value={ option }>
                  { option }
                </option>))
            }
          </select>
        </label>
        <label htmlFor="ASC">
          ASC
          <input
            type="radio"
            data-testid="column-sort-input-asc"
            name="order"
            id="ASC"
            value="ASC"
          />
        </label>
        <label htmlFor="DESC">
          DESC
          <input
            type="radio"
            data-testid="column-sort-input-desc"
            name="order"
            id="DESC"
            value="DESC"
            // onChange={(e) => {}}
          />
        </label>
        <button
          data-testid="column-sort-button"
          type="button"
          onClick={ () => orderResulte() }
        >
          Order
        </button>
      </fieldset>
      <fieldset>
        <legend>
          Mais filtro
        </legend>
        <label htmlFor="column">
          <select id="column" data-testid="column-filter">
            {
              options.reverse().map((option) => (
                <option id={ option } key={ option } value={ option }>
                  { option }
                </option>))
            }
          </select>
        </label>
        <label htmlFor="comparison">
          <select id="comparison" data-testid="comparison-filter">
            <option value="maior que">maior que</option>
            <option value="menor que">menor que</option>
            <option value="igual a">igual a</option>
          </select>
        </label>
        <label htmlFor="valueFilter">
          <input id="valueFilter" type="number" data-testid="value-filter" />
        </label>
        <button
          type="button"
          data-testid="button-filter"
          onClick={ () => handleRefine() }
        >
          Refinar busca
        </button>
        {
          renderFilters()
        }
      </fieldset>
      <table border="1">
        <thead>
          <tr>
            {
              headersTable.map((key) => (
                <th key={ key }>
                  {key.replace('_', ' ')}
                </th>
              ))
            }
          </tr>
        </thead>
        <tbody>
          {
            filteredPlanets.map((planet) => (
              <tr key={ planet.name }>
                <td data-testid="planet-name">{planet.name}</td>
                <td>{planet.rotation_period}</td>
                <td>{planet.orbital_period}</td>
                <td>{planet.diameter}</td>
                <td>{planet.climate}</td>
                <td>{planet.gravity}</td>
                <td>{planet.terrain}</td>
                <td>{planet.surface_water}</td>
                <td>{planet.population}</td>
                <td>{planet.films}</td>
                <td>{planet.created}</td>
                <td>{planet.edited}</td>
                <td>{planet.url}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

export default InfoTable;
