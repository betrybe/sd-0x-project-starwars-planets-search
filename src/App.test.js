import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import App from './App';
import testData from './testData';

const ROW_ROLE_SELECTOR = 'row';
const COLUMN_ROLE_SELECTOR = 'columnheader';
const INPUT_FILTER_NAME_SELECTOR = 'input-filter-name';

const mockFetch = () => {
  jest.spyOn(global, 'fetch')
    .mockImplementation(() => Promise.resolve({
      status: 200,
      ok: true,
      json: () => Promise.resolve(testData)
    }));
}

describe('Fazer uma requisição para o endpoint `/planets` da API de Star Wars e preencher uma tabela com os dados retornados, com exceção dos da coluna `residents`', () => {
  beforeAll(mockFetch);
  beforeEach(cleanup);

  it('realiza uma requisição para a API', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(global.fetch).toHaveBeenCalled();
  });

  it('preenche a tabela com os dados retornados', async () => {
    await act(async () => {
      render(<App />);
    });
    const planets = testData.results;
    for(let planetIndex in planets) {
      const name = await screen.findByText(planets[planetIndex].name);
      const rotationPeriod = await screen.findAllByText(planets[planetIndex].rotation_period);
      const orbitalPeriod = await screen.findAllByText(planets[planetIndex].orbital_period);
      const diameter = await screen.findAllByText(planets[planetIndex].diameter);
      const climate = await screen.findAllByText(planets[planetIndex].climate);
      const gravity = await screen.findAllByText(planets[planetIndex].gravity);
      const terrain = await screen.findAllByText(planets[planetIndex].terrain);
      const surfaceWater = await screen.findAllByText(planets[planetIndex].surface_water);
      const population = await screen.findAllByText(planets[planetIndex].population);

      expect(name).toBeInTheDocument();
      expect(rotationPeriod.length).toBeGreaterThanOrEqual(1);
      expect(orbitalPeriod.length).toBeGreaterThanOrEqual(1);
      expect(diameter.length).toBeGreaterThanOrEqual(1);
      expect(climate.length).toBeGreaterThanOrEqual(1);
      expect(gravity.length).toBeGreaterThanOrEqual(1);
      expect(terrain.length).toBeGreaterThanOrEqual(1);
      expect(surfaceWater.length).toBeGreaterThanOrEqual(1);
      expect(population.length).toBeGreaterThanOrEqual(1);
    };
  });

  it('renderiza uma tabela com 13 colunas', async () => {
    await act(async () => {
      render(<App />);
    });
    // a requisição (mock) retorna 14 chaves em cada planeta, mas a chave `residents` não deve ser exibida totalizando 13 colunas
    expect(await screen.findAllByRole(COLUMN_ROLE_SELECTOR)).toHaveLength(13);
  });

  it('renderiza uma tabela com 11 linhas', async () => {
    await act(async () => {
      render(<App />);
    });
    // a requisição (mock) retorna 10 planetas, somando com mais um linha do header totalizando 11 linhas
    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(11);
  });
});

describe('Sua página deve ter um campo de texto que filtra a tabela para somente exibir planetas cujos nomes incluam o texto digitado', () => {
  beforeAll(mockFetch);
  beforeEach(cleanup);

  it('renderiza campo de texto para filtro de nomes', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(await screen.findByTestId(INPUT_FILTER_NAME_SELECTOR)).toBeInTheDocument();
  });

  it('filtra planetas que possuem a letra "o" no nome', async () => {
    await act(async () => {
      render(<App />);
      const input = await screen.findByTestId(INPUT_FILTER_NAME_SELECTOR);
      fireEvent.change(input, { target: { value: 'o' } });
    });

    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(8);
    ['Coruscant', 'Dagobah', 'Endor', 'Hoth', 'Kamino', 'Naboo', 'Tatooine'].map(async (planetName) => {
      expect(await screen.findByText(planetName)).toBeInTheDocument();
    });
  });

  it('filtra planetas que possuem a letra "oo" no nome', async () => {
    await act(async () => {
      render(<App />);
      const input = await screen.findByTestId(INPUT_FILTER_NAME_SELECTOR);
      fireEvent.change(input, { target: { value: 'oo' } });
    });

    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(3);
    ['Naboo', 'Tatooine'].map(async (planetName) => {
      expect(await screen.findByText(planetName)).toBeInTheDocument();
    });
  });

  it('realiza vários filtros em sequência', async () => {
    await act(async () => {
      render(<App />);
      const input = await screen.findByTestId(INPUT_FILTER_NAME_SELECTOR);
      fireEvent.change(input, { target: { value: 'o' } });
    });
    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(8);
    ['Coruscant', 'Dagobah', 'Endor', 'Hoth', 'Kamino', 'Naboo', 'Tatooine'].map(async (planetName) => {
      expect(await screen.findByText(planetName)).toBeInTheDocument();
    });

    await act(async () => {
      const input = await screen.findByTestId(INPUT_FILTER_NAME_SELECTOR);
      fireEvent.change(input, { target: { value: 'oo' } });
    });
    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(3);
    ['Naboo', 'Tatooine'].map(async (planetName) => {
      expect(await screen.findByText(planetName)).toBeInTheDocument();
    });

    await act(async () => {
      const input = await screen.findByTestId(INPUT_FILTER_NAME_SELECTOR);
      fireEvent.change(input, { target: { value: '' } });
    });
    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(11);
    ['Alderaan', 'Bespin', 'Coruscant', 'Dagobah', 'Endor', 'Hoth', 'Kamino', 'Naboo', 'Tatooine', 'Yavin IV'].map(async (planetName) => {
      expect(await screen.findByText(planetName)).toBeInTheDocument();
    });
  });
});
