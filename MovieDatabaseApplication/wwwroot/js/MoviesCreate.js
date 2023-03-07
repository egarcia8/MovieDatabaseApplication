$(document).ready(async function () {
    var genresdata = [];
    var selectedItem;
    var selectedGenresList = [];

    $("#movieCreateForm").validate({
        rules: {
            movieTitle: {
                required: true
            },
            movieDescription: {
                required: true
            },
            movieRating: {
                required: true
            }
        },
        messages: {
            movieTitle: {
                required: "Please enter a title."
            },
            movieDescription: {
                required: "Please enter a description."
            },
            movieRating: {
                required: "Please select a rating from the list."
            }
        }
    });

    await $.ajax({
        type: "GET",
        url: "/Genres/GetGenres",
        dataType: "json",
        crossDomain: "true",
        success: function (result) {
            console.log("Received Genre Data");
            genresData = result;
            populateGenresList(result);
        }
    });

    await $.ajax({
        type: "GET",
        url: "/Ratings/GetRatings",
        dataType: "json",
        crossDomain: "true",
        success: function (result) {
            console.log("Received Ratings Data");
            populateRatingsSelect(result);
        }
    });

    function populateGenresList(genresdata) {
        genresdata.forEach(function (genre) {
            $('#movieGenreList').append('<button type="button" class="list-group-item list-group-item-action">'
                + genre.genre + '</button>');
        });
    }

    function populateRatingsSelect(ratingsdata) {
        ratingsdata.forEach(function (rating) {
            $('#movieRating').append('<option value="' + rating.ratingId + '">' + rating.rating + '</option>');
        });
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
        console.log(selectedItem);
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

    window.onCreateMovie = function () {
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

        //function checkGenreSelected(selectedGenresList)

        const isValid = $("#movieCreateForm").valid();

        var checkGenres = selectedGenresList.length;
        if (checkGenres === 0) {
            $("#movieGenreSelected").append("<p>Please add at least one genre to the list.</p>");
        }

        if (isValid && checkGenres != 0) {
            $.ajax({
                type: "POST",
                url: "/Movies/PostMovie",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(movieObj),
                dataType: "json",
                success:
                    $("#addMovieModal").modal("show")

            });
        }

    }

    window.onAddAgain = function () {
        location.reload();
    }

    window.onBack = function () {
        window.location.href = "/Movies";

        return false;
    }

});    