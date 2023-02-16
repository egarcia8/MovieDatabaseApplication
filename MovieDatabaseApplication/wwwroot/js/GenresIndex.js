


$(document).ready(function () {
    let tempGenreId = null;

    $("#genreCreateForm").validate({
        rules: {
            genreInput: {
                required: true
            }
        },
        messages: {
            genreInput: {
                required: "Please enter a genre."
            }
        }
    });


    //turn on spinner
    $(".spinner-border").show();
    $.ajax({
        type: "GET",
        url: "/Genres/GetGenres",
        
        success: function (result) {
            $(".spinner-border").hide();
            createGenreList(result);
        }
    });

    function createGenreList(data) {
        //var $tbody = $('<tbody></tbody>');
        data.forEach(function (genre) {
            $('#genreTable').append('<tr id="genre-'
                + genre.genreId + '"><td>'
                + genre.genre + '</td><td></a><button class="deleteButton" type="button" onclick="genres.onOpenModal('
                + genre.genreId + ')" data-bs-toggle="modal" data-mdb-target="#deleteGenreModal">Delete</button></td></tr>');
        });
    }

    function onOpenModal(genreId) {
        tempGenreId = genreId;
        $("#deleteGenreModal").modal("show");
    }


    function onCloseModal() {
        tempGenreId = null;
        $("#deleteGenreModal").modal('hide');
    }

    function onDeleteGenre() {
        $.ajax({
            type: "./Genres/DeleteGenres/" + tempGenreId,
            //dataType: "json",
            //crossDomain: "true",
            success: function () {
                $("#deleteGenreModal").modal('hide');
                $("#genre-" + tempGenreId).remove();
            },
            error: function () {
                $("#deleteGenreModal").modal('hide');
                /*alert(errorObject.responseText);*/
                alertFailure("You cannot delete this genre. It is currently in use.");
            }

        });
    }

    function alertFailure(message) {
        $('#alerts').append(
            '<div class="alert alert-danger alert-dismissible fade show" role="alert"> ' +
            message + ' ' + '</div>');
        window.scrollTo(0, 0);
        window.setTimeout(function () {
            $(".alert").fadeTo(500, 0).slideUp(500, function () {
                $(this).remove();
            });
        }, 5000);
    }

    function onAddGenre() {
        var newGenre = $("#genreInput").val();
        var genreObj = {
            genre: newGenre
        };

        const isValid = $("#genreCreateForm").valid();
        if (isValid) {
            $.ajax({
                type: "POST",
                url: "Genres/PostGenres",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(genreObj),
                dataType: 'json',
                success: function () {
                    $("#addGenreModal").modal('hide');
                    location.reload();
                    $('#genreTable').append(genreObj);
                },
                error: function () {
                    alert("Error in Operation");
                }
            });
        }
    }

    function onOpenCreate() {
        $("#addGenreModal").modal("show");
    }

    function onCloseCreate() {
        $("#addGenreModal").modal('hide');
    }

    window.genres = {
        onOpenModal: onOpenModal,
        onCloseModal: onCloseModal,
        onDeleteGenre: onDeleteGenre,
        onOpenCreate: onOpenCreate,
        onCloseCreate: onCloseCreate,
        onAddGenre: onAddGenre
    }
});