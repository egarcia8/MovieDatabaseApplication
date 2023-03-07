$(document).ready(function () {
    let tempRatingId = null;

    $("#ratingCreateForm").validate({
        rules: {
            ratingInput: {
                required: true
            }
        },
        messages: {
            ratingInput: {
                required: "Please enter a rating."
            }
        }
    });

    //turn on spinner
    $(".spinner-border").show();
    $.ajax({
        type: "GET",
        url: "/Ratings/GetRatings/",
        dataType: "json",
        crossDomain: "true",
        success: function (result) {
            $(".spinner-border").hide();
            createList(result);
        }
    });

    function createList(data) {
        //var $tbody = $('<tbody></tbody>');
        data.forEach(function (rating) {
            $('#ratingTable').append('<tr id="rating-'
                + rating.ratingId + '"><td>'
                + rating.rating + '</td><td><a href = "/Ratings/Edit/'
                + rating.ratingId + '">Edit</a><button class="deleteButton" type="button" onclick="ratings.onOpenModal('
                + rating.ratingId + ')" data-bs-toggle="modal" data-mdb-target="#deleteModal">Delete</button></td></tr>');
        });
    }

    //$.each(data, function (key, value) {
    //    $ul.append('<li>' + value.rating + '</li>');
    //});
    //    $('#ratingTable').html($tbody);
    //    }

    function onOpenModal(ratingId) {
        tempRatingId = ratingId;
        $("#deleteModal").modal("show");
    }


    function onCloseModal() {
        tempRatingId = null;
        $("#deleteModal").modal('hide');
    }

    function onDeleteRating() {
        $.ajax({
            type: "DELETE",
            url: "/api/Ratings/" + tempRatingId,
            //dataType: "json",
            //crossDomain: "true",
            success: function () {
                $("#deleteModal").modal('hide');
                $("#rating-" + tempRatingId).remove();
            },
            error: function () {
                $("#deleteModal").modal('hide');
                /*alert(errorObject.responseText);*/
                alertFailure("You cannot delete this rating. It is currently in use.");
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
        }, 3000);
    }

    function onAddRating() {
        var newRating = document.getElementById("ratingInput").value;
        var ratingObj = {
            rating: newRating
        };

        const isValid = $("#ratingCreateForm").valid();
        if (isValid) {
            $.ajax({
                type: "POST",
                url: "/Ratings/PostRatings",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(ratingObj),
                dataType: 'json',
                success: function () {
                    $("#addRatingModal").modal('hide');
                    location.reload();
                    $('#ratingTable').append(ratingObj);
                },
                error: function () {
                    alert("Error in Operation");
                }
            });
        }
    }

    function onOpenCreate() {
        $("#addRatingModal").modal("show");
    }

    function onCloseCreate() {
        $("#addRatingModal").modal('hide');
    }

    window.ratings = {
        onOpenModal: onOpenModal,
        onCloseModal: onCloseModal,
        onDeleteRating: onDeleteRating,
        onOpenCreate: onOpenCreate,
        onCloseCreate: onCloseCreate,
        onAddRating: onAddRating
    }
});