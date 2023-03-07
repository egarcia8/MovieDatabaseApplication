using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using MovieDatabaseApplication.DAL;
using MovieDatabaseApplication.Models;

namespace MovieDatabaseApplication.Controllers
{
    public class GenresController : Controller
    {
        private UnitOfWork _unitOfWork;

        public GenresController(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public IActionResult Index()
        {
            return View();
        }


        /// <summary>
        /// Get a list of genre items
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IEnumerable<Genres> GetGenres()
        {
            var genres = _unitOfWork.GenreRepository.Get();
            return genres;
          
        }


        /// <summary>
        /// Create a new genre item
        /// </summary>
        /// <param name="postGenre"></param>
        /// <returns></returns>
        // POST: Genres/PostGenres
        [HttpPost]
        public ActionResult PostGenres([FromBody] GenreDto postGenre)
        {
            var tempGenre = new Genres()
            {
                GenreId = postGenre.GenreId,
                Genre = postGenre.Genre
            };
            _unitOfWork.GenreRepository.Insert(tempGenre);
            _unitOfWork.Save();
            return Accepted(tempGenre);
        }


        /// <summary>
        /// Delete a genre item by id
        /// </summary>
        /// <param name="genreId"></param>
        /// <returns></returns>
       
        [HttpDelete("api/Genres/{genreId}")]
        public ActionResult DeleteGenres(int genreId)
        {
            Genres genres = _unitOfWork.GenreRepository.GetByID(genreId);


            var movies = _unitOfWork.MovieRepository.Get(m => m.MovieGenres.Select(g => g.GenreId == genreId).FirstOrDefault(), null, "MovieGenres.Genres");

            if (movies.ToList().Count > 0)
            {
                return Problem(statusCode: 400, detail: "Cannot delete genre; other table has dependency on it", title: "400 Error");
               
            }

            if (genres == null)
            {
                return Problem(statusCode: 400, detail: "Could not find object", title: "400 Error");
                
            }

            _unitOfWork.GenreRepository.Delete(genreId);
            _unitOfWork.Save();
            return Accepted();
        }
    }
}
