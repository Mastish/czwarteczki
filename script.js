import axios, * as others from "https://cdn.skypack.dev/axios@0.21.1";
import ReactPaginate from "https://cdn.skypack.dev/react-paginate@7.1.0";

// https://www.omdbapi.com/?apikey=756abb2f&i=tt4154664&plot=full

const { useState, useEffect } = React;

const copyToClipboard = text => {
  navigator.clipboard.writeText(text)
    .then(() => {
      // Display message to user
      alert('Numer skopiowano do schowka');
    })
    .catch(err => {
      console.error('Failed to copy: ', err);
    });
}

// Main component -------------------------------
const Main = (props) => {
  
  const getMovies = (term='zombie', page=1) => {
    setLoading(true);
    axios.get(`https://www.omdbapi.com/?apikey=756abb2f&s=${encodeURIComponent(term)}&plot=full&page=${page}&tomatoes=true`)
      .then(response => {
      // console.log(response.data);
      setMovies(response.data.Search);
      setTotal(Math.ceil(response.data.totalResults/10))
      setPages(page);
      setLoading(false);
    }).catch(error => {
      // console.log(error);
      setMovies([]);
      setLoading(false);
    });
  }
  
  const getMovie = (movieId) => {
    axios.get(`https://www.omdbapi.com/?apikey=756abb2f&i=${movieId}&plot=full&tomatoes=true`)
    .then(response => {
      // console.log(response.data);
      setMovie(response.data);
      setShowPop(true);
    });
  }
  
  const [loading, setLoading] = useState(true);
  const [showPop, setShowPop] = useState(false);
  const [movies, setMovies] = useState([]);
  const [movie, setMovie] = useState({});
  const [keyword, setKeyword] = useState('frozen');
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState();
  useEffect(() => {
    getMovies();
  }, []);
  
  const handlePageClick = e => {
    console.log(e.selected);
    getMovies(keyword, (e.selected + 1));
  }
  
  const handleCardClicked = movieId => {
    // console.log(movieId);
    getMovie(movieId);
    
  }
  
  const genCards = () => {
    let allCards = [];
    if(movies){
      movies.map(movie => {
        allCards.push(<Card {...movie} cardClicked={handleCardClicked} />);
      });
    }
    return allCards;
  }
  
  let allCards = genCards();
  
  return(
    <div className='main'>
      <h1 className='head'>🍆🎬</h1>
      <Search 
        getInputValue={val => setKeyword(val)} 
        sendEnter={() => getMovies(keyword)} 
        getSubmit={() => getMovies(keyword)} />
      
     { showPop ? <Showexpand {...movie} closePop={() => setShowPop(false)} /> : null }
      
      <div className='cards'>
        { loading ? <Loader /> : 
        (allCards.length === 0 ? 
         <div className='error'>
           No movie found...
           <i class="far fa-grin-beam-sweat"></i>
         </div> : allCards) }
      </div>
      
      <div className='paginate'>
        <ReactPaginate 
          previousLabel={"Cofij"}
          nextLabel={"Dalej"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={total}
          marginPagesDisplayed={1}
          pageRangeDisplayed={4}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"}
          />
      </div>
      
    </div>
  )
  
}



// Loader component -------------------------------
const Loader = props => {
  
  return (
     <div className='loader'>
      Bidony są dla frajerów...
      <i class="fas fa-sync-alt fa-spin"></i>
    </div>
  )
}


// Search component -------------------------
const Search = (props) => {

  let sendValue = (e) => {
    props.getInputValue(e.target.value)
  }
  
  const handleSubmit = () => {
    props.getSubmit();
  }
  
  const handleKeyDown = (e) => {
    if(e.key === 'Enter'){
      props.sendEnter();
      // console.log('Enter');
    }
  }
  
  return(
    <div className='search'>
      <div className='search-box'>
        <input type='text'
          onChange={sendValue}
          onKeyDown={handleKeyDown}
          placeholder='Szukaj złego filmu...' />
        <button onClick={handleSubmit} ><i class="fas fa-search"></i></button>
      </div>
    </div>
  )
}


// Card component ------------------------------------------------
const Card = props => {
  
  // console.log(props);
  const handleClick = (e) => {
    // console.log(e.target.dataset.id);
    props.cardClicked(e.target.dataset.id);
  }
  return (
    <div className='card' title={props.Title} data-id={props.imdbID} onClick={handleClick}>
      <img src={props.Poster !== 'N/A' ? props.Poster : 'https://via.placeholder.com/163x240/111217/FFFFFF/?text=No%20Image'} alt={props.Title} data-id={props.imdbID} />
    </div>
  )
}



// Show expand component ---------------------------------------
const Showexpand = (props) => {
  
  console.log(props)
  
  const handleCopyClick = () => {
    copyToClipboard(props.imdbID);
  }
  return (
    <div className='show-expand'>
      
      <div className='show-content'>
        <i class="show-close fas fa-times" onClick={props.closePop} ></i>
        
        <div className='show-poster'>
          <span className='show-poster-bg'>
            <img src={props.Poster !== 'N/A' ? props.Poster : 'https://via.placeholder.com/163x240/111217/FFFFFF/?text=No%20Image'} alt={props.Title} />
          </span>
          <span className='show-poster-main'>
            <img src={props.Poster !== 'N/A' ? props.Poster : 'https://via.placeholder.com/163x240/111217/FFFFFF/?text=No%20Image'} alt={props.Title} />
          </span>
        </div>
        
        <div className='show-detail'>
          <h2>{props.Title}</h2>
            <ul className="show-tags">
            <li className="show-rated">{props.Country}</li>
            <li className="show-rated">{props.Year}</li>
            <li className="show-year">{props.Rated}</li>
            <li className="show-year">{props.Genre}</li>
          </ul>
          
          <button className="copy-imdb-btn" onClick={handleCopyClick}>📋 Kopiuj ID filmu <b>({props.imdbID})</b></button>
          
          <div class="show-plot">
            <p>{props.Plot}</p>
          </div>
          
          <div class="show-credits">
            <p><strong>TomatoScore: </strong>{props.tomatoRating}</p>
            <p><strong>Production:</strong> {props.Production}</p>
            <p><strong>Runtime:</strong> {props.Runtime || 'N/A '}</p>
            <p><strong>Rating:</strong> {props.imdbRating}</p>
            <p><strong>Votes:</strong> {props.imdbVotes}</p>
            <p><strong>Director:</strong> {props.Director}</p>
            <p><strong>Actors:</strong> {props.Actors}</p>
            <p><strong>BoxOffice:</strong> {props.BoxOffice || 'N/A '}</p>
          </div>
          
        </div>
        
      </div>
    </div>
  )
}

ReactDOM.render(<Main />, document.getElementById('app'));