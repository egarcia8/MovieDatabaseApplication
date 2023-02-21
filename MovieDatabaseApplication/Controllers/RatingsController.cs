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
    public class RatingsController : Controller
    {
        private UnitOfWork _unitOfWork;
        

        public RatingsController(UnitOfWork unitOfWork)
        {
            
            _unitOfWork = unitOfWork;
        }

        public IActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// Get a list of rating items
        /// </summary>
        /// <returns></returns>
        // GET: Ratings/GetRatings
        [HttpGet]
        public IEnumerable<Ratings> GetRatings()
        {
           
            var ratings = _unitOfWork.RatingRepository.Get();
            return ratings;

        }

        /// <summary>
        /// Get a rating by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <response code="200">Returns the list of items</response>        
        [HttpGet("api/ratings/{id}")]
        public ActionResult GetApiRating(int id)
        {
            Ratings rating = _unitOfWork.RatingRepository.GetByID(id);

            if (rating == null)
            {
                return NotFound("That object is not found.");
            }

            return Accepted(rating);
        }

        /// <summary>
        /// Create a new rating item
        /// </summary>
        /// <param name="postRating"></param>
        /// <returns></returns>
        //POST: Ratings/PostRatings
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public ActionResult PostRatings(RatingDto postRating)
        {
            var tempRating = new Ratings()
            {
                RatingId = postRating.RatingId,
                Rating = postRating.Rating
            };
            _unitOfWork.RatingRepository.Insert(tempRating);
            _unitOfWork.Save();
            return Accepted(tempRating);
        }

        /// <summary>
        /// Update a rating item
        /// </summary>
        /// <param name="ratingId"></param>
        /// <param name="rating"></param>
        /// <returns></returns>
        //POST: Ratings/EditRatings
        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult EditRatings(int ratingId, RatingDto rating)
        {
            Ratings ratings = _unitOfWork.RatingRepository.GetByID(ratingId);
            if (ratings == null)
            {
                return Problem(statusCode: 400, detail: "Could not find object", title: "400 Error");
              
            }

            ratings.Rating = rating.Rating;

            _unitOfWork.RatingRepository.Update(ratings);
            _unitOfWork.Save();
            return Accepted();

        }

        /// <summary>
        /// Delete a rating item by id
        /// </summary>
        /// <param name="ratingId"></param>
        /// <returns></returns>
        //GET: Ratings/
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult DeleteRatings(int ratingId)
        {
            //var ratings = _db.Ratings.Find(ratingId);
            //Ratings ratings = ratingsRepository.GetRatingByID(ratingId);

            Ratings ratings = _unitOfWork.RatingRepository.GetByID(ratingId);

            var movie = _unitOfWork.MovieRepository.Get(m => m.RatingId == ratingId);
            //var movie = _db.Movies.FirstOrDefault(x => x.RatingId == ratingId);
            if (movie.ToList().Count > 0)
            {
                return Problem(statusCode: 400, detail: "Cannot delete rating; other table has dependency on it", title: "400 Error");
                //return BadRequest("Cannot delete rating; other table has dependency on it");
            }
            if (ratings == null)
            {
                return Problem(statusCode: 400, detail: "Could not find object", title: "400 Error");
                //return BadRequest("Could not find object");
            }

            // _db.Ratings.Remove(ratings);
            //_db.SaveChanges();
            //ratingsRepository.DeleteRatings(ratingId);
            //ratingsRepository.Save();
            _unitOfWork.RatingRepository.Delete(ratingId);
            _unitOfWork.Save();
            return Accepted();
        }

        //[HttpGet]
        //public async Task<IActionResult> Edit(int id)
        //{
        //    return View(id);
        //}

        public IActionResult Edit(int id)
        {
            return View(id);
        }

        protected override void Dispose(bool disposing)
        {
            _unitOfWork.Dispose();
            base.Dispose(disposing);
        }

    }
}
