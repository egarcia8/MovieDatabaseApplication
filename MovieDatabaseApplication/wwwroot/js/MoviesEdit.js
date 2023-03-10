
$(document).ready(async function () {
    var id = window.movieEditObj.movieId;
    var genresData = [];
    var selectedItem;
    var selectedGenresList = [];
    $(".spinner-border").show();
    $(".form-group").hide();

    $("#movieEditForm").validate({
        rules: {
            movieTitle: {
                required: true
            },
            movieDescription: {
                required: true
            }
        },
        messages: {
            movieTitle: {
                required: "Please enter a title."
            },
            movieDescription: {
                required: "Please enter a description."
            }
        }
    });

   
    await $.ajax({
        type: "GET",
        url: "/Genres/GetGenres",
        dataType: "json",
        crossDomain: "true",
        success: function (result) {
            genresData = result;
           
        }
    });

    await $.ajax({
        type: "GET",
        url: "/api/movies/" + id,
        dataType: "json",
        crossDomain: "true",
        async: false,
        success: function (result) {
            populateMovie(result);
        },
        error: function () {
            window.location.replace("/Home/ErrorPage");
        }
    });

   await $.ajax({
        type: "GET",
        url: "/Ratings/GetRatings",
        dataType: "json",
        crossDomain: "true",
        success: function (result) {
            populateRatingsSelect(result);
        }
    });


    function populateRatingsSelect(ratingsdata) {
        ratingsdata.forEach(function (rating) {
            $('#movieRating').append('<option value="' + rating.ratingId + '">' + rating.rating + '</option>');
        });
    }


    function populateMovie(moviedata) {
        $(".spinner-border").hide();
        $("#movieTitle").val(moviedata.title);
        $("#movieDescription").val(moviedata.description);
        $('#movieRating').append('<option value="' + moviedata.ratings.ratingId + '">' + moviedata.ratings.rating + '</option>');

        genresData.forEach(function (genre) {
            const found = moviedata.movieGenres.find(g => g.genreId === genre.genreId);

            if (found) {
                $('#movieGenreSelected').append('<button type="button" class="list-group-item list-group-item-action">'
                    + found.genres.genre + '</button>');
                selectedGenresList.push(genre);
            }

            else {
                $('#movieGenreList').append('<button type="button" class="list-group-item list-group-item-action">'
                    + genre.genre + '</button>');
            }
        });

        $(".form-group").show();

    }

    $(".list-group-item").click(function () {
        var listItems = $(".list-group-item");
        for (let i = 0; i < listItems.length; i++) {
            listItems[i].classList.remove("active");
        }
        this.classList.add("active");
        selectedItem = this;
    });

    window.toGenreSelected = function () {
        selectedItem.remove();
        $("#movieGenreSelected > p").remove();
        $("#movieGenreSelected").append(selectedItem);
        var genreListSelectedItem = $(selectedItem)[0].innerHTML;
        var found = genresData.find(g => g.genre === genreListSelectedItem);
        if (found) {
            selectedGenresList.push(found)
        }
    }

    window.toGenreList = function () {
        selectedItem.remove();
        $("#movieGenreList").append(selectedItem);

        var genreSelectedItem = $(selectedItem)[0].innerHTML;
        var found = genresData.find(g => g.genre === genreSelectedItem);

        function genretoRemove(genre) {
            return found.genre;
        }
        if (found) {
            var index = selectedGenresList.findIndex(function (item, i) {
                return item.genre === genreSelectedItem;
            });

            selectedGenresList.splice(index, 1);
        }
    }

    window.onEditMovie = function () {

        var newTitle = $("#movieTitle").val();
        var newDescription = $("#movieDescription").val();
        var newRatingId = $('#movieRating').find(":selected").val();
        var newGenre = selectedGenresList;

        var movieObj = {
            title: newTitle,
            description: newDescription,
            ratingId: newRatingId,
            movieGenres: newGenre
        };

        const isValid = $("#movieEditForm").valid();

        var checkGenres = selectedGenresList.length;
        if (checkGenres === 0) {
            $("#movieGenreSelected").append("<p>Please add at least one genre to the list.</p>");
        }

        if (isValid && checkGenres != 0) {
            $.ajax({
                type: "PUT",
                url: "/api/Movies/" + id,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(movieObj),
                dataType: "json",
                success:
                    $("#editMovieModal").modal("show")
            });
        }

    }

    window.onEditAgain = function () {
        location.reload();
    }

    window.onBack = function () {
        window.location.href = "/Movies";
        return false;
    }
});