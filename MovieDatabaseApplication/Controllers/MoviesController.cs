using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using MovieDatabaseApplication.DAL;
using MovieDatabaseApplication.Models;
using Newtonsoft.Json;

namespace MovieDatabaseApplication.Controllers
{
    public class MoviesController : Controller
    {
        private UnitOfWork _unitOfWork;
        private readonly IConfiguration _config;
        private static readonly HttpClient _httpClient = new HttpClient();       

        public MoviesController(
            UnitOfWork unitOfWork,
            IConfiguration config)
        {
            _unitOfWork = unitOfWork;
            _config = config;            
        }

        public IActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// Get a list of rating items
        /// </summary>
        /// <returns></returns>
        // GET:Movies/GetMovies
        [HttpGet]
        public IEnumerable<Movies> GetMovies()
        {
            var movies = _unitOfWork.MovieRepository.Get(null, null, "Ratings,MovieGenres.Genres");

            return movies;
        }

        /// <summary>
        /// Get a movie by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <response code="200">Returns a single movie</response>
        [HttpGet("api/movies/{id}")]
        public ActionResult GetApiMovie(int id)
        {

            var movie = _unitOfWork.MovieRepository.Get(movie => movie.MovieId == id, null, "Ratings,MovieGenres.Genres");

            return Ok(movie.FirstOrDefault());
        }

        // GET: Movies/Create
        public IActionResult Create()
        {
            return View();
        }


        [HttpGet("api/search/{searchTitle}")]
        public async Task<JsonResult> SearchMovie(string searchTitle)
        {
            var key = _config["omdb-key"];

            var response = await _httpClient.GetAsync($"https://www.omdbapi.com?apikey={key}&page=1&s={searchTitle}");
            var responseBody = await response.Content.ReadAsStringAsync();
            
            return Json( responseBody);
        }

        [HttpGet("api/import/{searchId}")]
        public async Task<JsonResult> ImportMovie(string searchId)
        {
            var key = _config["omdb-key"];

            var response = await _httpClient.GetAsync($"https://www.omdbapi.com?apikey={key}&i={searchId}");
            var responseBody = await response.Content.ReadAsStringAsync();

            return Json(responseBody);
        }

        /// <summary>
        /// Create a new movie item
        /// </summary>
        /// <param name="postMovie"></param>
        /// <returns></returns>
        //POST: Movies/PostMovie
        [HttpPost]
        public ActionResult PostMovie([FromBody] MovieDto postMovie)
        {
            var movieGenres = new List<MovieGenres>();

            foreach (var mg in postMovie.MovieGenres)
            {
                var genre = _unitOfWork.GenreRepository.GetByID(mg.GenreId);
                movieGenres.Add(new MovieGenres { Genres = genre });
            }

            var tempMovie = new Movies()
            {
                Title = postMovie.Title,
                Description = postMovie.Description,
                RatingId = postMovie.RatingId,
                MovieGenres = movieGenres
            };

            _unitOfWork.MovieRepository.Insert(tempMovie);

            _unitOfWork.Save();

            return Accepted(tempMovie);
        }


        // GET: Movies/Edit/5
        public async Task<IActionResult> Edit(int id)
        {
            //if (id == null || _context.Movies == null)
            //{
            //    return NotFound();
            //}

            //var movies = await _context.Movies.FindAsync(id);
            //if (movies == null)
            //{
            //    return NotFound();
            //}
            //ViewData["RatingId"] = new SelectList(_context.Ratings, "RatingId", "RatingId", movies.RatingId);
            return View(id);
        }

        /// <summary>
        /// Update a movie item
        /// </summary>
        /// <param name="movieId"></param>
        /// <param name="movie"></param>
        /// <returns></returns>
        //PUT: Movies/EditMovie/id
        [HttpPut("api/Movies/{movieId}")]
        public ActionResult EditMovie(int movieId, [FromBody] MovieDto movie)
        {
            
            var movies = _unitOfWork.MovieRepository.Get(m => m.MovieId == movieId, null, "MovieGenres").FirstOrDefault();


            if (movies == null)
            {
                return Problem(statusCode: 400, detail: "Could not find object", title: "400 Error");
            }

            movies.MovieGenres = new List<MovieGenres>();

            _unitOfWork.MovieRepository.Update(movies);

            var movieGenres = new List<MovieGenres>();
            foreach (var mg in movie.MovieGenres)
            {
                var genre = _unitOfWork.GenreRepository.GetByID(mg.GenreId);
                movieGenres.Add(new MovieGenres { Genres = genre });
            }

            movies.Title = movie.Title;
            movies.Description = movie.Description;
            movies.RatingId = movie.RatingId;
            movies.MovieGenres = movieGenres;

            _unitOfWork.MovieRepository.Update(movies);
            _unitOfWork.Save();

            return Accepted();

        }


        /// <summary>
        /// Delete a movie item by id
        /// </summary>
        /// <param name="movieId"></param>
        /// <returns></returns>
        //DELETE: Movies/DeleteMovie/id
        [HttpDelete("api/Movies/{movieId}")]
        public ActionResult DeleteMovie(int movieId)
        {
            Movies movies = _unitOfWork.MovieRepository.GetByID(movieId);
            if (movies == null)
            {
                return BadRequest("Could not find object");
            }

            _unitOfWork.MovieRepository.Delete(movies);
            _unitOfWork.Save();
          
            return Accepted();
        }

    }
}
