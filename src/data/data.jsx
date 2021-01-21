const dataPlanet = async () => {
  const planetsResponse = await fetch('https://swapi-trybe.herokuapp.com/api/planets/');
  const planets = await planetsResponse.json();
  return planets;
};

export default dataPlanet;
// Ass: Vanusa
// te amo<3 <3
