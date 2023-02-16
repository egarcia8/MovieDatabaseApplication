using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace MovieDatabaseApplication.Models
{
    public class Movies
    {
        [Key]
        public int MovieId { get; set; }
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";

        public int RatingId { get; set; }
        [ForeignKey("RatingId")]
        public Ratings Ratings { get; set; } = default!;

        public ICollection<MovieGenres> MovieGenres { get; set; }
    }
}
