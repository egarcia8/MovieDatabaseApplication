using System.ComponentModel.DataAnnotations;

namespace MovieDatabaseApplication.Models
{
    public class Genres
    {
        [Key]
        public int GenreId { get; set; }
        public string Genre { get; set; } = default!;
    }
}

