using Microsoft.AspNetCore.Mvc;
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
        public ActionResult PostRatings([FromBody] RatingDto postRating)
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
        //PUT: Ratings/EditRatings
        [HttpPut("api/ratings/{ratingId}")]
        public ActionResult EditRatings(int ratingId,[FromBody] RatingDto rating)
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
        //DELETE: Ratings/DeleteRatings
        [HttpDelete("api/ratings/{ratingId}")]
        public ActionResult DeleteRatings(int ratingId)
        {
            Ratings ratings = _unitOfWork.RatingRepository.GetByID(ratingId);

            var movie = _unitOfWork.MovieRepository.Get(m => m.RatingId == ratingId);
           
            if (movie.ToList().Count > 0)
            {
                return Problem(statusCode: 400, detail: "Cannot delete rating; other table has dependency on it", title: "400 Error");
               
            }
            if (ratings == null)
            {
                return Problem(statusCode: 400, detail: "Could not find object", title: "400 Error");
                
            }

            _unitOfWork.RatingRepository.Delete(ratingId);
            _unitOfWork.Save();
            return Accepted();
        }


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
