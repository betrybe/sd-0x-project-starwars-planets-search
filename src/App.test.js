import React from 'react';
import { mount, shallow } from 'enzyme';

import App from './App';
import Header from './components/Header';
import MovieCard from './components/MovieCard';
import MovieList from './components/MovieList';
import Rating from './components/Rating';

let wrapper;

const movies = [
  {
    title: 'Movie Title 1',
    subtitle: 'Movie Subtitle 1',
    storyline: 'Movie Storyline 1',
    rating: 4.5,
    imagePath: 'images/movie_1',
  },
  {
    title: 'Movie Title 2',
    subtitle: 'Movie Subtitle 2',
    storyline: 'Movie Storyline 2',
    rating: 4.5,
    imagePath: 'images/movie_2',
  },
  {
    title: 'Movie Title 3',
    subtitle: 'Movie Subtitle 3',
    storyline: 'Movie Storyline 3',
    rating: 3,
    imagePath: 'images/movie_3',
  },
];

describe('Crie um componente chamado `Header`', () => {
  it('Renderiza sem quebrar', () => {
    shallow(<Header />);
  });

  it('Renderize o texto "Movie Cards Library" dentro de `Header`', () => {
    wrapper = shallow(<Header />);
    expect(wrapper.find('header h1').text()).toBe('Movie Cards Library');
  });
});

describe('Crie um componente chamado `MovieList`', () => {
  it('Renderiza sem quebrar', () => {
    shallow(<MovieList movies={movies} />);
  });

  it('Renderize componentes `MovieCard` dentro de `MovieList`', () => {
    wrapper = shallow(<MovieList movies={movies} />);

    expect(wrapper.find(MovieCard).length).toEqual(3);
  });

  it('Passe uma key para cada `MovieCard` renderizado', () => {
    wrapper = mount(<MovieList movies={movies} />);
    const movieCards = wrapper.find(MovieCard);

    movieCards.forEach((movieCard, index) => {
      expect(movieCard.key()).toEqual(movies[index].title);
    });
  });
});

describe('Crie um componente chamado `MovieCard`', () => {
  const movie = movies[0];

  it('Renderiza sem quebrar', () => {
    shallow(<MovieCard movie={movie} />);
  });

  it('Renderize a imagem do filme', () => {
    wrapper = shallow(<MovieCard movie={movie} />);

    expect(wrapper.find('img').prop('src')).toEqual('images/movie_1');
  });

  it('Renderize o título do filme', () => {
    wrapper = shallow(<MovieCard movie={movie} />);

    expect(wrapper.find('h4').text()).toBe('Movie Title 1');
  });

  it('Renderize o subtítulo do filme', () => {
    wrapper = shallow(<MovieCard movie={movie} />);

    expect(wrapper.find('h5').text()).toBe('Movie Subtitle 1');
  });

  it('Renderize a sinopse do filme', () => {
    wrapper = shallow(<MovieCard movie={movie} />);

    expect(wrapper.find('p').text()).toBe('Movie Storyline 1');
  });

  it('Renderize um componente `Rating` dentro de `MovieCard`', () => {
    wrapper = shallow(<MovieCard movie={movie} />);

    expect(wrapper.find('Rating').length).toEqual(1);
  });

  it('Passe como prop para o componente `Rating` o atributo `rating`', () => {
    wrapper = mount(<MovieCard movie={movie} />);
    const starRating = wrapper.find(Rating);

    expect(starRating.props().rating).toEqual(4.5);
  });
});

describe('Crie um componente chamado `Rating`', () => {
  it('Renderiza sem quebrar', () => {
    shallow(<Rating />);
  });

  it('Renderize a nota de um filme dentro de `Rating`', () => {
    wrapper = shallow(<Rating rating={3} />);

    expect(wrapper.find('.rating').text()).toEqual('3');
  });
});

describe('Implemente o componente App', () => {
  it('`App` deve renderizar `Header`', () => {
    wrapper = shallow(<App />);
    expect(wrapper.find('Header').length).toEqual(1);
  });

  it('`App` deve renderizar `MovieList`', () => {
    expect(wrapper.find('MovieList').length).toEqual(1);
  });
});
