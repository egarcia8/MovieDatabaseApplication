using System.ComponentModel.DataAnnotations;


namespace MovieDatabaseApplication.Models
{
    public class Ratings
    {
        [Key]
        public int RatingId { get; set; }
        public string Rating { get; set; } = default!;
    }
}
