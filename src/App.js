import React from 'react';
import './style/App.scss';
import axios from 'axios';
import loading from './images/loading.gif';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Link } from 'react-router-dom';

const url = 'https://api.thecatapi.com/v1/images/search?limit=12';
const breedsUrl = 'https://api.thecatapi.com/v1/breeds';

// Création d'un tableau qui contient toutes nos pages
const pageNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function App () {
  // Initialise le state qui va contenir nos photos de chats
  const [pictures, setPictures] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(25);
  const [isLoading, setIsLoading] = React.useState(true);
  const [breeds, setBreeds] = React.useState([]);
  const [selected, setSelected] = React.useState('');
  const [type, setType] = React.useState('');

  // Déclencher fetchBreeds seulement au lancement de la page
  React.useEffect(fetchBreeds, []);

  // Déclencher fetchPictures une fois que l'action va ce lancer et envoyer une nouvelle curentPage
  React.useEffect(fetchCats, [currentPage, selected, type]);

  return (
    <BrowserRouter>
      <div className='App container'>

        <h1 className='text-center my-3 mb-5'>Galerie de chats</h1>

        {/* Afficher le gif loading */}
        {isLoading && <img className='loading' src={loading} alt="Loading GIF" width='150' height='150'/>}
        {/* Afficher le gif loading end */}

        <header className='row'>

          {/* Navigation des images, si png, jpg, ou gif */}
          <nav className='col'>
            <ul className='list-unstyled m-0'>
              <li>
                <Link to="/" exact={true} onClick={() => setType('')}>Tous</Link>
              </li>
              <li>
                <Link to="/photos" onClick={() => setType('png, jpg')}>Photos</Link>
              </li>
              <li>
                <Link to="/gifs" onClick={() => setType('gif')}>Gifs</Link>
              </li>
            </ul>
          </nav>
          {/* Navigation des images, si png, jpg, ou gif end */}

          {/* Afficher le selecteur de race de chat */}
          <select className='custom-select col' id='Breeds' name='Breeds' onChange={handleSelect}>
            <option selected value=''>Choose...</option>
            {breeds.map((breed, index) => (
              <option key={index} value={breed.id}>{breed.name}</option>
            ))}
          </select>
          {/* Afficher le selecteur de race de chat end */}
        </header>

        <main className='flex-column'>

          {/* Afficher les images de chats */}
          <div className='Pictures'>
              {pictures.map((picture, index) => (
                <img className='Picture shadow m-3 bg-white rounded' key={index} src={picture.url} alt="Photo de chat"/>
              ))}
          </div>
          {/* Afficher les images de chats */}

        </main>

        <footer className='my-3'>

          {/* Afficher la pagination */}
          <nav className='d-flex justify-content-center'>
            <ul className="pagination">
              <li className="page-item">
                <a className="page-link" href="#" aria-label="Previous">
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>
              {pageNumbers.map((pageNumber, index) => (
                <li className="page-item" key={index} onClick={() => setCurrentPage(pageNumber)}>
                  <a className="page-link" href="#">{pageNumber}</a>
                </li>
              ))}
              <li className="page-item">
                <a className="page-link" href="#" aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </nav>
          {/* Afficher la pagination end */}

        </footer>
      </div>
    </BrowserRouter>
  );

  /**
   * Selectionner la race de chat
   * @param event
   */
  function handleSelect (event) {
    setSelected(event.target.value);
  }

  /**
   * Récupèrer la liste des races de chat
   */
  function fetchBreeds () {
    axios.get(breedsUrl).then(function (response) {
      const breeds = response.data.map((breed) => {
        return { id: breed.id, name: breed.name };
      });
      setBreeds(breeds);
    });
  }

  /**
   * Intéragir avec l'API pour récupèrer des données
   */
  function fetchCats () {
    setIsLoading(true);
    setPictures([]);

    axios.get(`${url}&page=${currentPage}&bredd_ids=${selected}&mime_types=${type}`).then(response => {
      // Mettre à jour notre setPictures
      setPictures(response.data);
      setIsLoading(false);
    });
  }
}

export default App;
