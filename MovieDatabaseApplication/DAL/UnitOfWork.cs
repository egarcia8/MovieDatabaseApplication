using MovieDatabaseApplication.Models;

namespace MovieDatabaseApplication.DAL
{
    public class UnitOfWork : IDisposable
    {
        private MovieContext _context;

        public UnitOfWork(MovieContext context)
        {
            _context = context;
        }

        private GenericRepository<Ratings> ratingRepository;
        private GenericRepository<Genres> genreRepository;
        private GenericRepository<Movies> movieRepository;

        public GenericRepository<Ratings> RatingRepository
        {
            get
            {
                if (this.ratingRepository == null)
                {
                    this.ratingRepository = new GenericRepository<Ratings>(_context);
                }
                return ratingRepository;
            }
        }

        public GenericRepository<Genres> GenreRepository
        {
            get
            {
                if (this.genreRepository == null)
                {
                    this.genreRepository = new GenericRepository<Genres>(_context);
                }
                return genreRepository;
            }
        }

        public GenericRepository<Movies> MovieRepository
        {
            get
            {
                if (this.movieRepository == null)
                {
                    this.movieRepository = new GenericRepository<Movies>(_context);
                }
                return movieRepository;
            }
        }

        public void Save()
        {
            _context.SaveChanges();
        }

        private bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

    }
}
