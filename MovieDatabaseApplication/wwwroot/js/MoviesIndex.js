$(document).ready(function () {

    $(".spinner-border").show();
    $.ajax({
        type: "GET",
        url: "/Movies/GetMovies",
        dataType: 'json',
        crossDomain: "true",
        success: function (result) {
            $(".spinner-border").hide();
            createList(result);
        }
    });

    function createList(data) {
        data.forEach(function (movie) {
            $('#movieTable').append('<tr id="movie-'
                + movie.movieId + '"><td>'
                + movie.title + '</td><td>'
                + movie.description + '</td><td>'
                + movie.ratings.rating + '</td><td>'
                + movie.movieGenres.map(function (genre) {
                    if (movie.movieGenres.length > 1) {
                        return " " + genre.genres.genre;
                    }
                    return genre.genres.genre;

                })
                + '</td><td><a href="/Movies/Edit/'
                + movie.movieId + '">Edit</a><button class="deleteButton" type="button" onclick="movies.onOpenModal('
                + movie.movieId + ')" data-bs-toggle="modal" data-mdb-target="#deleteModal">Delete</button></tr>');
        });
    }

    function onOpenModal(movieId) {
        tempMovieId = movieId;
        
        $("#deleteModal").modal("show");
    }


    function onCloseModal() {
        tempMovieId = null;
        $("#deleteModal").modal('hide');
    }

    function onDeleteMovie() {
        $.ajax({
            type: "DELETE",
            url: "api/movies/" + tempMovieId,
            //dataType: "json",
            success: function () {
                $("#deleteModal").modal('hide');
                $("#movie-" + tempMovieId).remove();
            },
            error: function () {
                $("#deleteModal").modal('hide');
                /*alert(errorObject.responseText);*/

            }

        });
    }

    window.movies = {
        onOpenModal: onOpenModal,
        onCloseModal: onCloseModal,
        onDeleteMovie: onDeleteMovie,

    }

});