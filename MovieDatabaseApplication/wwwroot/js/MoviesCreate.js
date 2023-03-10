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
            genresdata = result;
            populateGenresList(result);
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

    function populateGenresList(genresResults) {
        genresResults.forEach(function (genre) {
            $('#movieGenreList').append(`<button type="button" id="${genre.genre}" class="list-group-item list-group-item-action">${genre.genre}</button>`);
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

   

    $("#searchMovieButton").click(function searchMovie() {
        var searchTitle = $("#movieSearchTitle").val();

        $.ajax({
            type: "GET",
            url: "/api/search/" + searchTitle,
            dataType: "json",
            success: function (data) {
                var searchObj = JSON.parse(data);

                if (!searchObj.Search) {
                    console.log("Error - Search Engine is down");
                    return;
                }

                searchObj.Search.forEach(function (movie) {
                    $('#movieSearchResults').append("<tr><td>"
                        + movie.Title + "</td><td>"
                        + movie.Year + "</td><td></td><td><button type='button' class='btn btn-outline-success' onclick='importMovie(\""
                        + movie.imdbID + "\")'>Import</button></td></tr>"
                    )
                })
               
            }
        })
    })

    $('#clearSearchResultsButton').click(function clearTable() {
        $('#movieSearchResults').empty();
    })
  
    window.importMovie = function(imdbID) {
        searchId = imdbID;

        $.ajax({
            type: "GET",
            url: "/api/import/" + searchId,
            dataType: "json",
            success: function (data) {
                var importObj = JSON.parse(data);
                $('#movieTitle').val(importObj.Title);
                $('#movieDescription').val(importObj.Plot);
                $(`#movieRating option:contains('${importObj.Rated}')`).each(function () {
                    if ($(this).html() == `${importObj.Rated}`) {
                        $(this).prop('selected', true);
                    }
                });
                
                var importedGenres = [];
                var genreArray = importObj.Genre.split(', ');
             
                genreArray.forEach(genre => {
                    var found = genresdata.find(g => g.genre === genre);
                    
                    if (found) {
                        importedGenres.push(found)
                    }
                });

                importedGenres.forEach(genre => {
                    $('#movieGenreList button').remove(`#${genre.genre}`);
                    $('#movieGenreSelected').append(`<button type="button" class="list-group-item list-group-item-action">${genre.genre}</button>`);
                    selectedGenresList = importedGenres;
                })

            }
        })
    }

    $('#clearMovieEntryButton').click(function clearEntry() {
        $('#movieTitle').val("");
        $('#movieDescription').val("");
        $('#movieRating option:contains("Select Rating")').prop('selected', true);
        $('#movieGenreSelected').empty();

        selectedGenresList.forEach(genre => {
            $('#movieGenreSelected button').remove(`#${genre.genre}`);
            $('#movieGenreList button').remove();
            populateGenresList(genresdata);
        })
        
    });

    window.onAddAgain = function () {
        location.reload();
    }

    window.onBack = function () {
        window.location.href = "/Movies";

        return false;
    }
});    